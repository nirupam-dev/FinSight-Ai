'use client';

import { useEffect } from 'react';
import { motion } from 'framer-motion';
import useStore from '@/store/useStore';
import Sidebar from './Sidebar';
import Navbar from './Navbar';
import ChatWidget from '@/components/chat/ChatWidget';
import ToastContainer from '@/components/ui/ToastContainer';

export default function AppLayout({ children }) {
    const theme = useStore((s) => s.theme);
    const sidebarOpen = useStore((s) => s.sidebarOpen);
    const expensesLoaded = useStore((s) => s.expensesLoaded);
    const budgetLoaded = useStore((s) => s.budgetLoaded);
    const fetchExpenses = useStore((s) => s.fetchExpenses);
    const fetchBudget = useStore((s) => s.fetchBudget);

    useEffect(() => {
        document.documentElement.classList.toggle('dark', theme === 'dark');
    }, [theme]);

    // Fetch data once on mount
    useEffect(() => {
        if (!expensesLoaded) fetchExpenses();
        if (!budgetLoaded) fetchBudget();
    }, []);

    return (
        <div className="min-h-screen bg-white dark:bg-[#0a0a0a]">
            <Sidebar />
            <Navbar />
            <motion.main
                initial={false}
                animate={{ marginLeft: sidebarOpen ? 240 : 68 }}
                transition={{ duration: 0.2, ease: 'easeInOut' }}
                className="min-h-[calc(100vh-3.5rem)] p-6"
            >
                {children}
            </motion.main>
            <ChatWidget />
            <ToastContainer />
        </div>
    );
}
