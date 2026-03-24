'use client';

import { motion } from 'framer-motion';

export default function SummaryCard({ icon, label, value, trend, trendUp, color, delay = 0 }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay }}
            className="rounded-xl border border-neutral-200 dark:border-neutral-800 bg-white dark:bg-[#141414] p-5"
        >
            <div className="flex items-start justify-between mb-3">
                <div className={`w-9 h-9 rounded-lg flex items-center justify-center text-white ${color}`}>
                    {icon}
                </div>
                {trend !== undefined && (
                    <span className={`text-[11px] font-medium px-1.5 py-0.5 rounded-md ${trendUp
                            ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400'
                            : 'bg-red-50 text-red-600 dark:bg-red-900/30 dark:text-red-400'
                        }`}>
                        {trendUp ? '↑' : '↓'} {trend}
                    </span>
                )}
            </div>
            <p className="text-[13px] text-neutral-500 dark:text-neutral-400 mb-1">{label}</p>
            <p className="text-xl font-semibold text-neutral-900 dark:text-white">{value}</p>
        </motion.div>
    );
}
