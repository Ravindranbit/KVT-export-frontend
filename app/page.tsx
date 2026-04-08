'use client';

import Link from 'next/link';
import { useState, useEffect, Suspense } from 'react';
import { useWishlistStore } from '../store/useWishlistStore';
import { useCartStore } from '../store/useCartStore';
import Header from '../components/layout/Header';
import BannerCarousel from '../components/home/BannerCarousel';
import { useSearchParams } from 'next/navigation';
import { useProductStore } from '../store/useProductStore';
import { useAdminStore } from '../store/useAdminStore';
import GlobalLoading from '../components/layout/GlobalLoading';
import Skeleton from '../components/ui/Skeleton';

export default function Home() {
  return (
    <Suspense fallback={<GlobalLoading />}>
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
  const [selectedSort, setSelectedSort] = useState('Recommended');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [cartMessage, setCartMessage] = useState<string | null>(null);
  const [isChangingCategory, setIsChangingCategory] = useState(false);

  const { categories: adminCategories } = useAdminStore();
  const categories = ['all', ...adminCategories.filter(c => c.visible && (c.showInFilters !== false)).map(c => c.name.toLowerCase())];
  // If no admin categories are marked for filters, fallback to product categories
  const finalCategories = categories.length > 1 ? categories : ['all', ...Array.from(new Set(products.map(p => p.category.toLowerCase())))];

  useEffect(() => {
    if (catParam) {
      setIsChangingCategory(true);
      setSelectedCategory(catParam);
      setTimeout(() => setIsChangingCategory(false), 600);
    }
  }, [catParam]);

  const handleCategoryChange = (cat: string) => {
    setIsChangingCategory(true);
    setSelectedCategory(cat);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setTimeout(() => setIsChangingCategory(false), 600);
  };
  
  const wishlist = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = (productId: number) => {
    addToCart(productId);
    const product = products.find(p => p.id === productId);
    setCartMessage(product?.name || 'Product added to cart');
    setTimeout(() => setCartMessage(null), 3000);
  };

  const isFiltered = selectedCategory !== 'all' || priceRange[1] < 10000 || selectedTags.length > 0 || selectedSort !== 'Recommended';

  const clearAllFilters = () => {
    setSelectedCategory('all');
    setPriceRange([0, 10000]);
    setSelectedSort('Recommended');
    setSelectedTags([]);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };

  const filteredProducts = products.filter(p => {
    const categoryMatch = selectedCategory === 'all' || p.category === selectedCategory;
    const priceMatch = p.price >= priceRange[0] && p.price <= priceRange[1];
    return categoryMatch && priceMatch;
  });

  // Apply sorting
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (selectedSort === 'Price: Low to High') return a.price - b.price;
    if (selectedSort === 'Price: High to Low') return b.price - a.price;
    if (selectedSort === 'Newest Arrivals') return b.id - a.id;
    return 0; // Recommended = default order
  });

  const getProductDetails = (productId: number) => {
    return products.find(p => p.id === productId);
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header />

      {/* Cart Toast Notification */}
      {cartMessage && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-4 min-w-[320px]">
            <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
              <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div className="flex-1">
              <p className="text-sm font-bold text-gray-900">Added to Cart</p>
              <p className="text-xs text-gray-500 font-medium">{cartMessage}</p>
            </div>
            <Link 
              href="/cart" 
              className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
            >
              View Cart
            </Link>
          </div>
        </div>
      )}


      {/* Amazon/Flipkart-Style Offer Banner Carousel */}
      <BannerCarousel />

      {/* Categories Filter */}
      <section className="max-w-7xl mx-auto px-4 pt-12 pb-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between mb-10 gap-4">
          <div className="flex overflow-x-auto [&::-webkit-scrollbar]:hidden w-full md:w-auto flex-1 min-w-0 gap-2 pb-2 -mx-4 px-4 md:mx-0 md:px-0 md:pb-0 scroll-smooth">
            {finalCategories.map((cat) => (
              <button 
                key={cat}
                onClick={() => handleCategoryChange(cat)} 
                className={`relative whitespace-nowrap px-6 py-3 rounded-md text-sm font-medium transition-all duration-300 cursor-pointer ${
                  selectedCategory === cat 
                    ? 'text-white bg-gray-900 shadow-md shadow-gray-200' 
                    : 'text-gray-600 bg-gray-50 hover:bg-gray-100 hover:text-black border border-transparent hover:border-gray-900'
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

        {/* Filter Details Panel */}
        <div className={`overflow-hidden transition-all duration-400 ease-in-out ${showFilters ? 'max-h-[500px] opacity-100 mb-8' : 'max-h-0 opacity-0 mb-0'}`}>
          <div className="bg-white border border-gray-200 p-8 rounded-2xl flex flex-col md:flex-row gap-10">
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-5 text-xs uppercase tracking-widest">Price Range</h3>
              <div className="space-y-5">
                <input 
                  type="range" 
                  min="0" 
                  max="10000" 
                  step="100"
                  value={priceRange[1]} 
                  onChange={(e) => setPriceRange([0, parseInt(e.target.value)])}
                  className="w-full h-1.5 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-4 [&::-webkit-slider-thumb]:h-4 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-red-500 [&::-webkit-slider-thumb]:shadow-md [&::-webkit-slider-thumb]:cursor-pointer [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white"
                  style={{ background: `linear-gradient(to right, #ef4444 0%, #ef4444 ${(priceRange[1] / 10000) * 100}%, #e5e7eb ${(priceRange[1] / 10000) * 100}%, #e5e7eb 100%)` }}
                />
                <div className="flex justify-between items-center text-sm gap-3">
                  <span className="bg-gray-50 flex-1 text-center px-3 py-2 rounded-lg border border-gray-200 text-gray-500 font-medium">₹0</span>
                  <span className="text-gray-300">—</span>
                  <span className="bg-gray-50 flex-1 text-center px-3 py-2 rounded-lg border border-gray-200 text-gray-900 font-bold">₹{priceRange[1].toLocaleString()}</span>
                </div>
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-5 text-xs uppercase tracking-widest">Sort By</h3>
              <div className="flex flex-wrap gap-2">
                {['Recommended', 'Price: Low to High', 'Price: High to Low', 'Newest Arrivals'].map(sort => (
                   <button 
                     key={sort} 
                     onClick={() => setSelectedSort(sort)}
                     className={`px-4 py-2 rounded-lg border text-sm font-medium transition-all duration-200 ${
                       selectedSort === sort 
                         ? 'bg-red-600 text-white border-red-600' 
                         : 'border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600 bg-white'
                     }`}
                   >
                     {sort}
                   </button>
                ))}
              </div>
            </div>
            
            <div className="flex-1">
              <h3 className="font-bold text-gray-900 mb-5 text-xs uppercase tracking-widest">Tags</h3>
              <div className="flex flex-wrap gap-2">
                {['Fashion', 'Lifestyle', 'Denim', 'Streetstyle', 'Minimalist'].map(tag => (
                  <button 
                    key={tag} 
                    onClick={() => toggleTag(tag)}
                    className={`px-3.5 py-1.5 text-sm rounded-full font-medium transition-all duration-200 border ${
                      selectedTags.includes(tag)
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white border-gray-200 text-gray-500 hover:border-red-500 hover:text-red-600'
                    }`}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>

            {/* Clear Filters */}
            {isFiltered && (
              <div className="flex items-end">
                <button 
                  onClick={clearAllFilters}
                  className="text-sm font-bold text-red-600 hover:text-red-700 transition-colors whitespace-nowrap flex items-center gap-1.5"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                  Clear All
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Active Filter Pills + Result Count */}
        {isFiltered && (
          <div className="flex flex-wrap items-center gap-2 mb-6">
            <span className="text-sm font-bold text-gray-900 mr-1">Showing {sortedProducts.length} product{sortedProducts.length !== 1 ? 's' : ''}</span>
            <span className="text-gray-300 mr-1">|</span>
            {selectedCategory !== 'all' && (
              <button 
                onClick={() => setSelectedCategory('all')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                {selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {priceRange[1] < 10000 && (
              <button 
                onClick={() => setPriceRange([0, 10000])}
                className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 text-xs font-bold rounded-full hover:bg-gray-200 transition-colors"
              >
                Up to ₹{priceRange[1].toLocaleString()}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {selectedSort !== 'Recommended' && (
              <button 
                onClick={() => setSelectedSort('Recommended')}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full hover:bg-red-100 transition-colors"
              >
                {selectedSort}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            )}
            {selectedTags.map(tag => (
              <button 
                key={tag}
                onClick={() => toggleTag(tag)}
                className="inline-flex items-center gap-1 px-3 py-1 bg-red-50 text-red-600 text-xs font-bold rounded-full hover:bg-red-100 transition-colors"
              >
                {tag}
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            ))}
          </div>
        )}

        {/* Products Grid */}
        <div id="products-section" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {isChangingCategory ? (
            // Loading State Grid
            Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-4">
                <Skeleton className="aspect-square w-full rounded-[32px]" />
                <div className="space-y-2 px-2">
                  <Skeleton className="h-4 w-3/4" variant="text" />
                  <Skeleton className="h-4 w-1/2" variant="text" />
                </div>
              </div>
            ))
          ) : sortedProducts.slice(0, visibleCount).map((product) => (
            <div
              key={product.id}
              className="group rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1.5 transition-all duration-300 relative block"
            >
              <Link href={`/products/${product.id}`} className="block after:absolute after:inset-0 after:z-0">
                <div className="bg-gray-50 overflow-hidden">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                  </div>
                </div>
              </Link>

              {/* Quick Add to Cart — appears on hover */}
              <button
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  handleAddToCart(product.id);
                }}
                className="absolute bottom-[130px] left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs font-bold px-6 py-2.5 rounded-full opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-300 shadow-lg hover:bg-black whitespace-nowrap z-20 cursor-pointer"
              >
                + Add to cart
              </button>

              <div className="p-4 bg-white relative z-10 pointer-events-none">
                <div className="flex items-start justify-between gap-2 pointer-events-auto">
                  <Link href={`/products/${product.id}`} className="flex-1 min-w-0 relative z-20">
                    <h3 className="text-sm font-semibold text-gray-700 hover:text-red-600 transition-colors duration-200 line-clamp-1">{product.name}</h3>
                  </Link>
                  <button 
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      toggleWishlist(product.id);
                    }}
                    className={`flex-shrink-0 transition-all duration-200 hover:scale-110 cursor-pointer relative z-20 ${
                      wishlist.includes(product.id) ? 'text-red-600' : 'text-gray-300 hover:text-red-500'
                    }`}
                  >
                    <svg className="w-5 h-5" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
                    </svg>
                  </button>
                </div>
                {/* Star Rating - dynamic */}
                <div className="flex items-center gap-1 mt-1.5 pointer-events-auto">
                  {[1,2,3,4,5].map(s => (
                    <svg key={s} className={`w-3.5 h-3.5 fill-current ${s <= Math.round(product.rating || 4) ? 'text-yellow-400' : 'text-gray-200'}`} viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                  ))}
                  <span className="text-[10px] text-gray-400 font-medium ml-0.5">({product.reviews || 0})</span>
                </div>
                <div className="pointer-events-auto">
                  <Link href={`/products/${product.id}`} className="inline-block mt-2 relative z-20">
                    <p className="text-lg font-bold text-gray-900">₹{product.price.toFixed(2)}</p>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>

        {visibleCount < sortedProducts.length && (
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

    </div>
  );
}
