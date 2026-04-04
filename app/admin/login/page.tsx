'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { useAdminStore } from '../../../store/useAdminStore';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthStore();
  const { admins } = useAdminStore();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    setTimeout(() => {
      // Find admin in the store
      const foundAdmin = admins.find(a => a.email === email);

      if (foundAdmin && (password === 'admin123')) {
        setUser({
          id: foundAdmin.id,
          name: foundAdmin.name,
          email: foundAdmin.email,
          role: 'admin',
          phone: foundAdmin.phone,
          joinedDate: foundAdmin.joinedDate,
          permissions: foundAdmin.permissions,
        });
        router.push('/admin');
      } else {
        setError('Invalid email or password');
      }
      setLoading(false);
    }, 800);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2.5 mb-3">
            <div className="w-10 h-10 bg-gray-900 rounded-xl flex items-center justify-center text-white font-black text-sm">K</div>
          </div>
          <h1 className="text-xl font-black text-gray-900 tracking-tight">
            KVT <span className="text-gray-400 font-normal">Admin</span>
          </h1>
          <p className="text-gray-400 text-xs mt-1">Sign in to manage your store</p>
        </div>

        {/* Login Card */}
        <div className="bg-white border border-gray-200 rounded-2xl p-7 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin123@gmail.com"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 transition-all"
                required
              />
            </div>

            <div>
              <label className="block text-[11px] font-bold text-gray-500 uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-gray-50 border border-gray-200 text-gray-900 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-gray-900 focus:border-transparent placeholder:text-gray-400 transition-all"
                required
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-600 text-sm font-medium py-2.5 px-4 rounded-lg">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded-lg transition-all duration-200 text-sm disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </button>
          </form>

          <div className="mt-5 pt-4 border-t border-gray-100 text-center">
            <p className="text-gray-400 text-[11px]">
              Default: <span className="text-gray-600 font-medium">admin123@gmail.com</span> / <span className="text-gray-600 font-medium">admin123</span>
            </p>
          </div>
        </div>

        <p className="text-center text-[11px] text-gray-400 mt-6">
          ← <a href="/" className="hover:text-gray-900 font-medium transition-colors">Back to store</a>
        </p>
      </div>
    </div>
  );
}
