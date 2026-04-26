import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';

// We temporarily pass products to the standard cart since we do not have a robust backend or product store yet.
// In a mature app, this component would fetch from its own product API details hook.
interface CartDrawerProps {
  getProductDetails: (id: string) => any;
}

export default function CartDrawer({ getProductDetails }: CartDrawerProps) {
  const [mounted, setMounted] = useState(false);
  const cartItems = useCartStore((state) => state.cart);
  const isCartOpen = useCartStore((state) => state.isOpen);
  const setIsCartOpen = useCartStore((state) => state.setIsOpen);
  const fetchCart = useCartStore((state) => state.fetchCart);
  const isLoading = useCartStore((state) => state.isLoading);
  const error = useCartStore((state) => state.error);
  const { token } = useAuthStore();

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!isCartOpen) return;
    if (!token) return;
    fetchCart();
  }, [isCartOpen, token, fetchCart]);

  if (!mounted || !isCartOpen) return null;

  const cartTotal = cartItems.reduce((sum: number, item: any) => {
    const product = item.product || getProductDetails(item.productId);
    return sum + (product?.price || 0) * item.quantity;
  }, 0);

  return (
    <>
      <div className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm transition-opacity" onClick={() => setIsCartOpen(false)}></div>
      <div className="fixed right-0 top-0 h-full w-96 bg-white shadow-[0_0_40px_rgba(0,0,0,0.1)] z-50 flex flex-col overflow-y-auto transform transition-transform duration-300">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900 tracking-wide">YOUR CART</h2>
          <button onClick={() => setIsCartOpen(false)} className="fixed top-6 right-6 text-gray-400 hover:text-red-500 text-2xl transition">
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {!token ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400 gap-4">
              <p>Please sign in to view your cart</p>
              <Link href="/signin" onClick={() => setIsCartOpen(false)} className="text-sm font-semibold text-red-600 hover:text-red-700">
                Go to Sign In
              </Link>
            </div>
          ) : isLoading ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="py-8">Loading cart...</p>
            </div>
          ) : cartItems.length === 0 ? (
            <div className="h-full flex flex-col items-center justify-center text-gray-400">
              <p className="py-8">Your cart is empty</p>
            </div>
          ) : (
            cartItems.map((item: any) => {
              const product = item.product || getProductDetails(item.productId);
              if (!product) return null;
              return (
                <div key={item.id} className="flex gap-4 border-b border-gray-100 pb-4">
                  <img
                    src={product.imageUrl || product.image}
                    alt={product.name}
                    className="w-20 h-24 object-contain rounded shadow-sm bg-white"
                  />
                  <div className="flex-1 flex flex-col justify-between py-1">
                    <h3 className="font-medium text-sm text-gray-700 hover:text-red-500 transition cursor-pointer">{product.name}</h3>
                    <p className="text-sm font-semibold text-gray-900">{item.quantity} x ₹{product.price.toFixed(2)}</p>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {token && error && <p className="px-6 pb-4 text-xs text-red-600">{error}</p>}

        {token && cartItems.length > 0 && (
          <div className="border-t border-gray-200 bg-gray-50 p-6 space-y-5">
            <div className="flex justify-between items-center text-lg font-bold text-gray-900">
              <span>Total:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            <div className="flex gap-3">
              <Link
                href="/cart"
                onClick={() => setIsCartOpen(false)}
                className="flex-1 bg-white border border-gray-900 text-gray-900 py-3 rounded-full font-semibold text-center hover:bg-gray-100 transition shadow-sm"
              >
                VIEW CART
              </Link>
              <Link
                href="/checkout"
                onClick={() => setIsCartOpen(false)}
                className="flex-1 bg-red-600 text-white py-3 rounded-full font-semibold text-center hover:bg-red-700 transition shadow-sm"
              >
                CHECK OUT
              </Link>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
