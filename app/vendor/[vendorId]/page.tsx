'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import Header from '../../../components/layout/Header';
import CartDrawer from '../../../components/cart/CartDrawer';
import { useWishlistStore } from '../../../store/useWishlistStore';

const VENDORS = [
  { id: 'v1', name: 'Artisan Threadsco', banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?q=80&w=2070', logo: 'AT', description: 'Handcrafted premium clothing and accessories. Based in NY. All items are ethically sourced and created with precision.', rating: 4.8 },
  { id: 'v2', name: 'Urban Sole', banner: 'https://images.unsplash.com/photo-1555529733-0e670560f8e1?q=80&w=2070', logo: 'US', description: 'Streetwear essentials and limited edition sneakers. Check out our latest drop of urban apparel.', rating: 4.5 },
];

import { useProductStore } from '../../../store/useProductStore';
import { useAuthStore } from '../../../store/useAuthStore';
import { useCartStore } from '../../../store/useCartStore';
import { useState, useEffect } from 'react';

export default function VendorStorefront() {
  const params = useParams();
  const vendorId = params.vendorId as string;
  const { products } = useProductStore();
  const { user } = useAuthStore();
  const addToCart = useCartStore((state) => state.addItem);
  const setCartOpen = useCartStore((state) => state.setIsOpen);
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    if (message) {
      const t = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(t);
    }
  }, [message]);
  
  // Find vendor in static list or use current user if they are the vendor
  let vendor = VENDORS.find(v => v.id === vendorId);
  if (!vendor && user?.id === vendorId && user.role === 'seller') {
    vendor = {
      id: user.id,
      name: user.storeName || user.name,
      banner: 'https://images.unsplash.com/photo-1441984904996-e0b6ba687e07?q=80&w=2070',
      logo: user.storeName?.substring(0, 2).toUpperCase() || 'V',
      description: user.storeDescription || 'A verified premium seller on KVT exports.',
      rating: 5.0
    };
  }

  const vendorProducts = products.filter(p => p.vendorId === vendorId);
  
  const wishlist = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  if (!vendor) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <div className="flex-1 flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">Vendor Not Found</h1>
            <p className="text-gray-500 mb-8">The storefront you are looking for does not exist.</p>
            <Link href="/" className="bg-gray-900 text-white px-8 py-3 rounded-md font-medium hover:bg-black transition-colors">Return Home</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <CartDrawer getProductDetails={(id) => products.find(p => p.id === id)} />
      
      {/* Toast Notification */}
      {message && (
        <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
          <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-3.5 min-w-[300px]">
             <div className="w-10 h-10 bg-gray-50 rounded-xl flex items-center justify-center shrink-0">
               <svg className="w-5 h-5 text-gray-900" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
             </div>
             <p className="text-sm font-bold text-gray-900 flex-1">{message}</p>
          </div>
        </div>
      )}
      
      {/* Vendor Banner Header */}
      <div className="relative h-[350px] w-full overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
        <img src={vendor.banner} alt={vendor.name} className="absolute inset-0 w-full h-full object-cover transform hover:scale-105 transition-transform duration-1000" />
        <div className="absolute bottom-0 left-0 w-full z-20 pb-12 px-4">
          <div className="max-w-7xl mx-auto flex items-end gap-6 md:gap-8">
            <div className="w-24 h-24 md:w-36 md:h-36 bg-white rounded-2xl md:rounded-[32px] border-4 border-white shadow-2xl flex items-center justify-center font-extrabold text-3xl md:text-5xl text-gray-900 tracking-tighter">
              {vendor.logo}
            </div>
            <div className="text-white pb-2 flex-1 relative top-2">
              <h1 className="text-4xl md:text-6xl font-extrabold mb-3 tracking-tight drop-shadow-lg">{vendor.name}</h1>
              <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
                <span className="flex items-center gap-1.5 bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  <span className="text-yellow-400 text-lg leading-none">★</span> 
                  {vendor.rating} Seller Rating
                </span>
                <span className="bg-white/20 px-4 py-1.5 rounded-full backdrop-blur-md border border-white/10">
                  {vendorProducts.length} Exclusive Items
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12">
          
          {/* Left Sidebar (Vendor Info) */}
          <div className="w-full lg:w-80 shrink-0">
            <div className="bg-white p-8 rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.04)] border border-gray-100 sticky top-12">
              <h3 className="font-extrabold text-gray-900 mb-5 text-xl tracking-tight">About the Shop</h3>
              <p className="text-gray-600 leading-relaxed mb-8">{vendor.description}</p>
              
              <div className="pt-8 border-t border-gray-100 space-y-3">
                <button 
                  onClick={() => setMessage(`Connecting you to ${vendor.name} support...`)}
                  className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5"
                >
                  Contact Seller
                </button>
                <button 
                  onClick={() => setMessage(`You are now following ${vendor.name}!`)}
                  className="w-full bg-white border-2 border-gray-200 hover:border-gray-900 hover:bg-gray-50 text-gray-900 font-bold py-4 rounded-xl transition-all hover:-translate-y-0.5"
                >
                  Follow Shop
                </button>
              </div>
            </div>
          </div>

          {/* Right Product Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-gray-200">
              <h2 className="text-2xl font-extrabold text-gray-900 tracking-tight">Featured Collection</h2>
              <div className="text-sm font-semibold text-gray-500 bg-gray-100 px-3 py-1 rounded-md">
                Showing all {vendorProducts.length} results
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              {vendorProducts.map((product) => (
                <div
                  key={product.id}
                  className="group rounded-2xl border border-gray-100 bg-white overflow-hidden hover:shadow-[0_20px_40px_rgb(0,0,0,0.08)] hover:-translate-y-1.5 transition-all duration-300 relative"
                >
                  <Link href={`/products/${product.id}`}>
                    <div className="bg-white h-80 flex items-center justify-center overflow-hidden relative p-4">
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors duration-300 z-10" />
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-full object-contain transition-transform duration-700 group-hover:scale-110"
                      />
                    </div>
                  </Link>
                  <div className="p-6 bg-white relative">
                    <button 
                      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggleWishlist(product.id); }}
                      className={`absolute -top-6 right-5 w-12 h-12 bg-white rounded-full shadow-lg flex items-center justify-center transition-transform hover:scale-110 z-20 ${wishlist.includes(product.id) ? 'text-red-600' : 'text-gray-400 hover:text-red-600'}`}
                    >
                      <svg className="w-6 h-6" fill={wishlist.includes(product.id) ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                    </button>
                    <div className="pt-2">
                      <Link href={`/products/${product.id}`}>
                        <h3 className="text-base font-bold text-gray-900 hover:text-red-600 transition-colors leading-snug mb-2 pr-8">{product.name}</h3>
                      </Link>
                      <div className="mt-4 flex items-center justify-between gap-4">
                        <span className="text-red-600 font-extrabold text-lg">₹{product.price.toFixed(2)}</span>
                        <button 
                          onClick={(e) => {
                            e.preventDefault();
                            addToCart(product.id, 1);
                            setCartOpen(true);
                          }}
                          className="flex-1 bg-gray-900 border border-gray-900 text-white text-xs font-bold py-2 rounded-lg hover:bg-black transition-all shadow-sm active:scale-95 translate-y-0 hover:-translate-y-0.5"
                        >
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
        </div>
      </main>
    </div>
  );
}
