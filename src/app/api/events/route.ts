import { NextResponse } from 'next/server';
import { LocalJsonRepository } from '@/core/adapters/LocalJsonRepository';

export async function GET() {
    try {
        const dbRepo = new LocalJsonRepository();
        const events = await dbRepo.getEvents();
        return NextResponse.json(events);
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
