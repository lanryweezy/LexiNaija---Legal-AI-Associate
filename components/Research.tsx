import React, { useState, useRef, useEffect } from 'react';
import { Send, User, Bot, Loader2 } from 'lucide-react';
import { generateLegalResearch } from '../services/geminiService';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

export const Research: React.FC = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      role: 'model',
      text: 'Greetings, Learned Colleague. I am ready to assist with your research on Nigerian law. You may ask about statutes, case law principles, or procedural rules.',
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      const responseText = await generateLegalResearch(userMsg.text);
      const botMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: "My apologies, I encountered an error accessing the legal database. Please try again.",
        timestamp: new Date(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50 pt-6 px-6 pb-6 max-w-5xl mx-auto">
      <div className="mb-4">
        <h2 className="text-2xl font-serif font-bold text-legal-900">Legal Research Assistant</h2>
        <p className="text-sm text-gray-500">Powered by Gemini 2.5 Flash • Context: Nigerian Legal System</p>
      </div>

      <div className="flex-1 overflow-y-auto bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-4 space-y-6">
        {messages.map((msg) => (
          <div key={msg.id} className={`flex gap-4 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}>
            <div className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-legal-700 text-white' : 'bg-legal-gold text-legal-900'
            }`}>
              {msg.role === 'user' ? <User size={20} /> : <Bot size={20} />}
            </div>
            <div className={`max-w-[80%] rounded-2xl p-4 ${
              msg.role === 'user' 
                ? 'bg-legal-900 text-white' 
                : 'bg-gray-50 text-legal-900 border border-gray-100'
            }`}>
              <div className={`prose prose-sm ${msg.role === 'user' ? 'prose-invert' : ''} max-w-none`}>
                <ReactMarkdown>{msg.text}</ReactMarkdown>
              </div>
              <span className={`text-[10px] block mt-2 ${msg.role === 'user' ? 'text-gray-400' : 'text-gray-400'}`}>
                {msg.timestamp.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
              </span>
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-4">
            <div className="w-10 h-10 rounded-full bg-legal-gold text-legal-900 flex items-center justify-center shrink-0">
              <Bot size={20} />
            </div>
            <div className="bg-gray-50 border border-gray-100 rounded-2xl p-4 flex items-center gap-2">
              <Loader2 className="animate-spin text-legal-900 w-4 h-4" />
              <span className="text-sm text-gray-500">Consulting statutes and precedents...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="relative">
        <textarea
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
          placeholder="Ask about CAMA 2020 sections, recent SC judgments, or procedural rules..."
          className="w-full bg-white border border-gray-300 rounded-xl pl-4 pr-14 py-4 focus:outline-none focus:ring-2 focus:ring-legal-gold focus:border-transparent resize-none shadow-sm"
          rows={3}
        />
        <button 
          onClick={handleSend}
          disabled={isLoading || !input.trim()}
          className="absolute right-3 bottom-3 p-2 bg-legal-900 text-white rounded-lg hover:bg-legal-800 disabled:opacity-50 transition-colors"
        >
          <Send size={18} />
        </button>
      </div>
    </div>
  );
};