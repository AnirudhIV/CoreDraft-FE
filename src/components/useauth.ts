'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  sub: string;
  email: string;
  is_admin?: boolean;
  exp: number;
}

export function useAuth() {
  const router = useRouter();
  const [checked, setChecked] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    // Avoid SSR localStorage errors
    if (typeof window === 'undefined') return;

    const token = localStorage.getItem('token');
    console.log('[useAuth] Token in localStorage:', token);

    if (!token) {
      console.warn('[useAuth] No token found → redirecting to login.');
      router.replace('/');
      return;
    }

    try {
      const decoded: DecodedToken = jwtDecode(token);
      console.log('[useAuth] Decoded token:', decoded);

      // Check expiry
      if (decoded.exp * 1000 < Date.now()) {
        console.warn('[useAuth] Token expired → redirecting to login.');
        localStorage.removeItem('token');
        router.replace('/');
        return;
      }

      // Check admin role
      if (decoded.is_admin) {
        console.log('[useAuth] User is admin');
        setIsAdmin(true);
      } else {
        console.log('[useAuth] User is NOT admin');
      }

      setChecked(true);
    } catch (err) {
      console.error('[useAuth] Invalid token:', err);
      localStorage.removeItem('token');
      router.replace('/');
    }
  }, [router]);

  return { checked, isAdmin };
}
