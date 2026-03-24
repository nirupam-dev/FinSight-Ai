'use client';

import { motion } from 'framer-motion';
import useStore from '@/store/useStore';
export default function RecentTransactions() {
    const expenses = useStore((s) => s.expenses);
    const budgetCategories = useStore((s) => s.budgetCategories);
    const recent = expenses.slice(0, 8);

    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5"
        >
            <div className="flex items-center justify-between mb-4">
                <h3 className="text-[14px] font-semibold text-neutral-900 dark:text-white">
                    Recent Transactions
                </h3>
                <span className="text-[12px] text-indigo-600 dark:text-indigo-400 font-medium cursor-pointer hover:underline">View All</span>
            </div>
            <div className="space-y-0">
                {recent.map((tx, i) => {
                    const cat = budgetCategories.find((c) => c.id === tx.category);
                    const icon = tx.icon || cat?.icon || '📦';
                    return (
                        <div
                            key={tx.id}
                            className="flex items-center gap-3 py-2.5 border-b border-neutral-100 dark:border-neutral-800 last:border-0"
                        >
                            <div className="w-8 h-8 rounded-lg bg-neutral-100 dark:bg-neutral-800 flex items-center justify-center text-sm flex-shrink-0">
                                {icon}
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-[13px] font-medium text-neutral-900 dark:text-white truncate">{tx.description}</p>
                                <p className="text-[11px] text-neutral-400">{cat?.label || 'Other'} · {tx.date}</p>
                            </div>
                            <span className="text-[13px] font-medium text-neutral-900 dark:text-white">
                                -₹{tx.amount.toLocaleString('en-IN')}
                            </span>
                        </div>
                    );
                })}
            </div>
        </motion.div>
    );
}
