'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useStore from '@/store/useStore';
import { getAIResponse } from '@/lib/aiEngine';
import { MessageCircle, X, Send, Bot, User } from 'lucide-react';

export default function ChatWidget() {
    const chatOpen = useStore((s) => s.chatOpen);
    const toggleChat = useStore((s) => s.toggleChat);
    const chatMessages = useStore((s) => s.chatMessages);
    const addChatMessage = useStore((s) => s.addChatMessage);
    const expenses = useStore((s) => s.expenses);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const messagesEndRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [chatMessages]);

    const handleSend = () => {
        if (!input.trim()) return;
        const userMsg = input.trim();
        setInput('');
        addChatMessage({ role: 'user', text: userMsg });
        setIsTyping(true);
        setTimeout(() => {
            const response = getAIResponse(userMsg, expenses);
            addChatMessage({ role: 'assistant', text: response });
            setIsTyping(false);
        }, 600 + Math.random() * 400);
    };

    return (
        <>
            {/* Floating Button */}
            <button
                onClick={toggleChat}
                className="fixed bottom-5 right-5 z-50 w-11 h-11 rounded-full bg-indigo-600 hover:bg-indigo-700
          shadow-md flex items-center justify-center text-white transition-colors duration-150"
            >
                {chatOpen ? <X className="w-5 h-5" /> : <MessageCircle className="w-5 h-5" />}
            </button>

            {/* Chat Panel */}
            <AnimatePresence>
                {chatOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: 8 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 8 }}
                        transition={{ duration: 0.2 }}
                        className="fixed bottom-20 right-5 z-50 w-[360px] max-h-[480px] flex flex-col
              rounded-xl overflow-hidden shadow-lg
              bg-white dark:bg-[#141414]
              border border-neutral-200 dark:border-neutral-800"
                    >
                        {/* Header */}
                        <div className="px-4 py-3 border-b border-neutral-200 dark:border-neutral-800">
                            <div className="flex items-center gap-2.5">
                                <div className="w-7 h-7 rounded-lg bg-indigo-600 flex items-center justify-center">
                                    <Bot className="w-4 h-4 text-white" />
                                </div>
                                <div>
                                    <h3 className="text-[13px] font-semibold text-neutral-900 dark:text-white">FinSight AI</h3>
                                    <p className="text-[11px] text-neutral-400">Finance assistant</p>
                                </div>
                            </div>
                        </div>

                        {/* Messages */}
                        <div className="flex-1 overflow-y-auto p-3 space-y-2.5 min-h-[280px] max-h-[330px]">
                            {chatMessages.map((msg, i) => (
                                <div
                                    key={i}
                                    className={`flex gap-2 ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                                >
                                    {msg.role === 'assistant' && (
                                        <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center flex-shrink-0 mt-0.5">
                                            <Bot className="w-3.5 h-3.5 text-white" />
                                        </div>
                                    )}
                                    <div
                                        className={`max-w-[78%] px-3 py-2 rounded-xl text-[12px] leading-relaxed whitespace-pre-line
                    ${msg.role === 'user'
                                                ? 'bg-indigo-600 text-white rounded-br-sm'
                                                : 'bg-neutral-100 dark:bg-neutral-800 text-neutral-800 dark:text-neutral-200 rounded-bl-sm'
                                            }`}
                                    >
                                        {msg.text}
                                    </div>
                                </div>
                            ))}
                            {isTyping && (
                                <div className="flex gap-2 items-center">
                                    <div className="w-6 h-6 rounded-md bg-indigo-600 flex items-center justify-center">
                                        <Bot className="w-3.5 h-3.5 text-white" />
                                    </div>
                                    <div className="bg-neutral-100 dark:bg-neutral-800 px-3 py-2.5 rounded-xl rounded-bl-sm flex gap-1">
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '0ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '150ms' }} />
                                        <span className="w-1.5 h-1.5 rounded-full bg-neutral-400 animate-bounce" style={{ animationDelay: '300ms' }} />
                                    </div>
                                </div>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input */}
                        <div className="p-3 border-t border-neutral-200 dark:border-neutral-800">
                            <div className="flex gap-2">
                                <input
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={(e) => e.key === 'Enter' && handleSend()}
                                    placeholder="Ask about your finances..."
                                    className="flex-1 px-3 py-2 rounded-lg text-[12px]
                    bg-neutral-50 dark:bg-neutral-900
                    border border-neutral-200 dark:border-neutral-700
                    text-neutral-900 dark:text-neutral-100
                    placeholder:text-neutral-400
                    outline-none focus:ring-1 focus:ring-indigo-500/30
                    transition-all duration-150"
                                />
                                <button
                                    onClick={handleSend}
                                    className="w-9 h-9 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center transition-colors duration-150"
                                >
                                    <Send className="w-3.5 h-3.5" />
                                </button>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}
