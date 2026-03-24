'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { STOCKS, PORTFOLIO } from '@/data/mockData';
import { TrendingUp, TrendingDown, Shield, BarChart3 } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 text-[12px]">
            <p className="text-neutral-400 mb-0.5">{label}</p>
            {payload.map((p, i) => (
                <p key={i} className="font-semibold" style={{ color: p.color }}>{p.name}: ₹{p.value?.toLocaleString('en-IN')}</p>
            ))}
        </div>
    );
}

function RiskGauge({ score }) {
    const color = score <= 30 ? '#10b981' : score <= 60 ? '#f59e0b' : '#ef4444';
    const label = score <= 30 ? 'Low Risk' : score <= 60 ? 'Moderate' : 'High Risk';
    return (
        <div className="flex flex-col items-center">
            <svg width="100" height="60" viewBox="0 0 120 70">
                <path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke="#e5e5e5" strokeWidth="8" strokeLinecap="round" />
                <motion.path d="M10 65 A50 50 0 0 1 110 65" fill="none" stroke={color} strokeWidth="8" strokeLinecap="round"
                    initial={{ pathLength: 0 }} animate={{ pathLength: score / 100 }} transition={{ duration: 1, ease: 'easeOut' }} />
            </svg>
            <p className="text-xl font-semibold mt-1" style={{ color }}>{score}</p>
            <p className="text-[11px] text-neutral-400">{label}</p>
        </div>
    );
}

