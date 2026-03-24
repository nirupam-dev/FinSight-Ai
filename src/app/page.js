'use client';

import AppLayout from '@/components/layout/AppLayout';
import SummaryCard from '@/components/dashboard/SummaryCard';
import SpendingChart from '@/components/dashboard/SpendingChart';
import CategoryDonut from '@/components/dashboard/CategoryDonut';
import RecentTransactions from '@/components/dashboard/RecentTransactions';
import useStore from '@/store/useStore';
import { PORTFOLIO } from '@/data/mockData';
import { Wallet, Target, PiggyBank, TrendingUp, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const expenses = useStore((s) => s.expenses);
  const loading = useStore((s) => s.loading);
  const getTotalSpent = useStore((s) => s.getTotalSpent);
  const getBudgetRemaining = useStore((s) => s.getBudgetRemaining);
  const getSavingsRate = useStore((s) => s.getSavingsRate);

  const totalSpent = getTotalSpent();
  const budgetRemaining = getBudgetRemaining();
  const savingsRate = getSavingsRate();

  return (
    <AppLayout>
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h1 className="text-lg font-semibold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-[13px] text-neutral-400 mt-0.5">Financial overview for March 2026</p>
        </div>

        {loading.expenses && expenses.length === 0 ? (
          <div className="flex items-center justify-center py-20 text-neutral-400 text-[13px]">
            <Loader2 className="w-5 h-5 animate-spin mr-2" /> Loading dashboard...
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <SummaryCard
                icon={<Wallet className="w-4 h-4" />}
                label="Total Spending"
                value={`₹${totalSpent.toLocaleString('en-IN')}`}
                trend="12%"
                trendUp={false}
                color="bg-indigo-600"
                delay={0}
              />
              <SummaryCard
                icon={<Target className="w-4 h-4" />}
                label="Budget Remaining"
                value={`₹${budgetRemaining.toLocaleString('en-IN')}`}
                trend="8%"
                trendUp={true}
                color="bg-emerald-600"
                delay={0.05}
              />
              <SummaryCard
                icon={<PiggyBank className="w-4 h-4" />}
                label="Savings Rate"
                value={`${savingsRate}%`}
                trend="3%"
                trendUp={true}
                color="bg-amber-600"
                delay={0.1}
              />
              <SummaryCard
                icon={<TrendingUp className="w-4 h-4" />}
                label="Portfolio Value"
                value={`₹${PORTFOLIO.totalValue.toLocaleString('en-IN')}`}
                trend={`${PORTFOLIO.returnsPercent}%`}
                trendUp={true}
                color="bg-blue-600"
                delay={0.15}
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
              <div className="lg:col-span-2">
                <SpendingChart />
              </div>
              <CategoryDonut />
            </div>

            <RecentTransactions />
          </>
        )}
      </div>
    </AppLayout>
  );
}
