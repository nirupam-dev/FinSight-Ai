'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import { SUBSCRIPTIONS, SPENDING_PATTERNS, FINANCIAL_HEALTH, SPENDING_BY_DAY, SPENDING_BY_HOUR, RISK_SCENARIOS } from '@/data/advancedData';
import { AlertTriangle, CheckCircle, Info, Zap, RotateCcw, ShieldAlert } from 'lucide-react';

function ChartTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 text-[12px]">
            <p className="text-neutral-400 mb-0.5">{label}</p>
            <p className="font-semibold text-neutral-900 dark:text-white">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
    );
}

const severityStyles = {
    danger: 'border-red-200 dark:border-red-800/30 bg-red-50 dark:bg-red-900/10',
    warning: 'border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/10',
    success: 'border-emerald-200 dark:border-emerald-800/30 bg-emerald-50 dark:bg-emerald-900/10',
    info: 'border-blue-200 dark:border-blue-800/30 bg-blue-50 dark:bg-blue-900/10',
};
const severityText = {
    danger: 'text-red-700 dark:text-red-400',
    warning: 'text-amber-700 dark:text-amber-400',
    success: 'text-emerald-700 dark:text-emerald-400',
    info: 'text-blue-700 dark:text-blue-400',
};

export default function InsightsPage() {
    const [activeTab, setActiveTab] = useState('patterns');

    const totalSubCost = SUBSCRIPTIONS.filter((s) => s.active).reduce((sum, s) => sum + (s.frequency === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0);
    const wastedSubs = SUBSCRIPTIONS.filter((s) => s.active && s.usage === 'low');
    const wastedAmount = wastedSubs.reduce((sum, s) => sum + (s.frequency === 'yearly' ? Math.round(s.amount / 12) : s.amount), 0);
    const potentialSavings = SPENDING_PATTERNS.reduce((s, p) => s + p.savings, 0);

    const healthRadar = FINANCIAL_HEALTH.breakdown.map((b) => ({ subject: b.label, score: b.score, fullMark: 100 }));

    const tabs = [
        { id: 'patterns', label: 'Behavioral', icon: Zap },
        { id: 'subscriptions', label: 'Subscriptions', icon: RotateCcw },
        { id: 'health', label: 'Financial Health', icon: ShieldAlert },
        { id: 'risk', label: 'Risk Engine', icon: AlertTriangle },
    ];

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">AI Insights</h1>
                    <p className="text-[13px] text-neutral-400 mt-0.5">Behavioral analysis, subscription tracking, and risk assessment</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
                    {[
                        { label: 'Financial Health Score', value: FINANCIAL_HEALTH.overallScore, suffix: '/100', color: 'text-emerald-600' },
                        { label: 'Monthly Subscriptions', value: `₹${totalSubCost.toLocaleString('en-IN')}`, suffix: '/month', color: 'text-indigo-600' },
                        { label: 'Potential Savings', value: `₹${(potentialSavings + wastedAmount).toLocaleString('en-IN')}`, suffix: '/month', color: 'text-amber-600' },
                    ].map((s, i) => (
                        <motion.div key={i} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                            <p className="text-[12px] text-neutral-400 mb-1">{s.label}</p>
                            <div className="flex items-baseline gap-1">
                                <span className={`text-2xl font-semibold ${s.color}`}>{s.value}</span>
                                <span className="text-[11px] text-neutral-400">{s.suffix}</span>
                            </div>
                        </motion.div>
                    ))}
                </div>

                {/* Tabs */}
                <div className="flex gap-1 mb-6 border-b border-neutral-200 dark:border-neutral-800">
                    {tabs.map((t) => (
                        <button key={t.id} onClick={() => setActiveTab(t.id)}
                            className={`px-3.5 py-2.5 text-[13px] font-medium transition-colors duration-150 border-b-2
              ${activeTab === t.id
                                    ? 'border-indigo-600 text-indigo-600'
                                    : 'border-transparent text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300'
                                }`}>
                            {t.label}
                        </button>
                    ))}
                </div>

                {/* Patterns Tab */}
                {activeTab === 'patterns' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-4">
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                            <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-4">Behavioral Spending Patterns</h3>
                            <div className="space-y-2">
                                {SPENDING_PATTERNS.map((p, i) => (
                                    <div key={i} className={`flex items-start gap-3 p-3 rounded-lg border ${severityStyles[p.severity]}`}>
                                        <span className="text-lg mt-0.5">{p.icon}</span>
                                        <div className="flex-1">
                                            <p className={`text-[13px] font-medium ${severityText[p.severity]}`}>{p.pattern}</p>
                                            <p className="text-[11px] text-neutral-500 mt-0.5">{p.description}</p>
                                        </div>
                                        {p.savings > 0 && (
                                            <span className={`text-[11px] font-medium ${severityText[p.severity]} whitespace-nowrap`}>
                                                Save ₹{p.savings.toLocaleString('en-IN')}/mo
                                            </span>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {[{ title: 'By Day of Week', data: SPENDING_BY_DAY, key: 'day', color: '#6366f1' },
                            { title: 'By Time of Day', data: SPENDING_BY_HOUR, key: 'hour', color: '#f59e0b' }].map((c) => (
                                <div key={c.title} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                                    <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white mb-3">{c.title}</h3>
                                    <div className="h-[180px]">
                                        <ResponsiveContainer width="100%" height="100%">
                                            <BarChart data={c.data}>
                                                <CartesianGrid stroke="#e5e5e5" strokeDasharray="none" vertical={false} />
                                                <XAxis dataKey={c.key} tick={{ fontSize: 10, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                                                <YAxis tick={{ fontSize: 10, fill: '#a3a3a3' }} tickFormatter={(v) => `₹${(v / 1000)}k`} axisLine={false} tickLine={false} />
                                                <Tooltip content={<ChartTooltip />} />
                                                <Bar dataKey="amount" radius={[3, 3, 0, 0]} fill={c.color} />
                                            </BarChart>
                                        </ResponsiveContainer>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {/* Subscriptions Tab */}
                {activeTab === 'subscriptions' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-4">
                        {wastedSubs.length > 0 && (
                            <div className="rounded-xl border border-amber-200 dark:border-amber-800/30 bg-amber-50 dark:bg-amber-900/10 p-5">
                                <div className="flex items-center gap-2 mb-2">
                                    <AlertTriangle className="w-4 h-4 text-amber-600" />
                                    <h3 className="text-[13px] font-semibold text-amber-700 dark:text-amber-400">Subscription Waste Detected</h3>
                                </div>
                                <p className="text-[12px] text-amber-600 dark:text-amber-400/80 mb-2">
                                    {wastedSubs.length} low-usage subscriptions costing ₹{wastedAmount.toLocaleString('en-IN')}/month (₹{(wastedAmount * 12).toLocaleString('en-IN')}/year).
                                </p>
                                <div className="flex flex-wrap gap-1.5">
                                    {wastedSubs.map((s) => (
                                        <span key={s.id} className="px-2 py-1 rounded-md text-[11px] font-medium bg-amber-100 dark:bg-amber-800/20 text-amber-700 dark:text-amber-400">
                                            {s.name} — ₹{s.amount}/mo
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden">
                            <div className="px-5 py-3.5 border-b border-neutral-100 dark:border-neutral-800">
                                <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white">All Subscriptions</h3>
                            </div>
                            {SUBSCRIPTIONS.map((sub) => {
                                const usageColor = sub.usage === 'high' ? 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' : sub.usage === 'medium' ? 'text-amber-600 bg-amber-50 dark:bg-amber-900/10' : 'text-red-500 bg-red-50 dark:bg-red-900/10';
                                return (
                                    <div key={sub.id} className="flex items-center gap-3 px-5 py-3 border-b border-neutral-50 dark:border-neutral-800/50 last:border-0">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2">
                                                <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{sub.name}</p>
                                                {!sub.active && <span className="text-[10px] px-1.5 py-0.5 rounded bg-neutral-100 dark:bg-neutral-800 text-neutral-400">Paused</span>}
                                            </div>
                                            <p className="text-[11px] text-neutral-400">{sub.frequency} · Last: {sub.lastCharged}</p>
                                        </div>
                                        <span className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${usageColor}`}>
                                            {sub.usage} usage
                                        </span>
                                        <span className="text-[13px] font-medium text-neutral-900 dark:text-white w-20 text-right">
                                            ₹{sub.amount}{sub.frequency === 'yearly' ? '/yr' : '/mo'}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </motion.div>
                )}

                {/* Health Tab */}
                {activeTab === 'health' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                                <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white mb-3">Health Radar</h3>
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <RadarChart data={healthRadar}>
                                            <PolarGrid stroke="#e5e5e5" />
                                            <PolarAngleAxis dataKey="subject" tick={{ fontSize: 10, fill: '#a3a3a3' }} />
                                            <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 9 }} />
                                            <Radar name="Score" dataKey="score" stroke="#6366f1" fill="#6366f1" fillOpacity={0.1} strokeWidth={1.5} />
                                        </RadarChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                            <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                                <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white mb-3">Score Trend</h3>
                                <div className="h-[260px]">
                                    <ResponsiveContainer width="100%" height="100%">
                                        <LineChart data={FINANCIAL_HEALTH.trend}>
                                            <CartesianGrid stroke="#e5e5e5" strokeDasharray="none" vertical={false} />
                                            <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                                            <YAxis domain={[50, 100]} tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                                            <Tooltip />
                                            <Line type="monotone" dataKey="score" stroke="#10b981" strokeWidth={1.5} dot={{ r: 3, fill: '#10b981', stroke: '#fff', strokeWidth: 2 }} />
                                        </LineChart>
                                    </ResponsiveContainer>
                                </div>
                            </div>
                        </div>
                        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                            <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-4">Breakdown</h3>
                            <div className="space-y-3">
                                {FINANCIAL_HEALTH.breakdown.map((item, i) => (
                                    <div key={i}>
                                        <div className="flex items-center justify-between text-[12px] mb-1.5">
                                            <span className="text-neutral-500">{item.label}</span>
                                            <span className="font-medium text-neutral-900 dark:text-white">{item.score}/100</span>
                                        </div>
                                        <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-1">
                                            <motion.div initial={{ width: 0 }} animate={{ width: `${item.score}%` }} transition={{ duration: 0.6, delay: i * 0.1 }}
                                                className={`h-full rounded-full ${item.score >= 75 ? 'bg-emerald-500' : item.score >= 50 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                        </div>
                                        <p className="text-[11px] text-neutral-400">{item.tip}</p>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </motion.div>
                )}

                {/* Risk Tab */}
                {activeTab === 'risk' && (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }} className="space-y-4">
                        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                            {RISK_SCENARIOS.map((scenario, i) => (
                                <motion.div key={scenario.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                    className={`rounded-xl border p-5 ${severityStyles[scenario.severity]}`}>
                                    <div className="flex items-center gap-2.5 mb-3">
                                        <span className="text-xl">{scenario.icon}</span>
                                        <div>
                                            <h4 className={`text-[13px] font-semibold ${severityText[scenario.severity]}`}>{scenario.title}</h4>
                                            <p className="text-[11px] text-neutral-500">{scenario.description}</p>
                                        </div>
                                    </div>
                                    {scenario.id === 'job_loss' && (
                                        <div className="space-y-1.5 mb-3 text-[12px]">
                                            {[['Emergency Fund', `₹${scenario.emergencyFund.toLocaleString('en-IN')}`], ['Monthly Expenses', `₹${scenario.monthlyExpenses.toLocaleString('en-IN')}`]].map(([l, v]) => (
                                                <div key={l} className="flex justify-between"><span className="text-neutral-500">{l}</span><span className="font-medium text-neutral-900 dark:text-white">{v}</span></div>
                                            ))}
                                            <div className="flex justify-between"><span className="text-neutral-500">Survival</span><span className="text-lg font-semibold text-amber-600">{scenario.survivalMonths} months</span></div>
                                        </div>
                                    )}
                                    {scenario.id === 'medical' && (
                                        <div className="space-y-1.5 mb-3 text-[12px]">
                                            <div className="flex justify-between"><span className="text-neutral-500">Insurance</span><span className="font-medium text-neutral-900 dark:text-white">₹{scenario.healthInsurance.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between"><span className="text-neutral-500">Status</span><span className="font-medium text-emerald-600">✓ Covered</span></div>
                                        </div>
                                    )}
                                    {scenario.id === 'inflation' && (
                                        <div className="space-y-1.5 mb-3 text-[12px]">
                                            <div className="flex justify-between"><span className="text-neutral-500">Current</span><span className="font-medium text-neutral-900 dark:text-white">₹{scenario.currentMonthly.toLocaleString('en-IN')}/mo</span></div>
                                            <div className="flex justify-between"><span className="text-neutral-500">After 8%</span><span className="font-medium text-neutral-900 dark:text-white">₹{scenario.futureMonthly.toLocaleString('en-IN')}/mo</span></div>
                                            <div className="flex justify-between"><span className="text-neutral-500">Impact</span><span className="font-medium text-amber-600">+₹{scenario.impact.toLocaleString('en-IN')}/mo</span></div>
                                        </div>
                                    )}
                                    {scenario.id === 'rate_hike' && (
                                        <div className="space-y-1.5 mb-3 text-[12px]">
                                            <div className="flex justify-between"><span className="text-neutral-500">Current EMI</span><span className="font-medium text-neutral-900 dark:text-white">₹{scenario.currentEMI.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between"><span className="text-neutral-500">New EMI (+1%)</span><span className="font-medium text-neutral-900 dark:text-white">₹{scenario.newEMI.toLocaleString('en-IN')}</span></div>
                                            <div className="flex justify-between"><span className="text-neutral-500">Impact</span><span className="font-medium text-amber-600">+₹{scenario.monthlyImpact.toLocaleString('en-IN')}</span></div>
                                        </div>
                                    )}
                                    <div className="p-2.5 rounded-lg bg-white/60 dark:bg-black/20 text-[11px] text-neutral-600 dark:text-neutral-400">
                                        💡 {scenario.recommendation}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </div>
        </AppLayout>
    );
}
