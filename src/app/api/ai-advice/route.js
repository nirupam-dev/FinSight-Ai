// POST /api/ai-advice — processes user message and returns context-aware advice
// Purely server-side processing of financial data

import { readData } from '@/lib/storage';
import { SEED_EXPENSES, SEED_BUDGET } from '@/lib/seedData';
import { getAIResponse } from '@/lib/aiEngine';
import { NextResponse } from 'next/server';

export async function POST(request) {
    try {
        const { message } = await request.json();
        if (!message) {
            return NextResponse.json({ success: false, error: 'Message is required' }, { status: 400 });
        }

        // Fetch latest data from storage
        const expenses = await readData('expenses', SEED_EXPENSES);
        const budget = await readData('budget', SEED_BUDGET);

        const response = getAIResponse(message, expenses, budget.config);

        return NextResponse.json({ success: true, data: response });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
