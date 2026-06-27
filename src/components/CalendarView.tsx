"use client";

import { CalendarEvent } from '@/core/entities/CalendarEvent';
import { format } from 'date-fns';

export default function CalendarView({ events }: { events: CalendarEvent[] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">Schedule</h2>
                <span className="text-sm text-gray-500">{format(new Date(), 'EEEE, MMMM do')}</span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
                {events.length === 0 ? (
                    <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
                        <p>No events scheduled.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {events.sort((a,b) => new Date(a.startTime).getTime() - new Date(b.startTime).getTime()).map(event => (
                            <div key={event.id} className={`p-4 rounded-xl border ${event.isFocusBlock ? 'bg-indigo-50 border-indigo-100 dark:bg-indigo-900/20 dark:border-indigo-800' : 'bg-white border-gray-100 dark:bg-gray-800 dark:border-gray-700'} shadow-sm flex flex-col`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className={`font-medium ${event.isFocusBlock ? 'text-indigo-900 dark:text-indigo-200' : 'text-gray-800 dark:text-gray-200'}`}>
                                        {event.title}
                                    </h3>
                                    {event.isFocusBlock && (
                                        <span className="px-2 py-1 bg-indigo-100 text-indigo-700 dark:bg-indigo-800 dark:text-indigo-200 text-xs rounded-md font-medium">
                                            Focus Block
                                        </span>
                                    )}
                                </div>
                                <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center space-x-2">
                                    <span>{format(new Date(event.startTime), 'h:mm a')}</span>
                                    <span>-</span>
                                    <span>{format(new Date(event.endTime), 'h:mm a')}</span>
                                    <span className="text-xs ml-2 opacity-70">
                                        ({format(new Date(event.startTime), 'MMM do')})
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
