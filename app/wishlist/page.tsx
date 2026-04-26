'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useWishlistStore } from '../../store/useWishlistStore';
import { useCartStore } from '../../store/useCartStore';
import Header from '../../components/layout/Header';

import { useProductStore } from '../../store/useProductStore';

export default function Wishlist() {
  const router = useRouter();
  const { products } = useProductStore();
  const [mounted, setMounted] = useState(false);
  const wishlistIds = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);
  const addToCartStore = useCartStore((state) => state.addToCart);

  useEffect(() => {
    setMounted(true);
  }, []);

  const getProductDetails = (id: string) => products.find(p => p.id === id);

  if (!mounted) return null;

  return (
    <div className="min-h-screen bg-white">
      <Header />

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
                    onClick={async () => {
                      try {
                        await addToCartStore(item.id, 1);
                      } catch {
                        router.push('/signin');
                      }
                    }}
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

    </div>
  );
}
