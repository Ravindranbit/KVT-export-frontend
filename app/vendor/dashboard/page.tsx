'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../../components/layout/Header';
import { useAuthStore } from '../../../store/useAuthStore';
import { useProductStore } from '../../../store/useProductStore';

const MOCK_ORDERS = [
  { id: 'ORD-7821', customer: 'Arjun Mehta', date: 'Apr 05, 2026', total: 3450, status: 'Processing', items: 2 },
  { id: 'ORD-7819', customer: 'Priya Sharma', date: 'Apr 04, 2026', total: 1200, status: 'Shipped', items: 1 },
  { id: 'ORD-7815', customer: 'Vikram Patel', date: 'Apr 03, 2026', total: 8900, status: 'Delivered', items: 3 },
  { id: 'ORD-7810', customer: 'Sneha Reddy', date: 'Apr 02, 2026', total: 2750, status: 'Delivered', items: 1 },
  { id: 'ORD-7806', customer: 'Ravi Kumar', date: 'Apr 01, 2026', total: 5600, status: 'Delivered', items: 4 },
];

const MOCK_PAYOUTS = [
  { id: 'PAY-301', date: 'Apr 01, 2026', amount: 34200, status: 'Completed', method: 'Bank Transfer' },
  { id: 'PAY-289', date: 'Mar 15, 2026', amount: 28750, status: 'Completed', method: 'Bank Transfer' },
  { id: 'PAY-274', date: 'Mar 01, 2026', amount: 41300, status: 'Completed', method: 'Bank Transfer' },
];

