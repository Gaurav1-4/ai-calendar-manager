import { NextResponse } from 'next/server';
import { GeminiAdapter } from '@/core/adapters/GeminiAdapter';
import { LocalJsonRepository } from '@/core/adapters/LocalJsonRepository';
import { ProcessChatCommand } from '@/core/use-cases/ProcessChatCommand';

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { message } = body;

        if (!message) {
            return NextResponse.json({ error: 'Message is required' }, { status: 400 });
        }

        const aiProvider = new GeminiAdapter();
        const dbRepo = new LocalJsonRepository();
        const useCase = new ProcessChatCommand(aiProvider, dbRepo);

        const reply = await useCase.execute(message);

        return NextResponse.json({ reply });
    } catch (error: any) {
        console.error("Chat API Error:", error);
        return NextResponse.json({ error: error.message || 'Internal Server Error' }, { status: 500 });
    }
}
