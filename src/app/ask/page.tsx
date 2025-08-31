'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';
import { useAuth } from '@/components/useauth';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  sources?: any[];
}

export default function AskPage() {
  useAuth();

  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showSources, setShowSources] = useState<{ [idx: number]: boolean }>({});
  const chatEndRef = useRef<HTMLDivElement>(null);

  // Load session history on mount (per tab)
  useEffect(() => {
    const saved = sessionStorage.getItem('ask_chat');
    if (saved) {
      setMessages(JSON.parse(saved));
    }
  }, []);

  // Save session history whenever it changes (per tab)
  useEffect(() => {
    sessionStorage.setItem('ask_chat', JSON.stringify(messages));
    // Reset all sources visibility when any change (new question)
    setShowSources({});
  }, [messages]);

  // Auto-scroll to bottom when new messages appear
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  const handleAsk = async () => {
    const token = localStorage.getItem('token');
    if (!question.trim()) {
      setError('Please enter a question.');
      return;
    }

    setLoading(true);
    setError(null);

    // Add user message
    const newUserMessage: Message = { role: 'user', content: question };
    setMessages((prev) => [...prev, newUserMessage]);
    setQuestion('');

    try {
      const response = await axios.post(
        'http://localhost:8000/compliance/ask',
        { question },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      const newAnswer: string = response.data.answer;
      const newSources: any[] = response.data.sources || [];

      // Add assistant reply
      const newAssistantMessage: Message = {
        role: 'assistant',
        content: newAnswer,
        sources: newSources,
      };
      setMessages((prev) => [...prev, newAssistantMessage]);
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        role: 'assistant',
        content: '❌ Error retrieving answer',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const toggleSources = (idx: number) => {
    setShowSources((prev) => ({
      ...prev,
      [idx]: !prev[idx]
    }));
  };

  return (
    <div className="min-h-screen relative bg-gray-900 text-gray-100 flex flex-col">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.15),transparent_40%)]"></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Chat Container */}
      <div className="relative z-10 flex-1 flex flex-col max-w-3xl mx-auto w-full p-6">
        <div className="flex-1 overflow-y-auto space-y-4 p-6 rounded-2xl 
          bg-slate-800/70 backdrop-blur-md shadow-inner border border-slate-700/60 
          scrollbar-thin scrollbar-thumb-purple-600 scrollbar-track-gray-900">
          {messages.map((msg, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-xl max-w-[80%] animate-fadeIn transition-shadow duration-300 ${
                msg.role === 'user'
                  ? 'ml-auto bg-gradient-to-br from-purple-700 to-purple-500 text-purple-100 shadow-lg'
                  : 'mr-auto bg-gradient-to-br from-slate-700 to-slate-600 text-gray-100 shadow-md'
              }`}
              style={{ wordBreak: 'break-word', whiteSpace: 'pre-wrap' }}
            >
              <p>{msg.content}</p>

              {/* Toggle sources button for assistant messages with sources */}
              {msg.role === 'assistant' && msg.sources && msg.sources.length > 0 && (
                <div className="mt-3">
                  <button
                    className="text-xs px-3 py-1 rounded bg-purple-700/40 hover:bg-purple-600 shadow-inner transition"
                    onClick={() => toggleSources(idx)}
                  >
                    {showSources[idx] ? 'Hide Sources' : 'Show Sources'}
                  </button>
                  {showSources[idx] && (
                    <ul className="text-xs text-gray-400 list-disc ml-4 mt-1 space-y-1 max-w-xs truncate">
                      {msg.sources.map((s, i) => (
                        <li key={i}>{s.title || JSON.stringify(s)}</li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <p className="text-gray-400 text-sm flex items-center gap-2 animate-pulse">
              <svg
                className="w-4 h-4 animate-spin text-purple-500"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <circle cx="12" cy="12" r="10" strokeDasharray="31.4" strokeDashoffset="0" />
              </svg>
              🤖 Thinking...
            </p>
          )}
          <div ref={chatEndRef} />
        </div>

        {/* Input */}
        <div className="mt-4 flex space-x-3">
          <textarea
            className="flex-1 border border-purple-600 bg-gray-900/80 text-gray-100 rounded-lg px-4 py-3 resize-none 
              focus:outline-none focus:ring-2 focus:ring-purple-600 placeholder-purple-500 transition"
            rows={3}
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          />
          <button
            onClick={handleAsk}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 to-purple-600 hover:brightness-110 active:scale-95 
              disabled:opacity-50 disabled:cursor-not-allowed rounded-lg px-6 py-3 text-white font-semibold shadow-lg transition"
          >
            {loading ? '...' : 'Ask'}
          </button>
        </div>

        {error && <p className="text-red-500 mt-2">{error}</p>}
      </div>
    </div>
  );
}