export default function StocksPage() {
    const [selected, setSelected] = useState(STOCKS[0]);

    const chartData = useMemo(() => {
        const hist = selected.history.slice(-60).map((d) => ({ date: d.date.slice(5), Historical: d.price }));
        const pred = selected.prediction.slice(0, 20).map((d) => ({ date: d.date.slice(5), Predicted: d.price }));
        const bridge = { date: hist[hist.length - 1].date, Historical: hist[hist.length - 1].Historical, Predicted: hist[hist.length - 1].Historical };
        hist[hist.length - 1] = bridge;
        return [...hist, ...pred];
    }, [selected]);

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Stock Prediction</h1>
                    <p className="text-[13px] text-neutral-400 mt-0.5">AI-powered analysis with LSTM predictions</p>
                </div>

                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-6">
                    {STOCKS.map((stock, i) => {
                        const isSel = selected.symbol === stock.symbol;
                        const up = stock.change > 0;
                        return (
                            <button key={stock.symbol} onClick={() => setSelected(stock)}
                                className={`p-4 rounded-xl text-left transition-all duration-150 border
                  ${isSel ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/10' : 'border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] hover:border-neutral-300 dark:hover:border-neutral-700'}`}>
                                <p className="text-[11px] text-neutral-400 mb-0.5">{stock.sector}</p>
                                <p className="text-[13px] font-semibold text-neutral-900 dark:text-white">{stock.symbol}</p>
                                <p className="text-base font-semibold text-neutral-900 dark:text-white mt-1">₹{stock.currentPrice.toLocaleString('en-IN')}</p>
                                <div className={`flex items-center gap-1 mt-0.5 ${up ? 'text-emerald-600' : 'text-red-500'}`}>
                                    {up ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                    <span className="text-[11px] font-medium">{up ? '+' : ''}{stock.change}</span>
                                </div>
                            </button>
                        );
                    })}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-4 gap-4 mb-6">
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="lg:col-span-3 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                        <div className="flex items-center justify-between mb-4">
                            <div>
                                <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white">{selected.name}</h3>
                                <p className="text-[11px] text-neutral-400">Historical + prediction (dashed)</p>
                            </div>
                            <div className="flex items-center gap-3 text-[11px] text-neutral-400">
                                <span className="flex items-center gap-1"><span className="w-3 h-px bg-indigo-500 inline-block" /> Historical</span>
                                <span className="flex items-center gap-1"><span className="w-3 h-px bg-emerald-500 inline-block border-dashed" /> Predicted</span>
                            </div>
                        </div>
                        <div className="h-[280px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <AreaChart data={chartData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                                    <defs>
                                        <linearGradient id="hG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#6366f1" stopOpacity={0.06} /><stop offset="100%" stopColor="#6366f1" stopOpacity={0} /></linearGradient>
                                        <linearGradient id="pG" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="#10b981" stopOpacity={0.06} /><stop offset="100%" stopColor="#10b981" stopOpacity={0} /></linearGradient>
                                    </defs>
                                    <CartesianGrid stroke="#e5e5e5" strokeDasharray="none" vertical={false} />
                                    <XAxis dataKey="date" tick={{ fontSize: 10, fill: '#a3a3a3' }} axisLine={false} tickLine={false} interval="preserveStartEnd" />
                                    <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} tickFormatter={(v) => `₹${v}`} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Area type="monotone" dataKey="Historical" stroke="#6366f1" strokeWidth={1.5} fill="url(#hG)" dot={false} connectNulls={false} />
                                    <Area type="monotone" dataKey="Predicted" stroke="#10b981" strokeWidth={1.5} strokeDasharray="4 3" fill="url(#pG)" dot={false} connectNulls={false} />
                                </AreaChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>

                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5 flex flex-col items-center justify-center">
                        <div className="flex items-center gap-1.5 mb-3">
                            <Shield className="w-4 h-4 text-indigo-500" />
                            <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white">Risk Score</h3>
                        </div>
                        <RiskGauge score={selected.riskScore} />
                        <div className="mt-4 w-full space-y-1.5 text-[12px]">
                            <div className="flex justify-between"><span className="text-neutral-400">Sector</span><span className="font-medium text-neutral-900 dark:text-white">{selected.sector}</span></div>
                            <div className="flex justify-between"><span className="text-neutral-400">Current</span><span className="font-medium text-neutral-900 dark:text-white">₹{selected.currentPrice.toLocaleString('en-IN')}</span></div>
                            <div className="flex justify-between"><span className="text-neutral-400">Change</span><span className={`font-medium ${selected.change > 0 ? 'text-emerald-600' : 'text-red-500'}`}>{selected.change > 0 ? '+' : ''}₹{selected.change}</span></div>
                        </div>
                    </motion.div>
                </div>

                {/* Portfolio */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                    <div className="flex items-center gap-2 mb-4">
                        <BarChart3 className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white">Portfolio</h3>
                        <span className="ml-auto text-[12px] font-medium text-emerald-600">+₹{PORTFOLIO.returns.toLocaleString('en-IN')} ({PORTFOLIO.returnsPercent}%)</span>
                    </div>
                    <table className="w-full text-[12px]">
                        <thead>
                            <tr className="text-left text-neutral-400 border-b border-neutral-100 dark:border-neutral-800">
                                <th className="pb-2 font-medium">Symbol</th><th className="pb-2 font-medium">Qty</th><th className="pb-2 font-medium">Avg</th><th className="pb-2 font-medium">Current</th><th className="pb-2 font-medium text-right">P&L</th>
                            </tr>
                        </thead>
                        <tbody>
                            {PORTFOLIO.holdings.map((h) => {
                                const pl = (h.currentPrice - h.avgPrice) * h.qty;
                                const up = pl >= 0;
                                return (
                                    <tr key={h.symbol} className="border-b border-neutral-50 dark:border-neutral-800/50 last:border-0">
                                        <td className="py-2.5 font-medium text-neutral-900 dark:text-white">{h.symbol}</td>
                                        <td className="py-2.5 text-neutral-500">{h.qty}</td>
                                        <td className="py-2.5 text-neutral-500">₹{h.avgPrice.toLocaleString('en-IN')}</td>
                                        <td className="py-2.5 text-neutral-900 dark:text-white font-medium">₹{h.currentPrice.toLocaleString('en-IN')}</td>
                                        <td className={`py-2.5 text-right font-medium ${up ? 'text-emerald-600' : 'text-red-500'}`}>{up ? '+' : ''}₹{pl.toLocaleString('en-IN')}</td>
                                    </tr>
                                );
                            })}
                        </tbody>
                    </table>
                </motion.div>
            </div>
        </AppLayout>
    );
}
