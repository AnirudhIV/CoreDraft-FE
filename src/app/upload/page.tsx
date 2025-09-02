'use client';
import { useState } from 'react';
import axios from 'axios';

export default function UploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState('');

  const handleUpload = async () => {
    if (!file) return;

    const token = localStorage.getItem('token');
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post(
        'http://localhost:8000/compliance/upload',
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMessage(`✅ ${response.data.message}`);
    } catch  {
      setMessage('❌ Upload failed');
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen space-y-4">
      <h2 className="text-xl font-semibold">Upload Compliance Document</h2>

      {/* Custom Choose File Button */}
      <label className="bg-gray-200 hover:bg-gray-300 text-gray-800 px-4 py-2 rounded cursor-pointer transition">
        Choose File
        <input
          type="file"
          onChange={e => setFile(e.target.files?.[0] || null)}
          className="hidden"
        />
      </label>

      {/* Show selected file name */}
      {file && <p className="text-sm text-gray-600">{file.name}</p>}

      {/* Upload Button */}
      <button
        onClick={handleUpload}
        className="bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white px-4 py-2 rounded transition"
      >
        Upload
      </button>

      <p className="mt-2">{message}</p>
    </div>
  );
}
