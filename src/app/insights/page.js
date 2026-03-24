'use client';

import { useState, useMemo } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import useStore from '@/store/useStore';
import { getBehavioralInsights } from '@/lib/analysis';
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts';
import { Brain, ShieldAlert, HeartPulse, CreditCard, ChevronRight, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function InsightsPage() {
    const expenses = useStore((s) => s.expenses);
    const budgetCategories = useStore((s) => s.budgetCategories) || [];
    const subscriptions = useStore((s) => s.subscriptions) || [];
    const [activeTab, setActiveTab] = useState('behavioral');

    const behavioralInsights = useMemo(() => getBehavioralInsights(expenses || []), [expenses]);

    // Financial Health Data (Radar Chart)
    const financialHealth = useMemo(() => {
        if (!budgetCategories || budgetCategories.length === 0) return [];
        return budgetCategories.map(c => ({
            subject: c.label || c.id,
            A: Math.min(100, Math.round(((c.spent || 0) / (c.allocated || 1)) * 100)),
            fullMark: 100
        })).slice(0, 6);
    }, [budgetCategories]);

    // Subscriptions Analytics
    const subAnalytics = useMemo(() => {
        if (!subscriptions) return { total: 0, inactive: 0, potentialSavings: 0 };
        const total = subscriptions.reduce((s, sub) => s + (sub.active ? (sub.amount || 0) : 0), 0);
        const inactive = subscriptions.filter(s => !s.active).length;
        const potentialSavings = subscriptions.filter(s => s.usage === 'low').reduce((s, sub) => s + (sub.amount || 0), 0);
        return { total, inactive, potentialSavings };
    }, [subscriptions]);

    const tabs = [
        { id: 'behavioral', label: 'Behavioral', icon: <Brain className="w-4 h-4" /> },
        { id: 'subscriptions', label: 'Subscriptions', icon: <CreditCard className="w-4 h-4" /> },
        { id: 'health', label: 'Financial Health', icon: <HeartPulse className="w-4 h-4" /> },
        { id: 'risk', label: 'Risk Engine', icon: <ShieldAlert className="w-4 h-4" /> },
    ];

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Financial Insights</h1>
                    <p className="text-[13px] text-neutral-400 mt-0.5">AI-driven behavioral analysis and risk assessment</p>
                </div>

                {/* Tabs */}
                <div className="flex gap-1 p-1 bg-neutral-100 dark:bg-neutral-900 rounded-xl mb-6 w-fit">
                    {tabs.map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-[13px] font-medium transition-all duration-200
                                ${activeTab === tab.id
                                    ? 'bg-white dark:bg-neutral-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                                    : 'text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300'}`}
                        >
                            {tab.icon}
                            {tab.label}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Main Content Area */}
                    <div className="lg:col-span-2 space-y-6">
                        {activeTab === 'behavioral' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                {behavioralInsights.map((insight, i) => (
                                    <div key={i} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] flex gap-4">
                                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 
                                            ${insight.type === 'positive' ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/10 text-amber-600'}`}>
                                            {insight.type === 'positive' ? <CheckCircle2 className="w-5 h-5" /> : <AlertCircle className="w-5 h-5" />}
                                        </div>
                                        <div>
                                            <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-1">{insight.title}</h3>
                                            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 leading-relaxed">{insight.description}</p>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}

                        {activeTab === 'subscriptions' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Monthly Burn</p>
                                        <p className="text-2xl font-bold text-neutral-900 dark:text-white">₹{subAnalytics.total.toLocaleString()}</p>
                                    </div>
                                    <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                                        <p className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider mb-1">Potential Savings</p>
                                        <p className="text-2xl font-bold text-emerald-500">₹{subAnalytics.potentialSavings.toLocaleString()}</p>
                                        <p className="text-[10px] text-neutral-400 mt-1">Found in low-usage apps</p>
                                    </div>
                                </div>
                                <div className="rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden">
                                    <table className="w-full text-[13px]">
                                        <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                                            <tr className="text-neutral-400 text-left">
                                                <th className="px-5 py-3 font-medium">Service</th>
                                                <th className="px-5 py-3 font-medium">Cost</th>
                                                <th className="px-5 py-3 font-medium">Usage</th>
                                                <th className="px-5 py-3 font-medium text-right">Action</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800">
                                            {subscriptions.map((sub) => (
                                                <tr key={sub.id} className="group hover:bg-neutral-50 dark:hover:bg-neutral-900/30 transition-colors">
                                                    <td className="px-5 py-4 font-medium text-neutral-900 dark:text-white">{sub.name}</td>
                                                    <td className="px-5 py-4 text-neutral-500">₹{sub.amount}/mo</td>
                                                    <td className="px-5 py-4">
                                                        <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sub.usage === 'high' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-amber-100 dark:bg-amber-900/20 text-amber-600'}`}>
                                                            {sub.usage}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-4 text-right">
                                                        <button className="text-indigo-600 dark:text-indigo-400 font-medium hover:underline">Manage</button>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'health' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="p-6 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                                <h3 className="text-[15px] font-bold text-neutral-900 dark:text-white mb-8 text-center">Spending Allocation Radar</h3>
                                <div className="h-[350px]">
                                    {financialHealth.length > 0 ? (
                                        <ResponsiveContainer width="100%" height="100%">
                                            <RadarChart cx="50%" cy="50%" outerRadius="80%" data={financialHealth}>
                                                <PolarGrid stroke="#e5e5e5" />
                                                <PolarAngleAxis dataKey="subject" tick={{ fontSize: 11, fill: '#888' }} />
                                                <Radar name="Spending" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.5} />
                                            </RadarChart>
                                        </ResponsiveContainer>
                                    ) : (
                                        <div className="flex items-center justify-center h-full text-neutral-400 text-[13px]">No health data available</div>
                                    )}
                                </div>
                                <div className="mt-8 p-4 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/30 flex gap-3">
                                    <Info className="w-5 h-5 text-indigo-600 shrink-0" />
                                    <p className="text-[12px] text-indigo-700 dark:text-indigo-300 leading-relaxed font-medium">
                                        Your radar chart shows how close you are to your budget limits. Balanced polygons indicate healthy spending discipline across categories.
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'risk' && (
                            <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-4">
                                {useStore.getState().riskScenarios.map((sc, i) => (
                                    <div key={i} className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                                        <div className="flex items-center justify-between mb-3">
                                            <h3 className="text-[14px] font-bold text-neutral-900 dark:text-white">{sc.scenario}</h3>
                                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase ${sc.impact === 'low' ? 'bg-emerald-100 dark:bg-emerald-900/20 text-emerald-600' : 'bg-red-100 dark:bg-red-900/20 text-red-600'}`}>
                                                {sc.impact} Impact
                                            </span>
                                        </div>
                                        <p className="text-[12px] text-neutral-500 mb-4">{sc.description}</p>
                                        <div className="flex items-center justify-between p-3 rounded-xl bg-neutral-50 dark:bg-neutral-900">
                                            <span className="text-[11px] font-bold text-neutral-400 uppercase tracking-wider">Estimated Recovery</span>
                                            <span className="text-[13px] font-bold text-neutral-900 dark:text-white">{sc.recovery}</span>
                                        </div>
                                    </div>
                                ))}
                            </motion.div>
                        )}
                    </div>

                    {/* Sidebar Area */}
                    <div className="space-y-6">
                        <div className="p-5 rounded-2xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414]">
                            <h3 className="text-[14px] font-bold text-neutral-900 dark:text-white mb-4 flex items-center gap-2">
                                <ShieldAlert className="w-4 h-4 text-amber-500" />
                                Critical Actions
                            </h3>
                            <div className="space-y-3">
                                {subAnalytics.potentialSavings > 0 && (
                                    <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20">
                                        <p className="text-[12px] text-amber-900 dark:text-amber-200 font-bold mb-1">Cancel Unused Subs</p>
                                        <p className="text-[11px] text-amber-700 dark:text-amber-400 mb-2">Save ₹{subAnalytics.potentialSavings.toLocaleString()}/mo immediately.</p>
                                        <button className="text-[11px] font-bold text-amber-900 dark:text-white flex items-center gap-1 hover:underline uppercase tracking-wider">
                                            Take Action <ChevronRight className="w-3 h-3" />
                                        </button>
                                    </div>
                                )}
                                <div className="p-3 rounded-xl bg-indigo-50 dark:bg-indigo-900/10 border border-indigo-100 dark:border-indigo-900/20">
                                    <p className="text-[12px] text-indigo-900 dark:text-indigo-200 font-bold mb-1">Diversify Portfolio</p>
                                    <p className="text-[11px] text-indigo-700 dark:text-indigo-400 mb-2">Increase and diversify for long-term stability.</p>
                                    <button className="text-[11px] font-bold text-indigo-900 dark:text-white flex items-center gap-1 hover:underline uppercase tracking-wider">
                                        Analyze <ChevronRight className="w-3 h-3" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
