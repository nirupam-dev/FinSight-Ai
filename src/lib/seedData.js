// ── Seed data used as defaults when no persisted data exists ──

export const SEED_EXPENSES = [
    { id: 1, description: 'Swiggy Order', amount: 450, category: 'food', date: '2026-03-24', type: 'debit' },
    { id: 2, description: 'Uber Ride', amount: 280, category: 'transport', date: '2026-03-23', type: 'debit' },
    { id: 3, description: 'Amazon Purchase', amount: 2499, category: 'shopping', date: '2026-03-22', type: 'debit' },
    { id: 4, description: 'Electricity Bill', amount: 1850, category: 'bills', date: '2026-03-21', type: 'debit' },
    { id: 5, description: 'Netflix Subscription', amount: 649, category: 'entertainment', date: '2026-03-20', type: 'debit' },
    { id: 6, description: 'Gym Membership', amount: 1500, category: 'health', date: '2026-03-19', type: 'debit' },
    { id: 7, description: 'Zepto Groceries', amount: 1230, category: 'groceries', date: '2026-03-18', type: 'debit' },
    { id: 8, description: 'Home Loan EMI', amount: 8500, category: 'bills', date: '2026-03-17', type: 'debit' },
    { id: 9, description: 'Zomato Gold', amount: 320, category: 'food', date: '2026-03-16', type: 'debit' },
    { id: 10, description: 'Metro Card Recharge', amount: 500, category: 'transport', date: '2026-03-15', type: 'debit' },
    { id: 11, description: 'Udemy Course', amount: 499, category: 'education', date: '2026-03-14', type: 'debit' },
    { id: 12, description: 'Myntra Shopping', amount: 3200, category: 'shopping', date: '2026-03-13', type: 'debit' },
    { id: 13, description: 'Pharmacy', amount: 680, category: 'health', date: '2026-03-12', type: 'debit' },
    { id: 14, description: 'Petrol', amount: 2100, category: 'transport', date: '2026-03-11', type: 'debit' },
    { id: 15, description: 'BigBasket Order', amount: 1850, category: 'groceries', date: '2026-03-10', type: 'debit' },
];

export const SEED_BUDGET = {
    config: { monthlyIncome: 85000, needs: 0.50, wants: 0.30, savings: 0.20 },
    categories: [
        { id: 'rent', label: 'Rent & Housing', allocated: 15000, spent: 15000, type: 'needs', color: '#ef4444' },
        { id: 'groceries', label: 'Groceries', allocated: 6000, spent: 4600, type: 'needs', color: '#22c55e' },
        { id: 'bills', label: 'Bills & EMI', allocated: 12000, spent: 10350, type: 'needs', color: '#f59e0b' },
        { id: 'transport', label: 'Transport', allocated: 5000, spent: 2880, type: 'needs', color: '#3b82f6' },
        { id: 'health', label: 'Health', allocated: 4500, spent: 2180, type: 'needs', color: '#10b981' },
        { id: 'food', label: 'Food & Dining', allocated: 8000, spent: 8770, type: 'wants', color: '#f59e0b' },
        { id: 'shopping', label: 'Shopping', allocated: 8000, spent: 5699, type: 'wants', color: '#8b5cf6' },
        { id: 'entertainment', label: 'Entertainment', allocated: 5000, spent: 3849, type: 'wants', color: '#ec4899' },
        { id: 'education', label: 'Education', allocated: 2500, spent: 499, type: 'wants', color: '#6366f1' },
    ],
    savingsGoals: [
        { id: 1, label: 'Emergency Fund', target: 300000, saved: 185000, color: '#10b981' },
        { id: 2, label: 'Vacation Fund', target: 100000, saved: 42000, color: '#3b82f6' },
        { id: 3, label: 'New Laptop', target: 80000, saved: 65000, color: '#8b5cf6' },
    ],
};

export const SEED_UPLOADS = [];
