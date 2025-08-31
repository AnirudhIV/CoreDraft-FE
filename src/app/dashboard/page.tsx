'use client';
import Link from 'next/link';
import { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';
import {
  MessageSquare,
  FileText,
  FilePlus,
  Edit3,
  Shield, // admin icon
} from 'lucide-react';

interface DecodedToken {
  sub?: string;
  username?: string;
  exp?: number;
  role?: string; // 👈 make sure your JWT includes this (user/admin)
}

const baseActions = [
  {
    title: 'Ask a Question',
    description: 'Query your documents and get instant answers.',
    icon: MessageSquare,
    href: '/ask',
  },
  {
    title: 'Summarize Document',
    description: 'Generate concise summaries from lengthy docs.',
    icon: FileText,
    href: '/summarize',
  },
  {
    title: 'Generate Compliance Doc',
    description: 'Create compliance-ready documents with AI.',
    icon: FilePlus,
    href: '/generate',
  },
  {
    title: 'Manage Documents',
    description: 'Edit and Delete your stored compliance docs.',
    icon: Edit3,
    href: '/edit_documents',
  },
];

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [loading, setLoading] = useState(true);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      if (decoded.exp && decoded.exp * 1000 < Date.now()) {
        localStorage.removeItem('token');
        router.push('/');
        return;
      }
      setUser(decoded);
    } catch {
      localStorage.removeItem('token');
      router.push('/');
    } finally {
      setLoading(false);
    }
  }, [router]);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  if (loading) return <div className="p-4 text-center text-gray-400">Loading dashboard...</div>;
  if (!user) return null;

  // 👇 Dynamically add Admin Panel card if user is admin
  const actions = [...baseActions];
  if (user.role === 'admin') {
    actions.push({
      title: 'Admin Panel',
      description: 'Manage users, roles, and security.',
      icon: Shield,
      href: '/admin',
    });
  }

  return (
    <div className="relative min-h-screen flex flex-col text-white overflow-hidden bg-gray-900">
      {/* Background pattern */}
      <div className="absolute inset-0 z-0">
        <div
          className="w-full h-full bg-[radial-gradient(circle_at_20%_30%,rgba(255,0,255,0.15),transparent_40%),radial-gradient(circle_at_80%_70%,rgba(0,255,255,0.15),transparent_40%)]"
          style={{ backgroundSize: 'cover' }}
        ></div>
      </div>

      {/* Top Navbar */}
      <div className="relative z-10 w-full backdrop-blur-xl bg-slate-900/70 border-b border-slate-700 px-8 py-4 flex justify-between items-center top-0">
        <Link href="/">
  <h1 className="text-2xl font-extrabold tracking-tight bg-gradient-to-r from-pink-400 to-purple-500 bg-clip-text text-transparent cursor-pointer">
    Compliance Copilot
  </h1>
      </Link>

        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setDropdownOpen((prev) => !prev)}
            className="flex items-center gap-3 bg-slate-800 border border-slate-700 rounded-full px-5 py-2 shadow hover:bg-slate-700 transition-all"
          >
            <span className="font-medium">{user.username || user.sub}</span>
            <svg
              className={`w-4 h-4 text-gray-400 transform transition-transform ${
                dropdownOpen ? 'rotate-180' : 'rotate-0'
              }`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-44 bg-slate-800 border border-slate-700 rounded-lg shadow-lg overflow-hidden">
              <button
                onClick={handleLogout}
                className="w-full text-left px-5 py-2 text-sm text-gray-200 hover:bg-slate-700"
              >
                Logout
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="relative z-10 p-10 flex-1 max-w-7xl mx-auto w-full">
        <p className="text-slate-300 mb-10 text-lg">
          Welcome back, <span className="font-semibold text-white">{user.username || user.sub}</span>.  
          What would you like to do today?
        </p>

        <div className="grid gap-8 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {actions.map((action) => {
            const Icon = action.icon;
            return (
              <div
                key={action.title}
                className="bg-slate-800/70 border border-slate-700 rounded-2xl shadow-xl hover:shadow-pink-400/30 hover:border-pink-300/50 transition-all p-6 flex flex-col justify-between group backdrop-blur-xl"
              >
                <div className="flex items-center mb-5">
                  <div className="bg-gradient-to-br from-pink-400 to-purple-500 text-white p-4 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h2 className="ml-5 text-lg font-semibold text-white">{action.title}</h2>
                </div>
                <p className="text-slate-400 text-sm flex-1">{action.description}</p>
                <button
                  onClick={() => router.push(action.href)}
                  className="bg-purple-600 hover:bg-purple-700 active:scale-95 text-white mt-6 px-5 py-2 rounded-xl shadow-md transition-all duration-200"
                >
                  Open
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
