'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/navbar';
import { useAuth } from '@/components/useauth';
import EditTags from '@/components/editTags';
import SummaryBox from '@/components/SummaryBox';

// Define the type for your document data
interface DocumentData {
  id: string;
  title: string;
  type: string;
  tags: string[];
  content: string;
}

export default function DocumentDetailPage() {
  useAuth();
  const { id } = useParams();
  const [doc, setDoc] = useState<DocumentData | null>(null);

  useEffect(() => {
    const fetchDoc = async () => {
      const token = localStorage.getItem('token');
      try {
        if (!id) return;
        const res = await axios.get<DocumentData>(
          `http://localhost:8000/compliance/documents/${id}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setDoc(res.data);
      } catch (err) {
        console.error('Failed to fetch document:', err);
      }
    };
    fetchDoc();
  }, [id]);

  if (!doc) return <p className="p-6">Loading...</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 max-w-3xl mx-auto">
        <h2 className="text-2xl font-bold mb-2">{doc.title}</h2>
        <p className="text-gray-500 mb-4">Type: {doc.type}</p>

        <EditTags docId={doc.id} existingTags={doc.tags} />

        <SummaryBox content={doc.content} />

        <h3 className="font-semibold mt-6 mb-2">Full Content:</h3>
        <div className="bg-gray-100 p-4 rounded whitespace-pre-wrap">{doc.content}</div>
      </div>
    </>
  );
}
