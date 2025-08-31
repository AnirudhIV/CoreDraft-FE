'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub?: string;
  username?: string;
  exp?: number;
}

export default function Navbar() {
  const router = useRouter();
  const pathname = usePathname();
  const [user, setUser] = useState<DecodedToken | null>(null);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    const checkToken = () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setUser(null);
        return;
      }
      try {
        const decoded: DecodedToken = jwtDecode(token);
        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          localStorage.removeItem('token');
          setUser(null);
          return;
        }
        setUser(decoded);
      } catch {
        console.error('Invalid token');
        localStorage.removeItem('token');
        setUser(null);
      }
    };

    checkToken();

    // Listen for localStorage changes (login/logout in other tabs)
    window.addEventListener('storage', checkToken);
    return () => {
      window.removeEventListener('storage', checkToken);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    router.push('/');
  };

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/ask', label: 'Ask AI' },
    { href: '/summarize', label: 'Summarize' },
    { href: '/generate', label: 'Generate Doc' },
    { href: '/edit_documents', label: 'Manage Documents' },
  ];

  return (
    <nav className="w-full bg-gray-50 dark:bg-slate-900 shadow-sm px-6 py-3 flex justify-between items-center border-b border-gray-200 dark:border-slate-700">
      {/* Logo with gradient wrapped in Link */}
      <Link
        href="/"
        className="font-extrabold text-2xl tracking-wide bg-gradient-to-r from-pink-400 to-purple-500 text-transparent bg-clip-text"
      >
        CoreDraft
      </Link>

      {/* Navigation Links */}
      <div className="flex items-center space-x-6 font-medium">
        {navLinks.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`transition-colors duration-200 ${
              pathname === href ? 'text-purple-400 font-semibold underline' : 'text-purple-700 hover:text-purple-400'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>

      {/* User dropdown or Login/Register buttons */}
      {user ? (
        <div className="flex items-center gap-4 relative">
          <div className="relative">
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center gap-2 bg-gray-100 dark:bg-slate-800 border border-gray-300 dark:border-slate-600 rounded-full px-5 py-2 shadow-sm hover:shadow-md transition"
            >
              <span className="font-medium text-gray-700 dark:text-gray-200">
                {user.username || user.sub || 'Account'}
              </span>
              <svg
                className="w-4 h-4 text-gray-500 dark:text-gray-400"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {dropdownOpen && (
              <div
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-gray-200 dark:border-slate-700 z-50"
                onMouseEnter={() => setDropdownOpen(true)}
                onMouseLeave={() => setDropdownOpen(false)}
              >
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-200 hover:bg-gray-100 dark:hover:bg-slate-700 rounded-lg"
                >
                  Logout
                </button>
              </div>
            )}
          </div>
        </div>
      ) : (
        <div className="flex space-x-4">
          <button
            onClick={() => router.push('/login')}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            Login
          </button>
          <button
            onClick={() => router.push('/register')}
            className="px-4 py-2 rounded bg-purple-600 text-white hover:bg-purple-700"
          >
            Register
          </button>
        </div>
      )}
    </nav>
  );
}
