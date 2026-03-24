'use client';

import { AnimatePresence, motion } from 'framer-motion';
import useStore from '@/store/useStore';
import { CheckCircle, AlertCircle, X } from 'lucide-react';

export default function ToastContainer() {
    const toasts = useStore((s) => s.toasts);

    return (
        <div className="fixed top-4 right-4 z-[100] flex flex-col gap-2 max-w-sm">
            <AnimatePresence>
                {toasts.map((t) => (
                    <motion.div
                        key={t.id}
                        initial={{ opacity: 0, x: 40, scale: 0.95 }}
                        animate={{ opacity: 1, x: 0, scale: 1 }}
                        exit={{ opacity: 0, x: 40, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                        className={`flex items-center gap-2.5 px-4 py-3 rounded-lg shadow-md border text-[13px]
              ${t.type === 'error'
                                ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800 text-red-700 dark:text-red-400'
                                : 'bg-emerald-50 dark:bg-emerald-900/20 border-emerald-200 dark:border-emerald-800 text-emerald-700 dark:text-emerald-400'
                            }`}
                    >
                        {t.type === 'error' ? <AlertCircle className="w-4 h-4 flex-shrink-0" /> : <CheckCircle className="w-4 h-4 flex-shrink-0" />}
                        <span className="flex-1">{t.msg}</span>
                    </motion.div>
                ))}
            </AnimatePresence>
        </div>
    );
}
