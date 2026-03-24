import { create } from 'zustand';

const useStore = create((set, get) => ({
    // ── Theme ──
    theme: 'dark',
    toggleTheme: () => set((s) => ({ theme: s.theme === 'dark' ? 'light' : 'dark' })),

    // ── Sidebar ──
    sidebarOpen: true,
    toggleSidebar: () => set((s) => ({ sidebarOpen: !s.sidebarOpen })),
    setSidebarOpen: (open) => set({ sidebarOpen: open }),

    // ── Loading & Error ──
    loading: { expenses: false, budget: false, upload: false },
    error: { expenses: null, budget: null, upload: null },
    setLoading: (key, val) => set((s) => ({ loading: { ...s.loading, [key]: val } })),
    setError: (key, val) => set((s) => ({ error: { ...s.error, [key]: val } })),

    // ── Toast Notifications ──
    toasts: [],
    addToast: (msg, type = 'success') => {
        const id = Date.now();
        set((s) => ({ toasts: [...s.toasts, { id, msg, type }] }));
        setTimeout(() => {
            set((s) => ({ toasts: s.toasts.filter((t) => t.id !== id) }));
        }, 3000);
    },

    // ═══════════════════════════════════════
    // ── EXPENSES (API-backed) ──
    // ═══════════════════════════════════════
    expenses: [],
    expensesLoaded: false,

    fetchExpenses: async () => {
        const { setLoading, setError } = get();
        setLoading('expenses', true);
        setError('expenses', null);
        try {
            const res = await fetch('/api/expenses');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set({ expenses: json.data, expensesLoaded: true });
        } catch (err) {
            setError('expenses', err.message);
        } finally {
            setLoading('expenses', false);
        }
    },

    addExpense: async (expense) => {
        const { setLoading, setError, addToast } = get();
        setLoading('expenses', true);
        setError('expenses', null);
        try {
            const res = await fetch('/api/expenses', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(expense),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set((s) => ({ expenses: [json.data, ...s.expenses] }));
            addToast(`Added: ${json.data.description}`);
            return { success: true };
        } catch (err) {
            setError('expenses', err.message);
            addToast(err.message, 'error');
            return { success: false, error: err.message };
        } finally {
            setLoading('expenses', false);
        }
    },

    deleteExpense: async (id) => {
        const { setError, addToast } = get();
        // Optimistic delete
        const prev = get().expenses;
        set((s) => ({ expenses: s.expenses.filter((e) => e.id !== id) }));
        try {
            const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            addToast('Expense deleted');
        } catch (err) {
            set({ expenses: prev }); // Rollback
            setError('expenses', err.message);
            addToast(err.message, 'error');
        }
    },

    // ═══════════════════════════════════════
    // ── BUDGET (API-backed) ──
    // ═══════════════════════════════════════
    budgetConfig: { monthlyIncome: 85000, needs: 0.50, wants: 0.30, savings: 0.20 },
    budgetCategories: [],
    savingsGoals: [],
    subscriptions: [],
    portfolio: { totalValue: 0, returnsPercent: 0, holdings: [] },
    riskScenarios: [],
    budgetLoaded: false,

    fetchBudget: async () => {
        const { setLoading, setError } = get();
        setLoading('budget', true);
        setError('budget', null);
        try {
            const res = await fetch('/api/budget');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set({
                budgetConfig: json.data.config,
                budgetCategories: json.data.categories,
                savingsGoals: json.data.savingsGoals,
                subscriptions: json.data.subscriptions || [],
                portfolio: json.data.portfolio || { totalValue: 0, returnsPercent: 0, holdings: [] },
                riskScenarios: json.data.riskScenarios || [],
                budgetLoaded: true,
            });
        } catch (err) {
            setError('budget', err.message);
        } finally {
            setLoading('budget', false);
        }
    },

    setBudgetIncome: async (income) => {
        const { setLoading, setError, addToast, budgetConfig, budgetCategories, savingsGoals, subscriptions, portfolio, riskScenarios } = get();
        setLoading('budget', true);
        try {
            const res = await fetch('/api/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config: { ...budgetConfig, monthlyIncome: income },
                    categories: budgetCategories,
                    savingsGoals,
                    subscriptions,
                    portfolio,
                    riskScenarios
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set({
                budgetConfig: json.data.config,
                budgetCategories: json.data.categories,
                savingsGoals: json.data.savingsGoals,
                subscriptions: json.data.subscriptions || [],
                portfolio: json.data.portfolio || { totalValue: 0, returnsPercent: 0, holdings: [] },
                riskScenarios: json.data.riskScenarios || [],
            });
            addToast(`Income updated to ₹${income.toLocaleString('en-IN')}`);
        } catch (err) {
            setError('budget', err.message);
            addToast(err.message, 'error');
        } finally {
            setLoading('budget', false);
        }
    },

    addGoal: async (goal) => {
        const { setLoading, setError, addToast, budgetConfig, budgetCategories, savingsGoals, subscriptions, portfolio, riskScenarios } = get();
        const newGoals = [...savingsGoals, goal];
        setLoading('budget', true);
        try {
            const res = await fetch('/api/budget', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    config: budgetConfig,
                    categories: budgetCategories,
                    savingsGoals: newGoals,
                    subscriptions,
                    portfolio,
                    riskScenarios
                }),
            });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set({ savingsGoals: json.data.savingsGoals });
            addToast(`Goal Added: ${goal.label}`);
        } catch (err) {
            setError('budget', err.message);
            addToast(err.message, 'error');
        } finally {
            setLoading('budget', false);
        }
    },

    // ═══════════════════════════════════════
    // ── FILE UPLOAD (API-backed) ──
    // ═══════════════════════════════════════
    uploads: [],
    uploadsLoaded: false,

    fetchUploads: async () => {
        const { setLoading, setError } = get();
        setLoading('upload', true);
        try {
            const res = await fetch('/api/upload');
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set({ uploads: json.data, uploadsLoaded: true });
        } catch (err) {
            setError('upload', err.message);
        } finally {
            setLoading('upload', false);
        }
    },

    uploadFile: async (file) => {
        const { setLoading, setError, addToast } = get();
        setLoading('upload', true);
        setError('upload', null);
        try {
            const fd = new FormData();
            fd.append('file', file);
            const res = await fetch('/api/upload', { method: 'POST', body: fd });
            const json = await res.json();
            if (!json.success) throw new Error(json.error);
            set((s) => ({ uploads: [json.data, ...s.uploads] }));
            addToast(`Uploaded: ${json.data.originalName}`);
            return { success: true, data: json.data };
        } catch (err) {
            setError('upload', err.message);
            addToast(err.message, 'error');
            return { success: false, error: err.message };
        } finally {
            setLoading('upload', false);
        }
    },

    // ── Chat ──
    chatOpen: false,
    toggleChat: () => set((s) => ({ chatOpen: !s.chatOpen })),
    chatMessages: [
        { role: 'assistant', text: "Hi! I'm FinSight AI 🤖 Ask me anything about your finances — like \"Can I afford a ₹20,000 phone?\" or \"How much did I spend on food?\"" },
    ],
    addChatMessage: (msg) =>
        set((s) => ({ chatMessages: [...s.chatMessages, msg] })),

    // ── Computed ──
    getTotalSpent: () => {
        const { expenses } = get();
        return expenses.reduce((sum, e) => sum + e.amount, 0);
    },
    getBudgetRemaining: () => {
        const { budgetConfig } = get();
        const totalSpent = get().getTotalSpent();
        return budgetConfig.monthlyIncome - totalSpent;
    },
    getSavingsRate: () => {
        const { budgetConfig } = get();
        const remaining = get().getBudgetRemaining();
        return Math.max(0, Math.round((remaining / budgetConfig.monthlyIncome) * 100));
    },
}));

export default useStore;
