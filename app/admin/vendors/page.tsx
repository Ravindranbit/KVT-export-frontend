'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';

export default function AdminVendors() {
  const { vendors, updateVendorStatus, updateVendorCommission } = useAdminStore();
  const [filterStatus, setFilterStatus] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [editCommission, setEditCommission] = useState<{ id: string; value: number } | null>(null);

  const filtered = vendors.filter(v => {
    const matchesStatus = filterStatus === 'all' || v.status === filterStatus;
    const matchesSearch = v.storeName.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          v.email.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  const statusColors: Record<string, string> = {
    pending: 'text-[#cca300]',
    approved: 'text-[#3b8c41]',
    suspended: 'text-[#e60000]',
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Vendor Management</h2>
          <p className="text-sm text-gray-500">{vendors.length} vendors · {vendors.filter(v => v.status === 'pending').length} pending</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search vendors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-white border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:border-[#e60000]"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          {/* Tabs */}
          <div className="flex gap-2">
            {['all', 'pending', 'approved', 'suspended'].map(s => (
              <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-2 text-xs font-bold rounded-lg transition-all ${filterStatus === s ? 'bg-gray-900 text-white shadow-sm' : 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50 hover:text-gray-900'}`}>
                {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filtered.map((v) => (
          <div key={v.id} className="bg-white border border-gray-200 rounded-3xl p-0 overflow-hidden hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 group hover:-translate-y-1 shadow-sm">
            {/* Card Header with Status Overlay */}
    <div className="relative h-20 bg-gray-50/80 flex items-center px-5 border-b border-gray-100">
      <div className="absolute top-3 right-4">
        <span className={`px-2.5 py-1 rounded-md text-[10px] font-black uppercase tracking-wider bg-white shadow-sm border border-gray-100 flex items-center gap-1.5 ${statusColors[v.status]}`}>
          <span className={`w-1.5 h-1.5 rounded-full bg-current ${v.status === 'pending' ? 'animate-pulse' : ''}`} />
          {v.status}
        </span>
      </div>
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-white border border-gray-200 rounded-xl flex items-center justify-center text-lg font-black text-gray-400 shadow-sm group-hover:rotate-3 transition-transform duration-500">
          {v.storeName.charAt(0)}
        </div>
        <div>
          <h3 className="font-black text-gray-900 text-[15px] leading-tight tracking-tight">{v.storeName}</h3>
          <p className="text-[10px] text-gray-500 font-bold uppercase tracking-widest mt-1">{v.name}</p>
        </div>
      </div>
    </div>

    <div className="p-5">
      <p className="text-[13px] text-gray-500 mb-4 leading-relaxed line-clamp-1 italic font-medium">
        "{v.storeDescription}"
      </p>

      {/* Stats Grid */}
      <div className="grid grid-cols-3 gap-0 border border-gray-100 rounded-xl overflow-hidden mb-4 shadow-sm">
        <div className="p-2.5 text-center border-r border-gray-100 bg-[#fafafa]">
          <p className="text-[15px] font-black text-gray-900">{v.productsCount}</p>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Products</p>
        </div>
        <div className="p-2.5 text-center border-r border-gray-100 bg-white">
          <p className="text-[15px] font-black text-gray-900">₹{(v.totalRevenue / 1000).toFixed(0)}k</p>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Revenue</p>
        </div>
        <div className="p-2.5 text-center bg-[#fafafa]">
          <p className="text-[15px] font-black text-blue-600">{v.commission}%</p>
          <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">Fee Rate</p>
        </div>
      </div>

      {/* Contact Details */}
      <div className="bg-gray-50/50 rounded-xl p-3 space-y-1.5 mb-5">
        <div className="flex items-center gap-3 text-xs text-gray-600 font-bold truncate">
          <svg className="w-3.5 h-3.5 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          {v.email}
        </div>
        <div className="flex items-center gap-3 text-[10px] text-gray-400 font-black uppercase tracking-widest pt-1.5 border-t border-gray-100/50">
          <svg className="w-3.5 h-3.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
          Est. {v.joinedDate}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2.5">
        {v.status === 'pending' && (
          <div className="flex gap-2 w-full mt-1">
            <button 
              onClick={() => updateVendorStatus(v.id, 'approved')} 
              className="flex-1 text-[12px] font-bold capitalize tracking-wide text-white bg-[#3b8c41] py-2.5 rounded-xl hover:bg-[#2e6e33] transition-all active:scale-95"
            >
              Approve
            </button>
            <button 
              onClick={() => updateVendorStatus(v.id, 'suspended')} 
              className="flex-1 text-[12px] font-bold capitalize tracking-wide text-white bg-[#e60000] py-2.5 rounded-xl hover:bg-[#cc0000] transition-all active:scale-95"
            >
              Reject
            </button>
          </div>
        )}
        {(v.status === 'approved' || v.status === 'suspended') && (
          <div className="flex gap-2 w-full mt-1">
            <button 
              onClick={() => setEditCommission({ id: v.id, value: v.commission })} 
              className="flex-1 text-[12px] font-bold capitalize tracking-wide text-white bg-[#1976d2] py-2.5 rounded-xl hover:bg-[#1565c0] transition-all active:scale-95"
            >
              Commission
            </button>
            <button 
              onClick={() => updateVendorStatus(v.id, v.status === 'suspended' ? 'approved' : 'suspended')} 
              className={`flex-1 text-[12px] font-bold capitalize tracking-wide py-2.5 rounded-xl transition-all active:scale-95 ${
                v.status === 'suspended' 
                  ? 'text-white bg-[#3b8c41] hover:bg-[#2e6e33]' 
                  : 'text-white bg-[#e60000] hover:bg-[#cc0000]'
              }`}
            >
              {v.status === 'suspended' ? 'Activate' : 'Suspend'}
            </button>
          </div>
        )}
      </div>
            </div>
          </div>
        ))}
      </div>

      {/* Commission Modal */}
      {editCommission && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditCommission(null)}>
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-gray-900 mb-4">Edit Commission</h3>
            <div className="mb-4">
              <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">Commission %</label>
              <input type="number" min={0} max={50} value={editCommission.value} onChange={(e) => setEditCommission({...editCommission, value: parseInt(e.target.value)})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" />
            </div>
            <div className="flex gap-3">
              <button onClick={() => setEditCommission(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={() => { updateVendorCommission(editCommission.id, editCommission.value); setEditCommission(null); }} className="flex-1 px-4 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold">Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
