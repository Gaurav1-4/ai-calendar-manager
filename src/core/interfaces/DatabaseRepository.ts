import { Task } from '../entities/Task';
import { CalendarEvent } from '../entities/CalendarEvent';

export interface DatabaseRepository {
    // Tasks
    getTasks(): Promise<Task[]>;
    getTaskById(id: string): Promise<Task | null>;
    saveTask(task: Task): Promise<void>;
    deleteTask(id: string): Promise<void>;

    // Events
    getEvents(): Promise<CalendarEvent[]>;
    getEventsByDateRange(start: Date, end: Date): Promise<CalendarEvent[]>;
    getEventById(id: string): Promise<CalendarEvent | null>;
    saveEvent(event: CalendarEvent): Promise<void>;
    deleteEvent(id: string): Promise<void>;
}
