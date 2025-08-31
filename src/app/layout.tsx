import './globals.css';
import type { Metadata } from 'next';
import NavbarWrapper from '@/components/navbar-wrapper';

export const metadata: Metadata = {
  title: 'Compliance Dashboard',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  let showNavbar = false;

  if (typeof window !== 'undefined') {
    // Only show navbar if token exists
    showNavbar = !!localStorage.getItem('token');
  }

  return (
    <html lang="en">
      <body>
        {showNavbar && <NavbarWrapper />}
        {children}
      </body>
    </html>
  );
}
