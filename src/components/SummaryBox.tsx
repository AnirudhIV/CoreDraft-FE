// components/SummaryBox.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function SummaryBox({ content }: { content: string }) {
  const [summary, setSummary] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSummarize = async () => {
    const token = localStorage.getItem('token');
    setLoading(true);
    try {
      const res = await axios.post('http://localhost:8000/compliance/ai/summarize', {
        content
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSummary(res.data.summary);
    } catch {
      setSummary('❌ Failed to summarize');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="my-6">
      <button onClick={handleSummarize} disabled={loading} className="bg-purple-700 text-white px-4 py-2 rounded">
        {loading ? 'Summarizing...' : 'Summarize Document'}
      </button>

      {summary && (
        <div className="mt-4 bg-gray-100 p-4 rounded">
          <h4 className="font-semibold">AI Summary:</h4>
          <p className="mt-2">{summary}</p>
        </div>
      )}
    </div>
  );
}
