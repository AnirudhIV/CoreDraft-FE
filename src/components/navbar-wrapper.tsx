'use client';

import { usePathname } from 'next/navigation';
import Navbar from './navbar';

export default function NavbarWrapper() {
  const pathname = usePathname();
  if (pathname === '/dashboard') return null; // hide on dashboard
  return <Navbar />;
}
