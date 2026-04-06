'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';

export default function AdminUsers() {
  const { users, admins, updateUserStatus, updateUserRole, deleteUser, addAdmin, removeAdmin, updateAdminPermissions } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [showAddAdmin, setShowAddAdmin] = useState(false);
  const [editingAdminId, setEditingAdminId] = useState<string | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  
  const initialPermissions = {
    dashboard: false,
    products: false,
    orders: false,
    users: false,
    vendors: false,
    categories: false,
    banners: false,
    settings: false,
    profile: false,
  };

  const [adminForm, setAdminForm] = useState({ 
    name: '', 
    email: '', 
    password: '', 
    phone: '',
    permissions: initialPermissions
  });

  const allPeople = [...users, ...admins];
  const filtered = allPeople.filter(u => {
    const matchSearch = u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase());
    const matchRole = filterRole === 'all' || u.role === filterRole;
    return matchSearch && matchRole;
  });

  const statusColors: Record<string, string> = {
    active: 'text-[#3b8c41]',
    banned: 'text-[#e60000]',
  };

  const roleColors: Record<string, string> = {
    admin: 'text-[#e60000]',
    seller: 'text-[#7b1fa2]',
    buyer: 'text-[#1976d2]',
  };

  const handleOpenAddModal = () => {
    setEditingAdminId(null);
    setAdminForm({ name: '', email: '', password: '', phone: '', permissions: initialPermissions });
    setShowAddAdmin(true);
  };

  const handleOpenEditModal = (admin: any) => {
    setEditingAdminId(admin.id);
    setAdminForm({
      name: admin.name,
      email: admin.email,
      password: '*****', // Placeholder
      phone: admin.phone || '',
      permissions: admin.permissions || initialPermissions
    });
    setShowAddAdmin(true);
  };

  const handleAddAdmin = () => {
    if (editingAdminId) {
      // Update permissions of existing admin
      updateAdminPermissions(editingAdminId, adminForm.permissions);
    } else {
      // Create new admin
      const newAdmin = {
        id: `admin_${Date.now()}`,
        name: adminForm.name,
        email: adminForm.email,
        role: 'admin' as const,
        status: 'active' as const,
        joinedDate: new Date().toISOString().split('T')[0],
        phone: adminForm.phone,
        permissions: adminForm.permissions,
      };
      addAdmin(newAdmin);
    }
    setShowAddAdmin(false);
    setAdminForm({ name: '', email: '', password: '', phone: '', permissions: initialPermissions });
  };

  const togglePermission = (key: keyof typeof adminForm.permissions) => {
    setAdminForm(prev => ({
      ...prev,
      permissions: { ...prev.permissions, [key]: !prev.permissions[key] }
    }));
  };

  const handleDelete = (id: string) => {
    const isAdmin = admins.find(a => a.id === id);
    if (isAdmin) {
      if (id === 'admin1') return; // Cannot delete Super Admin
      removeAdmin(id);
    } else {
      deleteUser(id);
    }
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">User Management</h2>
          <p className="text-sm text-gray-500">{allPeople.length} total users · {admins.length} admin{admins.length > 1 ? 's' : ''}</p>
        </div>
        <button onClick={handleOpenAddModal} className="bg-primary hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/10 border-none">
          + Create Admin
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search by name or email..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all" />
        </div>
        <div className="flex gap-2">
          {['all', 'admin', 'seller', 'buyer'].map(r => (
            <button key={r} onClick={() => setFilterRole(r)} className={`px-4 py-2.5 text-xs font-bold rounded-lg transition-all ${filterRole === r ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {r === 'all' ? 'All' : r.charAt(0).toUpperCase() + r.slice(1) + 's'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">User</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Role</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Joined</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Phone</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((u) => {
              const isAdmin = u.role === 'admin';
              const isSuperAdmin = u.id === 'admin1';
              return (
                <tr key={u.id} className="hover:bg-gray-50/80 transition-all group">
                   <td className="px-6 py-4">
                     <div className="flex flex-col">
                       <p className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors uppercase tracking-tight">{u.name}</p>
                       <p className="text-[11px] text-gray-400 font-medium tracking-tight mt-0.5">{u.email}</p>
                     </div>
                   </td>
                  <td className="px-4 py-4">
                    <span className={`text-sm font-black tracking-wide capitalize ${roleColors[u.role]}`}>
                      {isSuperAdmin ? <span className="text-red-600 whitespace-nowrap">Super Admin</span> : u.role}
                    </span>
                  </td>
                  <td className="px-4 py-4">
                    <span className={`flex items-center gap-1.5 text-sm font-black tracking-wide capitalize ${statusColors[u.status === 'suspended' ? 'active' : u.status] || 'text-gray-500'}`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
                      {u.status === 'suspended' ? 'active' : u.status}
                    </span>
                  </td>
                  <td className="px-4 py-4 text-xs font-medium text-gray-500">{u.joinedDate}</td>
                  <td className="px-4 py-4 text-xs font-medium text-gray-500">{u.phone || '—'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center gap-2">
                       {isAdmin && !isSuperAdmin && (
                        <button 
                          onClick={() => handleOpenEditModal(u)} 
                          className="px-3.5 py-2 text-[10px] font-black uppercase tracking-wider text-white bg-gray-900 rounded-lg hover:bg-black transition-all shadow-sm"
                        >
                          Edit Permissions
                        </button>
                      )}

                      {!isAdmin && u.status !== 'banned' && (
                        <button 
                          onClick={() => updateUserStatus(u.id, 'banned')} 
                          className="w-[85px] py-2 text-[10px] font-black uppercase tracking-wider text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-all border border-gray-200 shadow-sm"
                        >
                          Ban
                        </button>
                      )}
                      {!isAdmin && u.status === 'banned' && (
                        <button 
                          onClick={() => updateUserStatus(u.id, 'active')} 
                          className="w-[85px] py-2 text-[10px] font-black uppercase tracking-wider text-gray-600 bg-white rounded-lg hover:bg-gray-50 transition-all border border-gray-200"
                        >
                          Unban
                        </button>
                      )}
                      {!isSuperAdmin && (
                        <button 
                          onClick={() => setDeleteConfirm(u.id)} 
                          className="p-2 text-[#ef4444] hover:bg-red-50 rounded-xl transition-all active:scale-95 transform hover:scale-110"
                          title="Delete User"
                        >
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No users found</div>}
      </div>

      {/* Add/Edit Admin Modal */}
      {showAddAdmin && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddAdmin(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl animate-in fade-in zoom-in duration-200" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white z-10">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{editingAdminId ? 'Edit Admin Permissions' : 'Create New Admin'}</h3>
                <p className="text-xs text-gray-500 font-medium mt-1">Configure profile and access permissions</p>
              </div>
              <button onClick={() => setShowAddAdmin(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 space-y-8">
              {/* Account Details */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Account Info</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Full Name *</label>
                    <input value={adminForm.name} readOnly={!!editingAdminId} onChange={(e) => setAdminForm({...adminForm, name: e.target.value})} className={`w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium ${editingAdminId ? 'bg-gray-50 text-gray-400' : ''}`} placeholder="e.g. John Wick" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Email Address *</label>
                    <input type="email" value={adminForm.email} readOnly={!!editingAdminId} onChange={(e) => setAdminForm({...adminForm, email: e.target.value})} className={`w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium ${editingAdminId ? 'bg-gray-50 text-gray-400' : ''}`} placeholder="admin@kvtexports.com" />
                  </div>
                  {!editingAdminId && (
                    <>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Password *</label>
                        <input type="password" value={adminForm.password} onChange={(e) => setAdminForm({...adminForm, password: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="••••••••" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Phone Number</label>
                        <input value={adminForm.phone} onChange={(e) => setAdminForm({...adminForm, phone: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all font-medium" placeholder="+91 00000 00000" />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* Permissions Grid */}
              <div className="space-y-4">
                <h4 className="text-[10px] font-black text-primary uppercase tracking-[0.2em]">Feature Permissions</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-4">
                  {(Object.keys(adminForm.permissions) as Array<keyof typeof adminForm.permissions>).map((key) => (
                    <div
                      key={key}
                      onClick={() => togglePermission(key)}
                      className="flex items-center justify-between py-3 cursor-pointer group border-b border-gray-50 last:border-0"
                    >
                      <div className="flex flex-col">
                        <span className="text-[13px] font-bold text-gray-700 capitalize tracking-tight group-hover:text-red-600 transition-colors">{key} Management</span>
                        <span className="text-[10px] text-gray-400 font-medium">Access to {key} feature</span>
                      </div>
                      
                      {/* Modern Switch */}
                      <div className={`relative w-11 h-6 rounded-full transition-all duration-200 ease-in-out ${
                        adminForm.permissions[key] ? 'bg-primary shadow-inner' : 'bg-gray-200'
                      }`}>
                        <div className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transition-transform duration-200 ease-in-out ${
                          adminForm.permissions[key] ? 'translate-x-5' : 'translate-x-0'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 sticky bottom-0 z-10">
              <button 
                onClick={() => setShowAddAdmin(false)} 
                className="px-6 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-500 hover:bg-gray-50 transition-colors shadow-sm"
              >
                Cancel
              </button>
              <button 
                onClick={handleAddAdmin} 
                disabled={!adminForm.name || !adminForm.email || !adminForm.password} 
                className="px-8 py-3 bg-primary text-white hover:opacity-90 rounded-xl text-sm font-black uppercase tracking-wider disabled:opacity-50 transition-all shadow-lg shadow-primary/20 active:scale-95 border-none"
              >
                Create Admin
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirm */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center border border-gray-100 scale-100 animate-in fade-in zoom-in duration-200">
            <div className="w-14 h-14 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#ef4444]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
            </div>
            <h3 className="text-lg font-black text-gray-900 mb-2">Delete User?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-[#ef4444] hover:bg-[#dc2626] text-white rounded-lg text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
