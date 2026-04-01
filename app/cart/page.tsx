'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import Header from '../../components/layout/Header';
import CartDrawer from '../../components/cart/CartDrawer';

const VENDORS = [
  { id: 'v1', name: 'Artisan Threadsco' },
  { id: 'v2', name: 'Urban Sole' },
];

import { useProductStore } from '../../store/useProductStore';

export default function Cart() {
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.items);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductDetails = (id: number) => products.find(p => p.id === id);

  const total = cartItems.reduce((sum, item) => {
    const p = getProductDetails(item.id);
    return sum + ((p?.price || 0) * item.quantity);
  }, 0);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartDrawer getProductDetails={getProductDetails} />

      {/* Cart Content */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        {cartItems.length === 0 ? (
          <div className="text-center py-20">
            <svg className="w-24 h-24 mx-auto text-gray-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            <h2 className="text-2xl font-semibold text-gray-900 mb-4">Your cart is empty</h2>
            <p className="text-gray-600 mb-8">Add some products to get started!</p>
            <Link href="/" className="bg-red-600 hover:bg-red-700 text-white px-8 py-3 rounded inline-block">
              Continue Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Cart Items */}
            {/* Cart Items Grouped by Vendor */}
            <div className="lg:col-span-2">
              <div className="space-y-8">
                {Object.values(
                  cartItems.reduce((acc, item) => {
                    const product = getProductDetails(item.id);
                    if (!product) return acc;
                    const vendor = VENDORS.find(v => v.id === product.vendorId) || { id: 'v0', name: 'KVT Global' };
                    if (!acc[vendor.id]) acc[vendor.id] = { vendorName: vendor.name, items: [] };
                    acc[vendor.id].items.push(item);
                    return acc;
                  }, {} as Record<string, { vendorName: string, items: typeof cartItems }>)
                ).map((group, groupIdx) => (
                  <div key={groupIdx} className="bg-white rounded-2xl shadow-[0_4px_20px_rgb(0,0,0,0.03)] border border-gray-100 overflow-hidden">
                    <div className="px-6 py-4 bg-gray-50 border-b border-gray-100 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <svg className="w-5 h-5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                        <span className="font-extrabold text-gray-900 tracking-tight">Sold by {group.vendorName}</span>
                      </div>
                      <span className="text-xs font-bold text-red-600 bg-red-50 px-3 py-1 rounded-full uppercase tracking-wider border border-red-200">Separate Package</span>
                    </div>
                    
                    <div className="p-6 space-y-8">
                      {group.items.map((item) => {
                        const product = getProductDetails(item.id);
                        if (!product) return null;
                        return (
                          <div key={item.id} className="flex flex-col sm:flex-row gap-6">
                             <div className="w-full sm:w-28 h-28 bg-white border border-gray-100 rounded-xl overflow-hidden p-2 flex items-center justify-center">
                               <img
                                 src={product.image}
                                 alt={product.name}
                                 className="w-full h-full object-contain"
                               />
                             </div>
                            <div className="flex-1">
                              <Link href={`/products/${item.id}`} className="font-bold text-gray-900 hover:text-red-600 text-lg transition-colors leading-tight block mb-2">
                                {product.name}
                              </Link>
                              
                              <div className="flex items-center justify-between mt-6">
                                <div className="flex items-center border-2 border-gray-200 rounded-md bg-gray-50 h-10">
                                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="px-3 h-full flex items-center text-gray-500 hover:text-gray-900 transition-colors">−</button>
                                  <span className="px-4 h-full border-l-2 border-r-2 border-gray-200 flex items-center text-gray-900 font-bold bg-white">{item.quantity}</span>
                                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="px-3 h-full flex items-center text-gray-500 hover:text-gray-900 transition-colors">+</button>
                                </div>
                                <button onClick={() => removeItem(item.id)} className="text-gray-400 hover:text-red-600 text-sm font-bold transition-colors underline underline-offset-4">Remove</button>
                              </div>
                            </div>
                            <div className="text-right sm:w-32 flex flex-col items-end">
                              <p className="font-extrabold text-gray-900 text-2xl tracking-tight mb-1">
                                ₹{(product.price * item.quantity).toFixed(2)}
                              </p>
                              <p className="text-gray-400 text-xs font-medium line-through">₹{((product.price * item.quantity) * 1.2).toFixed(2)}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="lg:col-span-1">
              <div className="bg-white p-6 rounded sticky top-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-4">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-semibold text-gray-900">₹{total.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-semibold text-gray-900">{total > 4150 ? 'FREE' : '₹415.00'}</span>
                  </div>
                  <div className="border-t border-gray-300 pt-3 flex justify-between text-lg">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="font-bold text-red-600">
                      ₹{(total > 4150 ? total : total + 415).toFixed(2)}
                    </span>
                  </div>
                </div>

                <Link href="/checkout" className="block text-center w-full bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded mb-3">
                  Proceed to Checkout
                </Link>
                
                <Link href="/" className="block text-center text-gray-700 hover:text-gray-900">
                  Continue Shopping
                </Link>
              </div>
            </div>
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
