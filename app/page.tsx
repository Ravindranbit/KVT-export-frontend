'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import Header from '../components/layout/Header';
import CartDrawer from '../components/cart/CartDrawer';
import BannerCarousel from '../components/home/BannerCarousel';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '../store/useProductStore';

export default function Home() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white" />}>
      <HomeContent />
    </Suspense>
  );
}

function HomeContent() {
  const { products } = useProductStore();
  const searchParams = useSearchParams();
  const catParam = searchParams.get('category');
  
  const [selectedCategory, setSelectedCategory] = useState(catParam || 'all');
  const [showFilters, setShowFilters] = useState(false);
  const [priceRange, setPriceRange] = useState<[number, number]>([0, 10000]);
  const [visibleCount, setVisibleCount] = useState(8);

  useEffect(() => {
    if (catParam) {
      setSelectedCategory(catParam);
    }
  }, [catParam]);
  
  const wishlist = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  const getProductDetails = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />
      <CartDrawer getProductDetails={getProductDetails} />


      {/* Amazon/Flipkart-Style Offer Banner Carousel */}
      <BannerCarousel />

      {/* Categories Filter */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden w-full md:w-auto flex-1 gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scroll-smooth">
            {['all', 'electronics', 'fashion', 'home', 'sports', 'beauty', 'books', 'toys'].map((cat) => (
              <button 
                key={cat}
                onClick={() => setSelectedCategory(cat)} 
                className={`relative whitespace-nowrap px-6 py-3 rounded-xl text-sm font-medium transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat 
                    ? 'text-white bg-gray-900 shadow-md shadow-gray-200 dark:shadow-none dark:bg-white dark:text-gray-900' 
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-black border border-transparent hover:border-gray-900 dark:bg-gray-800/50 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-gray-300'
                }`}
              >
                {cat === 'all' ? 'All Categories' : cat.charAt(0).toUpperCase() + cat.slice(1)}
              </button>
            ))}
          </div>
          
          <button 
            onClick={() => setShowFilters(!showFilters)}
            className={`flex-shrink-0 flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 border cursor-pointer ${
              showFilters 
                ? 'bg-gray-900 text-white border-gray-900 dark:bg-white dark:text-gray-900 dark:border-white' 
                : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-900 hover:text-white hover:border-gray-900 dark:bg-[#0a0a0a] dark:border-gray-800 dark:text-gray-300 dark:hover:bg-white dark:hover:text-gray-900'
            }`}
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
            </svg>
            {showFilters ? 'Hide Filters' : 'Filters'}
          </button>
        </div>

        {/* Filter Details Panel (Advanced Search) */}
        {showFilters && (
          <div className="bg-white dark:bg-gray-900/50 border border-gray-200 dark:border-gray-800 p-8 rounded-2xl mb-12 flex flex-col md:flex-row gap-12 transition-all duration-300">
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Price Range</h3>
              <div className="space-y-6">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100"
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                  style={{ background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(priceRange[1] / 10000) * 100}%, #e5e7eb ${(priceRange[1] / 10000) * 100}%, #e5e7eb 100%)`, accentColor: '#ef4444' }}
                />
                <div className="flex justify-between items-center text-gray-600 dark:text-gray-400 font-medium text-sm gap-4">
                  <span className="bg-gray-50 flex-1 text-center dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700">₹0</span>
                  <span className="text-gray-400">-</span>
                  <span className="bg-gray-50 flex-1 text-center dark:bg-gray-800 px-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white font-bold">₹{priceRange[1]}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-6 text-sm uppercase tracking-wider">Sort By</h3>
              <div className="flex flex-wrap gap-3">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest Arrivals'].map(sort => (
                   <button key={sort} className="px-5 py-2.5 rounded-xl border border-gray-200 dark:border-gray-800 text-sm font-medium text-gray-600 dark:text-gray-400 hover:border-gray-900 dark:hover:text-white dark:hover:border-gray-600 transition-colors bg-white dark:bg-[#0a0a0a]">
                     {sort}
                   </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-6 text-lg tracking-tight">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Fashion', 'Lifestyle', 'Denim', 'Streetstyle', 'Minimalist'].map(tag => (
                  <span key={tag} className="px-3 py-1 bg-white border border-gray-200 text-gray-500 text-sm rounded-full cursor-pointer hover:border-red-600 hover:text-red-600 transition-colors">
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div id="products-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {filteredProducts.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:-translate-y-1 transition relative"
            >
              <Link href={`/products/${product.id}`}>
                <div className="bg-white dark:bg-gray-800 h-64 flex items-center justify-center overflow-hidden p-4">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-contain"
                  />
                </div>
              </Link>
              <div className="p-4 bg-white">
                <div className="flex items-start justify-between">
                  <Link href={`/products/${product.id}`}>
                    <h3 className="text-base font-medium text-[#6b7280] hover:text-red-600">{product.name}</h3>
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`transition ${
                      wishlist.includes(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'
                    }`}
                  >
                    <svg className="w-6 h-6" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
                    </svg>
                  </button>
                </div>
                <Link href={`/products/${product.id}`}>
                  <p className="mt-2 text-base font-semibold text-[#6b7280]">₹{product.price.toFixed(2)}</p>
                </Link>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < filteredProducts.length && (
          <div className="mt-16 text-center pb-10">
            <button 
              onClick={() => setVisibleCount(prev => prev + 8)}
              className="bg-gray-100 hover:bg-gray-900 hover:text-white text-gray-900 border border-gray-200 hover:border-gray-900 px-10 py-4 rounded-full font-bold transition-all shadow-sm hover:shadow-lg active:scale-95 cursor-pointer"
            >
              Load More
            </button>
          </div>
        )}
      </section>

      {/* Footer */}
      <footer className="bg-[#222222] text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
            {/* Categories */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">CATEGORIES</h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><Link href="/?category=electronics" className="hover:text-white transition">Electronics</Link></li>
                <li><Link href="/?category=fashion" className="hover:text-white transition">Fashion</Link></li>
                <li><Link href="/?category=home" className="hover:text-white transition">Home</Link></li>
                <li><Link href="/?category=beauty" className="hover:text-white transition">Beauty</Link></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">HELP</h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">GET IN TOUCH</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
              </p>
              <div className="flex items-center gap-4 text-gray-300">
                <a href="#" className="hover:text-white" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 011-1h3z" /></svg>
                </a>
                <a href="#" className="hover:text-white" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17.5 6.5h.01" /></svg>
                </a>
                <a href="#" className="hover:text-white" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L5.769 21.75H2.462l7.726-8.835L1.54 2.25h6.826l4.853 6.093 5.825-6.093zM16.369 19.25h1.836L8.71 4.1H6.748l9.621 15.15z" /></svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">NEWSLETTER</h4>
              <div className="flex flex-col gap-4 max-w-xs">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-transparent border-b border-gray-500 text-gray-200 placeholder-gray-500 focus:outline-none pb-2 text-sm"
                />
                <button className="w-full max-w-[220px] bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>Copyright ©2026 KVT exports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
