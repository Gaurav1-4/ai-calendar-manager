import { GoogleGenAI } from "@google/genai";
import { AIProvider, IntentAndEntities } from "../interfaces/AIProvider";

export class GeminiAdapter implements AIProvider {
    private ai: GoogleGenAI;

    constructor() {
        this.ai = new GoogleGenAI({
            apiKey: process.env.GEMINI_API_KEY,
        });
    }

    async generateResponse(prompt: string, context?: any): Promise<string> {
        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction: "You are an AI Calendar Manager assistant. Be concise and professional.",
            }
        });
        
        return response.text || "I couldn't process that.";
    }

    async extractIntentAndEntities(prompt: string, context?: any): Promise<IntentAndEntities> {
        const systemInstruction = `
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

        const response = await this.ai.models.generateContent({
            model: 'gemini-2.5-flash',
            contents: prompt,
            config: {
                systemInstruction,
                responseMimeType: "application/json",
            }
        });

        const result = response.text;
        if (!result) throw new Error("No response from Gemini");

        return JSON.parse(result) as IntentAndEntities;
    }
}
