'use client';
import { useAuth } from '@/components/useauth';
import Navbar from '@/components/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';
const [filterTag, setFilterTag] = useState('');
const [filterType, setFilterType] = useState('');

export default function DocumentsPage() {
  useAuth();
  const [documents, setDocuments] = useState([]);
  const fetchFilteredDocs = async () => {
  const token = localStorage.getItem('token');
  const res = await axios.get(`http://localhost:8000/compliance/filter`, {
    params: {
      tag: filterTag || undefined,
      type: filterType || undefined,
    },
    headers: { Authorization: `Bearer ${token}` },
  });
  setDocuments(res.data);
};


  const fetchDocs = async () => {
    const token = localStorage.getItem('token');
    const res = await axios.get('http://localhost:8000/compliance/documents', {
      headers: { Authorization: `Bearer ${token}` },
    });
    setDocuments(res.data);
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    await axios.delete(`http://localhost:8000/compliance/documents/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchDocs();
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6">
        <h2 className="text-xl font-semibold mb-4">Manage Documents</h2>
        {documents.map((doc: any) => (
          <div key={doc.id} className="border p-4 rounded shadow mb-4">
            <p><strong>{doc.title}</strong> (Status: {doc.status})</p>
            <p>Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
            <button
              onClick={() => handleDelete(doc.id)}
              className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
            >
                <div className="flex gap-2 mb-4">
            <input placeholder="Filter by tag" className="border p-1" onChange={e => setFilterTag(e.target.value)} />
            <input placeholder="Filter by type" className="border p-1" onChange={e => setFilterType(e.target.value)} />
            <button
                onClick={fetchFilteredDocs}
                    className="bg-gray-700 text-white px-2 py-1 rounded"
                    >Apply</button>
                    </div>

              Delete
            </button>
          </div>
        ))}
      </div>
    </>
  );
}
