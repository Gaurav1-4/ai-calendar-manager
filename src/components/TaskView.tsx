"use client";

import { Task } from '@/core/entities/Task';

export default function TaskView({ tasks }: { tasks: Task[] }) {
    return (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden h-full flex flex-col">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700 flex justify-between items-center">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">Tasks</h2>
                <span className="bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-300 px-2 py-1 rounded-full text-xs font-bold">
                    {tasks.length}
                </span>
            </div>
            
            <div className="p-4 flex-1 overflow-y-auto">
                {tasks.length === 0 ? (
                    <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
                        <p>No pending tasks.</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {tasks.map(task => (
                            <div key={task.id} className="p-4 rounded-xl bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-sm flex items-start space-x-3">
                                <input type="checkbox" className="mt-1 w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500" />
                                <div className="flex-1">
                                    <h3 className="font-medium text-gray-800 dark:text-gray-200">{task.title}</h3>
                                    <div className="flex items-center space-x-3 mt-2 text-xs">
                                        <span className={`px-2 py-1 rounded-md ${
                                            task.priorityScore > 7 ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' :
                                            task.priorityScore > 4 ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400' :
                                            'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                                        }`}>
                                            Priority: {task.priorityScore}
                                        </span>
                                        <span className="text-gray-500 flex items-center">
                                            ⏱️ {task.estimatedDurationMins}m
                                        </span>
                                        <span className="text-gray-500">
                                            Status: {task.status}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
