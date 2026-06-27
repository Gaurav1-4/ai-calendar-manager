import { NextResponse } from 'next/server';
import { LocalJsonRepository } from '@/core/adapters/LocalJsonRepository';

export async function GET() {
    try {
        const dbRepo = new LocalJsonRepository();
        const tasks = await dbRepo.getTasks();
        return NextResponse.json(tasks);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
