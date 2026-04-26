'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Header from '../../components/layout/Header';
import { useAuthStore } from '../../store/useAuthStore';
import { useOrderStore } from '../../store/useOrderStore';
import { useRouter } from 'next/navigation';

export default function OrdersPage() {
  const router = useRouter();
  const { user, token, hasHydrated, getProfile } = useAuthStore();
  const { orders, fetchOrders, isLoading, error } = useOrderStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push('/signin');
      return;
    }

    if (!user) {
      getProfile().catch(() => {
        router.push('/signin');
      });
    }

    fetchOrders();
  }, [hasHydrated, token, user, getProfile, router, fetchOrders]);

  if (!hasHydrated || !token) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-6xl px-4 py-10 md:py-14">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900 md:text-3xl">My Orders</h1>
            <p className="mt-1 text-sm text-gray-500">Track all your purchases and payment status.</p>
          </div>
          <Link
            href="/products"
            className="rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50"
          >
            Continue Shopping
          </Link>
        </div>

        {isLoading && (
          <div className="rounded-xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500">
            Loading your orders...
          </div>
        )}

        {!isLoading && error && (
          <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</div>
        )}

        {!isLoading && !error && orders.length === 0 && (
          <div className="rounded-xl border border-gray-200 bg-white p-10 text-center">
            <h2 className="text-lg font-semibold text-gray-900">No orders yet</h2>
            <p className="mt-2 text-sm text-gray-500">Once you complete a payment, your orders will appear here.</p>
            <Link
              href="/products"
              className="mt-6 inline-flex rounded-lg bg-gray-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-black"
            >
              Browse Products
            </Link>
          </div>
        )}

        {!isLoading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <article key={order.id} className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                <div className="mb-5 flex flex-wrap items-start justify-between gap-4 border-b border-gray-100 pb-4">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Order ID</p>
                    <p className="mt-1 text-sm font-semibold text-gray-900">{order.id}</p>
                    <p className="mt-2 text-xs text-gray-500">Placed on {order.date}</p>
                  </div>

                  <div className="text-right">
                    <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
                    <span className="mt-1 inline-flex rounded-full border border-green-200 bg-green-50 px-3 py-1 text-xs font-semibold text-green-700">
                      {order.status}
                    </span>
                    <p className="mt-2 text-sm font-semibold text-gray-900">Total: INR {order.total.toFixed(2)}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  {order.items.map((item) => (
                    <div key={`${order.id}-${item.id}`} className="flex items-center justify-between rounded-lg border border-gray-100 bg-gray-50 px-4 py-3">
                      <div>
                        <p className="text-sm font-medium text-gray-900">{item.name}</p>
                        <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900">INR {(item.price * item.quantity).toFixed(2)}</p>
                    </div>
                  ))}
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
