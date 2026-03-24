// ── FinSight AI Engine — Mock intelligent responses ──

import { CATEGORIES, BUDGET_CONFIG, BUDGET_CATEGORIES, EXPENSES } from '@/data/mockData';

function formatCurrency(amount) {
    return '₹' + amount.toLocaleString('en-IN');
}

function getTotalSpent(expenses) {
    return expenses.reduce((sum, e) => sum + e.amount, 0);
}

function getCategorySpending(expenses) {
    const map = {};
    expenses.forEach((e) => {
        map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return map;
}

export function getAIResponse(userMessage, expenses = EXPENSES) {
    const msg = userMessage.toLowerCase().trim();
    const totalSpent = getTotalSpent(expenses);
    const income = BUDGET_CONFIG.monthlyIncome;
    const remaining = income - totalSpent;
    const savingsRate = Math.round((remaining / income) * 100);
    const categorySpending = getCategorySpending(expenses);

    // ── Affordability Check ──
    const affordMatch = msg.match(/(?:can i|afford|buy|purchase|spend)\s.*?(?:₹|rs\.?|inr)?\s?(\d[\d,]*)/i);
    if (affordMatch) {
        const amount = parseInt(affordMatch[1].replace(/,/g, ''), 10);
        if (amount <= remaining * 0.3) {
            return `✅ Yes, you can comfortably afford ${formatCurrency(amount)}!\n\nYour remaining budget is ${formatCurrency(remaining)} and this is only ${Math.round((amount / remaining) * 100)}% of it. Your savings won't be significantly impacted.`;
        } else if (amount <= remaining) {
            return `⚠️ You *can* afford ${formatCurrency(amount)}, but it would use ${Math.round((amount / remaining) * 100)}% of your remaining budget (${formatCurrency(remaining)}).\n\nConsider if it's a need or a want. Your current savings rate is ${savingsRate}% — this purchase would drop it to around ${Math.round(((remaining - amount) / income) * 100)}%.`;
        } else {
            return `❌ That's above your current remaining budget of ${formatCurrency(remaining)}.\n\nTo afford ${formatCurrency(amount)}, you'd need to save for about ${Math.ceil(amount / (income * 0.2))} months at your current savings rate. Consider setting up a savings goal!`;
        }
    }

    // ── Category Queries ──
    for (const cat of CATEGORIES) {
        if (msg.includes(cat.label.toLowerCase()) || msg.includes(cat.id)) {
            const spent = categorySpending[cat.id] || 0;
            const budget = BUDGET_CATEGORIES.find((b) => b.id === cat.id);
            return `${cat.icon} **${cat.label}**\n\nYou've spent ${formatCurrency(spent)} this month${budget ? ` out of ${formatCurrency(budget.allocated)} budgeted (${Math.round((spent / budget.allocated) * 100)}% used)` : ''}.`;
        }
    }

    // ── General Finance Queries ──
    if (msg.includes('spend') || msg.includes('expense') || msg.includes('spent')) {
        return `📊 This month you've spent ${formatCurrency(totalSpent)} across ${expenses.length} transactions.\n\nTop categories:\n${Object.entries(categorySpending).sort((a, b) => b[1] - a[1]).slice(0, 3).map(([cat, amt]) => {
            const c = CATEGORIES.find((c) => c.id === cat);
            return `• ${c?.icon || '📦'} ${c?.label || cat}: ${formatCurrency(amt)}`;
        }).join('\n')}`;
    }

    if (msg.includes('budget') || msg.includes('remaining')) {
        return `💰 **Budget Overview**\n\nIncome: ${formatCurrency(income)}\nSpent: ${formatCurrency(totalSpent)}\nRemaining: ${formatCurrency(remaining)}\nSavings Rate: ${savingsRate}%\n\n${remaining < 0 ? '🚨 You\'ve exceeded your budget! Consider cutting back on non-essentials.' : remaining < income * 0.1 ? '⚠️ Budget is getting tight. Watch your spending!' : '✅ You\'re on track this month!'}`;
    }

    if (msg.includes('saving') || msg.includes('save')) {
        const monthlySavings = income * BUDGET_CONFIG.savings;
        return `🏦 **Savings Summary**\n\nTarget monthly savings (20%): ${formatCurrency(monthlySavings)}\nCurrent remaining: ${formatCurrency(remaining)}\nSavings rate: ${savingsRate}%\n\n${savingsRate >= 20 ? '🎉 Great job! You\'re meeting your savings target!' : `You need to save ${formatCurrency(monthlySavings - remaining)} more to hit your 20% target.`}`;
    }

    if (msg.includes('invest') || msg.includes('stock') || msg.includes('portfolio')) {
        return `📈 **Investment Tip**\n\nYour monthly surplus is ${formatCurrency(remaining)}. Consider:\n• SIP in index funds: ${formatCurrency(Math.round(remaining * 0.4))}/month\n• Emergency fund top-up: ${formatCurrency(Math.round(remaining * 0.3))}\n• Stock picks: Check the Stocks tab for AI predictions\n\nRemember: never invest more than you can afford to lose!`;
    }

    if (msg.includes('subscription') || msg.includes('recurring')) {
        return `🔄 **Subscription Analysis**\n\nDetected recurring expenses:\n• Netflix: ₹649/month (⚠️ Low usage)\n• Spotify Premium: ₹119/month (✅ High usage)\n• Gym Membership: ₹1,500/month (⚠️ Low usage)\n• Zomato Gold: ₹500/month (⚠️ Low usage)\n• YouTube Premium: ₹149/month (✅ High usage)\n\n🚨 **Subscription Waste Detected!**\n₹2,649/month wasted on low-usage subscriptions. That's ₹31,788/year!\n\nVisit the **Insights** tab for full subscription analysis.`;
    }

    if (msg.includes('goal') || msg.includes('plan') || msg.includes('future')) {
        return `🎯 **Financial Goals**\n\n1. 🚗 Buy a Car: ₹2.2L saved of ₹8L (28%)\n2. 🏠 House Down Payment: ₹4.5L saved of ₹20L (23%)\n3. 🛡️ Emergency Fund: ₹1.85L saved of ₹5L (37%)\n4. ✈️ Europe Trip: ₹85K saved of ₹3L (28%)\n\n💡 Use the **Goals** page to track progress and the SIP calculator to plan investments!`;
    }

    if (msg.includes('risk') || msg.includes('emergency') || msg.includes('job loss')) {
        return `⚠️ **Risk Assessment**\n\n• Emergency Fund: ₹1,85,000\n• Monthly Expenses: ₹45,000\n• Survival Duration: **4.1 months**\n\n🎯 Target: 6 months of expenses (₹2,70,000)\n🔴 Gap: ₹85,000 more needed\n\n💡 Check the **Insights → Risk Engine** for detailed what-if simulations (job loss, medical emergency, inflation, rate hikes).`;
    }

    if (msg.includes('health') || msg.includes('score') || msg.includes('financial health')) {
        return `💪 **Financial Health Score: 72/100**\n\n• Savings Rate: 78/100\n• Debt-to-Income: 85/100 ✅\n• Emergency Fund: 62/100 ⚠️\n• Investment Diversity: 55/100 ⚠️\n• Budget Adherence: 80/100\n\n📈 Score trending up from 65 → 72 over 6 months!\n\nVisit **Insights → Financial Health** for the full radar chart.`;
    }

    if (msg.includes('pattern') || msg.includes('habit') || msg.includes('behavior') || msg.includes('impulse')) {
        return `🧠 **Spending Behavior Analysis**\n\n• 📅 Weekend Splurge: 45% more spending on weekends\n• 🌙 Late-Night Orders: ₹4,200/mo on food after 10 PM\n• 🛒 Impulse Shopping: 3 unplanned purchases > ₹2,000\n\n💰 Potential Savings: **₹12,400/month** by fixing these patterns!\n\nVisit **Insights → Behavioral** for detailed heatmaps.`;
    }

    if (msg.includes('sip') || msg.includes('mutual fund') || msg.includes('systematic')) {
        return `📊 **SIP Recommendation**\n\nBased on your surplus of ${formatCurrency(remaining)}:\n\n• Conservative: ₹5,000/mo → ₹11.6L in 10 yrs\n• Balanced: ₹10,000/mo → ₹23.2L in 10 yrs\n• Aggressive: ₹15,000/mo → ₹34.9L in 10 yrs\n\n(Assuming 12% annual returns)\n\n💡 Visit **Goals → SIP Calculator** for custom projections!`;
    }

    if (msg.includes('hello') || msg.includes('hi') || msg.includes('hey')) {
        return `👋 Hey there! I'm your FinSight AI assistant. Here's what I can help with:\n\n• 💸 "Can I afford ₹X?"\n• 📊 "How much did I spend on food?"\n• 💰 "What's my budget status?"\n• 🏦 "How are my savings?"\n• 📈 "Any investment tips?"\n• 🎯 "What are my goals?"\n• ⚠️ "What's my risk score?"\n• 🧠 "Any spending patterns?"\n• 📊 "SIP recommendations?"\n\nJust ask away!`;
    }

    // ── Default ──
    return `🤔 I can help you with:\n\n• 💸 Affordability checks ("Can I afford ₹20,000?")\n• 📊 Spending analysis ("How much on food?")\n• 💰 Budget overview ("What's my budget?")\n• 🏦 Savings tips ("How are my savings?")\n• 📈 Investment suggestions ("Any investment tips?")\n• 🎯 Financial goals ("What are my goals?")\n• ⚠️ Risk assessment ("What's my risk score?")\n• 🧠 Spending patterns ("Any spending patterns?")\n• 🔄 Subscription analysis ("Check subscriptions")\n• 📊 SIP calculator ("SIP recommendations?")\n\nTry asking one of these!`;
}
