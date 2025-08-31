'use client';

import { useState } from 'react';
import axios from 'axios';

export default function TagsPage() {
  const [content, setContent] = useState('');
  const [tags, setTags] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSuggestTags = async () => {
    if (!content.trim()) {
      setError('Please enter some content.');
      return;
    }

    setLoading(true);
    setError('');
    setTags([]);

    try {
      const token = localStorage.getItem('token');

      const response = await axios.post(
        'http://localhost:8000/compliance/ai/suggest-tags',
        { content },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTags(response.data.tags || []);
    } catch (err) {
      console.error('Error suggesting tags:', err);
      setError('Failed to fetch suggested tags.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">AI Tag Suggestion</h1>

      <textarea
        className="w-full p-3 border rounded mb-4 h-40"
        placeholder="Paste your document content here..."
        value={content}
        onChange={(e) => setContent(e.target.value)}
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        onClick={handleSuggestTags}
        disabled={loading}
      >
        {loading ? 'Generating...' : 'Suggest Tags'}
      </button>

      {error && <p className="text-red-500 mt-3">{error}</p>}

      {tags.length > 0 && (
        <div className="mt-6">
          <h2 className="text-xl font-semibold mb-2">Suggested Tags:</h2>
          <div className="flex flex-wrap gap-2">
            {tags.map((tag, index) => (
              <span
                key={index}
                className="bg-gray-200 px-3 py-1 rounded-full text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
