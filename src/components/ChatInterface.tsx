"use client";

import { useState } from 'react';
import { Send, Loader2 } from 'lucide-react';

export default function ChatInterface({ onUpdate }: { onUpdate: () => void }) {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMsg = message;
        setMessage('');
        setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
        setIsLoading(true);

        try {
            const res = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ message: userMsg })
            });
            const data = await res.json();

            setChatHistory(prev => [...prev, { role: 'ai', content: data.reply || data.error }]);
            onUpdate(); // Trigger refresh of calendar/tasks
        } catch (error) {
            setChatHistory(prev => [...prev, { role: 'ai', content: 'An error occurred while connecting to the AI.' }]);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-full bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden">
            <div className="p-4 bg-gray-50 dark:bg-gray-900 border-b border-gray-100 dark:border-gray-700">
                <h2 className="font-semibold text-gray-800 dark:text-gray-200">AI Assistant</h2>
            </div>
            
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {chatHistory.length === 0 && (
                    <div className="text-center text-gray-400 dark:text-gray-500 mt-10">
                        <p>How can I help you manage your time?</p>
                        <p className="text-sm mt-2">Try "Schedule 2 hours for coding tomorrow"</p>
                    </div>
                )}
                {chatHistory.map((chat, idx) => (
                    <div key={idx} className={`flex ${chat.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-3 rounded-2xl ${chat.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none'}`}>
                            {chat.content}
                        </div>
                    </div>
                ))}
                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-gray-100 dark:bg-gray-700 p-3 rounded-2xl rounded-bl-none flex items-center space-x-2">
                            <Loader2 className="w-4 h-4 animate-spin text-gray-500" />
                            <span className="text-gray-500 text-sm">Thinking...</span>
                        </div>
                    </div>
                )}
            </div>

            <div className="p-4 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700">
                <div className="flex items-center space-x-2">
                    <input 
                        type="text" 
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                        placeholder="Type a command..."
                        className="flex-1 p-3 rounded-full bg-gray-100 dark:bg-gray-900 border-transparent focus:bg-white focus:ring-2 focus:ring-blue-500 dark:text-white outline-none transition-all"
                    />
                    <button 
                        onClick={handleSend}
                        disabled={isLoading || !message.trim()}
                        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 disabled:opacity-50 transition-colors"
                    >
                        <Send className="w-5 h-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
