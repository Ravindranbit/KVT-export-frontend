'use client';

import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useProductStore } from '../../store/useProductStore';
import MegaMenu from './MegaMenu';
import { useRouter } from 'next/navigation';
import { useAdminStore } from '../../store/useAdminStore';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const wishlist = useWishlistStore((state) => state.items);
  const { user, token, hasHydrated } = useAuthStore();
  const fetchCart = useCartStore((state) => state.fetchCart);
  
  const cart = useCartStore((state) => state.getTotalItems());
  const { products } = useProductStore();
  const { settings, categories: adminCategories } = useAdminStore();
  const productCategories = Array.from(new Set(products.map(p => p.category.toLowerCase())));
  const categories = adminCategories.filter(c => c.visible && (c.showInHeader !== false)).map(c => c.name.toLowerCase());
  
  // Merge categories if needed, but primarily follow Admin
  const finalCategories = categories.length > 0 ? categories : productCategories;

  const siteNameParts = settings.siteName ? settings.siteName.split(' ') : ['KVT', 'exports'];
  const firstPart = siteNameParts[0];
  const restParts = siteNameParts.slice(1).join(' ');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) {
        setSearchFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    fetchCart().catch(() => {
      // Ignore here; cart pages/drawer expose error details.
    });
  }, [hasHydrated, token, fetchCart]);

  const filtered = searchQuery.length > 1
    ? products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navigateToProduct = (id: string) => {
    router.push(`/products/${id}`);
    setSearchQuery('');
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 shadow-[0_1px_3px_rgba(0,0,0,0.05)]">
      {/* Desktop Header */}
      <div className="w-full px-4 md:px-8 py-3 flex items-center gap-4 md:gap-6">
        {/* Mobile Hamburger */}
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="md:hidden text-gray-900 p-1"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            {mobileMenuOpen ? (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            ) : (
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
            )}
          </svg>
        </button>

        {/* Logo */}
        <Link href="/" className="flex items-center gap-0.5 flex-shrink-0" style={{ fontFamily: 'var(--font-arvo)' }}>
          {settings.logoUrl ? (
            <img 
              src={settings.logoUrl} 
              alt={settings.siteName} 
              className="h-10 w-auto object-contain max-w-[200px]" 
            />
          ) : (
            <div className="flex items-baseline gap-0.5 select-none">
              <span className="text-xl md:text-2xl font-bold text-gray-900 tracking-tight">{firstPart}</span>
              <span className="text-xl md:text-2xl font-normal text-gray-400 tracking-tight">{restParts}</span>
            </div>
          )}
        </Link>

        {/* Desktop Mega Menu */}
        <MegaMenu />

        {/* Desktop Search Bar */}
        <div className="relative flex-1 min-w-0 mx-4 hidden md:block" ref={searchRef}>
          <div className="relative">
            <svg className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onFocus={() => setSearchFocused(true)}
              placeholder="Search products..."
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white focus:shadow-lg focus:shadow-gray-900/5 transition-all duration-200"
            />
          </div>

          {searchFocused && searchQuery.length > 1 && (
            <div className="absolute left-0 right-0 top-12 bg-white border border-gray-200 rounded-2xl shadow-2xl overflow-hidden z-50">
              <div className="max-h-80 overflow-y-auto">
                {filtered.length > 0 ? filtered.map(p => (
                  <button key={p.id} onClick={() => navigateToProduct(p.id)} className="w-full flex items-center gap-4 p-4 hover:bg-gray-50 transition-colors text-left cursor-pointer">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                      <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                      <p className="text-xs text-gray-500">{p.category} · ₹{p.price.toLocaleString()}</p>
                    </div>
                  </button>
                )) : (
                  <div className="p-6 text-center text-gray-400 text-sm">No products found for &ldquo;{searchQuery}&rdquo;</div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Right Icons */}
        <div className="flex items-center gap-3 md:gap-4 ml-auto">
          {/* Mobile Search Toggle */}
          <button onClick={() => setMobileSearchOpen(!mobileSearchOpen)} className="md:hidden text-gray-900 hover:text-red-500 transition">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </button>

          {/* Wishlist Icon */}
          <Link href="/wishlist" className="relative text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
            <svg className="w-5 h-5 md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
            </svg>
            {mounted && wishlist.length > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 md:w-[18px] md:h-[18px] flex items-center justify-center font-bold ring-2 ring-white">{wishlist.length}</span>}
          </Link>

          {/* Cart Icon */}
          <Link href="/cart" className="relative text-gray-600 hover:text-red-500 p-2 rounded-full hover:bg-gray-100 transition-all duration-200">
            <svg className="w-5 h-5 md:w-[22px] md:h-[22px]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {mounted && cart > 0 && <span className="absolute -top-0.5 -right-0.5 bg-red-500 text-white text-[9px] rounded-full w-4 h-4 md:w-[18px] md:h-[18px] flex items-center justify-center font-bold ring-2 ring-white">{cart}</span>}
          </Link>

          <div className="hidden md:flex items-center gap-3 ml-1 pl-3 border-l border-gray-200">
            {user && user.role === 'seller' && (
              <Link href="/vendor/dashboard" className="px-4 py-2 text-sm font-bold text-gray-900 hover:text-red-600 transition-colors duration-200 tracking-wide">Vendor Dashboard</Link>
            )}
            
            {user && user.role === 'admin' && (
              <Link href="/admin" className="px-4 py-2 text-sm font-bold text-gray-900 hover:text-red-600 transition-colors duration-200 tracking-wide">Admin Dashboard</Link>
            )}

            {(!user || user.role === 'buyer') && (
              <Link href="/become-seller" className="px-4 py-2 text-sm font-bold text-gray-900 hover:text-red-600 transition-colors duration-200 tracking-wide">Become a Seller</Link>
            )}

            {/* Profile / Sign In */}
            {user ? (
              <Link 
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="w-8 h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-xs ring-2 ring-gray-100 uppercase hover:scale-110 transition-transform duration-200 cursor-pointer"
              >
                {user.name.substring(0, 1)}
              </Link>
            ) : (
              <Link href="/signin" className="px-5 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all duration-200 font-bold tracking-tight text-sm shadow-md shadow-red-500/20 hover:shadow-lg hover:-translate-y-0.5">Sign In</Link>
            )}
          </div>

          {/* Mobile Profile */}
          <div className="md:hidden">
            {user ? (
              <Link 
                href={user.role === 'admin' ? '/admin' : '/dashboard'}
                className="w-7 h-7 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] ring-2 ring-gray-100 uppercase"
              >
                {user.name.substring(0, 1)}
              </Link>
            ) : (
              <Link href="/signin" className="px-3 py-1.5 bg-red-600 text-white rounded hover:bg-red-700 transition font-bold text-xs shadow-md shadow-red-500/20">Sign In</Link>
            )}
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-4 pb-3 border-t border-gray-100">
          <div className="relative mt-2">
            <svg className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder="Search products..."
              autoFocus
              className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900"
            />
          </div>
          {searchQuery.length > 1 && (
            <div className="mt-2 bg-white border border-gray-200 rounded-xl shadow-lg overflow-hidden max-h-60 overflow-y-auto">
              {filtered.length > 0 ? filtered.map(p => (
                <button key={p.id} onClick={() => navigateToProduct(p.id)} className="w-full flex items-center gap-3 p-3 hover:bg-gray-50 transition-colors text-left">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 overflow-hidden">
                    <img src={p.image} alt={p.name} className="w-full h-full object-cover" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-gray-900 truncate">{p.name}</p>
                    <p className="text-xs text-gray-500">{p.category} · ₹{p.price.toLocaleString()}</p>
                  </div>
                </button>
              )) : (
                <div className="p-4 text-center text-gray-400 text-sm">No products found</div>
              )}
            </div>
          )}
        </div>
      )}

      {/* Mobile Menu Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-gray-100 bg-white">
          <nav className="px-4 py-4 space-y-1">
            {finalCategories.map(cat => (
              <Link key={cat} href={`/?category=${cat}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-900 font-bold hover:bg-gray-50 rounded-xl transition-all duration-200 capitalize">
                {cat}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2"></div>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200">About</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-500 font-medium hover:bg-gray-50 hover:text-gray-900 rounded-xl transition-all duration-200">Contact</Link>
            {user && user.role === 'seller' && (
              <Link href="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition">Vendor Dashboard</Link>
            )}
            {user && user.role === 'admin' && (
              <Link href="/admin" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-bold hover:bg-gray-50 rounded-xl transition">Admin Dashboard</Link>
            )}
            {(!user || user.role === 'buyer') && (
              <Link href="/become-seller" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition">Become a Seller</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
