'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';
import {
    LayoutDashboard,
    Receipt,
    PiggyBank,
    TrendingUp,
    Lightbulb,
    Target,
    ChevronLeft,
    ChevronRight,
    Sparkles,
} from 'lucide-react';

const navItems = [
    { href: '/', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/expenses', label: 'Expenses', icon: Receipt },
    { href: '/budget', label: 'Budget', icon: PiggyBank },
    { href: '/stocks', label: 'Stocks', icon: TrendingUp },
    { href: '/insights', label: 'Insights', icon: Lightbulb },
    { href: '/goals', label: 'Goals', icon: Target },
];

export default function Sidebar() {
    const pathname = usePathname();
    const sidebarOpen = useStore((s) => s.sidebarOpen);
    const toggleSidebar = useStore((s) => s.toggleSidebar);

    return (
        <motion.aside
            initial={false}
            animate={{ width: sidebarOpen ? 240 : 68 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="fixed left-0 top-0 h-screen z-40 flex flex-col
        bg-white dark:bg-[#0f0f0f]
        border-r border-neutral-200 dark:border-neutral-800"
        >
            {/* Logo */}
            <div className="flex items-center gap-2.5 px-4 h-14 border-b border-neutral-200 dark:border-neutral-800">
                <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center flex-shrink-0">
                    <Sparkles className="w-4 h-4 text-white" />
                </div>
                <AnimatePresence>
                    {sidebarOpen && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.15 }}
                            className="font-semibold text-[15px] text-neutral-900 dark:text-neutral-100 whitespace-nowrap"
                        >
                            FinSight AI
                        </motion.span>
                    )}
                </AnimatePresence>
            </div>

            {/* Nav Links */}
            <nav className="flex-1 py-3 px-2 space-y-0.5">
                {navItems.map((item) => {
                    const isActive = pathname === item.href;
                    const Icon = item.icon;
                    return (
                        <Link
                            key={item.href}
                            href={item.href}
                            className={`flex items-center gap-2.5 px-2.5 py-2 rounded-lg transition-colors duration-150 text-[13px]
                ${isActive
                                    ? 'bg-neutral-100 dark:bg-neutral-800 text-neutral-900 dark:text-white font-medium'
                                    : 'text-neutral-500 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-50 dark:hover:bg-neutral-800/50'
                                }`}
                        >
                            <Icon className={`w-[18px] h-[18px] flex-shrink-0 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : ''}`} />
                            <AnimatePresence>
                                {sidebarOpen && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        transition={{ duration: 0.1 }}
                                        className="whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </AnimatePresence>
                        </Link>
                    );
                })}
            </nav>

            {/* Collapse Toggle */}
            <div className="px-2 pb-3">
                <button
                    onClick={toggleSidebar}
                    className="w-full flex items-center justify-center gap-2 px-2.5 py-2 rounded-lg
            text-neutral-400 hover:text-neutral-600 dark:hover:text-neutral-300 hover:bg-neutral-50 dark:hover:bg-neutral-800/50
            transition-colors duration-150 text-[13px]"
                >
                    {sidebarOpen ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
                    <AnimatePresence>
                        {sidebarOpen && (
                            <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                                Collapse
                            </motion.span>
                        )}
                    </AnimatePresence>
                </button>
            </div>
        </motion.aside>
    );
}
