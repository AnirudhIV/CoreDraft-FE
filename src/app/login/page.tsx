'use client';
import { useState, ChangeEvent } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async () => {
    setLoading(true);
    try {
      const response = await axios.post('http://localhost:8000/auth/login', { email, password });
      localStorage.setItem('token', response.data.access_token);
      router.push('/');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          alert(`Login failed: ${error.response.data.detail || 'Unknown error'}`);
        } else if (error.request) {
          alert('Login failed: No response from server');
        } else {
          alert('Login failed: ' + error.message);
        }
      } else {
        alert('Login failed: Unknown error occurred');
      }
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onEmailChange = (e: ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
  };

  const onPasswordChange = (e: ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative bg-gray-900 overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.15),transparent_40%)]"
          style={{ backgroundSize: 'cover' }}
        ></div>
      </div>

      {/* Card */}
      <div className="relative z-10 bg-slate-900/80 backdrop-blur-xl border border-slate-700 shadow-2xl rounded-2xl p-10 max-w-md w-full">
        <h2 className="text-3xl font-extrabold text-center mb-6 bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent">
          Welcome Back
        </h2>

        <div className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={onEmailChange}
            className="bg-slate-800/70 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={onPasswordChange}
            className="bg-slate-800/70 border border-slate-700 rounded-lg p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500 transition"
          />
          <button
            onClick={handleLogin}
            disabled={loading}
            className="bg-purple-600 text-white px-4 py-3 rounded-xl shadow-md hover:bg-purple-700 active:scale-95 hover:shadow-purple-500/30 transition transform duration-200 disabled:opacity-50"
          >
            {loading ? 'Logging in...' : 'Login'}
          </button>
        </div>

        <p className="mt-6 text-center text-gray-400 text-sm">
          Don’t have an account?{' '}
          <span
            className="text-purple-400 cursor-pointer hover:underline hover:text-purple-300 transition"
            onClick={() => router.push('/register')}
          >
            Register here
          </span>
        </p>
      </div>
    </div>
  );
}
