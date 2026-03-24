// ── Advanced Mock Data for FinSight AI ──

export const SUBSCRIPTIONS = [
    { id: 1, name: 'Netflix', amount: 649, category: 'entertainment', frequency: 'monthly', lastCharged: '2026-03-20', active: true, usage: 'low' },
    { id: 2, name: 'Spotify Premium', amount: 119, category: 'entertainment', frequency: 'monthly', lastCharged: '2026-03-15', active: true, usage: 'high' },
    { id: 3, name: 'Amazon Prime', amount: 1499, category: 'shopping', frequency: 'yearly', lastCharged: '2026-01-10', active: true, usage: 'medium' },
    { id: 4, name: 'Gym Membership', amount: 1500, category: 'health', frequency: 'monthly', lastCharged: '2026-03-19', active: true, usage: 'low' },
    { id: 5, name: 'iCloud Storage', amount: 75, category: 'other', frequency: 'monthly', lastCharged: '2026-03-12', active: true, usage: 'medium' },
    { id: 6, name: 'YouTube Premium', amount: 149, category: 'entertainment', frequency: 'monthly', lastCharged: '2026-03-05', active: true, usage: 'high' },
    { id: 7, name: 'Zomato Gold', amount: 500, category: 'food', frequency: 'monthly', lastCharged: '2026-03-16', active: true, usage: 'low' },
    { id: 8, name: 'LinkedIn Premium', amount: 1250, category: 'education', frequency: 'monthly', lastCharged: '2026-03-08', active: false, usage: 'low' },
];

export const SPENDING_PATTERNS = [
    { pattern: 'Weekend Splurge', description: 'You spend 45% more on weekends vs weekdays', severity: 'warning', icon: '📅', savings: 3200 },
    { pattern: 'Late-Night Orders', description: '₹4,200/month on food delivery after 10 PM', severity: 'danger', icon: '🌙', savings: 2800 },
    { pattern: 'Impulse Shopping', description: '3 purchases above ₹2,000 this month were unplanned', severity: 'warning', icon: '🛒', savings: 5200 },
    { pattern: 'Consistent Bills', description: 'Your utility bills are stable — good budgeting!', severity: 'success', icon: '✅', savings: 0 },
    { pattern: 'Transport Optimization', description: 'Consider a metro pass — could save ₹1,200/month', severity: 'info', icon: '🚇', savings: 1200 },
];

export const FINANCIAL_HEALTH = {
    overallScore: 72,
    breakdown: [
        { label: 'Savings Rate', score: 78, weight: 0.25, tip: 'Aim for 20%+ savings rate' },
        { label: 'Debt-to-Income', score: 85, weight: 0.20, tip: 'Your DTI ratio is healthy' },
        { label: 'Emergency Fund', score: 62, weight: 0.20, tip: 'Build up to 6 months of expenses' },
        { label: 'Investment Diversity', score: 55, weight: 0.15, tip: 'Consider adding mutual funds' },
        { label: 'Budget Adherence', score: 80, weight: 0.20, tip: 'Great job sticking to budgets!' },
    ],
    trend: [
        { month: 'Oct', score: 65 },
        { month: 'Nov', score: 68 },
        { month: 'Dec', score: 64 },
        { month: 'Jan', score: 70 },
        { month: 'Feb', score: 71 },
        { month: 'Mar', score: 72 },
    ],
};

export const SPENDING_BY_DAY = [
    { day: 'Mon', amount: 1200 },
    { day: 'Tue', amount: 980 },
    { day: 'Wed', amount: 1100 },
    { day: 'Thu', amount: 1350 },
    { day: 'Fri', amount: 2100 },
    { day: 'Sat', amount: 3400 },
    { day: 'Sun', amount: 2800 },
];

export const SPENDING_BY_HOUR = [
    { hour: '6AM', amount: 120 },
    { hour: '8AM', amount: 450 },
    { hour: '10AM', amount: 280 },
    { hour: '12PM', amount: 1200 },
    { hour: '2PM', amount: 650 },
    { hour: '4PM', amount: 380 },
    { hour: '6PM', amount: 900 },
    { hour: '8PM', amount: 1800 },
    { hour: '10PM', amount: 2100 },
    { hour: '12AM', amount: 800 },
];

export const FINANCIAL_GOALS = [
    { id: 1, name: 'Buy a Car', targetAmount: 800000, currentSaved: 220000, targetDate: '2028-06-01', monthlyContribution: 18000, icon: '🚗', category: 'asset', priority: 'high' },
    { id: 2, name: 'House Down Payment', targetAmount: 2000000, currentSaved: 450000, targetDate: '2030-01-01', monthlyContribution: 30000, icon: '🏠', category: 'asset', priority: 'high' },
    { id: 3, name: 'Retirement at 50', targetAmount: 10000000, currentSaved: 1200000, targetDate: '2046-01-01', monthlyContribution: 15000, icon: '🏖️', category: 'retirement', priority: 'medium' },
    { id: 4, name: 'Europe Trip', targetAmount: 300000, currentSaved: 85000, targetDate: '2027-03-01', monthlyContribution: 18000, icon: '✈️', category: 'lifestyle', priority: 'low' },
    { id: 5, name: 'Emergency Fund', targetAmount: 500000, currentSaved: 185000, targetDate: '2027-06-01', monthlyContribution: 20000, icon: '🛡️', category: 'safety', priority: 'high' },
];

export const RISK_SCENARIOS = [
    {
        id: 'job_loss',
        title: 'Job Loss',
        icon: '💼',
        description: 'What if you lose your income?',
        emergencyFund: 185000,
        monthlyExpenses: 45000,
        survivalMonths: 4.1,
        recommendation: 'Build emergency fund to cover 6 months (₹2,70,000 needed — ₹85,000 more to go)',
        severity: 'warning',
    },
    {
        id: 'medical',
        title: 'Medical Emergency',
        icon: '🏥',
        description: 'Unexpected ₹3L medical expense',
        coverageGap: 115000,
        healthInsurance: 500000,
        recommendation: 'Your health insurance covers ₹5L. A ₹3L expense is covered, but consider critical illness rider.',
        severity: 'success',
    },
    {
        id: 'inflation',
        title: 'High Inflation (8%)',
        icon: '📈',
        description: 'Impact on your purchasing power',
        currentMonthly: 45000,
        futureMonthly: 48600,
        impact: 3600,
        recommendation: 'Shift 30% of savings to inflation-beating instruments (equity, gold ETFs)',
        severity: 'info',
    },
    {
        id: 'rate_hike',
        title: 'Interest Rate Hike',
        icon: '🏦',
        description: 'Home loan EMI impact if rates rise 1%',
        currentEMI: 8500,
        newEMI: 9200,
        monthlyImpact: 700,
        recommendation: 'Consider partial prepayment or switching to fixed rate before hike',
        severity: 'warning',
    },
];

// SIP Calculator helper
export function calculateSIP(monthlyAmount, annualReturn = 12, years) {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(futureValue);
}

export function calculateRequiredSIP(targetAmount, annualReturn = 12, years) {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const sip = targetAmount / (((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate));
    return Math.round(sip);
}
