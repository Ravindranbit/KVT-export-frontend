'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

export default function SignIn() {
  const router = useRouter();
  const { setUser } = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [emailError, setEmailError] = useState('');

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

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (emailError) {
      return;
    }
    
    // Simulate Buyer Logic
    setUser({
      id: 'u1',
      name: email.split('@')[0],
      email: email,
      role: 'buyer'
    });
    
    router.push('/');
  };

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
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="Enter your password"
                required
              />
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-xs text-gray-600">Remember me</span>
              </label>
              <a href="#" className="text-xs text-red-600 hover:text-red-700">
                Forgot password?
              </a>
            </div>

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition text-sm disabled:cursor-not-allowed"
              disabled={!!emailError || !email || !password}
            >
              Sign In
            </button>
          </form>

          <div className="mt-3.5 text-center">
            <p className="text-gray-600 text-sm">
              Don't have an account?{' '}
              <Link href="/signup" className="text-red-600 hover:text-red-700 font-semibold">
                Sign Up
              </Link>
            </p>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-2 text-xs">Or sign in with</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 text-gray-900 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 text-gray-900 text-sm">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
