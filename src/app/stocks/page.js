'use client';

import { useState, useMemo, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import useStore from '@/store/useStore';
import { generateDynamicStockData } from '@/lib/analysis';
import { TrendingUp, TrendingDown, Search, Plus, PieChart, Activity, Shield, Loader2 } from 'lucide-react';

const FEATURED_SYMBOLS = ['RELIANCE', 'TCS', 'INFY', 'HDFCBANK', 'TSLA', 'AAPL', 'MSFT', 'GOOGL'];

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 text-[12px]">
            <p className="text-neutral-400 mb-0.5">{label}</p>
            <p className="font-semibold text-neutral-900 dark:text-white">₹{payload[0].value.toFixed(2)}</p>
        </div>
    );
}

export default function StocksPage() {
    const portfolio = useStore((s) => s.portfolio);
    const [search, setSearch] = useState('');
    const [selectedStock, setSelectedStock] = useState(null);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (!selectedStock) {
            setSelectedStock(generateDynamicStockData('RELIANCE'));
        }
    }, [selectedStock]);

    const handleSearch = (e) => {
        e.preventDefault();
        if (!search.trim()) return;

        setSearching(true);
        setError('');

        // Simulate "fetching" dynamic data
        setTimeout(() => {
            const newData = generateDynamicStockData(search.trim());
            setSelectedStock(newData);
            setSearching(false);
            setSearch('');
        }, 800);
    };

    if (!selectedStock) return (
        <AppLayout>
            <div className="flex items-center justify-center h-[60vh]">
                <Loader2 className="w-8 h-8 animate-spin text-indigo-500" />
            </div>
        </AppLayout>
    );

    const holdings = portfolio.holdings || [];

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Stock Prediction</h1>
                        <p className="text-[13px] text-neutral-400 mt-0.5">AI-powered analysis with LSTM predictions</p>
                    </div>
                </div>

                {/* Stock Search/Selection */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                    <div className="md:col-span-3 flex gap-2">
                        <form onSubmit={handleSearch} className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                            <input
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                                placeholder="Search symbol (e.g., RELIANCE, AAPL, TSLA)..."
                                className="w-full pl-10 pr-4 py-2 rounded-xl text-[13px] bg-white dark:bg-[#141414] border border-neutral-200 dark:border-neutral-800 focus:ring-1 focus:ring-indigo-500/30 outline-none transition-all"
                            />
                        </form>
                        <button type="submit" onClick={handleSearch} disabled={searching}
                            className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-all disabled:opacity-50">
                            {searching ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Search'}
                        </button>
                    </div>
                </div>

                {/* Top Picks / Watchlist */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                    {[selectedStock, ...holdings.filter(h => h.symbol !== selectedStock.symbol)].slice(0, 4).map((stock) => (
                        <motion.button
                            key={stock.symbol}
                            whileHover={{ y: -2 }}
                            onClick={() => setSelectedStock(stock.history ? stock : generateDynamicStockData(stock.symbol))}
                            className={`p-4 rounded-xl border text-left transition-all duration-150
                ${selectedStock.symbol === stock.symbol
                                    ? 'bg-indigo-50/50 dark:bg-indigo-900/10 border-indigo-200 dark:border-indigo-800'
                                    : 'bg-white dark:bg-[#141414] border-neutral-200 dark:border-neutral-800 hover:border-neutral-300'}`}
                        >
                            <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">{stock.sector || 'Asset'}</p>
                            <h3 className="text-sm font-bold text-neutral-900 dark:text-white mb-2">{stock.symbol}</h3>
                            <p className="text-xl font-bold text-neutral-900 dark:text-white">₹{stock.currentPrice.toLocaleString('en-IN')}</p>
                            <div className={`flex items-center gap-1 text-[11px] font-bold mt-1 ${stock.change >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                {stock.change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
                                {stock.change >= 0 ? '+' : ''}{(stock.change || 0).toLocaleString('en-IN')}
                            </div>
                        </motion.button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
                    {/* Main Chart */}
                    <div className="lg:col-span-2 p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                        <div className="flex items-center justify-between mb-6">
                            <div>
                                <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">{selectedStock.name}</h3>
                                <p className="text-[11px] text-neutral-400">Historical + prediction (dashed)</p>
                            </div>
                            <div className="flex gap-4">
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-0.5 bg-indigo-500" />
                                    <span className="text-[10px] text-neutral-400">Historical</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <div className="w-2.5 h-0.5 border-t border-dashed border-emerald-500" />
                                    <span className="text-[10px] text-neutral-400">Predicted</span>
                                </div>
                            </div>
                        </div>
                        <div className="h-[300px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <LineChart data={[...selectedStock.history, ...selectedStock.prediction]} margin={{ top: 5, right: 10, left: -20, bottom: 0 }}>
                                    <CartesianGrid strokeDasharray="0" vertical={false} stroke="#f0f0f0" />
                                    <XAxis dataKey="date" hide />
                                    <YAxis tick={{ fontSize: 10, fill: '#888' }} axisLine={false} tickLine={false} domain={['auto', 'auto']} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Line type="monotone" dataKey="price" data={selectedStock.history} stroke="#6366f1" strokeWidth={2} dot={false} />
                                    <Line type="monotone" dataKey="price" data={[selectedStock.history[selectedStock.history.length - 1], ...selectedStock.prediction]} stroke="#10b981" strokeWidth={2} dot={false} strokeDasharray="4 4" />
                                </LineChart>
                            </ResponsiveContainer>
                        </div>
                    </div>

                    {/* Risk Gauge & Stats */}
                    <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] flex flex-col items-center justify-center text-center">
                        <Shield className="w-8 h-8 text-indigo-500 mb-2" />
                        <h3 className="text-[14px] font-bold text-neutral-900 dark:text-white mb-6">Risk Score</h3>
                        <div className="relative w-40 h-20 overflow-hidden mb-4">
                            <div className="absolute inset-0 border-[12px] border-neutral-100 dark:border-neutral-800 rounded-t-full" />
                            <motion.div
                                initial={{ rotate: -90 }}
                                animate={{ rotate: -90 + (selectedStock.riskScore * 1.8) }}
                                transition={{ duration: 1.5, ease: 'easeOut' }}
                                className="absolute inset-0 border-[12px] border-amber-500 rounded-t-full"
                                style={{ borderRightColor: 'transparent', borderBottomColor: 'transparent' }}
                            />
                            <div className="absolute inset-0 flex flex-col items-center justify-end pb-1">
                                <span className="text-2xl font-bold text-neutral-900 dark:text-white">{selectedStock.riskScore}</span>
                                <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest">
                                    {selectedStock.riskScore < 30 ? 'Low' : selectedStock.riskScore < 60 ? 'Moderate' : 'High'}
                                </span>
                            </div>
                        </div>
                        <div className="w-full grid grid-cols-2 gap-3 mt-6">
                            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Sector</p>
                                <p className="text-[13px] font-bold text-neutral-900 dark:text-white">{selectedStock.sector}</p>
                            </div>
                            <div className="p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900 border border-neutral-100 dark:border-neutral-800">
                                <p className="text-[10px] text-neutral-400 font-bold uppercase mb-1">Current</p>
                                <p className="text-[13px] font-bold text-neutral-900 dark:text-white">₹{(selectedStock.currentPrice || 0).toLocaleString()}</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Portfolio Summary */}
                <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                    <div className="flex items-center gap-2 mb-6">
                        <PieChart className="w-4 h-4 text-indigo-500" />
                        <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white">Your Portfolio</h3>
                        <div className="ml-auto flex items-center gap-3">
                            <div className="text-right">
                                <p className="text-[10px] text-neutral-400 font-bold uppercase">Total Value</p>
                                <p className="text-[14px] font-bold text-neutral-900 dark:text-white">₹{portfolio.totalValue.toLocaleString('en-IN')}</p>
                            </div>
                            <div className="px-2 py-1 rounded-lg bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 font-bold text-[12px]">
                                {portfolio.returnsPercent >= 0 ? '+' : ''}{portfolio.returnsPercent}%
                            </div>
                        </div>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full text-[13px]">
                            <thead>
                                <tr className="border-b border-neutral-100 dark:border-neutral-800 text-neutral-400">
                                    <th className="text-left py-3 font-medium">Asset</th>
                                    <th className="text-right py-3 font-medium">Qty</th>
                                    <th className="text-right py-3 font-medium">Avg Price</th>
                                    <th className="text-right py-3 font-medium">Total Cost</th>
                                    <th className="text-right py-3 font-medium">Profit/Loss</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                {holdings.map((h) => {
                                    const profit = (h.currentPrice - h.avgPrice) * h.qty;
                                    const profitPct = (((h.currentPrice - h.avgPrice) / (h.avgPrice || 1)) * 100).toFixed(2);
                                    return (
                                        <tr key={h.symbol} className="hover:bg-neutral-50 dark:hover:bg-neutral-900/50 transition-colors">
                                            <td className="py-4">
                                                <p className="font-bold text-neutral-900 dark:text-white">{h.symbol}</p>
                                                <p className="text-[11px] text-neutral-400">₹{(h.currentPrice || 0).toLocaleString()}</p>
                                            </td>
                                            <td className="text-right py-4 font-medium">{h.qty}</td>
                                            <td className="text-right py-4 text-neutral-500">₹{h.avgPrice.toLocaleString()}</td>
                                            <td className="text-right py-4 font-bold text-neutral-900 dark:text-white">₹{(h.avgPrice * h.qty).toLocaleString()}</td>
                                            <td className={`text-right py-4 font-bold ${profit >= 0 ? 'text-emerald-500' : 'text-red-500'}`}>
                                                ₹{profit.toLocaleString()}
                                                <span className="block text-[10px] opacity-80">{profit >= 0 ? '+' : ''}{profitPct}%</span>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
