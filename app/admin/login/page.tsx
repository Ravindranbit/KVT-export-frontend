'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useAdminAuthStore } from '../../../store/useAdminAuthStore';

export default function AdminLogin() {
  const router = useRouter();
  const { admin, login, hasHydrated } = useAdminAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (admin) {
      router.replace('/admin');
    }
  }, [hasHydrated, admin, router]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!email || !password) return;

    setIsSubmitting(true);
    try {
      const result = await login(email, password);
      if (result.forcePasswordChange) {
        toast('Password reset required. Update it in your profile.', { icon: '⚠️' });
      }
      router.replace('/admin');
    } catch (error: any) {
      const message = error?.message || 'Admin login failed. Please try again.';
      toast.error(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!hasHydrated) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Loading...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      <header className="border-b border-gray-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>
            KVT exports
          </Link>
          <Link href="/" className="text-sm font-semibold text-gray-600 hover:text-gray-900">
            Back to Store
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[420px] bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-2 text-center">Admin Sign In</h1>
          <p className="text-sm text-gray-500 text-center mb-6">Access the management console</p>

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Admin Email <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="admin@kvtexports.com"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="Enter password"
                required
              />
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition text-sm disabled:cursor-not-allowed disabled:opacity-70"
              disabled={isSubmitting || !email || !password}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
