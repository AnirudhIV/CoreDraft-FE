'use client';

import { useEffect, useState } from 'react';
import Navbar from '@/components/navbar'; // <-- Import Navbar

const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_DRAFT_BACKEND;

interface Document {
  id: number;
  title: string;
}

export default function SummarizePage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<Document | null>(null);
  const [summary, setSummary] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const token =
    typeof window !== 'undefined' ? localStorage.getItem('token') : null;

  // Fetch documents
  useEffect(() => {
    async function fetchDocs() {
      try {
        const res = await fetch(`${API_BASE_URL}/compliance/documents`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!res.ok) throw new Error('Failed to fetch documents');

        const data = await res.json();
        setDocuments(data);
      } catch (err) {
        console.error(err);
        setError('Could not load documents.');
      }
    }

    if (token) {
      fetchDocs();
    } else {
      setError('No authentication token found. Please log in again.');
    }
  }, [token]);

  // Call summarize API
  async function handleSummarize() {
    if (!selectedDoc) {
      setError('Please select a document first.');
      return;
    }

    setLoading(true);
    setError(null);
    setSummary('');

    try {
      const res = await fetch(
        `${API_BASE_URL}/compliance/ai/summarize`,
        {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ doc_id: selectedDoc.id }),
        }
      );

      if (!res.ok) throw new Error('Failed to summarize document');

      const data = await res.json();
      setSummary(data.summary || 'No summary returned.');
    } catch (err) {
      console.error(err);
      setError('Failed to generate summary.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen relative bg-gray-900 text-gray-100">
      {/* Gradient background */}
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
      <div className="relative z-10 max-w-3xl mx-auto mt-12 p-6 rounded-2xl 
                      bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 
                      shadow-xl hover:shadow-pink-400/20 transition">
        <h1 className="text-3xl font-bold mb-6 text-transparent bg-clip-text 
                       bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 
                       text-center">
          Summarize Document
        </h1>

        {/* Document dropdown */}
        <div className="mb-6">
          <label className="block mb-2 font-semibold text-gray-300">
            Select Document
          </label>
          <div className="relative">
            <select
              className="appearance-none border border-gray-600 bg-gray-900/80 backdrop-blur-sm 
                         text-gray-100 rounded-xl p-3 w-full pr-10
                         focus:outline-none focus:ring-2 focus:ring-pink-500 
                         hover:border-pink-400/60 shadow-md transition
                         [&>option]:bg-gray-800 [&>option]:text-gray-100 [&>option]:px-3 [&>option]:py-2"
              value={selectedDoc?.id || ''}
              onChange={(e) => {
                const doc = documents.find((d) => d.id === Number(e.target.value));
                setSelectedDoc(doc || null);
              }}
            >
              <option value="" disabled>
                -- Select a document --
              </option>
              {documents.map((doc) => (
                <option key={doc.id} value={doc.id}>
                  {doc.title || `Document ${doc.id}`}
                </option>
              ))}
            </select>

            {/* Custom dropdown arrow */}
            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center">
              <svg
                className="h-5 w-5 text-pink-400"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M5.23 7.21a.75.75 0 011.06.02L10 11.292l3.71-4.06a.75.75 0 111.08 1.04l-4.25 4.65a.75.75 0 01-1.08 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Summarize button */}
        <button
          onClick={handleSummarize}
          disabled={loading}
          className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 
                     text-white font-medium px-6 py-3 rounded-xl shadow-md 
                     hover:brightness-110 transition-all disabled:opacity-50"
        >
          {loading ? 'Summarizing...' : 'Summarize'}
        </button>

        {/* Error */}
        {error && <p className="text-red-500 mt-4">{error}</p>}

        {/* Summary */}
        {summary && (
          <div className="mt-6 p-5 border border-gray-700/60 rounded-lg 
                          bg-gray-900/70 backdrop-blur-md shadow-inner">
            <h2 className="text-xl font-semibold mb-3 text-pink-400">
              Summary for {selectedDoc?.title || 'Document'}
            </h2>
            <p className="text-gray-200 leading-relaxed">{summary}</p>
          </div>
        )}
      </div>
    </div>
  );
}