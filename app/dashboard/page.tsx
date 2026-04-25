'use client';
import { useState, Fragment, useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '../../store/useAuthStore';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useProductStore } from '../../store/useProductStore';
import { useCartStore } from '../../store/useCartStore';
import { useOrderStore } from '../../store/useOrderStore';

// Removed MOCK_ORDERS as they are now replaced by persistence store

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
  const wishlistIds = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const { products } = useProductStore();
  const addToCartStore = useCartStore((state) => state.addItem);
  const getProductDetails = (id: number) => products.find(p => p.id === id);
  const [editingAddrId, setEditingAddrId] = useState<string | null>(null);
  const [showAddAddr, setShowAddAddr] = useState(false);
  const [showAddCard, setShowAddCard] = useState(false);
  const { user, logout, token, hasHydrated, getProfile } = useAuthStore();
  const router = useRouter();
  const { orders } = useOrderStore();
  const myOrders = user ? orders.filter(o => o.customerId === user.id) : orders.filter(o => o.customerId === 'guest');

  const [addresses, setAddresses] = useState<Address[]>([
    { id: 'a1', label: 'Home (Primary)', name: '', line1: '8th floor, 379 Hudson St', line2: '', city: 'New York', zip: 'NY 10018', country: 'India', phone: '+91 96716 68790', isDefault: true },
    { id: 'a2', label: 'Work Office', name: '', line1: '456 Broad St, Suite 1200', line2: '', city: 'New York', zip: 'NY 10012', country: 'United States', phone: '', isDefault: false },
  ]);
  const [cards, setCards] = useState<Card[]>([
    { id: 'c1', brand: 'VISA', last4: '4242', expiry: '12/28', isPrimary: true },
  ]);
  const [newAddr, setNewAddr] = useState({ label: '', line1: '', city: '', zip: '', country: '', phone: '' });
  const [newCard, setNewCard] = useState({ brand: 'VISA', last4: '', expiry: '' });

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push('/signin');
      return;
    }

    if (!user) {
      getProfile().catch(() => {
        router.push('/signin');
      });
    }
  }, [hasHydrated, token, user, getProfile, router]);

  useEffect(() => { if (message) { const t = setTimeout(() => setMessage(null), 3000); return () => clearTimeout(t); } }, [message]);

  const handleLogout = () => { logout(); router.push('/'); };
  const show = (text: string) => setMessage(text);

  const removeAddress = (id: string) => { setAddresses(prev => prev.filter(a => a.id !== id)); show('Address removed'); };
  const updateAddress = (id: string, field: keyof Address, value: string) => { setAddresses(prev => prev.map(a => a.id === id ? { ...a, [field]: value } : a)); };
  const addAddress = () => { if (!newAddr.label || !newAddr.line1) { show('Please fill label and street'); return; } setAddresses(prev => [...prev, { id: Date.now().toString(), ...newAddr, name: '', line2: '', isDefault: false }]); setNewAddr({ label: '', line1: '', city: '', zip: '', country: '', phone: '' }); setShowAddAddr(false); show('Address added'); };
  const removeCard = (id: string) => { setCards(prev => prev.filter(c => c.id !== id)); show('Card removed'); };
  const addCard = () => { if (!newCard.last4 || !newCard.expiry) { show('Please fill card details'); return; } setCards(prev => [...prev, { id: Date.now().toString(), ...newCard, isPrimary: prev.length === 0 }]); setNewCard({ brand: 'VISA', last4: '', expiry: '' }); setShowAddCard(false); show('Card added'); };

  const userName = user?.name || 'User';

  if (!hasHydrated || !token) {
    return null;
  }

  return (
    <div className="flex flex-col h-screen bg-[#F8F9FA] overflow-hidden w-full">
      <div className="shrink-0 relative z-50">
        <Header />
      </div>
      
      {/* Toast Notification */}
      {message && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-[60]">
          <div className="bg-white text-gray-900 px-5 py-3.5 rounded-lg shadow-[0_4px_24px_rgba(0,0,0,0.12)] border border-gray-200 text-sm font-medium flex items-center gap-2.5 min-w-[240px]">
            <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" /></svg>
            {message}
          </div>
        </div>
      )}

      <div className="flex flex-1 overflow-hidden">
        {/* Mobile Navigation Tabs */}
        <div className="lg:hidden absolute top-[73px] left-0 w-full flex overflow-x-auto gap-2 p-4 bg-white border-b border-gray-100 z-30 shrink-0 scrollbar-hide">
           {['orders', 'wishlist', 'addresses', 'payments', 'settings'].map(t => (
             <button key={t} onClick={() => setActiveTab(t)} className={`px-5 py-2.5 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${activeTab === t ? 'bg-red-50 text-red-600 border border-red-100' : 'text-gray-500 border border-gray-100 bg-gray-50'}`}>
               {t.charAt(0).toUpperCase() + t.slice(1)}
             </button>
           ))}
        </div>

        {/* Sidebar - Fixed on left */}
        <aside className="w-[240px] xl:w-[260px] bg-white border-r border-gray-200 shrink-0 flex flex-col z-20 hidden lg:flex">
          <div className="flex-1 flex flex-col h-full overflow-y-auto">

            {/* Navigation */}
            <nav className="flex-1 flex flex-col px-3 pt-5">
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider px-3 mb-2">Menu</p>
              <div className="space-y-0.5">
              {[
                { id: 'orders', label: 'Orders', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
                { id: 'wishlist', label: 'Wishlist', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg> },
                { id: 'addresses', label: 'Addresses', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
                { id: 'payments', label: 'Payments', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg> },
                { id: 'settings', label: 'Settings', icon: <svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg> },
              ].map((item) => (
                <button 
                  key={item.id}
                  onClick={() => { setActiveTab(item.id); setTrackingId(null); }} 
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium transition-colors ${activeTab === item.id ? 'bg-gray-100 text-gray-900' : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'}`}
                >
                  <span className={activeTab === item.id ? 'text-gray-700' : 'text-gray-400'}>{item.icon}</span>
                  {item.label}
                </button>
              ))}
              </div>

              {/* Logout */}
              <div className="mt-auto pt-4 pb-4 border-t border-gray-100">
                <button 
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-3 py-2 rounded-md text-[13px] font-medium text-gray-500 hover:text-red-600 hover:bg-red-50 transition-colors cursor-pointer"
                >
                  <svg className="w-[18px] h-[18px] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                  Logout
                </button>
              </div>
            </nav>
          </div>
        </aside>

          {/* Main Content Area */}
          <main className="flex-1 bg-[#F8F9FA] overflow-y-auto relative pt-20 lg:pt-0">
            <div className="max-w-6xl w-full p-4 md:p-8 lg:p-12 mx-auto pb-40 lg:pb-12">
              <AnimatePresence mode="wait">
              {activeTab === 'orders' && (
                <motion.div 
                  key="orders"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.3 }}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden"
                >
                  <div className="px-8 py-6 border-b border-gray-200 bg-white">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                      <div>
                        <h2 className="text-lg font-semibold text-gray-900">Order History</h2>
                        <p className="text-sm text-gray-500 mt-1">Track your recent purchases and active shipments</p>
                      </div>
                    </div>
                  </div>

                  <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm whitespace-nowrap">
                    <thead>
                      <tr className="bg-gray-50 border-b border-gray-200 text-gray-500 text-xs font-medium uppercase tracking-wider">
                        <th className="px-8 py-4">Order ID</th>
                        <th className="px-8 py-4">Date</th>
                        <th className="px-8 py-4">Status</th>
                        <th className="px-8 py-4">Total</th>
                        <th className="px-8 py-4 text-right">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 bg-white">
                      {myOrders.length === 0 ? (
                        <tr>
                          <td colSpan={5} className="px-8 py-20 text-center text-gray-500 font-medium">No orders found. Start shopping to see your history!</td>
                        </tr>
                      ) : (
                        myOrders.map(order => (
                        <Fragment key={order.id}>
                          <tr className="hover:bg-gray-50 transition-colors cursor-pointer" onClick={() => setTrackingId(trackingId === order.id ? null : order.id)}>
                            <td className="px-8 py-4 font-medium text-gray-900">{order.id}</td>
                            <td className="px-8 py-4 text-gray-500">{order.date}</td>
                            <td className="px-8 py-4">
                              <span className={`text-[10px] font-bold px-2 py-1 rounded-full border uppercase ${
                                order.status === 'Delivered' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 
                                order.status === 'Processing' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                'bg-blue-50 text-blue-600 border-blue-100'
                              }`}>
                                {order.status}
                              </span>
                            </td>
                            <td className="px-8 py-4 font-medium text-gray-900">₹{order.total.toFixed(2)}</td>
                            <td className="px-8 py-4 text-right">
                              <button 
                                className={`text-sm font-medium transition-colors focus:outline-none ${trackingId === order.id ? 'text-gray-500 bg-gray-100 hover:bg-gray-200 px-3 py-1.5 rounded-md' : 'text-red-600 hover:text-red-700'}`}
                              >
                                {trackingId === order.id ? 'Hide Details' : 'Track Package \u2192'}
                              </button>
                            </td>
                          </tr>
                          <AnimatePresence>
                            {trackingId === order.id && (
                              <motion.tr 
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: 'auto' }}
                                exit={{ opacity: 0, height: 0 }}
                                className="bg-gray-50/50"
                              >
                                <td colSpan={5} className="px-8 py-6 border-t border-gray-200">
                                  <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
                                    <div className="flex items-center justify-between mb-6">
                                      <h4 className="font-semibold text-gray-900">Tracking Overview</h4>
                                      <span className="text-xs font-semibold text-gray-500 bg-gray-100 px-2 py-1 rounded">Expedited Shipping</span>
                                    </div>
                                  <div className="space-y-6">
                                    <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 bg-green-500 rounded-full" />
                                        <div className="w-0.5 h-full bg-gray-200 my-1" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-900">Arrived at Local Distribution Center</p>
                                        <p className="text-xs text-gray-500">New York, NY - 10:45 AM</p>
                                      </div>
                                    </div>
                                    <div className="flex gap-4">
                                      <div className="flex flex-col items-center">
                                        <div className="w-3 h-3 border-2 border-gray-300 rounded-full bg-white" />
                                      </div>
                                      <div>
                                        <p className="text-sm font-medium text-gray-500">Out for Delivery</p>
                                        <p className="text-xs text-gray-400 italic">Pending...</p>
                                      </div>
                                    </div>
                                    </div>
                                  </div>
                                </td>
                              </motion.tr>
                          )}
                          </AnimatePresence>
                        </Fragment>
                      )))}
                    </tbody>
                  </table>
                </div>
              </motion.div>
            )}

            {activeTab === 'wishlist' && (
              <motion.div 
                key="wishlist"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 min-h-[500px]"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-8">Saved Items</h3>
                
                {wishlistIds.length === 0 ? (
                  <div className="flex flex-col items-center justify-center h-[300px] text-center">
                    <svg className="w-16 h-16 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
                    <p className="text-gray-500 font-medium">Your wishlist is currently empty.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {wishlistIds.map((id) => {
                      const item = getProductDetails(id);
                      if (!item) return null;
                      return (
                        <div key={item.id} className="group rounded-xl border border-gray-200 bg-white overflow-hidden hover:shadow-md transition-all relative flex flex-col">
                          <Link href={`/products/${item.id}`} className="aspect-square bg-gray-50 flex items-center justify-center overflow-hidden border-b border-gray-100 p-6">
                            <img src={item.image} alt={item.name} className="w-full h-full object-contain mix-blend-multiply group-hover:scale-105 transition-transform duration-500" />
                          </Link>
                          <div className="p-5 flex flex-col flex-1">
                            <div className="flex items-start justify-between gap-3 mb-2">
                              <Link href={`/products/${item.id}`} className="font-medium text-gray-900 hover:text-red-600 line-clamp-2 leading-snug">{item.name}</Link>
                              <button onClick={() => toggleWishlist(item.id)} className="text-red-500 hover:text-red-700 hover:bg-red-50 p-1.5 rounded-full transition-colors -mr-1.5 -mt-1.5 flex-shrink-0" title="Remove from wishlist">
                                <svg className="w-5 h-5" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" /></svg>
                              </button>
                            </div>
                            <div className="mt-auto pt-4 flex items-center justify-between">
                              <span className="font-semibold text-gray-900">₹{item.price.toFixed(2)}</span>
                              <button onClick={() => { addToCartStore(item.id); show('Added to cart!'); }} className="text-xs font-semibold bg-gray-900 hover:bg-black text-white px-3 py-1.5 rounded-lg transition-colors">Add to Cart</button>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === 'addresses' && (
              <motion.div 
                key="addresses"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-xl font-semibold text-gray-900">Saved Addresses</h3>
                  <button onClick={() => setShowAddAddr(!showAddAddr)} className="bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 px-4 py-2 rounded-lg font-medium text-sm transition-colors">
                    {showAddAddr ? 'Cancel' : 'Add Address'}
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
                    <div key={addr.id} className={`p-6 rounded-xl relative transition-all ${addr.isDefault ? 'border-2 border-gray-800 shadow-sm bg-white' : 'border border-gray-200 bg-gray-50/50 hover:border-gray-300'}`}>
                      {addr.isDefault && <span className="absolute top-4 right-4 bg-gray-100/50 text-gray-600 text-xs font-semibold px-2 py-1 border border-gray-200 rounded uppercase">Default</span>}
                      
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
                          <h4 className="font-semibold text-gray-900 mb-2">{addr.label}</h4>
                          <p className="text-gray-500 text-sm leading-relaxed mb-4">
                            {user?.name || 'User'}<br />{addr.line1}<br />{addr.city}, {addr.zip}<br />{addr.country}
                            {addr.phone && <><br />Phone: {addr.phone}</>}
                          </p>
                          <div className="flex gap-4">
                            <button onClick={() => setEditingAddrId(addr.id)} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors cursor-pointer">Edit</button>
                            <button onClick={() => removeAddress(addr.id)} className="text-sm font-medium text-red-600 hover:text-red-700 transition-colors cursor-pointer">Remove</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}

            {activeTab === 'payments' && (
              <motion.div 
                key="payments"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-sm border border-gray-200 p-8"
              >
                <h3 className="text-xl font-semibold text-gray-900 mb-8">Payment Methods</h3>
                <div className="space-y-4">
                  {cards.map(card => (
                    <div key={card.id} className="flex items-center justify-between p-6 rounded-xl border border-gray-200 bg-gray-50/50 hover:bg-white hover:border-gray-300 transition-all">
                      <div className="flex items-center gap-4">
                        <div className="w-14 h-10 border border-gray-200 rounded flex items-center justify-center text-gray-700 font-semibold text-xs tracking-wider bg-white shadow-sm">{card.brand}</div>
                        <div>
                          <h4 className="font-medium text-gray-900">{card.brand} ending in {card.last4}</h4>
                          <p className="text-xs text-gray-500">Expires {card.expiry}</p>
                        </div>
                      </div>
                      <div className="flex gap-6 items-center">
                        {card.isPrimary && <span className="text-xs font-medium text-gray-500 bg-white border border-gray-200 px-2 py-1 rounded">Primary</span>}
                        <button onClick={() => removeCard(card.id)} className="text-red-500 hover:text-red-700 transition-colors cursor-pointer p-1" title="Remove card"><svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></button>
                      </div>
                    </div>
                  ))}
                  {cards.length === 0 && <p className="text-gray-400 text-center py-4">No payment methods saved.</p>}

                  {showAddCard ? (
                    <div className="p-6 border border-gray-200 rounded-xl bg-gray-50/50 space-y-4">
                      <h4 className="font-semibold text-gray-900">Add New Card</h4>
                      <div className="grid grid-cols-3 gap-4">
                        <select value={newCard.brand} onChange={e => setNewCard({...newCard, brand: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900 bg-white">
                          <option>VISA</option><option>MASTERCARD</option><option>AMEX</option><option>RuPay</option>
                        </select>
                        <input placeholder="Last 4 digits" maxLength={4} value={newCard.last4} onChange={e => setNewCard({...newCard, last4: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" />
                        <input placeholder="MM/YY" maxLength={5} value={newCard.expiry} onChange={e => setNewCard({...newCard, expiry: e.target.value})} className="px-4 py-2 border border-gray-300 rounded-lg text-sm outline-none focus:ring-2 focus:ring-gray-900" />
                      </div>
                      <div className="flex gap-3">
                        <button onClick={addCard} className="bg-gray-900 text-white px-6 py-2 rounded-lg font-medium text-sm hover:bg-black transition-all">Save Card</button>
                        <button onClick={() => setShowAddCard(false)} className="text-gray-500 font-medium text-sm hover:text-gray-900 transition-colors">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button onClick={() => setShowAddCard(true)} className="w-full flex items-center justify-center gap-2 p-4 rounded-xl border border-dashed border-gray-300 text-gray-600 font-medium hover:border-gray-400 hover:bg-gray-50 transition-all">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
                      Add New Card
                    </button>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === 'settings' && (
              <motion.div 
                key="settings"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.3 }}
              >
                <SettingsTab user={user} setUser={useAuthStore.getState().setUser} logout={logout} router={router} show={show} />
              </motion.div>
            )}
            </AnimatePresence>
            </div>
          </main>
        </div>
      </div>
    );
  }
