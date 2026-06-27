export type TaskStatus = 'Pending' | 'Scheduled' | 'Completed' | 'Skipped';
export type EnergyLevel = 'Low' | 'Medium' | 'High';

export interface Task {
    id: string;
    title: string;
    description?: string;
    priorityScore: number; // 1-10
    urgencyScore: number; // 1-10
    estimatedDurationMins: number;
    energyRequirement?: EnergyLevel;
    deadline?: Date;
    status: TaskStatus;
    createdAt: Date;
    scheduledEventId?: string; // Link to CalendarEvent if scheduled
}
