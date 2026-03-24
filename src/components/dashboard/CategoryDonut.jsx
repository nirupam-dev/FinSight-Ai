'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { motion } from 'framer-motion';
import useStore from '@/store/useStore';

const CLEAN_COLORS = ['#6366f1', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899', '#06b6d4'];

const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
        return (
            <div className="bg-white dark:bg-neutral-800 px-3 py-2 rounded-lg shadow-md border border-neutral-200 dark:border-neutral-700 text-[12px]">
                <p className="font-medium text-neutral-900 dark:text-white">{payload[0].name}</p>
                <p className="text-indigo-600 dark:text-indigo-400 font-bold">₹{payload[0].value.toLocaleString('en-IN')}</p>
            </div>
        );
    }
    return null;
};

export default function CategoryDonut() {
    const expenses = useStore((s) => s.expenses) || [];
    const budgetCategories = useStore((s) => s.budgetCategories) || [];

    // Compute category breakdown from live data
    const categoryData = useMemo(() => {
        if (!expenses.length) return [];
        const map = {};
        expenses.forEach((e) => {
            const cat = budgetCategories.find((c) => c.id === e.category);
            const name = cat?.label || e.category;
            map[name] = (map[name] || 0) + (e.amount || 0);
        });
        return Object.entries(map)
            .map(([name, value]) => ({ name, value }))
            .sort((a, b) => b.value - a.value);
    }, [expenses, budgetCategories]);

    const total = categoryData.reduce((s, c) => s + c.value, 0);

    if (categoryData.length === 0) return (
        <div className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5 h-full flex items-center justify-center">
            <p className="text-neutral-400 text-[13px]">No spending data yet</p>
        </div>
    );

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.15 }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5 h-full"
        >
            <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white mb-4">
                By Category
            </h3>
            <div className="flex flex-col sm:flex-row items-center gap-5">
                <div className="w-[160px] h-[160px] relative shrink-0">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={categoryData}
                                cx="50%"
                                cy="50%"
                                innerRadius={52}
                                outerRadius={72}
                                paddingAngle={2}
                                dataKey="value"
                                stroke="none"
                            >
                                {categoryData.map((entry, i) => (
                                    <Cell key={i} fill={CLEAN_COLORS[i % CLEAN_COLORS.length]} />
                                ))}
                            </Pie>
                            <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                    </ResponsiveContainer>
                    <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                        <p className="text-base font-semibold text-neutral-900 dark:text-white">₹{(total / 1000).toFixed(1)}k</p>
                        <p className="text-[11px] text-neutral-400">Total</p>
                    </div>
                </div>
                <div className="flex-1 space-y-2 w-full">
                    {categoryData.slice(0, 5).map((cat, i) => (
                        <div key={i} className="flex items-center gap-2 text-[12px]">
                            <div className="w-2 h-2 rounded-full flex-shrink-0" style={{ background: CLEAN_COLORS[i % CLEAN_COLORS.length] }} />
                            <span className="text-neutral-500 dark:text-neutral-400 flex-1 truncate">{cat.name}</span>
                            <span className="font-medium text-neutral-900 dark:text-white">₹{cat.value.toLocaleString('en-IN')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </motion.div>
    );
}
