/**
 * ── FinSight AI Engine — Fully Functional logic ──
 * Reads real-time data from the store and provides context-aware financial advice.
 */

function formatCurrency(amount) {
    return '₹' + Math.round(amount).toLocaleString('en-IN');
}

export function getAIResponse(userMessage, expenses, budgetConfig) {
    const msg = userMessage.toLowerCase().trim();

    if (!expenses || !budgetConfig) {
        return "I'm still loading your data. Please try again in a second!";
    }

    const totalSpent = expenses.reduce((sum, e) => sum + e.amount, 0);
    const income = budgetConfig.monthlyIncome;
    const remaining = income - totalSpent;
    const savingsRate = Math.round((remaining / income) * 100);

    // 1. Affordability Check (REAL LOGIC)
    const affordMatch = msg.match(/(?:can i|afford|buy|purchase|spend)\s.*?(?:₹|rs\.?|inr)?\s?(\d[\d,]*)/i);
    if (affordMatch) {
        const amount = parseInt(affordMatch[1].replace(/,/g, ''), 10);
        if (amount <= remaining * 0.25) {
            return `✅ Yes! You have ${formatCurrency(remaining)} left this month. Buying this for ${formatCurrency(amount)} is safe as it's only ${Math.round((amount / remaining) * 100)}% of your surplus.`;
        } else if (amount <= remaining) {
            return `⚠️ Technically yes, but it would consume ${Math.round((amount / remaining) * 100)}% of your remaining ${formatCurrency(remaining)}. If this is an impulse buy, I'd suggest waiting 24 hours. Your current savings rate is ${savingsRate}%.`;
        } else {
            const gap = amount - remaining;
            return `❌ No, that's above your current remaining budget of ${formatCurrency(remaining)}. You need another ${formatCurrency(gap)}. At your current 20% savings target, you'd save this in about ${Math.ceil(amount / (income * 0.2))} months.`;
        }
    }

    // 2. Spending Summary (REAL LOGIC)
    if (msg.includes('spent') || msg.includes('expense') || msg.includes('how much')) {
        const catMap = {};
        expenses.forEach(e => catMap[e.category] = (catMap[e.category] || 0) + e.amount);
        const topCat = Object.entries(catMap).sort((a, b) => b[1] - a[1])[0];

        return `📊 You've spent **${formatCurrency(totalSpent)}** so far this month.\n\nYour highest spending category is **${topCat ? topCat[0] : 'None'}** at ${formatCurrency(topCat ? topCat[1] : 0)}.\n\nRemaining budget: ${formatCurrency(remaining)} (${savingsRate}% savings rate).`;
    }

    // 3. Behavioral/Pattern Insight (REAL LOGIC)
    if (msg.includes('habit') || msg.includes('pattern') || msg.includes('behavior')) {
        const foodSpend = expenses.filter(e => e.category === 'food').reduce((s, e) => s + e.amount, 0);
        if (foodSpend > income * 0.15) {
            return `🧠 **Pattern Found**: You're spending ${Math.round((foodSpend / income) * 100)}% of your income on food delivery. Cutting this by half could add ${formatCurrency(foodSpend * 0.5)} to your monthly savings!`;
        }
        return `✅ Your current spending behavior looks healthy. Your savings rate is ${savingsRate}%, which is ${savingsRate >= 20 ? 'above' : 'below'} the recommended 20% mark.`;
    }

    // 4. Budget Status (REAL LOGIC)
    if (msg.includes('budget') || msg.includes('remaining')) {
        const status = remaining < 0 ? 'Exceeded 🚨' : remaining < income * 0.1 ? 'Tight ⚠️' : 'On Track ✅';
        return `💰 **Budget Status: ${status}**\n\n• Income: ${formatCurrency(income)}\n• Spent: ${formatCurrency(totalSpent)}\n• Remaining: ${formatCurrency(remaining)}\n• Savings Rate: ${savingsRate}%`;
    }

    // 5. Default Helpers
    if (msg.includes('hi') || msg.includes('hello') || msg.includes('help')) {
        return `👋 I'm your AI finance buddy! Ask me:\n\n• "Can I afford ₹15,000?"\n• "How much did I spend this month?"\n• "What's my budget status?"\n• "Any spending patterns?"`;
    }

    return `🤔 I'm not sure about that. Try asking "Can I afford ₹500?" or "How much did I spend on food?"`;
}
