'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import { useAuthStore } from '../../../store/useAuthStore';
import { useProductStore } from '../../../store/useProductStore';

export default function VendorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { products, addProduct, removeProduct } = useProductStore();
  
  const [activeTab, setActiveTab] = useState('products');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'seller') {
      // For demo, if no user, we can stay, but in real app we redirect
      // router.push('/become-seller');
    }
  }, [user, router]);

  if (!mounted) return null;

  // Mock stats since we don't have a backend for orders yet
  const stats = {
    revenue: 124500,
    orders: 86,
    views: 12540,
    rating: 4.8
  };

  const vendorProducts = products.filter(p => p.vendorId === (user?.id || 'v1'));

  const handleAddProduct = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const price = parseFloat(formData.get('price') as string);
    const name = formData.get('name') as string;
    const description = formData.get('description') as string;
    const category = formData.get('category') as string;
    const stock = parseInt(formData.get('stock') as string) || 0;
    const sku = formData.get('sku') as string;
    const sizesStr = formData.get('sizes') as string;
    const colorsStr = formData.get('colors') as string;
    const imageFile = formData.get('imageFile') as File;

    // Simulate S3 Upload by creating a local URL
    let imageUrl = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?q=80&w=800';
    if (imageFile && imageFile.size > 0) {
      imageUrl = URL.createObjectURL(imageFile);
    }

    const brand = formData.get('brand') as string;
    const weight = formData.get('weight') as string;
    const l = formData.get('dim_l') as string;
    const w = formData.get('dim_w') as string;
    const h = formData.get('dim_h') as string;

    const specs: Record<string, string> = {};
    if (category === 'fashion') {
      specs.material = formData.get('material') as string;
      specs.fit = formData.get('fit') as string;
    } else if (category === 'electronics') {
      specs.warranty = formData.get('warranty') as string;
      specs.battery = formData.get('battery') as string;
    } else if (category === 'home') {
      specs.material = formData.get('material') as string;
      specs.care = formData.get('care') as string;
    } else if (category === 'beauty') {
      specs.skinType = formData.get('skinType') as string;
    }

    const newProduct: any = {
      id: Math.floor(Math.random() * 1000000),
      name,
      price,
      image: imageUrl,
      category: category || 'fashion',
      description: description || 'A premium quality product added by our verified vendor.',
      rating: 5,
      reviews: 0,
      vendorId: user?.id || 'v1',
      stock,
      sku,
      brand,
      weight,
      dimensions: { l, w, h },
      specifications: specs
    };

    if (sizesStr) {
      newProduct.sizes = sizesStr.split(',').map(s => s.trim()).filter(s => s);
    }
    if (colorsStr) {
      newProduct.colors = colorsStr.split(',').map(c => ({
        name: c.trim(),
        hex: '#000000'
      })).filter(c => c.name);
    }

    addProduct(newProduct);
    setShowAddModal(false);
  };

  const handleDeleteProduct = (id: number) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      removeProduct(id);
    }
  };

  const displayName = user?.storeName || user?.name || 'Vendor';
  const displayLogo = user?.storeName?.substring(0, 2).toUpperCase() || 'V';

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Navigation specifically for Vendor internal view */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link href="/" className="text-2xl font-bold text-gray-900 tracking-tighter" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>
            <div className="h-6 w-px bg-gray-200" />
            <span className="font-bold tracking-tight text-gray-900 text-lg">Seller Central</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href={`/vendor/${user?.id || 'v1'}`} className="text-sm font-bold text-gray-900 hover:underline transition-colors">
              View Public Storefront
            </Link>
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-gray-700">{displayName}</span>
              <div className="w-9 h-9 bg-gray-100 text-gray-900 rounded-lg flex items-center justify-center font-bold text-sm border border-gray-200">
                {displayLogo}
              </div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-10 md:py-14">
        <div className="mb-10 flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-gray-200 pb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 tracking-tight mb-2">Welcome Back, {displayName}</h1>
            <p className="text-gray-500 font-medium">Manage your products and track your store performance.</p>
          </div>
          <button onClick={() => setShowAddModal(true)} className="bg-gray-900 hover:bg-black text-white px-8 py-4 rounded font-bold transition-all shadow-lg hover:-translate-y-0.5 flex items-center gap-2 w-full md:w-auto justify-center uppercase tracking-wider text-xs">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" /></svg>
            Add New Product
          </button>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          
          {/* Sidebar */}
          <div className="w-full lg:w-64 shrink-0">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sticky top-28">
              <nav className="space-y-1">
                <button onClick={() => setActiveTab('overview')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'overview' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
                  Overview
                </button>
                <button onClick={() => setActiveTab('products')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'products' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                  My Products
                </button>
                <button onClick={() => setActiveTab('orders')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'orders' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                  Orders
                  <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-bold ${activeTab === 'orders' ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-700'}`}>12</span>
                </button>
                <button onClick={() => setActiveTab('payouts')} className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg font-bold transition-all ${activeTab === 'payouts' ? 'bg-gray-900 text-white shadow-md' : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}`}>
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                  Payouts
                </button>
              </nav>
              
              <div className="mt-8 pt-6 border-t border-gray-100">
                <div className="bg-gray-100 p-4 rounded-lg">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1">PRO SELLER STATUS</p>
                  <p className="text-gray-900 font-bold text-xs leading-relaxed">Your store is operating at peak efficiency.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 space-y-8">
            
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {/* Stat Cards */}
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group">
                    <p className="text-gray-400 font-bold text-[10px] mb-1 uppercase tracking-widest">Total Revenue</p>
                    <div className="flex items-end justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">₹{stats.revenue.toLocaleString()}</h3>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">↑ 12.5%</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group">
                    <p className="text-gray-400 font-bold text-[10px] mb-1 uppercase tracking-widest">Active Orders</p>
                    <div className="flex items-end justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stats.orders}</h3>
                      <span className="text-[10px] font-bold text-green-600 bg-green-50 px-2 py-0.5 rounded border border-green-100">↑ 4.1%</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group">
                    <p className="text-gray-400 font-bold text-[10px] mb-1 uppercase tracking-widest">Store Views</p>
                    <div className="flex items-end justify-between">
                      <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stats.views.toLocaleString()}</h3>
                      <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-0.5 rounded border border-gray-100">↓ 1.2%</span>
                    </div>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 group">
                    <p className="text-gray-400 font-bold text-[10px] mb-1 uppercase tracking-widest">Average Rating</p>
                    <div className="flex items-end justify-between">
                      <div className="flex items-center gap-2">
                        <h3 className="text-2xl font-bold text-gray-900 tracking-tight">{stats.rating}</h3>
                        <div className="flex text-yellow-400">
                          <svg className="w-4 h-4 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                        </div>
                      </div>
                      <span className="text-[10px] font-bold text-gray-400">142 reviews</span>
                    </div>
                  </div>
                </div>

                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200">
                  <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="font-bold text-gray-900 text-xl tracking-tight">Revenue Analytics</h3>
                      <p className="text-gray-400 font-bold text-[10px] mt-1 uppercase tracking-widest">Earnings Performance (INR)</p>
                    </div>
                  </div>
                  <div className="h-72 border-b-2 border-gray-100 relative flex items-end justify-between px-6 pb-2 pt-10">
                    {[45, 75, 52, 95, 68, 100, 88].map((h, i) => (
                      <div key={i} className="w-[10%] bg-emerald-500 hover:bg-emerald-600 rounded-t transition-all duration-300 relative group cursor-pointer" style={{ height: `${h}%` }}>
                        <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded opacity-0 group-hover:opacity-100 transition-all shadow-xl whitespace-nowrap z-20">
                          ₹{(h * 1230).toLocaleString()}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="flex justify-between mt-6 text-[10px] font-bold text-gray-400 px-6 uppercase tracking-widest">
                    <span>Mon</span><span>Tue</span><span>Wed</span><span>Thu</span><span>Fri</span><span>Sat</span><span>Sun</span>
                  </div>
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-8 border-b border-gray-100 bg-gray-50/30 flex items-center justify-between">
                  <div>
                    <h2 className="text-xl font-bold text-gray-900">Store Inventory</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-1">Total Active Items: {vendorProducts.length}</p>
                  </div>
                </div>
                
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-white border-b border-gray-200 text-gray-400 text-[10px] tracking-widest uppercase font-bold">
                        <th className="px-8 py-5">Product Details</th>
                        <th className="px-8 py-5">Price</th>
                        <th className="px-8 py-5">Category</th>
                        <th className="px-8 py-5">Inventory Status</th>
                        <th className="px-8 py-5 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {vendorProducts.map(item => (
                        <tr key={item.id} className="hover:bg-gray-50 transition-all duration-200 group">
                          <td className="px-8 py-6 text-gray-900">
                            <div className="flex items-center gap-4">
                              <div className="w-12 h-12 bg-white border border-gray-100 rounded-lg p-2 overflow-hidden flex items-center justify-center shrink-0 shadow-sm">
                                <img src={item.image} className="w-full h-full object-contain" alt="" />
                              </div>
                               <span className="font-bold text-base">{item.name}</span>
                            </div>
                          </td>
                          <td className="px-8 py-6 font-bold text-gray-900">₹{item.price.toLocaleString()}</td>
                          <td className="px-8 py-6 capitalise">
                             <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded text-[10px] font-bold uppercase tracking-widest">
                               {item.category}
                             </span>
                          </td>
                          <td className="px-8 py-6">
                            <div className="flex items-center gap-2">
                              <div className={`w-1.5 h-1.5 rounded-full ${(item.stock || 0) > 5 ? 'bg-green-500' : 'bg-red-500'}`} />
                              <span className={`font-bold text-xs ${(item.stock || 0) > 5 ? 'text-green-700' : 'text-red-700'}`}>
                                {(item.stock || 0)} Units Available
                              </span>
                            </div>
                          </td>
                          <td className="px-8 py-6 text-right">
                            <button 
                              onClick={() => handleDeleteProduct(item.id)}
                              className="text-gray-400 hover:text-gray-900 transition-all cursor-pointer p-2 hover:bg-gray-100 rounded" 
                              title="Delete Product"
                            >
                              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab !== 'overview' && activeTab !== 'products' && (
              <div className="bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 p-12 text-center h-64 flex flex-col items-center justify-center">
                <h3 className="text-2xl font-bold text-gray-900 mb-2 capitalize">{activeTab} Details</h3>
                <p className="text-gray-500 font-medium">This section handles {activeTab} operations for your vendor account.</p>
              </div>
            )}

          </div>
        </div>
      </main>

      {/* Add Product Modal Overlay */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-300">
          <div className="bg-white rounded-xl shadow-2xl w-full max-w-lg animate-in zoom-in-95 duration-300 flex flex-col max-h-[90vh]">
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between bg-white shrink-0">
              <h2 className="text-xl font-bold text-gray-900 tracking-tight">Create New Product</h2>
              <button type="button" onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-900 p-2 rounded-lg transition-all">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="overflow-y-auto flex-1 p-8">
              <form onSubmit={handleAddProduct} className="space-y-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Product Name</label>
                  <input name="name" type="text" required placeholder="Ex: Classic Black T-Shirt" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Price (₹)</label>
                    <input name="price" type="number" step="0.01" min="0" required placeholder="0.00" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Category</label>
                    <select 
                      name="category" 
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold transition-all"
                    >
                      <option value="fashion">Fashion</option>
                      <option value="electronics">Electronics</option>
                      <option value="home">Home</option>
                      <option value="beauty">Beauty</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Units Available</label>
                    <input name="stock" type="number" min="0" required placeholder="Quantity" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">SKU (Internal ID)</label>
                    <input name="sku" type="text" placeholder="Ex: KVT-001" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Brand</label>
                    <input name="brand" type="text" placeholder="Ex: KVT Originals" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Weight (kg)</label>
                    <input name="weight" type="text" placeholder="Ex: 0.5" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                </div>

                {/* Dynamic Category Fields */}
                <div className="bg-gray-50 p-6 rounded-lg space-y-4 border border-gray-100">
                  <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2">Category Specific Details</p>
                  
                  {selectedCategory === 'fashion' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Material</label>
                        <input name="material" type="text" placeholder="Cotton, Silk" className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Fit Type</label>
                        <select name="fit" className="w-full px-4 py-3 bg-white border border-gray-200 rounded outline-none font-bold">
                          <option value="regular">Regular Fit</option>
                          <option value="slim">Slim Fit</option>
                          <option value="oversized">Oversized</option>
                        </select>
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'electronics' && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Warranty (Months)</label>
                        <input name="warranty" type="number" placeholder="12" className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Battery Capacity</label>
                        <input name="battery" type="text" placeholder="5000mAh" className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900" />
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'home' && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Primary Material</label>
                        <input name="material" type="text" placeholder="Oak Wood, Metal" className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900" />
                      </div>
                      <div>
                        <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Care Instructions</label>
                        <input name="care" type="text" placeholder="Wipe with damp cloth" className="w-full px-4 py-3 bg-white border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-gray-900" />
                      </div>
                    </div>
                  )}

                  {selectedCategory === 'beauty' && (
                    <div>
                      <label className="block text-[10px] font-bold text-gray-600 uppercase tracking-widest mb-1.5">Recommended Skin Type</label>
                      <select name="skinType" className="w-full px-4 py-3 bg-white border border-gray-200 rounded outline-none font-bold">
                        <option value="all">All Skin Types</option>
                        <option value="dry">Dry</option>
                        <option value="oily">Oily</option>
                        <option value="sensitive">Sensitive</option>
                      </select>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Available Sizes</label>
                    <input name="sizes" type="text" placeholder="S, M, L, XL" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                  <div>
                    <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Available Colors</label>
                    <input name="colors" type="text" placeholder="Red, Black, Blue" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-bold text-gray-900 transition-all placeholder:font-normal" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Dimensions (L × W × H) cm</label>
                  <div className="grid grid-cols-3 gap-3">
                    <input name="dim_l" type="text" placeholder="L" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-center" />
                    <input name="dim_w" type="text" placeholder="W" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-center" />
                    <input name="dim_h" type="text" placeholder="H" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 outline-none font-bold text-center" />
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Product Description</label>
                  <textarea name="description" required rows={3} placeholder="Write something about this product..." className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded focus:ring-2 focus:ring-gray-900 focus:bg-white outline-none font-medium text-gray-900 transition-all resize-none"></textarea>
                </div>

                <div>
                  <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-1.5">Product Image</label>
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-gray-200 border-dashed rounded cursor-pointer bg-gray-50 hover:bg-gray-100 transition-all">
                      <div className="flex flex-col items-center justify-center pt-5 pb-6 text-gray-400">
                        <svg className="w-8 h-8 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                        <p className="text-xs font-bold tracking-tight"><span className="text-gray-900">Upload Image</span> or drag & drop</p>
                      </div>
                      <input name="imageFile" type="file" accept="image/*" className="hidden" required />
                    </label>
                  </div>
                </div>
                
                <div className="pt-6 border-t border-gray-100 flex gap-4">
                  <button type="button" onClick={() => setShowAddModal(false)} className="flex-1 bg-white border border-gray-200 hover:border-gray-900 text-gray-900 font-bold py-3.5 rounded transition-all">
                    Cancel
                  </button>
                  <button type="submit" className="flex-[2] bg-gray-900 hover:bg-black text-white font-bold py-3.5 rounded transition-all shadow-md hover:-translate-y-0.5">
                    Save Product
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
