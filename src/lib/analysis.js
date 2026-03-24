/**
 * ── Behavioral Analysis Engine ──
 * Detects patterns from real expense data
 */

// No longer using CATEGORIES mock import

export function getBehavioralInsights(expenses) {
    if (!expenses || expenses.length === 0) return [];

    const insights = [];
    const now = new Date();

    // 1. Weekend vs Weekday analysis
    let weekendSpend = 0;
    let weekdaySpend = 0;
    let weekendCount = 0;
    let weekdayCount = 0;

    expenses.forEach(e => {
        const d = new Date(e.date);
        const day = d.getDay();
        if (day === 0 || day === 6) { // 0=Sun, 6=Sat
            weekendSpend += e.amount;
            weekendCount++;
        } else {
            weekdaySpend += e.amount;
            weekdayCount++;
        }
    });

    const avgWeekend = weekendCount ? weekendSpend / weekendCount : 0;
    const avgWeekday = weekdayCount ? weekdaySpend / weekdayCount : 0;

    if (avgWeekend > avgWeekday * 1.3) {
        const pct = Math.round(((avgWeekend - avgWeekday) / avgWeekday) * 100);
        insights.push({
            pattern: 'Weekend Splurge',
            description: `You spend ${pct}% more on weekends vs weekdays on average.`,
            severity: 'warning',
            icon: '📅',
            savings: Math.round(weekendSpend * 0.15)
        });
    }

    // 2. Late-Night spending (roughly inferred from mock categories/descriptions since we only have dates)
    // For now, let's look for frequent "Food & Dining" or "Entertainment"
    const foodSpend = expenses.filter(e => e.category === 'food').reduce((sum, e) => sum + e.amount, 0);
    if (foodSpend > 10000) {
        insights.push({
            pattern: 'High Dining Cost',
            description: `₹${foodSpend.toLocaleString('en-IN')} spent on food this month. Reducing 20% could save ₹${Math.round(foodSpend * 0.2).toLocaleString('en-IN')}.`,
            severity: 'danger',
            icon: '🍕',
            savings: Math.round(foodSpend * 0.2)
        });
    }

    // 3. Repeated Small Expenses (Micro-leaks)
    const descMap = {};
    expenses.forEach(e => {
        descMap[e.description] = (descMap[e.description] || 0) + 1;
    });
    const repeats = Object.entries(descMap).filter(([desc, count]) => count >= 3);
    if (repeats.length > 0) {
        insights.push({
            pattern: 'Subscription/Recurring',
            description: `Detected ${repeats.length} repeated transactions. Check if these are necessary subscriptions.`,
            severity: 'info',
            icon: '🔄',
            savings: 0
        });
    }

    // 4. Large Unplanned Purchases
    const largeExpenses = expenses.filter(e => e.amount > 5000);
    if (largeExpenses.length >= 2) {
        insights.push({
            pattern: 'Large Outliers',
            description: `You had ${largeExpenses.length} purchases over ₹5,000 this month.`,
            severity: 'warning',
            icon: '🛍️',
            savings: Math.round(largeExpenses.reduce((s, e) => s + e.amount, 0) * 0.1)
        });
    }

    // Default success pattern if everything is good
    if (insights.length < 2) {
        insights.push({
            pattern: 'Disciplined Spender',
            description: 'Your spending habits look consistent and controlled. Keep it up!',
            severity: 'success',
            icon: '✅',
            savings: 0
        });
    }

    return insights;
}

/**
 * ── Dynamic Stock Generation Engine ──
 * Generates realistic-looking mock stock data based on a symbol
 */
export function generateDynamicStockData(symbol) {
    const basePrices = {
        'RELIANCE': 2950,
        'TCS': 3800,
        'INFY': 1850,
        'HDFCBANK': 1680,
        'AAPL': 180 * 83, // Approx in INR
        'GOOGL': 150 * 83,
        'TSLA': 170 * 83,
    };

    const basePrice = basePrices[symbol.toUpperCase()] || (Math.random() * 5000 + 500);
    const volatility = basePrice * 0.015;

    const history = [];
    let price = basePrice;
    const now = new Date();

    for (let i = 90; i >= 0; i--) {
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        price += (Math.random() - 0.49) * volatility; // slight upward bias
        history.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(price * 100) / 100
        });
    }

    const prediction = [];
    let predPrice = price;
    const trend = (history[history.length - 1].price - history[history.length - 10].price) / 10;

    for (let i = 1; i <= 30; i++) {
        const date = new Date(now);
        date.setDate(date.getDate() + i);
        predPrice += trend + (Math.random() - 0.5) * Math.abs(trend) * 1.5;
        prediction.push({
            date: date.toISOString().split('T')[0],
            price: Math.round(predPrice * 100) / 100
        });
    }

    const change = +(history[history.length - 1].price - history[history.length - 2].price).toFixed(2);

    return {
        symbol: symbol.toUpperCase(),
        name: symbol.toUpperCase() + ' Corp',
        currentPrice: history[history.length - 1].price,
        change,
        history,
        prediction,
        riskScore: Math.floor(Math.random() * 60) + 10,
        sector: ['IT', 'Banking', 'Energy', 'Consumer', 'Auto'][Math.floor(Math.random() * 5)]
    };
}

export function calculateSIP(monthlyAmount, annualReturn = 12, years) {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const futureValue = monthlyAmount * ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(futureValue);
}

export function calculateRequiredSIP(targetAmount, annualReturn = 12, years) {
    const monthlyRate = annualReturn / 12 / 100;
    const months = years * 12;
    const numerator = targetAmount;
    const denominator = ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) * (1 + monthlyRate);
    return Math.round(numerator / denominator);
}
