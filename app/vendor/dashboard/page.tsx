'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../store/useAuthStore';
import { useProductStore } from '../../../store/useProductStore';
import { useOrderStore } from '../../../store/useOrderStore';
import { useAdminStore } from '../../../store/useAdminStore';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import Link from 'next/link';

export default function VendorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { products, addProduct, removeProduct, updateProduct } = useProductStore();
  const { categories: adminCategories } = useAdminStore();
  const { orders, updateOrderStatus } = useOrderStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [message, setMessage] = useState<string | null>(null);
  
  // Multi-image state for modal
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);

  useEffect(() => {
    if (editingProduct) {
      setSelectedImages(editingProduct.images || (editingProduct.image ? [editingProduct.image] : []));
    } else {
      setSelectedImages([]);
    }
  }, [editingProduct]);

  const vendorOrders = user ? orders.filter(o => o.items.some(item => item.vendorId === user.id)) : [];
  const vendorProducts = products.filter(p => p.vendorId === user?.id);
  const filteredProducts = vendorProducts.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase()));

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  const stats = {
    revenue: vendorOrders.reduce((sum, o) => {
      const vendorItemsTotal = o.items
        .filter(item => item.vendorId === user?.id)
        .reduce((s, i) => s + (i.price * i.quantity), 0);
      return sum + vendorItemsTotal;
    }, 0),
    orders: vendorOrders.filter(o => o.status !== 'Delivered').length,
    views: 12540,
    rating: 4.8
  };

  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files) {
      const newUrls = Array.from(files).map(file => URL.createObjectURL(file));
      setSelectedImages(prev => [...prev, ...newUrls].slice(0, 6));
    }
  };

  const removeSelectedImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
  };

  const getStatusAction = (status: any): { next: any; label: string; color: string } | null => {
    switch(status) {
      case 'Processing': return { next: 'Shipped', label: 'Ship Order', color: 'bg-gray-900' };
      case 'Shipped': return { next: 'Arrived at Local Store', label: 'Mark Arrived at Store', color: 'bg-blue-600' };
      case 'Arrived at Local Store': return { next: 'Out for Delivery', label: 'Dispatch', color: 'bg-amber-600' };
      case 'Out for Delivery': return { next: 'Delivered', label: 'Complete Delivery', color: 'bg-emerald-600' };
      default: return null;
    }
  };

  const getStatusBadge = (status: any) => {
    const styles: Record<string, string> = {
      'Processing': 'bg-amber-50 text-amber-600 border-amber-100',
      'Shipped': 'bg-blue-50 text-blue-600 border-blue-100',
      'Arrived at Local Store': 'bg-purple-50 text-purple-600 border-purple-100',
      'Out for Delivery': 'bg-orange-50 text-orange-600 border-orange-100',
      'Delivered': 'bg-emerald-50 text-emerald-600 border-emerald-100'
    };
    return styles[status] || 'bg-gray-50 text-gray-500 border-gray-100';
  };

  const availableCategories = Array.from(new Set([
    'fashion', 'electronics', 'toys', 'beauty', 'sports',
    ...adminCategories.map(c => c.name.toLowerCase())
  ]));

  return (
    <div className="flex min-h-screen bg-white text-gray-900 font-sans">
      <aside className="w-64 bg-white flex-shrink-0 flex flex-col border-r border-gray-100 relative hidden lg:flex">
        <div className="p-8 pb-10">
          <div className="flex items-center gap-3 group cursor-pointer" onClick={() => router.push('/')}>
            <div>
              <h1 className="text-base font-black text-gray-900 tracking-tight uppercase leading-none">KVT</h1>
              <p className="text-[9px] font-bold text-gray-400 uppercase tracking-widest mt-1">Vendor dashboard</p>
            </div>
          </div>
        </div>

        <nav className="flex-1 px-4 space-y-1">
          {['overview', 'products', 'orders', 'payouts'].map((id) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg capitalize font-bold text-sm transition-all ${
                activeTab === id ? 'bg-red-50 text-red-600' : 'text-gray-500 hover:bg-gray-50'
              }`}
            >
              <span className="truncate">{id}</span>
              {id === 'orders' && <span className="ml-auto text-[10px] bg-red-100 px-1.5 rounded">{vendorOrders.length}</span>}
              {id === 'products' && <span className="ml-auto text-[10px] bg-gray-100 px-1.5 rounded">{vendorProducts.length}</span>}
            </button>
          ))}
        </nav>
      </aside>

      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-[#fafafa]">
        <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8 shrink-0">
          <h2 className="text-xl font-black text-gray-900 tracking-tight capitalize leading-none">{activeTab}</h2>
          <div className="flex items-center gap-4">
             <div className="text-right hidden sm:block">
                <p className="text-sm font-black text-gray-900 leading-none">{user?.name || 'Partner'}</p>
                <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Prime Vendor</p>
             </div>
          </div>
        </header>

        <div className="flex-1 overflow-y-auto p-8">
          <div className="max-w-[1400px] mx-auto space-y-8 animate-in fade-in duration-500">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                  <div className="lg:col-span-8 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 min-h-[380px] flex flex-col">
                    <div className="flex items-center justify-between mb-8">
                      <div><h3 className="text-lg font-black text-gray-900 leading-none">Sales Intelligence</h3><p className="text-[10px] font-black text-gray-400 uppercase mt-2">Verified Transactional Flow</p></div>
                    </div>
                    <div className="flex-1 w-full h-full min-h-[250px]">
                      <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={[
                          { name: 'Mon', sales: 420 },
                          { name: 'Tue', sales: 380 },
                          { name: 'Wed', sales: 550 },
                          { name: 'Thu', sales: 450 },
                          { name: 'Fri', sales: 700 },
                          { name: 'Sat', sales: 650 },
                          { name: 'Sun', sales: 800 },
                        ]} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                          <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f3f4f6" />
                          <XAxis dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dy={10} />
                          <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#9ca3af', fontWeight: 'bold' }} dx={-10} />
                          <Tooltip 
                            contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                            labelStyle={{ fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}
                            itemStyle={{ fontWeight: 'bold', color: '#dc2626' }}
                            cursor={{ stroke: '#f3f4f6', strokeWidth: 2 }}
                          />
                          <Line type="monotone" dataKey="sales" stroke="#dc2626" strokeWidth={3} dot={{ r: 4, fill: '#dc2626', strokeWidth: 0 }} activeDot={{ r: 6, strokeWidth: 0, fill: '#dc2626' }} />
                        </LineChart>
                      </ResponsiveContainer>
                    </div>
                  </div>
                  <div className="lg:col-span-4 bg-white p-8 rounded-[2rem] shadow-sm border border-gray-100 flex flex-col">
                    <div className="mb-6"><small className="text-[10px] font-black text-red-600 uppercase mb-1 block">Live Operations</small><h3 className="text-xl font-black text-gray-900 italic">Mission Board</h3></div>
                    <div className="space-y-3 flex-1">
                      {[{ label: 'Orders to Ship', count: vendorOrders.filter(o => o.status === 'Processing').length, urgency: 'high' }, { label: 'Stock Alerts', count: vendorProducts.filter(p => (p.stock || 0) < 5).length, urgency: 'medium' }].map((task, idx) => (
                        <div key={idx} className="p-5 bg-gray-50 border border-gray-100 rounded-2xl flex items-center justify-between">
                          <div><p className="text-[9px] font-black text-gray-400 uppercase">{task.label}</p><p className="text-sm font-black text-gray-900 mt-1">{task.count} Active</p></div>
                        </div>
                      ))}
                    </div>
                    <button onClick={() => { setEditingProduct(null); setShowAddModal(true); }} className="w-full py-4 mt-6 bg-red-600 text-white rounded-2xl font-black text-[10px] uppercase border-none cursor-pointer">+ Add New Product</button>
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                  {[{label:'Gross Revenue', v:`₹${stats.revenue.toLocaleString()}`}, {label:'Active Pipeline', v:stats.orders}, {label:'Global Reach', v:stats.views.toLocaleString()}, {label:'Expert Rating', v:stats.rating}].map((s,i) => (
                    <div key={i} className="bg-white p-7 rounded-[2rem] border border-gray-100 shadow-sm"><p className="text-[10px] font-black text-gray-400 uppercase">{s.label}</p><p className="text-2xl font-black mt-4 text-gray-900">{s.v}</p></div>
                  ))}
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-8 border-b border-gray-50 flex items-center justify-between">
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">Arsenal Management</h2>
                  <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} placeholder="Filter Arsenal..." className="px-5 py-2 style-none bg-gray-50 border border-gray-200 rounded-xl text-xs font-bold outline-none" />
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                     <thead><tr className="bg-gray-50/50 text-[10px] font-black text-gray-400 uppercase border-b border-gray-50"><th className="px-8 py-5">Product Details</th><th className="px-8 py-5">Price</th><th className="px-8 py-5">Stock</th><th className="px-8 py-5 text-right">Controls</th></tr></thead>
                     <tbody className="divide-y divide-gray-50">
                       {filteredProducts.map(p => (
                         <tr key={p.id} className="hover:bg-gray-50/20">
                           <td className="px-8 py-5 flex items-center gap-3"><div className="w-12 h-12 bg-gray-50 rounded-lg p-1 border border-gray-100"><img src={p.image} className="w-full h-full object-contain" /></div><span className="font-bold text-sm">{p.name}</span></td>
                           <td className="px-8 py-5 font-black text-sm">₹{p.price.toLocaleString()}</td>
                           <td className="px-8 py-5 font-bold text-xs text-gray-500">{p.stock || 0} Units</td>
                           <td className="px-8 py-5 text-right flex items-center justify-end gap-6">
                             <button onClick={() => {setEditingProduct(p); setShowAddModal(true);}} className="text-gray-900 font-black text-[10px] uppercase border-none bg-transparent cursor-pointer hover:text-red-600 transition-colors tracking-widest">Modify Asset</button>
                             <button 
                               onClick={() => {
                                 if(window.confirm('Secure Protocol: Are you sure you want to decommission this asset?')) {
                                   removeProduct(p.id);
                                   setMessage('Asset Decommissioned');
                                 }
                               }} 
                               className="w-8 h-8 rounded-lg bg-red-50 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-all border-none cursor-pointer shadow-sm shadow-red-600/5 group"
                               title="Decommission Asset"
                             >
                               ✕
                             </button>
                           </td>
                         </tr>
                       ))}
                     </tbody>
                   </table>
                </div>
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-[2rem] shadow-sm border border-gray-100 overflow-hidden animate-in fade-in duration-500">
                <div className="p-8 border-b border-gray-50"><h2 className="text-xl font-black text-gray-900 leading-none">Logistics Stream</h2></div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left">
                    <thead><tr className="bg-gray-50/50 border-b border-gray-50 text-gray-400 text-[10px] uppercase font-black"><th className="px-8 py-5">Order Reference</th><th className="px-8 py-5">Recipient</th><th className="px-8 py-5">Phase Status</th><th className="px-8 py-5 text-right">Dispatch Controls</th></tr></thead>
                    <tbody className="divide-y divide-gray-50">
                      {vendorOrders.map(order => {
                        const action = getStatusAction(order.status);
                        return (
                          <tr key={order.id} className="hover:bg-gray-50/30 transition-all font-bold">
                            <td className="px-8 py-6 text-gray-900 text-sm italic">{order.id}</td>
                            <td className="px-8 py-6 text-sm text-gray-600">{order.customerName}</td>
                            <td className="px-8 py-6"><span className={`text-[10px] font-black px-3 py-1.5 rounded-full border uppercase ${getStatusBadge(order.status)}`}>{order.status}</span></td>
                            <td className="px-8 py-6 text-right">
                              {action ? <button onClick={() => { updateOrderStatus(order.id, action.next); setMessage(`Status updated`); }} className={`${action.color} text-white px-4 py-2 rounded-xl text-[9px] font-black uppercase border-none cursor-pointer`}>{action.label}</button> : <span className="text-[10px] font-black text-emerald-600 uppercase">Complete</span>}
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        </div>
      </main>

      {/* ADVANCED ARSENAL DETAILER MODAL */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/40 backdrop-blur-md p-4 animate-in fade-in zoom-in duration-300">
          <div className="bg-white rounded-[2.5rem] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="p-8 border-b border-gray-100 flex items-center justify-between shrink-0 bg-white">
               <div>
                  <h2 className="text-xl font-black text-gray-900 tracking-tight">{editingProduct ? 'Modify Asset' : 'Secure New Entry'}</h2>
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mt-1">Inventory Management Protocol</p>
               </div>
               <button onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="w-10 h-10 rounded-xl bg-gray-50 text-gray-400 hover:text-gray-900 flex items-center justify-center cursor-pointer border-none transition-all">✕</button>
            </div>
            
            <form onSubmit={(e) => {
              e.preventDefault();
              const fd = new FormData(e.currentTarget);
              const p: any = {
                id: editingProduct?.id || Math.floor(Math.random()*100000),
                name: fd.get('name') as string,
                price: parseFloat(fd.get('price') as string),
                stock: parseInt(fd.get('stock') as string),
                image: selectedImages[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800',
                images: selectedImages,
                vendorId: user?.id || 'v1',
                category: fd.get('category') as string,
                description: fd.get('description') as string,
                rating: editingProduct?.rating || 4.5,
                reviews: editingProduct?.reviews || 0
              };
              editingProduct ? updateProduct(p.id, p) : addProduct(p);
              setShowAddModal(false); 
              setEditingProduct(null);
              setMessage(editingProduct ? 'Asset Updated' : 'Asset Recorded');
            }} className="flex-1 overflow-y-auto flex flex-col lg:flex-row [scrollbar-width:none]">
              
              {/* IMAGE ARSENAL (LEFT) */}
              <div className="w-full lg:w-[400px] bg-gray-50/50 p-8 border-r border-gray-100">
                 <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-4 block">Product Gallery (Max 6)</label>
                 <div className="grid grid-cols-2 gap-4">
                    {selectedImages.map((img, idx) => (
                      <div key={idx} className="aspect-square rounded-2xl bg-white border border-gray-200 relative group overflow-hidden shadow-sm">
                        <img src={img} className="w-full h-full object-contain p-2" alt="" />
                        <button type="button" onClick={() => removeSelectedImage(idx)} className="absolute top-2 right-2 w-6 h-6 bg-red-600 text-white rounded-lg flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all border-none cursor-pointer">✕</button>
                        {idx === 0 && <span className="absolute bottom-2 left-2 bg-gray-900 border border-white/20 text-[8px] font-black text-white px-2 py-0.5 rounded shadow">PRIMARY</span>}
                      </div>
                    ))}
                    {selectedImages.length < 6 && (
                      <button 
                        type="button" 
                        onClick={() => fileInputRef.current?.click()}
                        className="aspect-square rounded-2xl bg-white border border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-red-500 hover:bg-red-50/30 transition-all cursor-pointer group"
                      >
                        <span className="text-2xl text-gray-300 group-hover:text-red-500 transition-all">+</span>
                        <span className="text-[9px] font-black text-gray-400 uppercase group-hover:text-red-600 transition-all">Upload</span>
                      </button>
                    )}
                 </div>
                 <input type="file" ref={fileInputRef} onChange={handleImageSelect} className="hidden" multiple accept="image/*" />
                 <p className="mt-6 text-[9px] font-bold text-gray-400 leading-relaxed italic border-l-2 border-gray-200 pl-4">Note: The primary image will be used as the featured visual across high-reach zones.</p>
              </div>

              {/* TECHNICAL SPECS (RIGHT) */}
              <div className="flex-1 p-8 space-y-6">
                 <div className="space-y-4">
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Core Identification</label>
                      <input name="name" defaultValue={editingProduct?.name} required placeholder="Asset Identity (e.g. Classic Premium T-Shirt)" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900 focus:ring-2 focus:ring-red-500/10 focus:border-red-500/20" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Market Valuation (INR)</label>
                         <input name="price" type="number" step="0.01" defaultValue={editingProduct?.price} required placeholder="749.00" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-red-500/10" />
                       </div>
                       <div>
                         <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Logistics Surplus (Stock)</label>
                         <input name="stock" type="number" defaultValue={editingProduct?.stock} required placeholder="100" className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold focus:ring-2 focus:ring-red-500/10" />
                       </div>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Market Categorization</label>
                      <select name="category" defaultValue={editingProduct?.category} className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900 appearance-none">
                         {availableCategories.map(cat => (
                           <option key={cat} value={cat}>{cat.toUpperCase()}</option>
                         ))}
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] font-black text-gray-400 uppercase tracking-widest mb-2 block">Intellectual Description</label>
                      <textarea name="description" rows={4} defaultValue={editingProduct?.description} placeholder="Describe the premium attributes and technical specifications of this asset..." className="w-full px-5 py-4 bg-gray-50 border border-gray-200 rounded-2xl outline-none font-bold text-gray-900 resize-none h-[120px]" />
                    </div>
                 </div>
                 
                 <div className="pt-4 flex gap-4">
                    <button type="submit" className="flex-1 py-4 bg-gray-900 text-white rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer hover:bg-black transition-all shadow-xl shadow-gray-900/10">Confirm Allocation</button>
                    <button type="button" onClick={() => { setShowAddModal(false); setEditingProduct(null); }} className="px-8 py-4 bg-gray-100 text-gray-500 rounded-2xl font-black text-[10px] uppercase tracking-widest cursor-pointer border-none transition-all">Cancel</button>
                 </div>
              </div>
            </form>
          </div>
        </div>
      )}
      
      {message && (
        <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] bg-gray-900 text-white px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-2xl animate-in slide-in-from-bottom-4 duration-300">
          {message}
        </div>
      )}
    </div>
  );
}
