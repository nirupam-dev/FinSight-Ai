// POST /api/upload — uploads a file (receipt/invoice) and stores it
// GET /api/upload — returns list of uploaded files

import { readData, writeData } from '@/lib/storage';
import { SEED_UPLOADS } from '@/lib/seedData';
import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads');

async function ensureUploadDir() {
    try { await fs.mkdir(UPLOAD_DIR, { recursive: true }); } catch { }
}

export async function GET() {
    try {
        const uploads = await readData('uploads', SEED_UPLOADS);
        return NextResponse.json({ success: true, data: uploads });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}

export async function POST(request) {
    try {
        await ensureUploadDir();
        const formData = await request.formData();
        const file = formData.get('file');

        if (!file || typeof file === 'string') {
            return NextResponse.json({ success: false, error: 'No file provided' }, { status: 400 });
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            return NextResponse.json({ success: false, error: 'File too large (max 5MB)' }, { status: 400 });
        }

        // Validate file type
        const validTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp', 'application/pdf'];
        if (!validTypes.includes(file.type)) {
            return NextResponse.json({ success: false, error: 'Unsupported file type. Use PNG, JPG, WEBP, or PDF.' }, { status: 400 });
        }

        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        const ext = file.name.split('.').pop() || 'bin';
        const uniqueName = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}.${ext}`;
        const filePath = path.join(UPLOAD_DIR, uniqueName);
        await fs.writeFile(filePath, buffer);

        const uploadRecord = {
            id: Date.now(),
            originalName: file.name,
            fileName: uniqueName,
            url: `/uploads/${uniqueName}`,
            size: file.size,
            type: file.type,
            uploadedAt: new Date().toISOString(),
        };

        const uploads = await readData('uploads', SEED_UPLOADS);
        uploads.unshift(uploadRecord);
        await writeData('uploads', uploads);

        return NextResponse.json({ success: true, data: uploadRecord }, { status: 201 });
    } catch (err) {
        return NextResponse.json({ success: false, error: err.message }, { status: 500 });
    }
}
