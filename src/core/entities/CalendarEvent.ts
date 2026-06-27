export interface CalendarEvent {
    id: string;
    title: string;
    startTime: Date;
    endTime: Date;
    isFocusBlock: boolean;
    isMeeting: boolean;
    taskId?: string; // Link to Task if this block is for a task
}
