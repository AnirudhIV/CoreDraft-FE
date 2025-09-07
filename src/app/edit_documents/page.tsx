'use client';

import { useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/components/navbar';
const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_DRAFT_BACKEND;
interface DecodedToken {
  sub?: string;
  username?: string;
  role?: string;
  exp?: number;
}

interface Document {
  id: string;
  title: string;
  content?: string;
  is_default: boolean;
}

export default function EditDocumentsPage() {
  const router = useRouter();
  const [isAuth, setIsAuth] = useState(false);
  const [loading, setLoading] = useState(true);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [fetchingDocs, setFetchingDocs] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [editingDoc, setEditingDoc] = useState<Document | null>(null);
  const [editContent, setEditContent] = useState('');
  const [userRole, setUserRole] = useState<string | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/login');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }
      setIsAuth(true);
      setUserRole(decoded.role || null);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, [router]);

  const fetchDocuments = useCallback(async () => {
    if (!isAuth) return;
    setFetchingDocs(true);
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/compliance/documents`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Failed to fetch documents: ${res.status}`);
      const data: Document[] = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error('❌ Error fetching documents:', err);
    } finally {
      setFetchingDocs(false);
    }
  }, [isAuth]);

  useEffect(() => {
    fetchDocuments();
  }, [fetchDocuments]);

  const handleUpload = async () => {
    if (!file) return;
    setUploading(true);
    try {
      const token = localStorage.getItem('token');
      const formData = new FormData();
      formData.append('file', file);
      const res = await fetch(`${API_BASE_URL}/compliance/upload`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      if (!res.ok) throw new Error('Upload failed');
      await fetchDocuments();
      setFile(null);
    } catch (err) {
      console.error('❌ Error uploading file:', err);
    } finally {
      setUploading(false);
    }
  };

  const handleSetDefault = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/compliance/documents/${id}/set_default`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to set default document');
      setDocuments((prev) =>
        prev.map((doc) => ({ ...doc, is_default: doc.id === id }))
      );
    } catch (err) {
      console.error('❌ Error setting default document:', err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/compliance/documents/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to delete document');
      setDocuments((prev) => prev.filter((doc) => doc.id !== id));
    } catch (err) {
      console.error('❌ Error deleting document:', err);
    }
  };

  const handleEdit = async (id: string) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/compliance/documents/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch document');
      const data: Document = await res.json();
      setEditingDoc(data);
      setEditContent(data.content || '');
    } catch (err) {
      console.error('❌ Error fetching document for edit:', err);
    }
  };

  const handleSaveEdit = async () => {
    if (!editingDoc) return;
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(
        `${API_BASE_URL}/compliance/documents/${editingDoc.id}`,
        {
          method: 'PUT',
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: editContent }),
        }
      );
      if (!res.ok) throw new Error('Failed to update document');
      await fetchDocuments();
      setEditingDoc(null);
      setEditContent('');
    } catch (err) {
      console.error('❌ Error saving edit:', err);
    }
  };

  if (loading) return <div className="p-4 text-white">🔄 Checking authentication...</div>;
  if (!isAuth) return null;

  return (
    <div className="min-h-screen relative bg-gray-900 text-gray-100">
      {/* Gradient background */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.15),transparent_40)]"
        ></div>
      </div>

      {/* Navbar */}
      <div className="relative z-10">
        <Navbar />
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-4xl mx-auto mt-6 p-6">
        <h1 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
          Manage Documents
        </h1>
        <p className="text-center text-gray-400 mb-8">
          Note: The current maximum number of documents a user can upload for accurate answers is <span className="font-semibold text-pink-400">3</span>.
        </p>

        {/* Upload Section */}
        <div className="mb-8 bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-6 shadow-xl hover:shadow-pink-400/20 transition">
          <h2 className="font-semibold text-xl mb-4 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 bg-clip-text text-transparent">
            Upload Document
          </h2>
          <div className="flex items-center gap-4">
            <input
              type="file"
              onChange={(e) => setFile(e.target.files?.[0] || null)}
              className="border border-gray-600 bg-gray-900/60 backdrop-blur-sm text-gray-100 rounded-lg p-2 flex-1 focus:outline-none focus:ring-2 focus:ring-pink-500"
            />
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition-all disabled:opacity-50"
            >
              {uploading ? 'Uploading...' : 'Upload'}
            </button>
          </div>
        </div>

        {/* Documents List */}
        {fetchingDocs ? (
          <p className="text-center text-gray-400">🔄 Loading documents...</p>
        ) : documents.length === 0 ? (
          <p className="text-center text-gray-400">No documents found.</p>
        ) : (
          <ul className="space-y-4">
            {documents.map((doc) => (
              <li
                key={doc.id}
                className="flex justify-between items-center bg-gray-800/50 backdrop-blur-lg border border-gray-700/50 rounded-2xl p-4 shadow-sm hover:shadow-pink-400/10 transition"
              >
                <span className="font-medium">
                  {doc.title}{' '}
                  {doc.is_default && <span className="text-green-400 font-semibold">(Default)</span>}
                </span>
                <div className="flex gap-2">
                  {userRole === 'admin' && !doc.is_default && (
                    <button
                      className="bg-purple-600 hover:bg-purple-700 text-white px-3 py-1 rounded-lg transition"
                      onClick={() => handleSetDefault(doc.id)}
                    >
                      Set as Default
                    </button>
                  )}
                  <button
                    className="bg-gradient-to-r from-purple-500 to-purple-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition-all"
                    onClick={() => handleEdit(doc.id)}
                  >
                    Edit
                  </button>
                  <button
                    className="bg-gradient-to-r from-red-500 to-red-700 text-white font-medium px-6 py-3 rounded-xl shadow-md hover:brightness-110 transition-all"
                    onClick={() => handleDelete(doc.id)}
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Edit Modal */}
        {editingDoc && (
          <div className="fixed inset-0 flex items-center justify-center bg-black/70 z-50">
            <div className="bg-gray-900 p-6 rounded-2xl shadow-xl w-full max-w-2xl border border-gray-700">
              <h2 className="text-xl font-bold mb-4 text-pink-400">
                Editing: {editingDoc.title}
              </h2>
              <textarea
                value={editContent}
                onChange={(e) => setEditContent(e.target.value)}
                rows={12}
                className="w-full p-4 rounded-lg bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <div className="mt-4 flex justify-end gap-3">
                <button
                  onClick={() => setEditingDoc(null)}
                  className="px-4 py-2 rounded-lg bg-gray-700 hover:bg-gray-600 text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="px-4 py-2 rounded-lg bg-gradient-to-r from-pink-500 via-fuchsia-500 to-purple-600 text-white shadow hover:brightness-110"
                >
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}