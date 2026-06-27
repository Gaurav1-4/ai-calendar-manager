import fs from 'fs/promises';
import path from 'path';
import { DatabaseRepository } from '../interfaces/DatabaseRepository';
import { Task } from '../entities/Task';
import { CalendarEvent } from '../entities/CalendarEvent';

const DB_PATH = path.join(process.cwd(), '.data', 'db.json');

interface DbSchema {
    tasks: Task[];
    events: CalendarEvent[];
}

export class LocalJsonRepository implements DatabaseRepository {
    private async readDb(): Promise<DbSchema> {
        try {
            const data = await fs.readFile(DB_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            return { tasks: [], events: [] };
        }
    }

    private async writeDb(data: DbSchema): Promise<void> {
        await fs.writeFile(DB_PATH, JSON.stringify(data, null, 2));
    }

    // Tasks
    async getTasks(): Promise<Task[]> {
        const db = await this.readDb();
        return db.tasks;
    }

    async getTaskById(id: string): Promise<Task | null> {
        const db = await this.readDb();
        return db.tasks.find(t => t.id === id) || null;
    }

    async saveTask(task: Task): Promise<void> {
        const db = await this.readDb();
        const index = db.tasks.findIndex(t => t.id === task.id);
        if (index >= 0) {
            db.tasks[index] = task;
        } else {
            db.tasks.push(task);
        }
        await this.writeDb(db);
    }

    async deleteTask(id: string): Promise<void> {
        const db = await this.readDb();
        db.tasks = db.tasks.filter(t => t.id !== id);
        await this.writeDb(db);
    }

    // Events
    async getEvents(): Promise<CalendarEvent[]> {
        const db = await this.readDb();
        return db.events;
    }

    async getEventsByDateRange(start: Date, end: Date): Promise<CalendarEvent[]> {
        const db = await this.readDb();
        return db.events.filter(e => {
            const eventStart = new Date(e.startTime);
            return eventStart >= start && eventStart <= end;
        });
    }

    async getEventById(id: string): Promise<CalendarEvent | null> {
        const db = await this.readDb();
        return db.events.find(e => e.id === id) || null;
    }

    async saveEvent(event: CalendarEvent): Promise<void> {
        const db = await this.readDb();
        const index = db.events.findIndex(e => e.id === event.id);
        if (index >= 0) {
            db.events[index] = event;
        } else {
            db.events.push(event);
        }
        await this.writeDb(db);
    }

    async deleteEvent(id: string): Promise<void> {
        const db = await this.readDb();
        db.events = db.events.filter(e => e.id !== id);
        await this.writeDb(db);
    }
}
