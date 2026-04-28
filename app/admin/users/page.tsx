'use client';

import { useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import adminApi from '../../../src/lib/adminApi';

interface AdminRecord {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
  isActive: boolean;
  isTemporaryPassword: boolean;
  lastLogin?: string | null;
  createdAt: string;
}

const INITIAL_FORM = {
  name: '',
  email: '',
  role: 'ADMIN' as 'SUPER_ADMIN' | 'ADMIN',
  temporaryPassword: '',
};

export default function AdminUsers() {
  const [admins, setAdmins] = useState<AdminRecord[]>([]);
  const [search, setSearch] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [form, setForm] = useState(INITIAL_FORM);

  const loadAdmins = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response: any = await adminApi.get('/admin/all');
      const records = Array.isArray(response?.data) ? response.data : [];
      setAdmins(records.map((admin: any) => ({
        id: String(admin.id),
        name: admin.name,
        email: admin.email,
        role: admin.role,
        isActive: Boolean(admin.isActive),
        isTemporaryPassword: Boolean(admin.isTemporaryPassword),
        lastLogin: admin.lastLogin || null,
        createdAt: admin.createdAt,
      })));
    } catch (err: any) {
      setAdmins([]);
      setError(err?.message || 'Unable to load admin accounts');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const filteredAdmins = useMemo(() => {
    const query = search.toLowerCase();
    return admins.filter((admin) =>
      admin.name.toLowerCase().includes(query) ||
      admin.email.toLowerCase().includes(query) ||
      admin.role.toLowerCase().includes(query)
    );
  }, [admins, search]);

  const handleCreateAdmin = async () => {
    if (!form.name || !form.email || !form.temporaryPassword) {
      toast.error('Fill in all required fields');
      return;
    }

    setIsSubmitting(true);
    try {
      await adminApi.post('/admin/create', form);
      toast.success('Admin created');
      setForm(INITIAL_FORM);
      setShowCreateModal(false);
      await loadAdmins();
    } catch (err: any) {
      toast.error(err?.message || 'Unable to create admin');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleToggleStatus = async (admin: AdminRecord) => {
    try {
      await adminApi.patch(`/admin/${admin.id}/status`, {
        isActive: !admin.isActive,
      });
      toast.success(`Admin ${admin.isActive ? 'deactivated' : 'activated'}`);
      await loadAdmins();
    } catch (err: any) {
      toast.error(err?.message || 'Unable to update admin status');
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-xl font-black text-gray-900">Admin Management</h2>
          <p className="text-sm text-gray-500">{admins.length} backend admin account{admins.length === 1 ? '' : 's'}</p>
        </div>
        <button onClick={() => setShowCreateModal(true)} className="bg-primary hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/10 border-none">
          + Create Admin
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search admins..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {error && (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-700">
          {error}. Buyer, seller, and vendor accounts are not exposed by the backend yet.
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">Admin</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Created</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Last Login</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {isLoading ? (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">Loading admins...</td>
              </tr>
            ) : filteredAdmins.length > 0 ? (
              filteredAdmins.map((admin) => (
                <tr key={admin.id} className="hover:bg-gray-50/80 transition-all group">
                  <td className="px-6 py-4">
                    <div className="flex flex-col">
                      <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight">{admin.name}</p>
                      <p className="text-[11px] text-gray-400 font-medium tracking-tight mt-0.5">{admin.email}</p>
                    </div>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-black tracking-wide ${admin.role === 'SUPER_ADMIN' ? 'text-red-600' : 'text-blue-600'}`}>
                      {admin.role === 'SUPER_ADMIN' ? 'Super Admin' : 'Admin'}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1.5 text-sm font-black tracking-wide ${admin.isActive ? 'text-[#3b8c41]' : 'text-[#e60000]'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current" />
                      {admin.isActive ? 'active' : 'inactive'}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-gray-500">
                    {admin.createdAt ? new Date(admin.createdAt).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-gray-500">
                    {admin.lastLogin ? new Date(admin.lastLogin).toLocaleString() : 'Never'}
                  </td>
                  <td className="px-6 py-4 text-center">
                    {admin.role === 'SUPER_ADMIN' ? (
                      <span className="text-[11px] font-bold text-gray-400">Protected</span>
                    ) : (
                      <button
                        onClick={() => handleToggleStatus(admin)}
                        className={`px-4 py-2 text-[10px] font-black uppercase tracking-wider rounded-lg transition-all ${
                          admin.isActive
                            ? 'text-white bg-[#e60000] hover:bg-[#cc0000]'
                            : 'text-white bg-[#3b8c41] hover:bg-[#2e6e33]'
                        }`}
                      >
                        {admin.isActive ? 'Deactivate' : 'Activate'}
                      </button>
                    )}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={6} className="px-6 py-16 text-center text-sm text-gray-400">No admins found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowCreateModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-xl shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(event) => event.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">Create New Admin</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Backed by `POST /admin/create`</p>
              </div>
              <button onClick={() => setShowCreateModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>

            <div className="p-8 space-y-6">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                <input value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="e.g. Jane Doe" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                <input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="admin@kvtexports.com" />
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Role *</label>
                  <select value={form.role} onChange={(event) => setForm({ ...form, role: event.target.value as 'SUPER_ADMIN' | 'ADMIN' })} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium bg-white">
                    <option value="ADMIN">Admin</option>
                    <option value="SUPER_ADMIN">Super Admin</option>
                  </select>
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Temporary Password *</label>
                  <input type="password" value={form.temporaryPassword} onChange={(event) => setForm({ ...form, temporaryPassword: event.target.value })} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="••••••••" />
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3">
              <button onClick={() => setShowCreateModal(false)} className="px-6 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm">
                Cancel
              </button>
              <button onClick={handleCreateAdmin} disabled={isSubmitting} className="px-8 py-3 bg-primary text-white hover:opacity-90 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-primary/20 border-none">
                {isSubmitting ? 'Creating...' : 'Create Admin'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
