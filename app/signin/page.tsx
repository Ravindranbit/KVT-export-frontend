'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';

export default function SignIn() {
  const router = useRouter();
  const { login, token, user, hasHydrated, getProfile } = useAuthStore();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [identifierError, setIdentifierError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;

    if (user) {
      router.push('/');
      return;
    }

    if (token && !user) {
      getProfile().catch(() => {
        // If profile lookup fails, user stays on login page and can retry.
      });
    }
  }, [hasHydrated, user, token, router, getProfile]);

  const validateIdentifier = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const phoneRegex = /^\+?[0-9]{10,15}$/;

    if (value && !emailRegex.test(value) && !phoneRegex.test(value)) {
      setIdentifierError('Enter a valid email or phone number');
    } else {
      setIdentifierError('');
    }
  };

  const handleIdentifierChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setIdentifier(value);
    validateIdentifier(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (identifierError) {
      return;
    }

    setIsSubmitting(true);

    try {
      await login(identifier, password);
      await getProfile();
      router.push('/');
    } catch (error: any) {
      const message = error?.message || 'Login failed. Please try again.';
      if (message.toLowerCase().includes('invalid')) {
        toast.error('Wrong password or user not found');
      } else {
        toast.error(message);
      }
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

  if (user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Redirecting...
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>
        </div>
      </header>

      {/* Sign In Form - Centered container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-5 text-center">Sign In</h1>
          
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="identifier" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email or Phone <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="identifier"
                value={identifier}
                onChange={handleIdentifierChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${
                  identifierError ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                }`}
                placeholder="Enter email or phone"
                required
              />
              {identifierError && <p className="text-red-500 text-xs mt-1">{identifierError}</p>}
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
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition text-sm disabled:cursor-not-allowed disabled:opacity-70"
              disabled={!!identifierError || !identifier || !password || isSubmitting}
            >
              {isSubmitting ? 'Signing In...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-3.5 text-center">
            <p className="text-gray-600 text-sm">
              Don&apos;t have an account?{' '}
              <Link href="/signup" className="text-red-600 hover:text-red-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
