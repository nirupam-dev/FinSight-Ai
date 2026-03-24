'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import AppLayout from '@/components/layout/AppLayout';
import useStore from '@/store/useStore';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { AlertTriangle, CheckCircle, IndianRupee, Loader2 } from 'lucide-react';

export default function BudgetPage() {
    const budgetConfig = useStore((s) => s.budgetConfig);
    const setBudgetIncome = useStore((s) => s.setBudgetIncome);
    const budgetCategories = useStore((s) => s.budgetCategories);
    const savingsGoals = useStore((s) => s.savingsGoals);
    const loading = useStore((s) => s.loading);

    const [editIncome, setEditIncome] = useState(false);
    const [incomeValue, setIncomeValue] = useState(budgetConfig.monthlyIncome);
    const [saving, setSaving] = useState(false);

    const income = budgetConfig.monthlyIncome;
    const needsBudget = income * budgetConfig.needs;
    const wantsBudget = income * budgetConfig.wants;
    const savingsBudget = income * budgetConfig.savings;

    const splitData = [
        { name: 'Needs (50%)', value: needsBudget, color: '#3b82f6' },
        { name: 'Wants (30%)', value: wantsBudget, color: '#8b5cf6' },
        { name: 'Savings (20%)', value: savingsBudget, color: '#10b981' },
    ];

    const handleSaveIncome = async () => {
        const val = Number(incomeValue);
        if (isNaN(val) || val <= 0) return;
        setSaving(true);
        await setBudgetIncome(val);
        setSaving(false);
        setEditIncome(false);
    };

    const displayGoals = savingsGoals;

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="mb-6">
                    <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Budget Planning</h1>
                    <p className="text-[13px] text-neutral-400 mt-0.5">50-30-20 rule based budgeting</p>
                </div>

                {loading.budget && budgetCategories.length === 0 && (
                    <div className="flex items-center justify-center py-20 text-neutral-400 text-[13px]">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading budget data...
                    </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
                    {/* Income */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                        <div className="flex items-center gap-2 mb-3">
                            <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                                <IndianRupee className="w-4 h-4 text-white" />
                            </div>
                            <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white">Monthly Income</h3>
                        </div>
                        {editIncome ? (
                            <div className="flex gap-2">
                                <input type="number" value={incomeValue} onChange={(e) => setIncomeValue(e.target.value)}
                                    className="flex-1 px-3 py-2 rounded-lg text-[13px] bg-neutral-50 dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-700 text-neutral-900 dark:text-white outline-none" />
                                <button onClick={handleSaveIncome} disabled={saving}
                                    className="px-3 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium disabled:opacity-50 flex items-center gap-1">
                                    {saving && <Loader2 className="w-3 h-3 animate-spin" />}
                                    Save
                                </button>
                            </div>
                        ) : (
                            <div className="flex items-baseline gap-2">
                                <p className="text-2xl font-semibold text-neutral-900 dark:text-white">₹{income.toLocaleString('en-IN')}</p>
                                <button onClick={() => { setIncomeValue(income); setEditIncome(true); }} className="text-[12px] text-indigo-600 hover:underline">Edit</button>
                            </div>
                        )}
                    </motion.div>

                    {/* Split */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5 flex items-center gap-4">
                        <div className="w-[120px] h-[120px] relative">
                            <ResponsiveContainer width="100%" height="100%">
                                <PieChart><Pie data={splitData} cx="50%" cy="50%" innerRadius={36} outerRadius={54} paddingAngle={3} dataKey="value" stroke="none">
                                    {splitData.map((e, i) => <Cell key={i} fill={e.color} />)}
                                </Pie></PieChart>
                            </ResponsiveContainer>
                            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                                <p className="text-[11px] font-semibold text-neutral-500">50-30-20</p>
                            </div>
                        </div>
                        <div className="space-y-2">
                            {splitData.map((s, i) => (
                                <div key={i} className="flex items-center gap-2">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: s.color }} />
                                    <div>
                                        <p className="text-[11px] text-neutral-400">{s.name}</p>
                                        <p className="text-[13px] font-medium text-neutral-900 dark:text-white">₹{s.value.toLocaleString('en-IN')}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Alerts */}
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
                        className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                        <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-3">Alerts</h3>
                        <div className="space-y-2">
                            {budgetCategories.filter((c) => c.spent > c.allocated).map((c) => (
                                <div key={c.id} className="flex items-center gap-2 p-2 rounded-lg bg-amber-50 dark:bg-amber-900/10">
                                    <AlertTriangle className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />
                                    <p className="text-[11px] text-amber-700 dark:text-amber-400 font-medium">{c.label} over by ₹{(c.spent - c.allocated).toLocaleString('en-IN')}</p>
                                </div>
                            ))}
                            {budgetCategories.filter((c) => c.spent <= c.allocated * 0.5).length > 0 && (
                                <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50 dark:bg-emerald-900/10">
                                    <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                                    <p className="text-[11px] text-emerald-700 dark:text-emerald-400 font-medium">
                                        {budgetCategories.filter((c) => c.spent <= c.allocated * 0.5).length} categories under 50%
                                    </p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                </div>

                {/* Budget Categories */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                    {['needs', 'wants'].map((type) => {
                        const cats = budgetCategories.filter((c) => c.type === type);
                        const totalSpent = cats.reduce((s, c) => s + c.spent, 0);
                        const totalBudget = type === 'needs' ? needsBudget : wantsBudget;
                        const color = type === 'needs' ? '#3b82f6' : '#8b5cf6';
                        return (
                            <motion.div key={type} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: type === 'needs' ? 0.15 : 0.2 }}
                                className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                                <div className="flex items-center gap-2 mb-4">
                                    <div className="w-2.5 h-2.5 rounded-full" style={{ background: color }} />
                                    <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white capitalize">{type} ({type === 'needs' ? '50%' : '30%'})</h3>
                                    <span className="ml-auto text-[11px] text-neutral-400">₹{totalSpent.toLocaleString('en-IN')} / ₹{totalBudget.toLocaleString('en-IN')}</span>
                                </div>
                                <div className="space-y-3">
                                    {cats.map((cat) => {
                                        const pct = Math.min(100, Math.round((cat.spent / cat.allocated) * 100));
                                        const over = cat.spent > cat.allocated;
                                        return (
                                            <div key={cat.id}>
                                                <div className="flex items-center justify-between text-[12px] mb-1">
                                                    <span className="text-neutral-500">{cat.label}</span>
                                                    <span className={`font-medium ${over ? 'text-red-500' : 'text-neutral-900 dark:text-white'}`}>
                                                        ₹{cat.spent.toLocaleString('en-IN')} / ₹{cat.allocated.toLocaleString('en-IN')}
                                                    </span>
                                                </div>
                                                <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.6, ease: 'easeOut' }}
                                                        className="h-full rounded-full" style={{ background: over ? '#ef4444' : color }} />
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            </motion.div>
                        );
                    })}
                </div>

                {/* Savings Goals */}
                <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
                    className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5">
                    <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-4">Savings Goals</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {displayGoals.map((goal) => {
                            const pct = Math.round((goal.saved / goal.target) * 100);
                            return (
                                <div key={goal.id} className="p-4 rounded-lg border border-neutral-100 dark:border-neutral-800">
                                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white mb-1">{goal.label}</p>
                                    <p className="text-[11px] text-neutral-400 mb-3">₹{goal.saved.toLocaleString('en-IN')} / ₹{goal.target.toLocaleString('en-IN')}</p>
                                    <div className="h-1.5 bg-neutral-100 dark:bg-neutral-800 rounded-full overflow-hidden mb-1">
                                        <motion.div initial={{ width: 0 }} animate={{ width: `${pct}%` }} transition={{ duration: 0.8 }}
                                            className="h-full rounded-full" style={{ background: goal.color }} />
                                    </div>
                                    <p className="text-[11px] font-medium text-right" style={{ color: goal.color }}>{pct}%</p>
                                </div>
                            );
                        })}
                    </div>
                </motion.div>
            </div>
        </AppLayout>
    );
}
