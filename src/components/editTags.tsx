// components/EditTags.tsx
'use client';
import { useState } from 'react';
import axios from 'axios';

export default function EditTags({ docId, existingTags }: { docId: number; existingTags: string[] }) {
  const [tags, setTags] = useState(existingTags.join(', '));
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);

  const saveTags = async () => {
    const token = localStorage.getItem('token');
    try {
      await axios.put(`http://localhost:8000/compliance/${docId}`, {
        tags: tags.split(',').map(t => t.trim())
      }, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMessage('✅ Tags updated');
    } catch {
      setMessage('❌ Failed to update tags');
    }
  };

  const suggestTags = async () => {
    setLoading(true);
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get(`http://localhost:8000/compliance/${docId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      const content = res.data.content;

      const tagRes = await axios.post(`http://localhost:8000/compliance/ai/suggest-tags`, { content }, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setTags(tagRes.data.tags.join(', '));
      setMessage('✨ Tags suggested by AI');
    } catch {
      setMessage('❌ Failed to suggest tags');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mb-6">
      <label className="block mb-1 font-medium">Tags (comma separated)</label>
      <input
        className="w-full border p-2"
        value={tags}
        onChange={e => setTags(e.target.value)}
      />
      <div className="flex gap-2 mt-2">
        <button onClick={saveTags} className="bg-blue-600 text-white px-3 py-1 rounded">Save Tags</button>
        <button onClick={suggestTags} disabled={loading} className="bg-green-600 text-white px-3 py-1 rounded">
          {loading ? 'Suggesting...' : 'Suggest Tags'}
        </button>
      </div>
      {message && <p className="mt-2 text-sm">{message}</p>}
    </div>
  );
}
