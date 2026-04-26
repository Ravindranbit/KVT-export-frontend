'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/layout/Header';
import api from '../../src/lib/api';
import { useAuthStore } from '../../store/useAuthStore';

interface OrderDetails {
  id: string;
  totalAmount: number;
  status: string;
}

export default function OrderConfirmationPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId') || '';
  const { token, hasHydrated } = useAuthStore();
  const [order, setOrder] = useState<OrderDetails | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    if (!hasHydrated || !token || !orderId) {
      return;
    }

    let isMounted = true;

    const loadOrderDetails = async () => {
      setIsLoading(true);
      setLoadError(null);

      try {
        const response: any = await api.get('/orders/my');
        const orders = Array.isArray(response?.data) ? response.data : [];
        const matchingOrder = orders.find((item: any) => String(item.id) === orderId);

        if (!matchingOrder) {
          throw new Error('Order details are not available yet');
        }

        if (isMounted) {
          setOrder({
            id: String(matchingOrder.id),
            totalAmount: Number(matchingOrder.totalAmount || 0),
            status: matchingOrder.status || 'CONFIRMED',
          });
        }
      } catch (error: any) {
        if (isMounted) {
          setLoadError(error?.message || 'Unable to load order details');
        }
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadOrderDetails();

    return () => {
      isMounted = false;
    };
  }, [hasHydrated, token, orderId]);

  const displayOrder = useMemo<OrderDetails>(() => ({
    id: order?.id || orderId || 'Unavailable',
    totalAmount: order?.totalAmount || 0,
    status: order?.status || 'CONFIRMED',
  }), [order, orderId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto flex max-w-3xl px-4 py-12 md:py-20">
        <section className="w-full rounded-3xl border border-gray-200 bg-white p-8 shadow-sm md:p-12">
          <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
            <svg className="h-8 w-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
          </div>

          <div className="text-center">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-green-600">Order Confirmed</p>
            <h1 className="mt-3 text-3xl font-semibold text-gray-900 md:text-4xl">Your order has been placed successfully</h1>
            <p className="mt-3 text-sm text-gray-500">We&apos;ve received your payment and started processing the order.</p>
          </div>

          <div className="mt-10 grid gap-4 rounded-2xl border border-gray-100 bg-gray-50 p-6 md:grid-cols-3">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Order ID</p>
              <p className="mt-2 break-all text-sm font-semibold text-gray-900">{displayOrder.id}</p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Total Amount</p>
              <p className="mt-2 text-sm font-semibold text-gray-900">
                {displayOrder.totalAmount > 0 ? `₹${displayOrder.totalAmount.toFixed(2)}` : isLoading ? 'Loading...' : 'Unavailable'}
              </p>
            </div>
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-gray-500">Status</p>
              <p className="mt-2 text-sm font-semibold text-green-700">{displayOrder.status}</p>
            </div>
          </div>

          {loadError && (
            <p className="mt-4 text-center text-sm text-amber-600">{loadError}</p>
          )}

          <div className="mt-10 flex justify-center">
            <Link
              href="/"
              className="inline-flex items-center justify-center rounded-xl bg-gray-900 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-black"
            >
              Continue Shopping
            </Link>
          </div>
        </section>
      </main>
    </div>
  );
}
