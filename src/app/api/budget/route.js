// GET /api/budget — returns budget config, categories, savings goals
// POST /api/budget — updates budget config (income, categories, goals)

import { readData, writeData } from '@/lib/storage';
import { SEED_BUDGET } from '@/lib/seedData';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const budget = await readData('budget', SEED_BUDGET);
        return NextResponse.json({ success: true, data: budget });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const current = await readData('budget', SEED_BUDGET);

        // If updating config (income, etc)
        if (body.config) {
            current.config = { ...current.config, ...body.config };
        }

        // If updating categories
        if (body.categories) {
            current.categories = body.categories;
        }

        // If updating savings goals
        if (body.savingsGoals) {
            current.savingsGoals = body.savingsGoals;
        }

        await writeData('budget', current);
        return NextResponse.json({ success: true, data: current });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
