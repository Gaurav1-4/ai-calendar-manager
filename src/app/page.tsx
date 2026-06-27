"use client";

import { useEffect, useState, useCallback } from 'react';
import ChatInterface from '@/components/ChatInterface';
import CalendarView from '@/components/CalendarView';
import TaskView from '@/components/TaskView';
import { CalendarEvent } from '@/core/entities/CalendarEvent';
import { Task } from '@/core/entities/Task';

export default function Home() {
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [tasks, setTasks] = useState<Task[]>([]);
  
  const fetchData = useCallback(async () => {
    try {
      const [eventsRes, tasksRes] = await Promise.all([
        fetch('/api/events'),
        fetch('/api/tasks')
      ]);
      const eventsData = await eventsRes.json();
      const tasksData = await tasksRes.json();
      
      if (Array.isArray(eventsData)) setEvents(eventsData);
      if (Array.isArray(tasksData)) setTasks(tasksData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-8 font-sans">
      <header className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
          <span className="text-blue-600">AI</span> Calendar Manager
        </h1>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Intelligently scheduling your day</p>
      </header>

      <main className="grid grid-cols-1 md:grid-cols-12 gap-6 h-[80vh]">
        {/* Left Column: Chat Interface */}
        <div className="md:col-span-4 h-full">
          <ChatInterface onUpdate={fetchData} />
        </div>

        {/* Middle Column: Calendar View */}
        <div className="md:col-span-5 h-full">
          <CalendarView events={events} />
        </div>

        {/* Right Column: Tasks View */}
        <div className="md:col-span-3 h-full">
          <TaskView tasks={tasks} />
        </div>
      </main>
    </div>
  );
}
