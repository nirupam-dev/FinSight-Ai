'use client';

import { motion } from 'framer-motion';
import useStore from '@/store/useStore';
import { Bell, Search, Sun, Moon, User } from 'lucide-react';

export default function Navbar() {
    const theme = useStore((s) => s.theme);
    const toggleTheme = useStore((s) => s.toggleTheme);
    const sidebarOpen = useStore((s) => s.sidebarOpen);

    return (
        <motion.header
            initial={false}
            animate={{ marginLeft: sidebarOpen ? 240 : 68 }}
            transition={{ duration: 0.2, ease: 'easeInOut' }}
            className="sticky top-0 z-30 h-14 flex items-center justify-between px-6
        bg-white dark:bg-[#0a0a0a]
        border-b border-neutral-200 dark:border-neutral-800"
        >
            {/* Search */}
            <div className="relative flex-1 max-w-sm">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-400" />
                <input
                    type="text"
                    placeholder="Search..."
                    className="w-full pl-9 pr-4 py-1.5 rounded-lg text-[13px]
            bg-neutral-50 dark:bg-neutral-900
            border border-neutral-200 dark:border-neutral-800
            text-neutral-900 dark:text-neutral-100
            placeholder:text-neutral-400
            focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500/40
            outline-none transition-all duration-150"
                />
            </div>

            {/* Right Actions */}
            <div className="flex items-center gap-1 ml-4">
                <button
                    onClick={toggleTheme}
                    className="w-8 h-8 rounded-lg flex items-center justify-center
            hover:bg-neutral-100 dark:hover:bg-neutral-800
            text-neutral-500 dark:text-neutral-400
            transition-colors duration-150"
                    aria-label="Toggle theme"
                >
                    {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                </button>

                <button
                    className="w-8 h-8 rounded-lg flex items-center justify-center relative
            hover:bg-neutral-100 dark:hover:bg-neutral-800
            text-neutral-500 dark:text-neutral-400
            transition-colors duration-150"
                    aria-label="Notifications"
                >
                    <Bell className="w-4 h-4" />
                    <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full bg-red-500" />
                </button>

                <div className="ml-3 flex items-center gap-2.5 pl-3 border-l border-neutral-200 dark:border-neutral-800">
                    <div className="w-7 h-7 rounded-full bg-indigo-600 flex items-center justify-center">
                        <User className="w-3.5 h-3.5 text-white" />
                    </div>
                    <div className="hidden sm:block">
                        <p className="text-[13px] font-medium text-neutral-900 dark:text-neutral-100 leading-none">User</p>
                        <p className="text-[11px] text-neutral-400 mt-0.5">Premium</p>
                    </div>
                </div>
            </div>
        </motion.header>
    );
}
