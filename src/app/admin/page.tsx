'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import Navbar from '@/components/navbar';

// ✅ Use env variable instead of localhost
const API_BASE_URL = process.env.NEXT_PUBLIC_CORE_DRAFT_BACKEND;

interface DecodedToken {
  role?: string;
  exp?: number;
}

interface User {
  id: number;
  email: string;
  role: string;
  blocked: boolean;
}

export default function AdminDashboard() {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRole, setUserRole] = useState<string | null>(null);

  // Decode token and check expiration
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
      setUserRole(decoded.role || null);
    } catch {
      localStorage.removeItem('token');
      router.push('/login');
    }
  }, [router]);

  // Fetch users
  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`${API_BASE_URL}/admin/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error('Failed to fetch users');
      const data: User[] = await res.json();
      setUsers(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (userRole === 'admin') fetchUsers();
  }, [userRole]);

  // Block/unblock user
  const handleBlockToggle = async (id: number, block: boolean) => {
    const user = users.find((u) => u.id === id);
    if (!user) return;

    if (user.role === 'admin') {
      alert("❌ Cannot block an admin user");
      return;
    }

    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/admin/users/${id}/block?block=${block}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // Change role
  const handleChangeRole = async (id: number, role: string) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/admin/users/${id}/role?role=${role}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchUsers();
  };

  // Reset password
  const handleResetPassword = async (id: number) => {
    const token = localStorage.getItem('token');
    await fetch(`${API_BASE_URL}/admin/users/${id}/reset-password`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
    });
    alert('Temporary password has been set.');
  };

  // RAG actions
  const handleResetRAG = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/compliance/rag/reset`, {
      method: 'DELETE',
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) alert('All RAG collections deleted.');
  };

  const handleRAGStatus = async () => {
    const token = localStorage.getItem('token');
    const res = await fetch(`${API_BASE_URL}/compliance/rag/status`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (res.ok) {
      const data = await res.json();
      console.log('RAG Status:', data);
      alert(JSON.stringify(data, null, 2));
    }
  };

  if (loading) return <p className="text-white p-4">Loading...</p>;
  if (userRole !== 'admin') return <p className="text-red-500 p-4">❌ Admins only</p>;

  return (
    <>
      <Navbar />
      <div className="p-6 text-gray-100 bg-gray-900 min-h-screen">
        <h1 className="text-2xl font-bold mb-4">👑 Admin Dashboard</h1>

        {/* RAG Buttons */}
        <div className="mb-4 space-x-2">
          <button
            onClick={handleResetRAG}
            className="px-4 py-2 bg-red-600 rounded hover:bg-red-700"
          >
            Reset RAG Data
          </button>
          <button
            onClick={handleRAGStatus}
            className="px-4 py-2 bg-blue-600 rounded hover:bg-blue-700"
          >
            Show RAG Status
          </button>
        </div>

        <table className="w-full border border-gray-700 rounded-lg">
          <thead>
            <tr className="bg-gray-800">
              <th className="p-3 text-left">Email</th>
              <th className="p-3 text-left">Role</th>
              <th className="p-3 text-left">Status</th>
              <th className="p-3 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-gray-700">
                <td className="p-3">{u.email}</td>
                <td className="p-3">{u.role}</td>
                <td className="p-3">{u.blocked ? '❌ Blocked' : '✅ Active'}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleBlockToggle(u.id, !u.blocked)}
                    className="px-3 py-1 bg-red-600 rounded hover:bg-red-700"
                  >
                    {u.blocked ? 'Unblock' : 'Block'}
                  </button>
                  <button
                    onClick={() => handleChangeRole(u.id, u.role === 'admin' ? 'user' : 'admin')}
                    className="px-3 py-1 bg-purple-600 rounded hover:bg-purple-700"
                  >
                    {u.role === 'admin' ? 'Demote' : 'Promote'}
                  </button>
                  <button
                    onClick={() => handleResetPassword(u.id)}
                    className="px-3 py-1 bg-blue-600 rounded hover:bg-blue-700"
                  >
                    Reset PW
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
