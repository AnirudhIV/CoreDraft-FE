'use client';

import { useState } from 'react';
import axios from 'axios';
import Navbar from '@/components/navbar';
import { useAuth } from '@/components/useauth';

export default function GeneratePage() {
  useAuth();

  const [prompt, setPrompt] = useState('');
  const [type, setType] = useState('');
  const [response, setResponse] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    setResponse(null);

    try {
      const res = await axios.post(
        'http://localhost:8000/compliance/generate',
        { prompt, type },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setResponse(res.data);
    } catch (err: any) {
      setResponse({ error: '❌ Error generating document' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative bg-gray-900 text-white flex flex-col">
      {/* Gradient background (same as other pages) */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.15),transparent_40%)]"
        ></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Glassy card */}
      <div className="relative z-10 flex-1 flex justify-center items-start px-6 py-10">
        <div className="w-full max-w-3xl bg-slate-800/50 border border-slate-700/50 
                        rounded-2xl shadow-xl backdrop-blur-lg p-8 
                        hover:shadow-pink-400/20 transition">
          
          {/* Heading */}
          <h2 className="text-2xl font-bold mb-6 text-center 
                         bg-gradient-to-r from-pink-400 via-fuchsia-400 to-purple-400 
                         bg-clip-text text-transparent">
            Generate Compliance Document
          </h2>

          {/* Prompt textarea */}
          <textarea
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg 
                       p-4 mb-5 resize-none shadow-sm backdrop-blur-sm
                       focus:outline-none focus:ring-2 focus:ring-pink-500 
                       text-gray-200 placeholder-gray-400"
            rows={5}
            placeholder="Enter a prompt (e.g., Generate a privacy policy for a fintech startup in India)"
            onChange={e => setPrompt(e.target.value)}
            value={prompt}
          />

          {/* Type input */}
          <input
            className="w-full bg-slate-900/60 border border-slate-700/60 rounded-lg 
                       p-4 mb-5 shadow-sm backdrop-blur-sm
                       focus:outline-none focus:ring-2 focus:ring-pink-500 
                       text-gray-200 placeholder-gray-400"
            placeholder="Document Type (e.g., Privacy Policy)"
            onChange={e => setType(e.target.value)}
            value={type}
          />

          {/* Generate button */}
          <button
            onClick={handleGenerate}
            disabled={loading}
            className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 
                       text-white font-medium px-6 py-3 rounded-xl shadow-md 
                       hover:brightness-110 transition-all disabled:opacity-50"
          >
            {loading ? 'Generating...' : 'Generate'}
          </button>

          {/* Response display */}
          {response && (
            <div className="mt-6 p-5 bg-slate-900/70 border border-slate-700/60 
                            rounded-lg shadow-inner backdrop-blur-md">
              {response.error ? (
                <p className="text-red-400">{response.error}</p>
              ) : (
                <>
                  <h3 className="text-lg font-semibold text-pink-300">
                    ✅ Document Generated{' '}
                    {response.saved ? `(ID: ${response.document_id})` : '(Not Saved)'}
                  </h3>

                  {/* Title */}
                  <p className="mt-3 text-xl font-bold text-white">
                    {response.document?.title}
                  </p>

                  {/* Tags */}
                  {response.document?.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-2">
                      {response.document.tags.map((tag: string, idx: number) => (
                        <span
                          key={idx}
                          className="px-2 py-1 text-xs bg-pink-600/30 border border-pink-500 rounded-lg text-pink-200"
                        >
                          #{tag}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Content */}
                  <p className="mt-4 whitespace-pre-wrap text-gray-200 leading-relaxed">
                    {response.document?.content}
                  </p>
                </>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
