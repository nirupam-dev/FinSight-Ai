'use client';

import { useState, useMemo, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import AppLayout from '@/components/layout/AppLayout';
import useStore from '@/store/useStore';
const CATEGORIES = [
    { id: 'food', label: 'Food & Dining', icon: '🍕', color: '#f59e0b' },
    { id: 'transport', label: 'Transport', icon: '🚗', color: '#3b82f6' },
    { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
    { id: 'bills', label: 'Bills & EMI', icon: '📄', color: '#ef4444' },
    { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ec4899' },
    { id: 'health', label: 'Health', icon: '💊', color: '#10b981' },
    { id: 'travel', label: 'Travel', icon: '✈️', color: '#06b6d4' },
    { id: 'education', label: 'Education', icon: '📚', color: '#6366f1' },
    { id: 'groceries', label: 'Groceries', icon: '🥦', color: '#22c55e' },
    { id: 'other', label: 'Other', icon: '📦', color: '#64748b' },
];
import { Plus, Trash2, X, Upload, FileText, Loader2 } from 'lucide-react';

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 text-[12px]">
            <p className="text-neutral-400 mb-0.5">{label}</p>
            <p className="font-semibold text-neutral-900 dark:text-white">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
    );
}

export default function ExpensesPage() {
    const expenses = useStore((s) => s.expenses);
    const addExpense = useStore((s) => s.addExpense);
    const deleteExpense = useStore((s) => s.deleteExpense);
    const uploadFile = useStore((s) => s.uploadFile);
    const uploads = useStore((s) => s.uploads);
    const loading = useStore((s) => s.loading);
    const error = useStore((s) => s.error);

    const [showForm, setShowForm] = useState(false);
    const [filterCat, setFilterCat] = useState('all');
    const [form, setForm] = useState({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] });
    const [formErrors, setFormErrors] = useState({});
    const [submitting, setSubmitting] = useState(false);
    const fileInputRef = useRef(null);

    const filtered = filterCat === 'all' ? expenses : expenses.filter((e) => e.category === filterCat);

    const categoryAnalytics = useMemo(() => {
        const map = {};
        expenses.forEach((e) => {
            const cat = CATEGORIES.find((c) => c.id === e.category);
            const label = cat?.label || e.category;
            map[label] = (map[label] || 0) + e.amount;
        });
        return Object.entries(map)
            .map(([name, amount]) => ({ name: name.length > 10 ? name.substring(0, 10) + '…' : name, amount }))
            .sort((a, b) => b.amount - a.amount);
    }, [expenses]);

    const validateForm = () => {
        const errs = {};
        if (!form.description.trim()) errs.description = 'Required';
        if (!form.amount || Number(form.amount) <= 0) errs.amount = 'Enter valid amount';
        if (!form.date) errs.date = 'Select a date';
        setFormErrors(errs);
        return Object.keys(errs).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateForm()) return;
        setSubmitting(true);
        const result = await addExpense({
            description: form.description.trim(),
            amount: Number(form.amount),
            category: form.category,
            date: form.date,
        });
        setSubmitting(false);
        if (result.success) {
            setForm({ description: '', amount: '', category: 'food', date: new Date().toISOString().split('T')[0] });
            setFormErrors({});
            setShowForm(false);
        }
    };

    const handleUpload = async (e) => {
        const file = e.target.files?.[0];
        if (!file) return;
        await uploadFile(file);
        e.target.value = '';
    };

    const inputClass = "w-full px-3 py-2 rounded-lg text-[13px] bg-neutral-50 dark:bg-neutral-900 border text-neutral-900 dark:text-white outline-none focus:ring-1 focus:ring-indigo-500/30 transition-all duration-150";

    return (
        <AppLayout>
            <div className="max-w-6xl mx-auto">
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Expenses</h1>
                        <p className="text-[13px] text-neutral-400 mt-0.5">Track and manage your spending</p>
                    </div>
                    <div className="flex gap-2">
                        <input type="file" ref={fileInputRef} onChange={handleUpload} accept="image/*,.pdf" className="hidden" />
                        <button
                            onClick={() => fileInputRef.current?.click()}
                            disabled={loading.upload}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg border border-neutral-200 dark:border-neutral-700 text-[13px] font-medium text-neutral-600 dark:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors duration-150 disabled:opacity-50"
                        >
                            {loading.upload ? <Loader2 className="w-4 h-4 animate-spin" /> : <Upload className="w-4 h-4" />}
                            Upload Receipt
                        </button>
                        <button
                            onClick={() => setShowForm(true)}
                            className="flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors duration-150"
                        >
                            <Plus className="w-4 h-4" /> Add Expense
                        </button>
                    </div>
                </div>

                {/* Uploaded receipts */}
                {uploads.length > 0 && (
                    <div className="mb-4 rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-4">
                        <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white mb-2 flex items-center gap-1.5">
                            <FileText className="w-4 h-4 text-indigo-500" /> Uploaded Receipts
                        </h3>
                        <div className="flex gap-3 flex-wrap">
                            {uploads.slice(0, 6).map((u) => (
                                <a key={u.id} href={u.url} target="_blank" rel="noopener noreferrer"
                                    className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 hover:border-indigo-400 transition-colors text-[12px]">
                                    {u.type?.startsWith('image') ? (
                                        <img src={u.url} alt={u.originalName} className="w-8 h-8 rounded object-cover" />
                                    ) : (
                                        <FileText className="w-4 h-4 text-neutral-400" />
                                    )}
                                    <div>
                                        <p className="text-neutral-900 dark:text-white font-medium truncate max-w-[120px]">{u.originalName}</p>
                                        <p className="text-neutral-400">{new Date(u.uploadedAt).toLocaleDateString()}</p>
                                    </div>
                                </a>
                            ))}
                        </div>
                    </div>
                )}

                {/* Loading state */}
                {loading.expenses && expenses.length === 0 && (
                    <div className="flex items-center justify-center py-20 text-neutral-400 text-[13px]">
                        <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading expenses...
                    </div>
                )}

                {/* Error state */}
                {error.expenses && (
                    <div className="mb-4 p-3 rounded-lg bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-800 text-[12px] text-red-600 dark:text-red-400">
                        ⚠️ {error.expenses}
                    </div>
                )}

                {/* Chart */}
                {expenses.length > 0 && (
                    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5 mb-6">
                        <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-4">Spending by Category</h3>
                        <div className="h-[200px]">
                            <ResponsiveContainer width="100%" height="100%">
                                <BarChart data={categoryAnalytics} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                                    <CartesianGrid stroke="#e5e5e5" strokeDasharray="none" vertical={false} />
                                    <XAxis dataKey="name" tick={{ fontSize: 10, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                                    <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} tickFormatter={(v) => `₹${(v / 1000)}k`} axisLine={false} tickLine={false} />
                                    <Tooltip content={<CustomTooltip />} />
                                    <Bar dataKey="amount" radius={[4, 4, 0, 0]} fill="#6366f1" />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </motion.div>
                )}

                {/* Filters */}
                <div className="flex items-center gap-1.5 mb-4 flex-wrap">
                    <button onClick={() => setFilterCat('all')}
                        className={`px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors duration-150 ${filterCat === 'all' ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                        All
                    </button>
                    {CATEGORIES.slice(0, 7).map((cat) => (
                        <button key={cat.id} onClick={() => setFilterCat(cat.id)}
                            className={`px-2.5 py-1.5 rounded-md text-[12px] font-medium transition-colors duration-150 ${filterCat === cat.id ? 'bg-indigo-600 text-white' : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-500 dark:text-neutral-400 hover:bg-neutral-200 dark:hover:bg-neutral-700'}`}>
                            {cat.icon} {cat.label}
                        </button>
                    ))}
                </div>

                {/* List */}
                <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] overflow-hidden">
                    <div className="divide-y divide-neutral-100 dark:divide-neutral-800">
                        {filtered.length === 0 && !loading.expenses && (
                            <div className="py-12 text-center text-[13px] text-neutral-400">No expenses found</div>
                        )}
                        {filtered.map((tx) => {
                            const cat = CATEGORIES.find((c) => c.id === tx.category);
                            return (
                                <div key={tx.id} className="flex items-center gap-3 px-4 py-3 hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors duration-100 group">
                                    <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm">{cat?.icon || '📦'}</div>
                                    <div className="flex-1 min-w-0">
                                        <p className="text-[13px] font-medium text-neutral-900 dark:text-white">{tx.description}</p>
                                        <p className="text-[11px] text-neutral-400">{cat?.label} · {tx.date}</p>
                                    </div>
                                    <p className="text-[13px] font-medium text-neutral-900 dark:text-white">-₹{tx.amount.toLocaleString('en-IN')}</p>
                                    <button onClick={() => deleteExpense(tx.id)} className="opacity-0 group-hover:opacity-100 p-1.5 rounded-md hover:bg-red-50 dark:hover:bg-red-900/20 text-red-500 transition-all duration-100">
                                        <Trash2 className="w-3.5 h-3.5" />
                                    </button>
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Add Expense Modal */}
                <AnimatePresence>
                    {showForm && (
                        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/20 z-50 flex items-center justify-center p-4" onClick={() => setShowForm(false)}>
                            <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} onClick={(e) => e.stopPropagation()}
                                className="w-full max-w-md bg-white dark:bg-[#141414] rounded-xl p-6 shadow-lg border border-neutral-200 dark:border-neutral-800">
                                <div className="flex items-center justify-between mb-5">
                                    <h3 className="text-[15px] font-semibold text-neutral-900 dark:text-white">Add Expense</h3>
                                    <button onClick={() => setShowForm(false)} className="p-1 rounded-md hover:bg-neutral-100 dark:hover:bg-neutral-800"><X className="w-4 h-4 text-neutral-400" /></button>
                                </div>
                                <form onSubmit={handleSubmit} className="space-y-4">
                                    <div>
                                        <label className="text-[12px] font-medium text-neutral-500 mb-1 block">Description</label>
                                        <input value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                                            className={`${inputClass} ${formErrors.description ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'}`}
                                            placeholder="e.g., Coffee at Starbucks" />
                                        {formErrors.description && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.description}</p>}
                                    </div>
                                    <div className="grid grid-cols-2 gap-3">
                                        <div>
                                            <label className="text-[12px] font-medium text-neutral-500 mb-1 block">Amount (₹)</label>
                                            <input type="number" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })}
                                                className={`${inputClass} ${formErrors.amount ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'}`}
                                                placeholder="500" />
                                            {formErrors.amount && <p className="text-[11px] text-red-500 mt-0.5">{formErrors.amount}</p>}
                                        </div>
                                        <div>
                                            <label className="text-[12px] font-medium text-neutral-500 mb-1 block">Date</label>
                                            <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                                                className={`${inputClass} ${formErrors.date ? 'border-red-400' : 'border-neutral-200 dark:border-neutral-700'}`} />
                                        </div>
                                    </div>
                                    <div>
                                        <label className="text-[12px] font-medium text-neutral-500 mb-1 block">Category</label>
                                        <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                            className={`${inputClass} border-neutral-200 dark:border-neutral-700`}>
                                            {CATEGORIES.map((cat) => (<option key={cat.id} value={cat.id}>{cat.icon} {cat.label}</option>))}
                                        </select>
                                    </div>
                                    <button type="submit" disabled={submitting}
                                        className="w-full py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-[13px] font-medium transition-colors duration-150 disabled:opacity-50 flex items-center justify-center gap-2">
                                        {submitting && <Loader2 className="w-4 h-4 animate-spin" />}
                                        {submitting ? 'Adding...' : 'Add Expense'}
                                    </button>
                                </form>
                            </motion.div>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </AppLayout>
    );
}
