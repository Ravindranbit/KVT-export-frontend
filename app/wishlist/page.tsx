'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import Header from '../../components/layout/Header';
import CartDrawer from '../../components/cart/CartDrawer';

import { useProductStore } from '../../store/useProductStore';

export default function Wishlist() {
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const wishlistIds = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addToCartStore = useCartStore((state) => state.addItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductDetails = (id: number) => products.find(p => p.id === id);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartDrawer getProductDetails={getProductDetails} />

      {/* Wishlist Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">My Wishlist</h1>

        {wishlistIds.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your wishlist is empty</h2>
            <p className="text-gray-600 mb-8">Add some products you love!</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {wishlistIds.map((id) => {
              const item = getProductDetails(id);
              if (!item) return null;
              return (
              <div key={item.id} className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:-translate-y-1 transition relative">
                <Link href={`/products/${item.id}`}>
                  <div className="bg-white h-72 flex items-center justify-center overflow-hidden p-4 border-b">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                </Link>
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <Link href={`/products/${item.id}`}>
                      <h3 className="text-base font-medium text-[#6b7280] hover:text-red-600">{item.name}</h3>
                    </Link>
                    <button 
                      onClick={() => toggleWishlist(item.id)}
                      className="text-red-600 hover:text-red-800 transition"
                    >
                      <svg className="w-6 h-6" fill="currentColor" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
                      </svg>
                    </button>
                  </div>
                  <p className="mt-2 text-base font-semibold text-[#6b7280]">₹{item.price.toFixed(2)}</p>
                  <button
                    onClick={() => addToCartStore(item.id)}
                    className="w-full mt-4 bg-red-600 hover:bg-red-700 text-white py-2 rounded transition font-medium"
                  >
                    Add to Cart
                  </button>
                </div>
              </div>
            )})}
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
                <li><a href="#" className="hover:text-white transition">Women</a></li>
                <li><a href="#" className="hover:text-white transition">Men</a></li>
                <li><a href="#" className="hover:text-white transition">Shoes</a></li>
                <li><a href="#" className="hover:text-white transition">Watches</a></li>
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
