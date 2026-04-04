'use client';

import { useState } from 'react';
import { useAuthStore } from '../../../store/useAuthStore';

export default function AdminProfile() {
  const { user, updateProfile } = useAuthStore();
  const [saved, setSaved] = useState(false);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
  });
  const [passwordForm, setPasswordForm] = useState({ current: '', newPass: '', confirm: '' });
  const [passMsg, setPassMsg] = useState('');

  if (!user) return null;

  const handleSave = () => {
    updateProfile(form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handlePasswordChange = () => {
    if (passwordForm.newPass !== passwordForm.confirm) {
      setPassMsg('Passwords do not match');
      return;
    }
    if (passwordForm.newPass.length < 6) {
      setPassMsg('Password must be at least 6 characters');
      return;
    }
    setPassMsg('Password updated successfully!');
    setPasswordForm({ current: '', newPass: '', confirm: '' });
    setTimeout(() => setPassMsg(''), 2000);
  };

  return (
    <div className="max-w-[1200px] mx-auto space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight">Account Settings</h2>
          <p className="text-sm text-gray-500 mt-1">Manage your administrator profile and security preferences.</p>
        </div>
      </div>

      {saved && (
        <div className="bg-[#3b8c41]/10 border border-[#3b8c41]/20 text-[#3b8c41] text-sm font-bold tracking-wide px-4 py-3 rounded-xl flex items-center gap-2">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
          Profile updated successfully!
        </div>
      )}

      <div className="bg-white border border-gray-200 rounded-3xl overflow-hidden shadow-sm">
        <div className="grid grid-cols-1 md:grid-cols-12">
          
          {/* Sidebar Left Column */}
          <div className="md:col-span-4 lg:col-span-3 border-r border-gray-100 bg-gray-50/50 p-8 flex flex-col items-center text-center">
            <div className="w-28 h-28 rounded-full bg-gradient-to-tr from-[#e60000] to-orange-500 flex items-center justify-center text-white text-4xl font-black shadow-lg shadow-red-500/20 mb-5 border-4 border-white">
              {user.name.charAt(0)}
            </div>
            
            <h3 className="text-lg font-bold text-gray-900">{user.name}</h3>
            <p className="text-sm font-medium text-gray-500 mb-5">{user.email}</p>
            
            <div className="inline-flex items-center gap-2 bg-white px-3.5 py-1.5 rounded-lg border border-gray-200 shadow-sm">
              <div className="w-2 h-2 rounded-full bg-[#3b8c41]" />
              <span className="text-[10px] font-bold uppercase tracking-wider text-gray-700">Active {user.role}</span>
            </div>
            
            <div className="w-full mt-10 pt-8 border-t border-gray-200/60 text-left space-y-5">
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Account ID</p>
                <p className="text-xs font-mono font-bold text-gray-700">{user.id}</p>
              </div>
              <div>
                <p className="text-[10px] uppercase font-bold text-gray-400 tracking-wider mb-1.5">Member Since</p>
                <p className="text-xs font-bold text-gray-700">{user.joinedDate || 'Dec 2025'}</p>
              </div>
            </div>
          </div>

          {/* Main Content Form */}
          <div className="md:col-span-8 lg:col-span-9 p-8 lg:p-12">
            
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
            
              Personal Information
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Display Name</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60000]/20 focus:border-[#e60000] transition-colors" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address</label>
                <input type="email" value={form.email} onChange={(e) => setForm({...form, email: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60000]/20 focus:border-[#e60000] transition-colors" />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Contact Phone</label>
                <input value={form.phone} onChange={(e) => setForm({...form, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60000]/20 focus:border-[#e60000] transition-colors" placeholder="+91 ..." />
              </div>
            </div>

            <div className="flex justify-start mb-12">
              <button onClick={handleSave} className="bg-gray-900 hover:bg-black text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all shadow-md active:scale-95">
                Save Changes
              </button>
            </div>

            {/* Separator */}
            <div className="h-px w-full bg-gray-100 mb-12" />

            {/* Security Settings */}
            <h3 className="text-lg font-bold text-gray-900 mb-6 flex items-center gap-2">
              Security Settings
            </h3>

            {passMsg && (
              <div className={`text-xs font-bold tracking-wide px-4 py-3.5 rounded-xl mb-6 flex items-start gap-2 ${passMsg.includes('success') ? 'bg-[#3b8c41]/10 text-[#3b8c41] border border-[#3b8c41]/20' : 'bg-[#e60000]/10 text-[#e60000] border border-[#e60000]/20'}`}>
                {passMsg.includes('success') ? '✅' : '⚠️'} {passMsg}
              </div>
            )}

            <div className="max-w-md space-y-5 mb-8">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Current Password</label>
                <input type="password" value={passwordForm.current} onChange={(e) => setPasswordForm({...passwordForm, current: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60000]/20 focus:border-[#e60000] bg-gray-50" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">New Password</label>
                <input type="password" value={passwordForm.newPass} onChange={(e) => setPasswordForm({...passwordForm, newPass: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60000]/20 focus:border-[#e60000]" />
              </div>
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Confirm New Password</label>
                <input type="password" value={passwordForm.confirm} onChange={(e) => setPasswordForm({...passwordForm, confirm: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-[#e60000]/20 focus:border-[#e60000]" />
              </div>
            </div>

            <div className="flex justify-start">
              <button onClick={handlePasswordChange} disabled={!passwordForm.current || !passwordForm.newPass || !passwordForm.confirm} className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold px-8 py-3.5 rounded-xl text-sm transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-md active:scale-95">
                Update Password
              </button>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
