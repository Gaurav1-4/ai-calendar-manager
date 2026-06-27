import Groq from "groq-sdk";
import { AIProvider, IntentAndEntities } from "../interfaces/AIProvider";

export class GroqAdapter implements AIProvider {
    private groq: Groq;

    constructor() {
        this.groq = new Groq({
            apiKey: process.env.GROQ_API_KEY,
        });
    }

    async generateResponse(prompt: string, context?: any): Promise<string> {
        const completion = await this.groq.chat.completions.create({
            messages: [
                { role: "system", content: "You are an AI Calendar Manager assistant. Be concise and professional." },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
        });

        return completion.choices[0]?.message?.content || "I couldn't process that.";
    }

    async extractIntentAndEntities(prompt: string, context?: any): Promise<IntentAndEntities> {
        const systemPrompt = `
You are an AI Intent Extractor for a Calendar Manager.
Extract the intent and entities from the user's message.
Possible intents: SCHEDULE_TASK, MOVE_EVENT, GET_SCHEDULE, GENERAL_CHAT.

Respond ONLY with a valid JSON object matching this schema:
{
  "intent": "...",
  "entities": {
    "taskName": "...", // if applicable
    "date": "...", // YYYY-MM-DD if applicable
    "time": "...", // HH:MM if applicable
    "durationMins": 0, // number if applicable
    "targetDate": "..."
  },
  "replyMessage": "A friendly confirmation message of what you are doing"
}
        `;

        const completion = await this.groq.chat.completions.create({
            messages: [
                { role: "system", content: systemPrompt },
                { role: "user", content: prompt }
            ],
            model: "llama-3.3-70b-versatile",
            response_format: { type: "json_object" }
        });

        const result = completion.choices[0]?.message?.content;
        if (!result) throw new Error("No response from Groq");

        return JSON.parse(result) as IntentAndEntities;
    }
}