export default function VendorDashboard() {
  const router = useRouter();
  const { user } = useAuthStore();
  const { products, addProduct, removeProduct } = useProductStore();

  const [activeTab, setActiveTab] = useState('overview');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('fashion');
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    setMounted(true);
    if (!user || user.role !== 'seller') {
      // For demo, if no user, we can stay, but in real app we redirect
      // router.push('/become-seller');
    }
  }, [user, router]);

  if (!mounted) return null;

  const stats = {
    revenue: 124500,
    orders: 86,
    views: 12540,
    rating: 4.8
  };

  const vendorProducts = products.filter(p => p.vendorId === (user?.id || 'v1'));
  const filteredProducts = vendorProducts.filter(p =>
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

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
  const sellerScore = 92;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Side Navigation Bar */}
      <aside className="fixed left-0 top-0 h-screen w-64 bg-white border-r border-gray-200 z-50 flex flex-col">
        {/* Logo Section */}
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-gray-900 flex items-center justify-center text-white text-sm font-bold">{displayLogo}</div>
          <div className="flex-1 min-w-0">
            <h2 className="font-bold text-gray-900 text-sm truncate">{displayName}&apos;s Store</h2>
          </div>
        </div>

        {/* Navigation Section */}
        <nav className="flex-1 py-6 px-4 space-y-1 overflow-y-auto">
          <p className="px-2 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">Menu</p>
          {([
            { id: 'overview', label: 'Dashboard', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg> },
            { id: 'products', label: 'Products', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>, badge: vendorProducts.length.toString() },
            { id: 'orders', label: 'Orders', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>, badge: '5' },
            { id: 'payouts', label: 'Payouts', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" /></svg> },
          ] as const).map(item => (
            <button key={item.id} onClick={() => setActiveTab(item.id)} className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === item.id ? 'bg-red-50 text-red-600' : 'text-gray-600 hover:bg-gray-50'}`}>
              <span className={`${activeTab === item.id ? 'text-red-500' : 'text-gray-400'}`}>{item.icon}</span>
              {item.label}
              {'badge' in item && item.badge && (
                <span className={`ml-auto py-0.5 px-2 rounded-full text-xs font-semibold ${activeTab === item.id ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>{item.badge}</span>
              )}
            </button>
          ))}
        </nav>

        {/* Seller Score Widget - Fixed at Bottom */}
        <div className="p-4 border-t border-gray-100">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 shrink-0">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 44 44">
                <circle cx="22" cy="22" r="18" fill="none" stroke="#f3f4f6" strokeWidth="4" />
                <circle cx="22" cy="22" r="18" fill="none" stroke="#10b981" strokeWidth="4" strokeLinecap="round" strokeDasharray={`${sellerScore * 1.13} 200`} />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-[10px] font-bold text-gray-900">{sellerScore}</span>
            </div>
            <div>
              <p className="text-xs font-semibold text-gray-500">Seller Score</p>
              <p className="text-sm font-bold text-green-600">Excellent</p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 ml-64 flex flex-col min-h-screen">
        <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
          <div className="px-8 py-4 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/" className="text-xl font-bold text-gray-900 tracking-tighter" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>
              <div className="h-4 w-px bg-gray-300" />
              <span className="font-semibold text-gray-500 text-sm uppercase tracking-wide">Seller Dashboard</span>
            </div>
            <div className="flex items-center gap-4">
              <button className="relative p-2 rounded-full hover:bg-gray-100 transition-colors text-gray-500 hover:text-gray-900">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                <span className="absolute top-2 right-2 w-2 h-2 bg-red-500 rounded-full border-2 border-white" />
              </button>
              <div className="h-5 w-px bg-gray-300" />
              <Link href={`/vendor/${user?.id || 'v1'}`} className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors flex items-center gap-1.5">
                View Store
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
              </Link>
            </div>
          </div>
        </header>

        <main className="flex-1 p-8">
          {/* Welcome Hero Card */}
          <div className="mb-8 bg-white border border-gray-200 rounded-xl p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-sm">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 mb-1">Dashboard Overview</h1>
              <p className="text-gray-500 font-medium text-sm">Welcome back, {user?.name || 'Partner'}. Here's what's happening with your store today.</p>
            </div>
            <button onClick={() => setShowAddModal(true)} className="bg-gray-900 hover:bg-black text-white px-5 py-2.5 rounded-lg font-medium transition-colors flex items-center gap-2 text-sm shrink-0">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" /></svg>
              Add Product
            </button>
          </div>

          <div className="bg-transparent">
            {activeTab === 'overview' && (
              <>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {[
                    { label: 'Total Revenue', value: `₹${stats.revenue.toLocaleString()}`, change: '+12.5%', up: true, color: 'emerald', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg> },
                    { label: 'Active Orders', value: stats.orders.toString(), change: '+4.1%', up: true, color: 'blue', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg> },
                    { label: 'Store Views', value: stats.views.toLocaleString(), change: '-1.2%', up: false, color: 'violet', icon: <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg> },
                    { label: 'Avg Rating', value: stats.rating.toString(), change: '142 reviews', up: true, color: 'amber', icon: <svg className="w-5 h-5 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg> },
                  ].map((stat, i) => (
                    <div key={i} className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
                      <div className="flex items-start justify-between mb-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${stat.color === 'emerald' ? 'bg-emerald-50 text-emerald-600' : stat.color === 'blue' ? 'bg-blue-50 text-blue-600' : stat.color === 'violet' ? 'bg-violet-50 text-violet-600' : 'bg-amber-50 text-amber-500'}`}>
                          {stat.icon}
                        </div>
                        <span className={`text-[11px] font-semibold px-2 py-0.5 rounded ${stat.up ? 'text-green-700 bg-green-50' : 'text-red-700 bg-red-50'}`}>{stat.change}</span>
                      </div>
                      <div>
                        <p className="text-gray-500 font-medium text-[11px] uppercase tracking-widest mb-1">{stat.label}</p>
                        <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="bg-white p-6 md:p-8 rounded-xl border border-gray-200 mt-8">
                  <div className="flex items-center justify-between mb-8">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 8v8m-4-5v5m-4-2v2m-2 4h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                      </div>
                      <div>
                        <h3 className="text-base font-bold text-gray-900">Revenue Analytics</h3>
                        <p className="text-gray-400 text-[11px] font-medium mt-0.5">Weekly sales performance</p>
                      </div>
                    </div>
                    <div className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100 uppercase tracking-widest flex items-center gap-1.5">
                      <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" /></svg>
                      +12.5% this month
                    </div>
                  </div>

                  <div className="flex h-64">
                    {/* Y-Axis */}
                    <div className="flex flex-col justify-between items-end pr-3 pb-8 text-[10px] font-semibold text-gray-300 tabular-nums w-12 shrink-0">
                      <span>₹150K</span>
                      <span>₹113K</span>
                      <span>₹75K</span>
                      <span>₹38K</span>
                      <span>₹0</span>
                    </div>

                    {/* Chart Area */}
                    <div className="flex-1 relative border-l border-b border-gray-100 flex items-end justify-around pb-8 px-3">
                      {/* Grid Lines */}
                      {[25, 50, 75, 100].map(line => (
                        <div key={line} className="absolute left-0 right-0 border-t border-dashed border-gray-100 z-0 pointer-events-none" style={{ bottom: `calc(${line}% + 32px)` }} />
                      ))}

                      {/* Bars */}
                      {[
                        { h: 45, day: 'Mon', val: 55350 },
                        { h: 75, day: 'Tue', val: 92250 },
                        { h: 52, day: 'Wed', val: 63960 },
                        { h: 95, day: 'Thu', val: 116850 },
                        { h: 68, day: 'Fri', val: 83640 },
                        { h: 100, day: 'Sat', val: 123000 },
                        { h: 88, day: 'Sun', val: 108240 },
                      ].map(({ h, day, val }, i) => (
                        <div key={i} className="flex flex-col items-center justify-end h-full relative group">
                          {/* Bar */}
                          <div
                            className="w-9 sm:w-11 md:w-12 rounded-t-md bg-emerald-400 group-hover:bg-emerald-500 transition-colors duration-200 relative z-10 cursor-pointer"
                            style={{ height: `calc(${h}% - 32px)` }}
                          >
                            {/* Tooltip */}
                            <div className="absolute -top-11 left-1/2 -translate-x-1/2 bg-gray-900 text-white text-[10px] font-bold py-1.5 px-3 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity shadow-lg pointer-events-none whitespace-nowrap z-30">
                              ₹{val.toLocaleString()}
                              <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2 rotate-45 w-1.5 h-1.5 bg-gray-900" />
                            </div>
                          </div>

                          {/* Day Label */}
                          <div className="absolute bottom-0 h-8 flex items-center">
                            <span className="text-[10px] font-semibold text-gray-400 uppercase tracking-wider group-hover:text-gray-700 transition-colors">
                              {day}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Recent Orders Preview */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden mt-8">
                  <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                    <h3 className="font-bold text-gray-900 text-sm">Recent Orders</h3>
                    <button onClick={() => setActiveTab('orders')} className="text-[10px] font-bold text-red-500 hover:text-red-700 uppercase tracking-wider transition-colors">View All →</button>
                  </div>
                  <div className="divide-y divide-gray-50">
                    {MOCK_ORDERS.slice(0, 3).map(order => (
                      <div key={order.id} className="px-6 py-4 flex items-center justify-between hover:bg-gray-50/50 transition-colors">
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-lg bg-gray-100 flex items-center justify-center text-gray-500">
                            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" /></svg>
                          </div>
                          <div>
                            <p className="text-sm font-semibold text-gray-900">{order.customer}</p>
                            <p className="text-[10px] text-gray-400 font-medium">{order.id} · {order.items} items</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-bold text-gray-900">₹{order.total.toLocaleString()}</p>
                          <span className={`text-[10px] font-bold ${order.status === 'Processing' ? 'text-amber-600' : order.status === 'Shipped' ? 'text-blue-600' : 'text-emerald-600'}`}>{order.status}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}

            {activeTab === 'products' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Store Inventory</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Total Active Items: {vendorProducts.length}</p>
                  </div>
                  {/* Search */}
                  <div className="relative w-full sm:w-64">
                    <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    <input value={searchQuery} onChange={e => setSearchQuery(e.target.value)} type="text" placeholder="Search products..." className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl text-sm font-medium outline-none focus:ring-2 focus:ring-gray-900/10 focus:border-gray-300 focus:bg-white transition-all placeholder:text-gray-400" />
                  </div>
                </div>

                {filteredProducts.length === 0 ? (
                  <div className="p-16 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-gray-100 flex items-center justify-center">
                      <svg className="w-8 h-8 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>
                    </div>
                    <h3 className="font-bold text-gray-900 text-lg mb-1">{searchQuery ? 'No products found' : 'No products yet'}</h3>
                    <p className="text-gray-400 text-sm mb-6">{searchQuery ? 'Try a different search term.' : 'Add your first product to get started.'}</p>
                    {!searchQuery && (
                      <button onClick={() => setShowAddModal(true)} className="bg-gray-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-black transition-all">
                        Add Product
                      </button>
                    )}
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] tracking-widest uppercase font-bold">
                          <th className="px-6 py-4">Product Details</th>
                          <th className="px-6 py-4">Price</th>
                          <th className="px-6 py-4">Category</th>
                          <th className="px-6 py-4">Inventory Status</th>
                          <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {filteredProducts.map(item => (
                          <tr key={item.id} className="hover:bg-gray-50/50 transition-all duration-200 group">
                            <td className="px-6 py-4 text-gray-900">
                              <div className="flex items-center gap-3">
                                <div className="w-11 h-11 bg-white border border-gray-100 rounded-xl p-1.5 overflow-hidden flex items-center justify-center shrink-0 shadow-sm group-hover:shadow-md transition-shadow">
                                  <img src={item.image} className="w-full h-full object-contain" alt="" />
                                </div>
                                <span className="font-semibold text-sm">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4 font-bold text-gray-900 text-sm">₹{item.price.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="bg-gray-100 text-gray-600 px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-widest">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-2">
                                <div className={`w-2 h-2 rounded-full ${(item.stock || 0) > 5 ? 'bg-emerald-500' : (item.stock || 0) > 0 ? 'bg-amber-500' : 'bg-red-500'}`} />
                                <span className={`font-semibold text-xs ${(item.stock || 0) > 5 ? 'text-emerald-700' : (item.stock || 0) > 0 ? 'text-amber-700' : 'text-red-700'}`}>
                                  {(item.stock || 0)} units
                                </span>
                              </div>
                            </td>
                            <td className="px-6 py-4 text-right">
                              <div className="flex items-center justify-end gap-1">
                                <button className="text-gray-400 hover:text-gray-700 transition-all cursor-pointer p-2 hover:bg-gray-100 rounded-lg" title="Edit Product">
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(item.id)}
                                  className="text-gray-400 hover:text-red-600 transition-all cursor-pointer p-2 hover:bg-red-50 rounded-lg"
                                  title="Delete Product"
                                >
                                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                                </button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="px-6 py-5 border-b border-gray-100 flex items-center justify-between">
                  <div>
                    <h2 className="text-lg font-bold text-gray-900">Customer Orders</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Manage and fulfil incoming orders</p>
                  </div>
                  <span className="text-[10px] font-bold text-gray-500 bg-gray-100 px-3 py-1.5 rounded-lg border border-gray-200 uppercase tracking-wider">{MOCK_ORDERS.length} Total</span>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] tracking-widest uppercase font-bold">
                        <th className="px-6 py-4">Order ID</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Items</th>
                        <th className="px-6 py-4">Total</th>
                        <th className="px-6 py-4">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {MOCK_ORDERS.map(order => (
                        <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                          <td className="px-6 py-4 font-bold text-sm text-gray-900">{order.id}</td>
                          <td className="px-6 py-4 text-sm font-medium text-gray-700">{order.customer}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.date}</td>
                          <td className="px-6 py-4 text-sm text-gray-500">{order.items}</td>
                          <td className="px-6 py-4 font-bold text-sm text-gray-900">₹{order.total.toLocaleString()}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full ${order.status === 'Processing' ? 'bg-amber-50 text-amber-700 border border-amber-200' :
                                order.status === 'Shipped' ? 'bg-blue-50 text-blue-700 border border-blue-200' :
                                  'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              }`}>
                              <span className={`w-1.5 h-1.5 rounded-full ${order.status === 'Processing' ? 'bg-amber-500' : order.status === 'Shipped' ? 'bg-blue-500' : 'bg-emerald-500'}`} />
                              {order.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === 'payouts' && (
              <div className="space-y-6">
                {/* Payout Summary Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 font-medium text-[11px] uppercase tracking-wider mb-1">Available Balance</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹18,650</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 font-medium text-[11px] uppercase tracking-wider mb-1">Total Earned</p>
                    <h3 className="text-2xl font-bold text-gray-900">₹1,04,250</h3>
                  </div>
                  <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                    <p className="text-gray-500 font-medium text-[11px] uppercase tracking-wider mb-1">Next Payout</p>
                    <h3 className="text-2xl font-bold text-gray-900">Apr 15</h3>
                  </div>
                </div>

                {/* Payout History */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                  <div className="px-6 py-5 border-b border-gray-100">
                    <h2 className="text-lg font-bold text-gray-900">Payout History</h2>
                    <p className="text-gray-400 font-bold text-[10px] uppercase tracking-widest mt-0.5">Past settlements to your bank account</p>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="bg-gray-50/50 border-b border-gray-100 text-gray-400 text-[10px] tracking-widest uppercase font-bold">
                          <th className="px-6 py-4">Payout ID</th>
                          <th className="px-6 py-4">Date</th>
                          <th className="px-6 py-4">Method</th>
                          <th className="px-6 py-4">Amount</th>
                          <th className="px-6 py-4">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-gray-50">
                        {MOCK_PAYOUTS.map(payout => (
                          <tr key={payout.id} className="hover:bg-gray-50/50 transition-colors">
                            <td className="px-6 py-4 font-bold text-sm text-gray-900">{payout.id}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{payout.date}</td>
                            <td className="px-6 py-4 text-sm text-gray-500">{payout.method}</td>
                            <td className="px-6 py-4 font-bold text-sm text-gray-900">₹{payout.amount.toLocaleString()}</td>
                            <td className="px-6 py-4">
                              <span className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                {payout.status}
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

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
