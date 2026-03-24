// GET /api/expenses — returns all expenses
// POST /api/expenses — creates a new expense
// DELETE /api/expenses — deletes an expense by id (passed in body)

import { readData, writeData } from '@/lib/storage';
import { SEED_EXPENSES } from '@/lib/seedData';
import { NextResponse } from 'next/server';

export async function GET() {
    try {
        const expenses = await readData('expenses', SEED_EXPENSES);
        return NextResponse.json({ success: true, data: expenses });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        const body = await request.json();
        const { description, amount, category, date } = body;

        // Validation
        if (!description || typeof description !== 'string' || description.trim().length === 0) {
            return NextResponse.json({ success: false, error: 'Description is required' }, { status: 400 });
        }
        if (!amount || isNaN(Number(amount)) || Number(amount) <= 0) {
            return NextResponse.json({ success: false, error: 'Valid positive amount is required' }, { status: 400 });
        }
        if (!category) {
            return NextResponse.json({ success: false, error: 'Category is required' }, { status: 400 });
        }

        const expenses = await readData('expenses', SEED_EXPENSES);
        const newExpense = {
            id: Date.now(),
            description: description.trim(),
            amount: Number(amount),
            category,
            date: date || new Date().toISOString().split('T')[0],
            type: 'debit',
        };
        expenses.unshift(newExpense);
        await writeData('expenses', expenses);

        return NextResponse.json({ success: true, data: newExpense }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function DELETE(request) {
    try {
        const { searchParams } = new URL(request.url);
        const id = Number(searchParams.get('id'));
        if (!id) {
            return NextResponse.json({ success: false, error: 'Expense ID is required' }, { status: 400 });
        }

        const expenses = await readData('expenses', SEED_EXPENSES);
        const idx = expenses.findIndex((e) => e.id === id);
        if (idx === -1) {
            return NextResponse.json({ success: false, error: 'Expense not found' }, { status: 404 });
        }

        const deleted = expenses.splice(idx, 1)[0];
        await writeData('expenses', expenses);

        return NextResponse.json({ success: true, data: deleted });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
