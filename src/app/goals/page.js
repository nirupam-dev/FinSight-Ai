'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import { FINANCIAL_GOALS, calculateSIP, calculateRequiredSIP } from '@/data/advancedData';
import { Plus, X, Calculator, TrendingUp, Calendar, Flame } from 'lucide-react';

export default function GoalsPage() {
    const [goals, setGoals] = useState(FINANCIAL_GOALS);
    const [showForm, setShowForm] = useState(false);
    const [showCalc, setShowCalc] = useState(false);
    const [sipAmount, setSipAmount] = useState(10000);
    const [sipYears, setSipYears] = useState(10);
    const [sipReturn, setSipReturn] = useState(12);
    const [form, setForm] = useState({ name: '', targetAmount: '', targetDate: '', icon: '🎯', monthlyContribution: '' });

    const sipResult = useMemo(() => calculateSIP(sipAmount, sipReturn, sipYears), [sipAmount, sipReturn, sipYears]);
    const totalInvested = sipAmount * sipYears * 12;

    const handleAddGoal = (e) => {
        e.preventDefault();
        if (!form.name || !form.targetAmount) return;
        setGoals([...goals, { id: Date.now(), name: form.name, targetAmount: Number(form.targetAmount), currentSaved: 0, targetDate: form.targetDate || '2028-01-01', monthlyContribution: Number(form.monthlyContribution) || 5000, icon: form.icon, category: 'custom', priority: 'medium' }]);
        setForm({ name: '', targetAmount: '', targetDate: '', icon: '🎯', monthlyContribution: '' });
        setShowForm(false);
    };

    const priorityColors = { high: 'text-red-500 bg-red-50 dark:bg-red-900/10', medium: 'text-amber-600 bg-amber-50 dark:bg-amber-900/10', low: 'text-emerald-600 bg-emerald-50 dark:bg-emerald-900/10' };
    const inputClass = "w-full px-3 py-2 rounded-lg text-[13px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all duration-150";

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Financial Goals</h1>
                        <p className="text-[13px] text-neutral-400 mt-0.5">Goal-based planning with SIP calculator</p>
                    </div>
                    <div className="flex gap-2">
                        <button onClick={() => setShowCalc(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150">
                            <Calculator className="w-4 h-4" /> SIP Calculator
                        </button>
                        <button onClick={() => setShowForm(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors duration-150">
                            <Plus className="w-4 h-4" /> Add Goal
                        </button>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {goals.map((goal, i) => {
                        const pct = Math.round((goal.currentSaved / goal.targetAmount) * 100);
                        const remaining = goal.targetAmount - goal.currentSaved;
                        const targetDate = new Date(goal.targetDate);
                        const monthsLeft = Math.max(1, Math.round((targetDate - new Date()) / (1000 * 60 * 60 * 24 * 30)));
                        const requiredSIP = calculateRequiredSIP(remaining, 12, monthsLeft / 12);
                        const onTrack = goal.monthlyContribution >= requiredSIP;

                        return (
                            <motion.div key={goal.id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5 flex flex-col">
                                <div className="flex items-start justify-between mb-3">
                                    <div className="flex items-center gap-2.5">
                                        <span className="text-xl">{goal.icon}</span>
                                        <div>
                                            <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white">{goal.name}</h3>
                                            <span className={`text-[10px] px-1.5 py-0.5 rounded ${priorityColors[goal.priority]}`}>{goal.priority}</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <div className="flex justify-between text-[11px] mb-1">
                                        <span className="text-neutral-400">₹{goal.currentSaved.toLocaleString('en-IN')} saved</span>
                                        <span className="font-medium text-neutral-900 dark:text-white">{pct}%</span>
                                    </div>
                                    <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6 }}
                                            className={`h-full rounded-full ${pct >= 75 ? 'bg-emerald-500' : pct >= 40 ? 'bg-indigo-500' : 'bg-amber-500'}`} />
                                    </div>
                                </div>

                                <div className="space-y-1 text-[12px] mb-3 flex-1">
                                    {[['Target', `₹${goal.targetAmount.toLocaleString('en-IN')}`], ['Remaining', `₹${remaining.toLocaleString('en-IN')}`], ['Monthly SIP', `₹${goal.monthlyContribution.toLocaleString('en-IN')}`]].map(([l, v]) => (
                                        <div key={l} className="flex justify-between"><span className="text-neutral-400">{l}</span><span className="font-medium text-neutral-900 dark:text-white">{v}</span></div>
                                    ))}
                                    <div className="flex justify-between">
                                        <span className="text-neutral-400">Deadline</span>
                                        <span className="font-medium text-neutral-900 dark:text-white flex items-center gap-1"><Calendar className="w-3 h-3" />{targetDate.toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })}</span>
                                    </div>
                                </div>

                                <div className={`p-2 rounded-lg text-[11px] flex items-center gap-1.5 ${onTrack ? 'bg-emerald-50 dark:bg-emerald-900/10 text-emerald-600' : 'bg-amber-50 dark:bg-amber-900/10 text-amber-600'}`}>
                                    {onTrack ? <><TrendingUp className="w-3.5 h-3.5" /> On track</> : <><Flame className="w-3.5 h-3.5" /> Need ₹{requiredSIP.toLocaleString('en-IN')}/mo</>}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* SIP Calculator Modal */}
                <AnimatePresence>
                    {showCalc && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4" onClick={() => setShowCalc(false)}>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md bg-white dark:bg-[#141414] rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">SIP Calculator</h3>
                                    <button onClick={() => setShowCalc(false)} className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="w-4 h-4 text-neutral-400" /></button>
                                </div>
                                <div className="space-y-5">
                                    {[{ label: 'Monthly Investment (₹)', min: 1000, max: 100000, step: 1000, val: sipAmount, set: setSipAmount, display: `₹${sipAmount.toLocaleString('en-IN')}` },
                                    { label: 'Duration (years)', min: 1, max: 30, step: 1, val: sipYears, set: setSipYears, display: `${sipYears} years` },
                                    { label: 'Expected Return (%/year)', min: 6, max: 20, step: 0.5, val: sipReturn, set: setSipReturn, display: `${sipReturn}%` },
                                    ].map((s) => (
                                        <div key={s.label}>
                                            <label className="text-[12px] font-medium text-neutral-500 mb-1.5 block">{s.label}</label>
                                            <input type="range" min={s.min} max={s.max} step={s.step} value={s.val} onChange={(e) => s.set(Number(e.target.value))} className="w-full accent-indigo-600" />
                                            <p className="text-right text-[13px] font-medium text-indigo-600 mt-0.5">{s.display}</p>
                                        </div>
                                    ))}
                                    <div className="grid grid-cols-3 gap-3 pt-4 border-t border-neutral-100 dark:border-neutral-800">
                                        <div className="text-center"><p className="text-[11px] text-neutral-400 mb-0.5">Invested</p><p className="text-[13px] font-semibold text-neutral-900 dark:text-white">₹{totalInvested.toLocaleString('en-IN')}</p></div>
                                        <div className="text-center"><p className="text-[11px] text-neutral-400 mb-0.5">Returns</p><p className="text-[13px] font-semibold text-emerald-600">₹{(sipResult - totalInvested).toLocaleString('en-IN')}</p></div>
                                        <div className="text-center"><p className="text-[11px] text-neutral-400 mb-0.5">Total</p><p className="text-base font-semibold text-indigo-600">₹{sipResult.toLocaleString('en-IN')}</p></div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Add Goal Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md bg-white dark:bg-[#141414] rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">New Goal</h3>
                                    <button onClick={() => setShowForm(false)} className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="w-4 h-4 text-neutral-400" /></button>
                                </div>
                                <form onSubmit={handleAddGoal} className="space-y-4">
                                    <div className="grid grid-cols-4 gap-1.5">
                                        {['🎯', '🚗', '🏠', '✈️', '💻', '📚', '🏖️', '🛡️'].map((emoji) => (
                                            <button key={emoji} type="button" onClick={() => setForm({ ...form, icon: emoji })}
                                                className={`text-xl p-2 rounded-lg transition-colors duration-150 ${form.icon === emoji ? 'bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500' : 'bg-neutral-50 dark:bg-neutral-800 hover:bg-neutral-100 dark:hover:bg-neutral-700'}`}>
                                                {emoji}
                                            </button>
                                        ))}
                                    </div>
                                    <div><label className="text-[12px] font-medium text-neutral-500 mb-1 block">Goal Name</label><input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className={inputClass} placeholder="e.g., Buy a new car" /></div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div><label className="text-[12px] font-medium text-neutral-500 mb-1 block">Target (₹)</label><input type="number" value={form.targetAmount} onChange={(e) => setForm({ ...form, targetAmount: e.target.value })} className={inputClass} placeholder="500000" /></div>
                                        <div><label className="text-[12px] font-medium text-neutral-500 mb-1 block">Monthly SIP (₹)</label><input type="number" value={form.monthlyContribution} onChange={(e) => setForm({ ...form, monthlyContribution: e.target.value })} className={inputClass} placeholder="10000" /></div>
                                    </div>
                                    <div><label className="text-[12px] font-medium text-neutral-500 mb-1 block">Target Date</label><input type="date" value={form.targetDate} onChange={(e) => setForm({ ...form, targetDate: e.target.value })} className={inputClass} /></div>
                                    <button type="submit" className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors duration-150">Create Goal</button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
