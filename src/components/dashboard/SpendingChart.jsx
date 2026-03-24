'use client';

import { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { motion } from 'framer-motion';
import useStore from '@/store/useStore';

function CustomTooltip({ active, payload, label }) {
    if (!active || !payload?.length) return null;
    return (
        <div className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg shadow-sm border border-neutral-200 dark:border-neutral-700 text-[12px]">
            <p className="text-neutral-400 mb-0.5">{label}</p>
            <p className="font-semibold text-neutral-900 dark:text-white">₹{payload[0].value.toLocaleString('en-IN')}</p>
        </div>
    );
}

export default function SpendingChart() {
    const expenses = useStore((s) => s.expenses);

    // Compute monthly aggregates from real expense data
    const monthlyData = useMemo(() => {
        const months = {};
        const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        expenses.forEach((e) => {
            const d = new Date(e.date);
            const key = `${d.getFullYear()}-${String(d.getMonth()).padStart(2, '0')}`;
            const label = monthNames[d.getMonth()];
            if (!months[key]) months[key] = { month: label, amount: 0, sortKey: key };
            months[key].amount += e.amount;
        });
        return Object.values(months).sort((a, b) => a.sortKey.localeCompare(b.sortKey)).slice(-7);
    }, [expenses]);

    if (monthlyData.length === 0) return null;

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.1 }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5"
        >
            <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-4">
                Monthly Spending
            </h3>
            <div className="h-[240px]">
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={monthlyData} margin={{ top: 5, right: 5, bottom: 5, left: -15 }}>
                        <defs>
                            <linearGradient id="spendingGrad" x1="0" y1="0" x2="0" y2="1">
                                <stop offset="0%" stopColor="#6366f1" stopOpacity={0.08} />
                                <stop offset="100%" stopColor="#6366f1" stopOpacity={0} />
                            </linearGradient>
                        </defs>
                        <CartesianGrid stroke="#e5e5e5" strokeDasharray="none" vertical={false} />
                        <XAxis dataKey="month" tick={{ fontSize: 11, fill: '#a3a3a3' }} axisLine={false} tickLine={false} />
                        <YAxis tick={{ fontSize: 11, fill: '#a3a3a3' }} tickFormatter={(v) => `₹${(v / 1000)}k`} axisLine={false} tickLine={false} />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                            type="monotone"
                            dataKey="amount"
                            stroke="#6366f1"
                            strokeWidth={1.5}
                            fill="url(#spendingGrad)"
                            dot={false}
                            activeDot={{ r: 4, fill: '#6366f1', stroke: '#fff', strokeWidth: 2 }}
                        />
                    </AreaChart>
                </ResponsiveContainer>
            </div>
        </motion.div>
    );
}
