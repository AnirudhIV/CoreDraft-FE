'use client';

import { useAuth } from '@/components/useauth';
import Navbar from '@/components/navbar';
import { useEffect, useState } from 'react';
import axios from 'axios';

// Define the document interface for type safety
interface Document {
  id: number;
  title: string;
  status: string;
  uploaded_at: string;
  // Add other properties if needed
}

export default function DocumentsPage() {
  useAuth();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [filterTag, setFilterTag] = useState('');
  const [filterType, setFilterType] = useState('');

  const fetchFilteredDocs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get<Document[]>(`http://localhost:8000/compliance/filter`, {
        params: {
          tag: filterTag || undefined,
          type: filterType || undefined,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (error) {
      console.error('Failed to fetch filtered documents', error);
    }
  };

  const fetchDocs = async () => {
    const token = localStorage.getItem('token');
    try {
      const res = await axios.get<Document[]>('http://localhost:8000/compliance/documents', {
        headers: { Authorization: `Bearer ${token}` },
      });
      setDocuments(res.data);
    } catch (error) {
      console.error('Failed to fetch documents', error);
    }
  };

  const handleDelete = async (id: number) => {
    const token = localStorage.getItem('token');
    try {
      await axios.delete(`http://localhost:8000/compliance/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchDocs();
    } catch (error) {
      console.error('Failed to delete document', error);
    }
  };

  useEffect(() => {
    fetchDocs();
  }, []);

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-4xl mx-auto">
        <h2 className="text-xl font-semibold mb-4">Manage Documents</h2>

        {/* Filter Inputs */}
        <div className="flex gap-4 mb-6">
          <input
            placeholder="Filter by tag"
            className="border p-2 rounded flex-grow"
            value={filterTag}
            onChange={e => setFilterTag(e.target.value)}
          />
          <input
            placeholder="Filter by type"
            className="border p-2 rounded flex-grow"
            value={filterType}
            onChange={e => setFilterType(e.target.value)}
          />
          <button
            onClick={fetchFilteredDocs}
            className="bg-gray-700 text-white px-4 py-2 rounded"
          >
            Apply
          </button>
        </div>

        {/* Documents List */}
        {documents.length === 0 ? (
          <p>No documents found.</p>
        ) : (
          documents.map((doc) => (
            <div key={doc.id} className="border p-4 rounded shadow mb-4">
              <p><strong>{doc.title}</strong> (Status: {doc.status})</p>
              <p>Uploaded: {new Date(doc.uploaded_at).toLocaleString()}</p>
              <button
                onClick={() => handleDelete(doc.id)}
                className="mt-2 px-3 py-1 bg-red-600 text-white rounded"
              >
                Delete
              </button>
            </div>
          ))
        )}
      </div>
    </>
  );
}
