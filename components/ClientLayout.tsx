'use client';

import ThemeSync from './ThemeSync';
import DynamicFavicon from './DynamicFavicon';
import Footer from './layout/Footer';
import { Toaster } from 'react-hot-toast';

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <ThemeSync />
      <DynamicFavicon />
      <Toaster position="top-right" toastOptions={{ duration: 3000 }} />
      {children}
      <Footer />
    </>
  );
}
