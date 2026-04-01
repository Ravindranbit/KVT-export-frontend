import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { PRODUCTS } from '../../lib/mockData';
import MegaMenu from './MegaMenu';
import { useRouter } from 'next/navigation';

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchFocused, setSearchFocused] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const wishlist = useWishlistStore((state) => state.items);
  const { user } = useAuthStore();
  
  const cart = useCartStore((state) => state.getTotalItems());
  const isCartOpen = useCartStore((state) => state.isOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);

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

  const filtered = searchQuery.length > 1
    ? PRODUCTS.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        p.category.toLowerCase().includes(searchQuery.toLowerCase())
      ).slice(0, 6)
    : [];

  const navigateToProduct = (id: number | string) => {
    router.push(`/products/${id}`);
    setSearchQuery('');
    setSearchFocused(false);
    setMobileSearchOpen(false);
  };

  return (
    <header className="border-b border-gray-200 bg-white sticky top-0 z-40 transition-all shadow-sm">
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
        <Link href="/" className="text-xl md:text-2xl font-bold text-gray-900 flex-shrink-0" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>

        {/* Desktop Mega Menu */}
        <MegaMenu />

        {/* Desktop Search Bar */}
        <div className="relative flex-1 mx-4 hidden md:block" ref={searchRef}>
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
              className="w-full pl-11 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-xl outline-none text-sm font-medium text-gray-900 placeholder:text-gray-400 focus:ring-2 focus:ring-gray-900 focus:border-gray-900 focus:bg-white transition-all"
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
          <Link href="/wishlist" className="relative text-gray-900 hover:text-red-500 transition">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
            </svg>
            {mounted && wishlist.length > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold">{wishlist.length}</span>}
          </Link>

          {/* Cart Icon */}
          <button onClick={() => setIsCartOpen(!isCartOpen)} className="relative text-gray-900 hover:text-red-500 transition">
            <svg className="w-5 h-5 md:w-6 md:h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            {mounted && cart > 0 && <span className="absolute -top-2 -right-2 bg-red-500 text-white text-[10px] rounded-full w-4 h-4 md:w-5 md:h-5 flex items-center justify-center font-bold">{cart}</span>}
          </button>

          {/* Desktop Only: Become Seller / Vendor Dashboard */}
          {user && user.role === 'seller' ? (
            <Link href="/vendor/dashboard" className="hidden md:inline-flex px-4 py-2 text-sm font-bold text-gray-900 hover:text-red-600 transition tracking-wide">Vendor Dashboard</Link>
          ) : (
            <Link href="/become-seller" className="hidden md:inline-flex px-4 py-2 text-sm font-bold text-gray-900 hover:text-red-600 transition tracking-wide">Become a Seller</Link>
          )}

          {/* Profile / Sign In */}
          {user ? (
            <Link 
              href="/dashboard"
              className="w-7 h-7 md:w-8 md:h-8 bg-gray-900 text-white rounded-full flex items-center justify-center font-bold text-[10px] md:text-xs ring-2 ring-gray-100 uppercase hover:scale-105 transition-transform cursor-pointer"
            >
              {user.name.substring(0, 1)}
            </Link>
          ) : (
            <Link href="/signin" className="px-3 py-1.5 md:px-6 md:py-2 bg-red-600 text-white rounded hover:bg-red-700 transition font-bold tracking-tight text-xs md:text-sm shadow-md shadow-red-500/20">Sign In</Link>
          )}
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
            {['Electronics', 'Fashion', 'Home', 'Sports & Beauty'].map(cat => (
              <Link key={cat} href={`/?category=${cat.split(' ')[0].toLowerCase()}`} onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition">
                {cat}
              </Link>
            ))}
            <div className="border-t border-gray-100 my-2"></div>
            <Link href="/about" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition">About</Link>
            <Link href="/contact" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition">Contact</Link>
            {user && user.role === 'seller' ? (
              <Link href="/vendor/dashboard" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 rounded-xl transition">Vendor Dashboard</Link>
            ) : (
              <Link href="/become-seller" onClick={() => setMobileMenuOpen(false)} className="block px-4 py-3 text-red-600 font-bold hover:bg-red-50 rounded-xl transition">Become a Seller</Link>
            )}
          </nav>
        </div>
      )}
    </header>
  );
}
