'use client';

import Link from 'next/link';
import { useAuthStore } from '../../../store/useAuthStore';

export default function VendorDashboard() {
  const { user } = useAuthStore();

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="mx-auto max-w-4xl rounded-3xl border border-gray-200 bg-white p-10 shadow-sm">
        <div className="mb-8">
          <p className="text-sm font-bold uppercase tracking-[0.2em] text-gray-400">Vendor Dashboard</p>
          <h1 className="mt-2 text-3xl font-black text-gray-900">Vendor tools are not available yet</h1>
          <p className="mt-4 max-w-2xl text-sm text-gray-500">
            The current backend does not expose vendor products, payouts, or merchant notifications. Mock vendor data has been removed, so this screen now stays backend-accurate instead of showing sample activity.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          {[
            { label: 'Account', value: user?.name || 'Signed-out user' },
            { label: 'Role', value: user?.role || 'unknown' },
            { label: 'Status', value: 'Awaiting backend support' },
          ].map((item) => (
            <div key={item.label} className="rounded-2xl border border-gray-100 bg-gray-50 p-6">
              <p className="text-[11px] font-bold uppercase tracking-[0.18em] text-gray-400">{item.label}</p>
              <p className="mt-3 text-lg font-black text-gray-900">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-2xl border border-dashed border-gray-200 bg-white p-8 text-center">
          <p className="text-base font-bold text-gray-900">No vendor data available</p>
          <p className="mt-2 text-sm text-gray-500">Connect vendor endpoints in the backend to enable this dashboard.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-black">
            Back to Storefront
          </Link>
        </div>
      </div>
    </div>
  );
}
