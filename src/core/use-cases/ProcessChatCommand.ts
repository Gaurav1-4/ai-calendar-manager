import { v4 as uuidv4 } from 'uuid';
import { AIProvider } from '../interfaces/AIProvider';
import { DatabaseRepository } from '../interfaces/DatabaseRepository';
import { Task } from '../entities/Task';
import { CalendarEvent } from '../entities/CalendarEvent';

export class ProcessChatCommand {
    constructor(
        private aiProvider: AIProvider,
        private dbRepo: DatabaseRepository
    ) {}

    async execute(message: string): Promise<string> {
        // 1. Extract Intent
        const response = await this.aiProvider.extractIntentAndEntities(message);

        // 2. Perform Action based on Intent
        switch (response.intent) {
            case 'SCHEDULE_TASK':
                if (response.entities.taskName) {
                    const task: Task = {
                        id: uuidv4(),
                        title: response.entities.taskName,
                        priorityScore: 5,
                        urgencyScore: 5,
                        estimatedDurationMins: response.entities.durationMins || 60,
                        status: 'Pending',
                        createdAt: new Date(),
                    };
                    await this.dbRepo.saveTask(task);
                    
                    // Note: A smarter scheduler would assign CalendarEvents here.
                    // For MVP, we just create the task and a generic event if date is provided.
                    if (response.entities.date) {
                        const event: CalendarEvent = {
                            id: uuidv4(),
                            title: `Focus: ${task.title}`,
                            startTime: new Date(`${response.entities.date}T${response.entities.time || '09:00'}:00`),
                            endTime: new Date(new Date(`${response.entities.date}T${response.entities.time || '09:00'}:00`).getTime() + (task.estimatedDurationMins * 60000)),
                            isFocusBlock: true,
                            isMeeting: false,
                            taskId: task.id
                        };
                        await this.dbRepo.saveEvent(event);
                    }
                }
                break;
            case 'MOVE_EVENT':
                // MVP: In a real system we'd search for the event by name/date.
                break;
            case 'GET_SCHEDULE':
                const events = await this.dbRepo.getEvents();
                if (events.length === 0) {
                    return "You have nothing scheduled.";
                }
                const scheduleList = events.map(e => `- ${e.title} at ${new Date(e.startTime).toLocaleString()}`).join('\n');
                return `Here is your schedule:\n${scheduleList}`;
            case 'GENERAL_CHAT':
            default:
                break;
        }

        return response.replyMessage;
    }
}
