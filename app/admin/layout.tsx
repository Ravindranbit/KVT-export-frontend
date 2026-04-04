'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuthStore } from '../../store/useAuthStore';
import { useAdminStore } from '../../store/useAdminStore';
import { useProductStore } from '../../store/useProductStore';
import { ChevronRight, Shield, Settings, Database, Lock } from 'lucide-react';
import Link from 'next/link';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/admin', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 5a1 1 0 011-1h4a1 1 0 011 1v5a1 1 0 01-1 1H5a1 1 0 01-1-1V5zm10 0a1 1 0 011-1h4a1 1 0 011 1v2a1 1 0 01-1 1h-4a1 1 0 01-1-1V5zM4 16a1 1 0 011-1h4a1 1 0 011 1v3a1 1 0 01-1 1H5a1 1 0 01-1-1v-3zm10-3a1 1 0 011-1h4a1 1 0 011 1v6a1 1 0 01-1 1h-4a1 1 0 01-1-1v-6z" /></svg>) },
  { label: 'Products', href: '/admin/products', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" /></svg>) },
  { label: 'Orders', href: '/admin/orders', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" /></svg>) },
  { label: 'Users', href: '/admin/users', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" /></svg>) },
  { label: 'Vendors', href: '/admin/vendors', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 100 4 2 2 0 000-4z" /></svg>) },
];

const CONTENT_ITEMS = [
  { label: 'Categories', href: '/admin/categories', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A2 2 0 013 12V7a4 4 0 014-4z" /></svg>) },
  { label: 'Banners', href: '/admin/banners', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>) },
];

const SYSTEM_ITEMS = [
  { label: 'Settings', href: '/admin/settings', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.066 2.573c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.573 1.066c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.066-2.573c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>) },
  { label: 'Profile', href: '/admin/profile', icon: (<svg className="w-[18px] h-[18px]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>) },
];

function NavItem({ item, isActive }: { item: { label: string; href: string; icon: React.ReactNode }; isActive: boolean }) {
  return (
    <Link
      href={item.href}
      className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-medium transition-all duration-150 group ${
        isActive
          ? 'bg-red-50 text-red-700 font-bold'
          : 'text-gray-500 hover:text-gray-900 hover:bg-gray-50'
      }`}
    >
      {isActive && <span className="absolute left-0 top-1/2 -translate-y-1/2 w-[3px] h-5 bg-red-600 rounded-r-full" />}
      <span className={`${isActive ? 'text-red-600' : 'text-gray-400 group-hover:text-gray-600'} transition-colors`}>{item.icon}</span>
      {item.label}
    </Link>
  );
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, hasHydrated, logout } = useAuthStore();
  const { orders, vendors } = useAdminStore();
  const { products } = useProductStore();
  const router = useRouter();
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showNotif, setShowNotif] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearch, setShowSearch] = useState(false);

  useEffect(() => {
    if (!hasHydrated) return;
    if (!user || user.role !== 'admin') {
      router.push('/signin');
    }
  }, [user, hasHydrated, router]);

  if (!hasHydrated) return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Restoring system state...</div>;
  if (!user || user.role !== 'admin') return <div className="min-h-screen bg-white flex items-center justify-center text-gray-400">Redirecting...</div>;

  const pendingOrders = orders.filter(o => o.status === 'pending').length;
  const pendingVendors = vendors.filter(v => v.status === 'pending').length;
  const notifCount = pendingOrders + pendingVendors;
  const pageTitle = pathname === '/admin' ? 'Dashboard' : pathname.split('/').pop()?.replace(/-/g, ' ') || '';

  // Search results
  const searchResults = searchQuery.length > 1 ? {
    products: products.filter(p => p.name.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
    orders: orders.filter(o => o.id.toLowerCase().includes(searchQuery.toLowerCase()) || o.customerName.toLowerCase().includes(searchQuery.toLowerCase())).slice(0, 3),
  } : null;

  const isItemActive = (href: string) => pathname === href || (href !== '/admin' && pathname.startsWith(href));

  const SidebarContent = () => (
    <>
      {/* Logo */}
      <div className="px-5 h-[57px] flex items-center border-b border-gray-200">
        <Link href="/admin" className="flex items-baseline gap-1.5" onClick={() => setSidebarOpen(false)}>
          <span className="text-[22px] font-black text-gray-900 tracking-tight">KVT</span>
          <span className="text-[13px] text-gray-400 font-medium">admin panel</span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-5 space-y-0.5 overflow-y-auto">
        {/* Menu Section */}
        {(() => {
          const items = NAV_ITEMS.filter(i => user.permissions?.[i.label.toLowerCase() as keyof typeof user.permissions] !== false);
          if (items.length === 0) return null;
          return (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-3 mb-2">Menu</p>
              {items.map(item => <NavItem key={item.href} item={item} isActive={isItemActive(item.href)} />)}
            </>
          );
        })()}

        {/* Content Section */}
        {(() => {
          const items = CONTENT_ITEMS.filter(i => user.permissions?.[i.label.toLowerCase() as keyof typeof user.permissions] !== false);
          if (items.length === 0) return null;
          return (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-3 mb-2 mt-5">Content</p>
              {items.map(item => <NavItem key={item.href} item={item} isActive={isItemActive(item.href)} />)}
            </>
          );
        })()}

        {/* System Section */}
        {(() => {
          const items = SYSTEM_ITEMS.filter(i => user.permissions?.[i.label.toLowerCase() as keyof typeof user.permissions] !== false);
          if (items.length === 0) return null;
          return (
            <>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] px-3 mb-2 mt-5">System</p>
              {items.map(item => <NavItem key={item.href} item={item} isActive={isItemActive(item.href)} />)}
            </>
          );
        })()}
      </nav>

      {/* Bottom */}
      <div className="px-4 py-4 border-t border-gray-100">
        <Link href="/" className="flex items-center gap-2.5 px-3 py-2 text-gray-400 hover:text-gray-900 transition-colors text-[13px] font-medium rounded-lg hover:bg-gray-50">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" /></svg>
          View Storefront
        </Link>
        <button
          onClick={() => { logout(); router.push('/signin'); }}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-red-500 hover:text-red-700 transition-colors text-[13px] font-bold rounded-lg hover:bg-red-50 mt-0.5"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
          Logout
        </button>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-[#f6f7f9] flex">
      {/* Mobile Overlay */}
      {sidebarOpen && <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

      {/* Sidebar — Desktop */}
      <aside className="w-[260px] bg-white border-r border-gray-200 flex-col fixed h-screen z-30 hidden lg:flex">
        <SidebarContent />
      </aside>

      {/* Sidebar — Mobile */}
      <aside className={`w-[280px] bg-white border-r border-gray-200 flex flex-col fixed h-screen z-50 lg:hidden transition-transform duration-300 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <div className="flex-1 lg:ml-[260px]">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-4 lg:px-8 h-[57px] flex items-center justify-between sticky top-0 z-20">
          <div className="flex items-center gap-4">
            {/* Mobile hamburger */}
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500 hover:text-gray-900">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div>
              <h1 className="text-lg font-bold text-gray-900 capitalize">{pageTitle}</h1>
              <p className="text-[11px] text-gray-400 hidden sm:block">Manage your store</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Global Search */}
            <div className="relative hidden md:block">
              <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
              <input
                type="text"
                placeholder="Search products, orders, users..."
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearch(true); }}
                onFocus={() => setShowSearch(true)}
                onBlur={() => setTimeout(() => setShowSearch(false), 200)}
                className="pl-9 pr-4 py-2 bg-gray-50/50 border border-gray-200 rounded-xl text-sm text-gray-700 outline-none focus:bg-white focus:ring-4 focus:ring-red-500/10 focus:border-red-500/50 w-72 placeholder:text-gray-400 transition-all duration-300 shadow-sm focus:shadow-md"
              />
              {/* Search Dropdown */}
              {showSearch && searchResults && (searchResults.products.length > 0 || searchResults.orders.length > 0) && (
                <div className="absolute top-full mt-1 left-0 w-80 bg-white border border-gray-200 rounded-xl shadow-xl z-50 overflow-hidden">
                  {searchResults.products.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 bg-gray-50">Products</p>
                      {searchResults.products.map(p => (
                        <Link key={p.id} href={`/admin/products`} className="flex items-center gap-3 px-4 py-2.5 hover:bg-gray-50 transition-colors">
                          <img src={p.image} alt="" className="w-7 h-7 rounded object-cover" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 truncate">{p.name}</p>
                            <p className="text-xs text-gray-400">₹{p.price.toLocaleString()}</p>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                  {searchResults.orders.length > 0 && (
                    <div>
                      <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-4 py-2 bg-gray-50 border-t border-gray-100">Orders</p>
                      {searchResults.orders.map(o => (
                        <Link key={o.id} href={`/admin/orders`} className="flex items-center justify-between px-4 py-2.5 hover:bg-gray-50 transition-colors">
                          <div>
                            <p className="text-sm font-bold text-gray-900">{o.id}</p>
                            <p className="text-xs text-gray-400">{o.customerName}</p>
                          </div>
                          <span className="text-xs font-bold text-gray-500">₹{o.total.toLocaleString()}</span>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* Notification Bell */}
            <div className="relative">
              <button onClick={() => setShowNotif(!showNotif)} className="relative w-9 h-9 flex items-center justify-center rounded-lg text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-all">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" /></svg>
                {notifCount > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 bg-red-600 rounded-full text-[9px] font-bold text-white flex items-center justify-center">{notifCount}</span>
                )}
              </button>
              {showNotif && (
                <div className="absolute right-0 top-full mt-2 w-80 bg-white border border-gray-100 rounded-[20px] shadow-2xl z-50 overflow-hidden ring-1 ring-black/5">
                  <div className="px-5 py-4 border-b border-gray-50 flex items-center justify-between bg-gray-50/30">
                    <p className="text-sm font-black text-gray-900 tracking-tight">Intelligence Log</p>
                    <span className="text-[10px] font-bold text-red-600 bg-red-50 px-2 py-0.5 rounded-full">{notifCount} New</span>
                  </div>
                  <div className="divide-y divide-gray-50 max-h-[320px] overflow-y-auto">
                    {pendingOrders > 0 && (
                      <Link href="/admin/orders" onClick={() => setShowNotif(false)} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group">
                        <div className="w-10 h-10 bg-amber-50 text-amber-600 rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-lg">🛒</span></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{pendingOrders} Pending Orders</p>
                          <p className="text-[11px] text-gray-500 font-medium">Critical: Awaiting processing</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-amber-500" />
                      </Link>
                    )}
                    {pendingVendors > 0 && (
                      <Link href="/admin/vendors" onClick={() => setShowNotif(false)} className="flex items-center gap-4 px-5 py-4 hover:bg-gray-50 transition-colors group border-t border-gray-50">
                        <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-[12px] flex items-center justify-center group-hover:scale-110 transition-transform"><span className="text-lg">🏪</span></div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-gray-900 truncate">{pendingVendors} Merchant Requests</p>
                          <p className="text-[11px] text-gray-500 font-medium">Action required for review</p>
                        </div>
                        <ChevronRight size={14} className="text-gray-300 group-hover:text-indigo-500" />
                      </Link>
                    )}
                    {notifCount === 0 && (
                      <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
                        <div className="w-14 h-14 bg-gray-50 rounded-full flex items-center justify-center text-gray-300 mb-3">
                           <Shield size={24} />
                        </div>
                        <p className="text-sm font-black text-gray-900 tracking-tight">All systems clear</p>
                        <p className="text-[11px] text-gray-400 font-medium mt-1">No active alerts at this time.</p>
                      </div>
                    )}
                  </div>
                  <div className="p-3 border-t border-gray-50 bg-gray-50/20">
                     <button className="w-full py-2 text-[11px] font-black text-gray-400 uppercase tracking-widest hover:text-[#e60000] transition-colors">Mark all as acknowledged</button>
                  </div>
                </div>
              )}
            </div>

            <div className="h-6 w-px bg-gray-200 hidden sm:block" />
            <div className="relative group cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="text-right hidden sm:block">
                  <p className="text-sm font-black text-gray-900 tracking-tight leading-none">{user.name}</p>
                  <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-wider">{user.role}</p>
                </div>
                <div className="w-10 h-10 bg-gray-900 rounded-[14px] flex items-center justify-center text-white font-black text-sm ring-4 ring-gray-100 group-hover:ring-red-50/50 transition-all shadow-md">
                  {user.name.charAt(0)}
                </div>
              </div>
              
              {/* Profile Dropdown */}
              <div className="absolute right-0 top-full mt-2 w-56 bg-white border border-gray-100 rounded-[20px] shadow-2xl z-50 overflow-hidden opacity-0 translate-y-4 pointer-events-none group-hover:opacity-100 group-hover:translate-y-0 group-hover:pointer-events-auto transition-all duration-300 ring-1 ring-black/5">
                <div className="px-5 py-4 border-b border-gray-50 bg-gray-50/30">
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-widest">Account Hub</p>
                </div>
                <div className="p-1.5 pt-0">
                  <Link href="/admin/profile" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
                    <Settings size={16} className="text-gray-400" />
                    Account Profile
                  </Link>
                  <Link href="/admin/settings" className="flex items-center gap-3 px-4 py-2.5 text-[13px] font-bold text-gray-700 hover:bg-gray-50 rounded-xl transition-all">
                    <Database size={16} className="text-gray-400" />
                    System Preferences
                  </Link>
                </div>
                <div className="p-1.5 border-t border-gray-50">
                  <button 
                    onClick={() => { logout(); router.push('/signin'); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] font-black text-red-600 hover:bg-red-50 rounded-xl transition-all"
                  >
                    <Lock size={16} />
                    Terminate Session
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
