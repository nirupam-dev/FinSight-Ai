// ── JSON File Storage Utility for FinSight AI ──
// Persists data to JSON files in the project's /data directory

import { promises as fs } from 'fs';
import path from 'path';

const DATA_DIR = path.join(process.cwd(), '.finsight-data');

async function ensureDir() {
    try { await fs.mkdir(DATA_DIR, { recursive: true }); } catch { }
}

function filePath(name) {
    return path.join(DATA_DIR, `${name}.json`);
}

export async function readData(name, fallback) {
    await ensureDir();
    try {
        const raw = await fs.readFile(filePath(name), 'utf-8');
        return JSON.parse(raw);
    } catch {
        // File doesn't exist — seed with fallback
        if (fallback !== undefined) {
            await writeData(name, fallback);
            return fallback;
        }
        return null;
    }
}

export async function writeData(name, data) {
    await ensureDir();
    await fs.writeFile(filePath(name), JSON.stringify(data, null, 2), 'utf-8');
    return data;
}
