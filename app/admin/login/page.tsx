'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { apiPost, ApiError } from '../../../lib/api';

export default function AdminLogin() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setEmailError('Please enter a valid email address');
    } else {
      setEmailError('');
    }
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setEmail(value);
    validateEmail(value);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await apiPost<{
        success: boolean;
        data: {
          token: string;
          forcePasswordChange: boolean;
          admin: {
            id: string;
            name: string;
            email: string;
            phone?: string;
            role?: string;
            createdAt?: string;
            permissions?: {
              dashboard: boolean;
              products: boolean;
              orders: boolean;
              users: boolean;
              vendors: boolean;
              categories: boolean;
              banners: boolean;
              settings: boolean;
              profile: boolean;
            };
          };
        };
      }>('/auth/admin/login', {
        email,
        password,
      }, { auth: 'none' });

      const { token, admin } = response.data;
      localStorage.setItem('adminToken', token);
      localStorage.removeItem('userToken');

      setUser({
        id: admin.id,
        name: admin.name,
        email: admin.email,
        role: 'admin',
        phone: admin.phone,
        joinedDate: admin.createdAt,
        permissions: admin.permissions,
      });

      router.push('/admin');
    } catch (err) {
      setError(err instanceof ApiError ? err.message : 'Admin login failed');
      console.error('Admin login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>
            KVT exports
          </Link>
        </div>
      </header>

      {/* Admin Login Form - Centered container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-6">
          <div className="mb-6 text-center">
            <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-lg mb-3">
              <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-1">Admin Login</h1>
            <p className="text-sm text-gray-600">Access the admin dashboard</p>
          </div>

          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={handleEmailChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${
                  emailError ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                }`}
                placeholder="Enter your email"
                required
                disabled={loading}
              />
              {emailError && <p className="text-red-500 text-xs mt-1">{emailError}</p>}
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
                autoComplete="current-password"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="Enter your password"
                required
                disabled={loading}
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" disabled={loading} />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-xs text-red-600 hover:text-red-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition text-sm disabled:cursor-not-allowed disabled:bg-red-400"
              disabled={!!emailError || !email || !password || loading}
            >
              {loading ? 'Signing In...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
