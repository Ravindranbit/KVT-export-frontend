'use client';
import { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';

const MOCK_ORDERS = [
  { id: 'KVT-84920', date: 'Oct 24, 2026', total: 6450, status: 'Delivered', items: 3 },
  { id: 'KVT-71029', date: 'Nov 12, 2026', total: 1250, status: 'In Transit', items: 1 },
  { id: 'KVT-92304', date: 'Dec 05, 2026', total: 8900, status: 'Processing', items: 4 },
];

import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';

interface Address { id: string; label: string; name: string; line1: string; line2: string; city: string; zip: string; country: string; phone: string; isDefault: boolean; }
interface Card { id: string; brand: string; last4: string; expiry: string; isPrimary: boolean; }

function SettingsTab({ user, setUser, logout, router, show }: { user: any; setUser: (u: any) => void; logout: () => void; router: any; show: (t: string) => void }) {
  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [phone, setPhone] = useState('+91 ');
  const [showDeactivate, setShowDeactivate] = useState(false);

  const handleSave = () => {
    if (user) {
      setUser({ ...user, name, email });
      show('Settings saved successfully!');
    }
  };

  const handleDeactivate = () => {
    logout();
    router.push('/');
  };

  const inputClass = "w-full px-5 py-4 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all";

  return (
    <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
      <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">Account Settings</h3>
      <div className="space-y-8 max-w-lg">
        <div className="space-y-6">
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Full Name</label>
            <input type="text" value={name} onChange={e => setName(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Email Address</label>
            <input type="email" value={email} onChange={e => setEmail(e.target.value)} className={inputClass} />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-400 uppercase tracking-widest mb-3">Phone Number</label>
            <input type="tel" value={phone} onChange={e => { const v = e.target.value; if (v.startsWith('+91')) setPhone(v); }} placeholder="+91 XXXXX XXXXX" className={inputClass} />
          </div>
        </div>
        <div className="pt-6 border-t border-gray-50 flex gap-4">
          <button type="button" onClick={handleSave} className="bg-gray-900 text-white px-10 py-4 font-bold tracking-wide rounded-xl hover:bg-black transition-all shadow-lg hover:-translate-y-0.5 shadow-gray-200 cursor-pointer">
            Save Changes
          </button>
          <button type="button" onClick={() => setShowDeactivate(true)} className="text-gray-500 font-bold px-6 py-4 hover:text-red-600 transition-colors cursor-pointer">
            Deactivate Account
          </button>
        </div>
        {showDeactivate && (
          <div className="p-6 bg-red-50 border border-red-200 rounded-2xl space-y-4">
            <h4 className="font-bold text-red-700">Are you sure?</h4>
            <p className="text-sm text-red-600">This will deactivate your account and log you out. This action cannot be undone.</p>
            <div className="flex gap-3">
              <button onClick={handleDeactivate} className="bg-red-600 text-white px-6 py-3 rounded-xl font-bold text-sm hover:bg-red-700 transition-all cursor-pointer">Yes, Deactivate</button>
              <button onClick={() => setShowDeactivate(false)} className="text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors cursor-pointer">Cancel</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default function Dashboard() {
  const [activeTab, setActiveTab] = useState('orders');
  const [trackingId, setTrackingId] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const { user, logout } = useAuthStore();
  const router = useRouter();

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'a1', label: 'Home (Primary)', name: '', line1: '8th floor, 379 Hudson St', line2: '', city: 'New York', zip: 'NY 10018', country: 'India', phone: '+91 96716 68790', isDefault: true },
    { id: 'a2', label: 'Work Office', name: '', line1: '456 Broad St, Suite 1200', line2: '', city: 'New York', zip: 'NY 10012', country: 'United States', phone: '', isDefault: false },
  ]);
  const [cards, setCards] = useState<Card[]>([
    { id: 'c1', brand: 'VISA', last4: '4242', expiry: '12/28', isPrimary: true },
  ]);
  const [newAddr, setNewAddr] = useState({ label: '', line1: '', city: '', zip: '', country: '', phone: '' });
  const [newCard, setNewCard] = useState({ brand: 'VISA', last4: '', expiry: '' });

  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t); } }, [message]);

  const handleLogout = () => { logout(); router.push('/'); };
  const show = (text: string) => setMessage(text);

  const removeAddress = (id: string) => { setAddresses(prev => prev.filter(a => a.id !== id)); show('Address removed'); };
  const updateAddress = (id: string, field: keyof Address, value: string) => { setAddresses(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a)); };
  const addAddress = () => { if (!newAddr.label || !newAddr.line1) { show('Please fill label and street'); return; } setAddresses(prev => [...prev, { id: Date.now().toString(), ...newAddr, name: '', line2: '', isDefault: false }]); setNewAddr({ label: '', line1: '', city: '', zip: '', country: '', phone: '' }); setShowAddAddr(false); show('Address added'); };
  const removeCard = (id: string) => { setCards(prev => prev.filter(c => c.id !== id)); show('Card removed'); };
  const addCard = () => { if (!newCard.last4 || !newCard.expiry) { show('Please fill card details'); return; } setCards(prev => [...prev, { id: Date.now().toString(), ...newCard, isPrimary: prev.length === 0 }]); setNewCard({ brand: 'VISA', last4: '', expiry: '' }); setShowAddCard(false); show('Card added'); };

  const userInitial = user?.name ? user.name.substring(0, 2).toUpperCase() : 'JD';
  const userName = user?.name || 'User';
  const userEmail = user?.email || 'user@example.com';

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Global Dashboard Notification */}
      {message && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-50 animate-bounce">
          <div className="bg-gray-900 text-white px-8 py-4 rounded-2xl shadow-2xl font-bold flex items-center gap-3 border border-white/10 backdrop-blur-md">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        </div>
      )}

      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-72 shrink-0">
            <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-8">
              <div className="flex items-center gap-5 mb-10 pb-8 border-b border-gray-100">
                <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center font-extrabold text-2xl tracking-tighter shadow-inner">
                  {userInitial}
                </div>
                <div>
                  <h3 className="font-bold text-gray-900 text-lg">{userName}</h3>
                  <p className="text-sm text-gray-500 font-medium">{userEmail}</p>
                </div>
              </div>

              <nav className="space-y-3">
                <button onClick={() => { setActiveTab('orders'); setTrackingId(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'orders' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Orders
                </button>
                <button onClick={() => { setActiveTab('wishlist'); setTrackingId(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'wishlist' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                  Wishlist
                </button>
                <button onClick={() => { setActiveTab('addresses'); setTrackingId(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'addresses' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Addresses
                </button>
                <button onClick={() => { setActiveTab('payments'); setTrackingId(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'payments' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
                  Payments
                </button>
                <button onClick={() => { setActiveTab('settings'); setTrackingId(null); }} className={`w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold transition-all ${activeTab === 'settings' ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50 hover:text-gray-900 hover:translate-x-1'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                  Settings
                </button>
                <div className="pt-8 mt-8 border-t border-gray-100">
                  <button 
                    onClick={handleLogout}
                    className="w-full flex items-center gap-4 px-5 py-4 rounded-2xl font-bold text-red-500 hover:bg-red-50 hover:text-red-600 transition-all cursor-pointer"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    Logout
                  </button>
                </div>
              </nav>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {activeTab === 'orders' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <div>
                    <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Order History</h2>
                    <p className="text-gray-500 mt-2 font-medium">Track your recent purchases and shipments</p>
                  </div>
                  <div className="bg-gray-100 px-5 py-3 rounded-2xl">
                    <span className="text-gray-400 text-xs uppercase font-bold tracking-widest block mb-0.5">Total Spent</span>
                    <span className="text-gray-900 font-extrabold text-lg">₹{(16600).toFixed(2)}</span>
                  </div>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-100 text-gray-400 text-xs tracking-wider uppercase font-bold">
                        <th className="px-8 py-5">Order ID</th>
                        <th className="px-8 py-5">Date</th>
                        <th className="px-8 py-5">Status</th>
                        <th className="px-8 py-5">Total</th>
                        <th className="px-8 py-5 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {MOCK_ORDERS.map(order => (
                        <Fragment key={order.id}>
                          <tr className="hover:bg-gray-50 transition-colors group">
                            <td className="px-8 py-6 font-bold text-gray-900">{order.id}</td>
                            <td className="px-8 py-6 text-gray-500 font-medium">{order.date}</td>
                            <td className="px-8 py-6">
                              <span className={`px-4 py-1.5 text-xs font-extrabold tracking-wide uppercase rounded-full border ${
                                order.status === 'Delivered' ? 'bg-green-50 text-green-700 border-green-200' :
                                order.status === 'In Transit' ? 'bg-blue-50 text-blue-700 border-blue-200' :
                                'bg-amber-50 text-amber-700 border-amber-200'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-6 font-bold text-gray-900">₹{order.total.toFixed(2)}</td>
                            <td className="px-8 py-6 text-right">
                              <button 
                                onClick={() => setTrackingId(trackingId === order.id ? null : order.id)}
                                className={`font-bold text-sm transition-colors cursor-pointer ${trackingId === order.id ? 'text-gray-900' : 'text-red-600 hover:text-red-800'}`}
                              >
                                {trackingId === order.id ? 'Hide Details' : 'Track Package \u2192'}
                              </button>
                            </td>
                          </tr>
                          {trackingId === order.id && (
                            <tr className="bg-gray-50/50">
                              <td colSpan={5} className="px-8 py-8">
                                <div className="bg-white border border-gray-100 rounded-2xl p-6 shadow-sm">
                                  <div className="flex items-center justify-between mb-6">
                                    <h4 className="font-bold text-gray-900">Package Tracking Details</h4>
                                    <span className="text-xs font-extrabold text-blue-600 uppercase tracking-widest bg-blue-50 px-3 py-1 rounded">Expedited Shipping</span>
                                  </div>
                                  <div className="space-y-6">
                                    <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-gray-900">Arrived at Local Distribution Center</p>
                                        <p className="text-xs text-gray-500 font-medium">New York, NY - 10:45 AM</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-gray-300 rounded-full" />
                                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-bold text-gray-400">Out for Delivery</p>
                                        <p className="text-xs text-gray-400 font-medium italic">Pending...</p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </td>
                            </tr>
                          )}
                        </Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'wishlist' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 text-center h-full flex flex-col items-center justify-center">
                <svg className="w-16 h-16 text-gray-300 mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                <h3 className="text-2xl font-bold text-gray-900 mb-2">Saved Items</h3>
                <p className="text-gray-500 font-medium">Your wishlist is currently managed on the dedicated <Link href="/wishlist" className="text-red-600 font-bold hover:underline">Wishlist Page</Link>.</p>
              </div>
            )}

            {activeTab === 'addresses' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
                <div className="flex justify-between items-center mb-10">
                  <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight">Saved Addresses</h3>
                  <button onClick={() => setShowAddAddr(!showAddAddr)} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all shadow-md hover:-translate-y-0.5">
                    {showAddAddr ? 'Cancel' : '+ Add Address'}
                  </button>
                </div>

                {showAddAddr && (
                  <div className="mb-8 p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
                    <h4 className="font-bold text-gray-900 mb-2">New Address</h4>
                    <div className="grid grid-cols-2 gap-4">
                      <input placeholder="Label (e.g. Home)" value={newAddr.label} onChange={e => setNewAddr({...newAddr, label: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                      <input placeholder="Phone" value={newAddr.phone} onChange={e => setNewAddr({...newAddr, phone: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <input placeholder="Street Address" value={newAddr.line1} onChange={e => setNewAddr({...newAddr, line1: e.target.value})} className="w-full px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                    <div className="grid grid-cols-3 gap-4">
                      <input placeholder="City" value={newAddr.city} onChange={e => setNewAddr({...newAddr, city: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                      <input placeholder="ZIP Code" value={newAddr.zip} onChange={e => setNewAddr({...newAddr, zip: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                      <input placeholder="Country" value={newAddr.country} onChange={e => setNewAddr({...newAddr, country: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                    </div>
                    <button onClick={addAddress} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all">Save Address</button>
                  </div>
                )}

                {addresses.length === 0 && <p className="text-gray-400 text-center py-8">No saved addresses. Add one above.</p>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map(addr => (
                    <div key={addr.id} className={`p-6 rounded-2xl relative transition-all ${addr.isDefault ? 'border-2 border-gray-900 shadow-lg' : 'border border-gray-100 bg-gray-50/50 hover:border-gray-200'}`}>
                      {addr.isDefault && <span className="absolute top-4 right-4 bg-gray-900 text-white text-[10px] font-bold px-2 py-1 rounded uppercase tracking-widest">Default</span>}
                      
                      {editingAddrId === addr.id ? (
                        <div className="space-y-3">
                          <input value={addr.label} onChange={e => updateAddress(addr.id, 'label', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm font-bold outline-none focus:ring-2 focus:ring-gray-900" />
                          <input value={addr.line1} onChange={e => updateAddress(addr.id, 'line1', e.target.value)} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" />
                          <div className="grid grid-cols-2 gap-3">
                            <input value={addr.city} onChange={e => updateAddress(addr.id, 'city', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" />
                            <input value={addr.zip} onChange={e => updateAddress(addr.id, 'zip', e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" />
                          </div>
                          <input value={addr.phone} onChange={e => updateAddress(addr.id, 'phone', e.target.value)} placeholder="Phone" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" />
                          <button onClick={() => { setEditingAddrId(null); show('Address updated'); }} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-bold text-xs">Save</button>
                        </div>
                      ) : (
                        <>
                          <h4 className="font-bold text-gray-900 mb-2">{addr.label}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            {userName}<br />{addr.line1}<br />{addr.city}, {addr.zip}<br />{addr.country}
                            {addr.phone && <><br />Phone: {addr.phone}</>}
                          </p>
                          <div className="flex gap-4">
                            <button onClick={() => setEditingAddrId(addr.id)} className="text-xs font-bold text-gray-400 hover:text-gray-900 uppercase tracking-widest transition-colors cursor-pointer">Edit</button>
                            <button onClick={() => removeAddress(addr.id)} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors cursor-pointer">Remove</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'payments' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-10">
                <h3 className="text-2xl font-extrabold text-gray-900 tracking-tight mb-8">Payment Methods</h3>
                <div className="space-y-4">
                  {cards.map(card => (
                    <div key={card.id} className="flex items-center justify-between p-6 rounded-2xl border border-gray-100 bg-gray-50/50 hover:bg-white hover:shadow-md transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 bg-gray-900 rounded-lg flex items-center justify-center text-white font-extrabold text-[10px] uppercase italic tracking-tighter">{card.brand}</div>
                        <div>
                          <h4 className="font-bold text-gray-900">{card.brand} ending in {card.last4}</h4>
                          <p className="text-xs text-gray-500 font-medium">Expires {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex gap-6 items-center">
                        {card.isPrimary && <span className="text-[10px] font-bold text-gray-400 border border-gray-200 px-2 py-1 rounded uppercase tracking-widest">Primary</span>}
                        <button onClick={() => removeCard(card.id)} className="text-xs font-bold text-red-400 hover:text-red-600 uppercase tracking-widest transition-colors cursor-pointer">Remove</button>
                      </div>
                    </div>
                  ))}
                  {cards.length === 0 && <p className="text-gray-400 text-center py-4">No payment methods saved.</p>}

                  {showAddCard ? (
                    <div className="p-6 border-2 border-dashed border-gray-200 rounded-2xl bg-gray-50/50 space-y-4">
                      <h4 className="font-bold text-gray-900">Add New Card</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <select value={newCard.brand} onChange={e => setNewCard({...newCard, brand: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900">
                          <option>VISA</option><option>MASTERCARD</option><option>AMEX</option><option>RuPay</option>
                        </select>
                        <input placeholder="Last 4 digits" maxLength={4} value={newCard.last4} onChange={e => setNewCard({...newCard, last4: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                        <input placeholder="MM/YY" maxLength={5} value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={addCard} className="bg-gray-900 text-white px-8 py-3 rounded-xl font-bold text-sm hover:bg-black transition-all">Save Card</button>
                        <button onClick={() => setShowAddCard(false)} className="text-gray-500 font-bold text-sm hover:text-gray-900 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddCard(true)} className="w-full flex items-center justify-center gap-3 p-6 rounded-2xl border-2 border-dashed border-gray-200 text-gray-400 font-bold hover:border-gray-900 hover:text-gray-900 transition-all group">
                      <svg className="w-5 h-5 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Add New Card
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'settings' && (
              <SettingsTab user={user} setUser={useAuthStore.getState().setUser} logout={logout} router={router} show={show} />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
