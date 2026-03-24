// ── Mock Data for FinSight AI ──

export const CATEGORIES = [
  { id: 'food', label: 'Food & Dining', icon: '🍕', color: '#f59e0b' },
  { id: 'transport', label: 'Transport', icon: '🚗', color: '#3b82f6' },
  { id: 'shopping', label: 'Shopping', icon: '🛍️', color: '#8b5cf6' },
  { id: 'bills', label: 'Bills & EMI', icon: '📄', color: '#ef4444' },
  { id: 'entertainment', label: 'Entertainment', icon: '🎬', color: '#ec4899' },
  { id: 'health', label: 'Health', icon: '💊', color: '#10b981' },
  { id: 'travel', label: 'Travel', icon: '✈️', color: '#06b6d4' },
  { id: 'education', label: 'Education', icon: '📚', color: '#6366f1' },
  { id: 'groceries', label: 'Groceries', icon: '🥦', color: '#22c55e' },
  { id: 'other', label: 'Other', icon: '📦', color: '#64748b' },
];

export const MONTHLY_SPENDING = [
  { month: 'Sep', amount: 42500 },
  { month: 'Oct', amount: 38200 },
  { month: 'Nov', amount: 45800 },
  { month: 'Dec', amount: 52300 },
  { month: 'Jan', amount: 41600 },
  { month: 'Feb', amount: 39400 },
  { month: 'Mar', amount: 36800 },
];

export const CATEGORY_SPENDING = [
  { name: 'Food & Dining', value: 8500, color: '#f59e0b' },
  { name: 'Transport', value: 4200, color: '#3b82f6' },
  { name: 'Shopping', value: 6800, color: '#8b5cf6' },
  { name: 'Bills & EMI', value: 12000, color: '#ef4444' },
  { name: 'Entertainment', value: 3200, color: '#ec4899' },
  { name: 'Health', value: 1500, color: '#10b981' },
  { name: 'Groceries', value: 4600, color: '#22c55e' },
];

export const EXPENSES = [
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

export const BUDGET_CONFIG = {
  monthlyIncome: 85000,
  needs: 0.50,       // 50%
  wants: 0.30,       // 30%
  savings: 0.20,     // 20%
};

export const BUDGET_CATEGORIES = [
  { id: 'rent', label: 'Rent & Housing', allocated: 15000, spent: 15000, type: 'needs', color: '#ef4444' },
  { id: 'groceries', label: 'Groceries', allocated: 6000, spent: 4600, type: 'needs', color: '#22c55e' },
  { id: 'bills', label: 'Bills & EMI', allocated: 12000, spent: 10350, type: 'needs', color: '#f59e0b' },
  { id: 'transport', label: 'Transport', allocated: 5000, spent: 2880, type: 'needs', color: '#3b82f6' },
  { id: 'health', label: 'Health', allocated: 4500, spent: 2180, type: 'needs', color: '#10b981' },
  { id: 'food', label: 'Food & Dining', allocated: 8000, spent: 8770, type: 'wants', color: '#f59e0b' },
  { id: 'shopping', label: 'Shopping', allocated: 8000, spent: 5699, type: 'wants', color: '#8b5cf6' },
  { id: 'entertainment', label: 'Entertainment', allocated: 5000, spent: 3849, type: 'wants', color: '#ec4899' },
  { id: 'education', label: 'Education', allocated: 2500, spent: 499, type: 'wants', color: '#6366f1' },
];

export const SAVINGS_GOALS = [
  { id: 1, label: 'Emergency Fund', target: 300000, saved: 185000, color: '#10b981' },
  { id: 2, label: 'Vacation Fund', target: 100000, saved: 42000, color: '#3b82f6' },
  { id: 3, label: 'New Laptop', target: 80000, saved: 65000, color: '#8b5cf6' },
];

// ── Stock Data ──
function generateStockHistory(basePrice, volatility, days = 90) {
  const data = [];
  let price = basePrice;
  const now = new Date();
  for (let i = days; i >= 0; i--) {
    const date = new Date(now);
    date.setDate(date.getDate() - i);
    price += (Math.random() - 0.48) * volatility;
    price = Math.max(price * 0.85, Math.min(price, basePrice * 1.4));
    data.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }
  return data;
}

function generatePrediction(history, days = 30) {
  const lastPrice = history[history.length - 1].price;
  const trend = (history[history.length - 1].price - history[history.length - 10].price) / 10;
  const prediction = [];
  let price = lastPrice;
  const lastDate = new Date(history[history.length - 1].date);
  for (let i = 1; i <= days; i++) {
    const date = new Date(lastDate);
    date.setDate(date.getDate() + i);
    price += trend + (Math.random() - 0.5) * Math.abs(trend) * 2;
    prediction.push({
      date: date.toISOString().split('T')[0],
      price: Math.round(price * 100) / 100,
    });
  }
  return prediction;
}

const relHistory = generateStockHistory(2950, 40);
const tcsHistory = generateStockHistory(3800, 55);
const infoHistory = generateStockHistory(1850, 30);
const hdfcHistory = generateStockHistory(1680, 25);

export const STOCKS = [
  {
    symbol: 'RELIANCE',
    name: 'Reliance Industries',
    currentPrice: relHistory[relHistory.length - 1].price,
    change: +(relHistory[relHistory.length - 1].price - relHistory[relHistory.length - 2].price).toFixed(2),
    history: relHistory,
    prediction: generatePrediction(relHistory),
    riskScore: 35,
    sector: 'Energy',
  },
  {
    symbol: 'TCS',
    name: 'Tata Consultancy Services',
    currentPrice: tcsHistory[tcsHistory.length - 1].price,
    change: +(tcsHistory[tcsHistory.length - 1].price - tcsHistory[tcsHistory.length - 2].price).toFixed(2),
    history: tcsHistory,
    prediction: generatePrediction(tcsHistory),
    riskScore: 22,
    sector: 'IT',
  },
  {
    symbol: 'INFY',
    name: 'Infosys',
    currentPrice: infoHistory[infoHistory.length - 1].price,
    change: +(infoHistory[infoHistory.length - 1].price - infoHistory[infoHistory.length - 2].price).toFixed(2),
    history: infoHistory,
    prediction: generatePrediction(infoHistory),
    riskScore: 28,
    sector: 'IT',
  },
  {
    symbol: 'HDFCBANK',
    name: 'HDFC Bank',
    currentPrice: hdfcHistory[hdfcHistory.length - 1].price,
    change: +(hdfcHistory[hdfcHistory.length - 1].price - hdfcHistory[hdfcHistory.length - 2].price).toFixed(2),
    history: hdfcHistory,
    prediction: generatePrediction(hdfcHistory),
    riskScore: 18,
    sector: 'Banking',
  },
];

export const PORTFOLIO = {
  totalValue: 425000,
  invested: 380000,
  returns: 45000,
  returnsPercent: 11.84,
  holdings: [
    { symbol: 'RELIANCE', qty: 15, avgPrice: 2820, currentPrice: relHistory[relHistory.length - 1].price },
    { symbol: 'TCS', qty: 10, avgPrice: 3650, currentPrice: tcsHistory[tcsHistory.length - 1].price },
    { symbol: 'INFY', qty: 25, avgPrice: 1780, currentPrice: infoHistory[infoHistory.length - 1].price },
    { symbol: 'HDFCBANK', qty: 20, avgPrice: 1620, currentPrice: hdfcHistory[hdfcHistory.length - 1].price },
  ],
};
