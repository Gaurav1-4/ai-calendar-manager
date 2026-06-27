export interface IntentAndEntities {
    intent: 'SCHEDULE_TASK' | 'MOVE_EVENT' | 'GET_SCHEDULE' | 'GENERAL_CHAT';
    entities: {
        taskName?: string;
        date?: string;
        time?: string;
        durationMins?: number;
        originalEventId?: string;
        targetDate?: string;
    };
    replyMessage: string;
}

export interface AIProvider {
    generateResponse(prompt: string, context?: any): Promise<string>;
    extractIntentAndEntities(prompt: string, context?: any): Promise<IntentAndEntities>;
}
