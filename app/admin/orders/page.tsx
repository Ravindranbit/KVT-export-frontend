'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';

export default function AdminOrders() {
  const { orders, updateOrderStatus } = useAdminStore();
  const [search, setSearch] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<string | null>(null);

  const filtered = orders.filter(o => {
    const matchSearch = o.id.toLowerCase().includes(search.toLowerCase()) || o.customerName.toLowerCase().includes(search.toLowerCase());
    const matchStatus = filterStatus === 'all' || o.status === filterStatus;
    return matchSearch && matchStatus;
  });

  const statusColors: Record<string, string> = {
    pending: 'text-[#cca300]',
    processing: 'text-[#1976d2]',
    shipped: 'text-[#7b1fa2]',
    delivered: 'text-[#3b8c41]',
    cancelled: 'text-[#e60000]',
  };

  const statusFlow = ['pending', 'processing', 'shipped', 'delivered'];

  const orderDetail = selectedOrder ? orders.find(o => o.id === selectedOrder) : null;

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Order Management</h2>
          <p className="text-sm text-gray-500">{orders.length} total orders</p>
        </div>
        <div className="flex gap-2">
          {['all', 'pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
            <button key={s} onClick={() => setFilterStatus(s)} className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${filterStatus === s ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-500 hover:bg-gray-200'}`}>
              {s === 'all' ? 'All' : s.charAt(0).toUpperCase() + s.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Search */}
      <div className="bg-white border border-gray-200 rounded-xl p-4">
        <div className="relative">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input type="text" placeholder="Search by order ID or customer..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary" />
        </div>
      </div>

      {/* Orders Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">Order</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Customer</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Items</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Total</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Payment</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((o) => (
              <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-6 py-3">
                  <p className="text-sm font-bold text-gray-900">{o.id}</p>
                  <p className="text-xs text-gray-400">{o.date}</p>
                </td>
                <td className="px-4 py-3">
                  <p className="text-sm font-medium text-gray-900">{o.customerName}</p>
                  <p className="text-xs text-gray-400">{o.customerEmail}</p>
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3 justify-center max-w-[200px] mx-auto">
                    <div className="flex items-center gap-1.5 shrink-0">
                      {o.items.slice(0, 2).map((item, i) => (
                        <div key={i} className="relative group">
                          <img 
                            src={item.image} 
                            alt="" 
                            className="w-10 h-10 rounded-lg border border-gray-200 object-cover shadow-sm transition-transform group-hover:scale-110 z-10" 
                          />
                        </div>
                      ))}
                    </div>
                    {o.items.length > 0 && (
                      <div className="min-w-0 flex-1">
                        <p className="text-xs font-bold text-gray-900 truncate">{o.items[0].productName}</p>
                        {o.items.length > 1 && (
                          <p className="text-[10px] text-primary font-black tracking-tight mt-0.5 uppercase">
                            +{o.items.length - 1} more item{o.items.length > 2 ? 's' : ''}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                </td>
                <td className="px-4 py-3 text-sm font-bold text-gray-900">₹{o.total.toLocaleString()}</td>
                <td className="px-4 py-3 text-xs text-gray-500 font-medium">{o.paymentMethod}</td>
                <td className="px-4 py-3">
                  <span className={`flex items-center gap-1.5 text-xs font-black tracking-wide capitalize ${statusColors[o.status]}`}>
                    <span className={`w-1.5 h-1.5 rounded-full bg-current ${(o.status === 'delivered' || o.status === 'cancelled') ? '' : 'animate-pulse'}`} />
                    {o.status}
                  </span>
                </td>
                <td className="px-6 py-3">
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={() => setSelectedOrder(o.id)} 
                      className="text-[12px] font-bold capitalize tracking-wide text-white bg-[#1976d2] px-4 py-2.5 rounded-xl hover:bg-[#1565c0] transition-all active:scale-95 text-center flex-shrink-0"
                    >
                      Details
                    </button>
                    <div className="relative group">
                      <select
                        value={o.status}
                        onChange={(e) => updateOrderStatus(o.id, e.target.value as any)}
                        className="text-[12px] font-bold capitalize border-2 border-gray-100 rounded-xl px-3 py-2.5 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white min-w-[125px] cursor-pointer hover:border-blue-400 transition-all appearance-none pr-8 text-gray-700"
                      >
                        {['pending', 'processing', 'shipped', 'delivered', 'cancelled'].map(s => (
                          <option key={s} value={s} className="capitalize font-medium">{s}</option>
                        ))}
                      </select>
                      <svg className="absolute right-3 top-1/2 -translate-y-1/2 w-3 h-3 text-gray-400 pointer-events-none group-hover:text-blue-500 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M19 9l-7 7-7-7" /></svg>
                    </div>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && <div className="text-center py-12 text-gray-400 text-sm">No orders found</div>}
      </div>

      {/* Order Detail Modal */}
      {orderDetail && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setSelectedOrder(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black text-gray-900">{orderDetail.id}</h3>
                <p className="text-xs text-gray-400">{orderDetail.date}</p>
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className={`flex items-center gap-1.5 text-sm font-black tracking-wide capitalize ${statusColors[orderDetail.status]}`}>
                  <span className={`w-2 h-2 rounded-full bg-current ${(orderDetail.status === 'delivered' || orderDetail.status === 'cancelled') ? '' : 'animate-pulse'}`} />
                  {orderDetail.status}
                </span>

              </div>
            </div>
            <div className="p-6 space-y-5">
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Customer</h4>
                <p className="text-sm font-bold text-gray-900">{orderDetail.customerName}</p>
                <p className="text-xs text-gray-500">{orderDetail.customerEmail}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Shipping Address</h4>
                <p className="text-sm text-gray-700">{orderDetail.shippingAddress}</p>
              </div>
              <div>
                <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Items</h4>
                <div className="space-y-2">
                  {orderDetail.items.map((item, i) => (
                    <div key={i} className="flex items-center gap-3 bg-gray-50 px-3 py-2 rounded-lg">
                      <img src={item.image} alt="" className="w-10 h-10 rounded object-cover" />
                      <div className="flex-1">
                        <p className="text-sm font-medium text-gray-900">{item.productName}</p>
                        <p className="text-xs text-gray-400">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-bold text-gray-900">₹{(item.price * item.quantity).toLocaleString()}</p>
                    </div>
                  ))}
                </div>
              </div>
              <div className="border-t border-gray-100 pt-4 flex items-center justify-between">
                <span className="text-sm font-bold text-gray-500">Total</span>
                <span className="text-xl font-black text-gray-900">₹{orderDetail.total.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-gray-500">Payment: <span className="font-bold text-gray-700">{orderDetail.paymentMethod}</span></span>
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end">
              <button onClick={() => setSelectedOrder(null)} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
