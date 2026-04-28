'use client';

import Link from 'next/link';

export default function AdminVendorDetail() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Vendor Details</h2>
        <p className="text-sm text-gray-500">No vendor data available</p>
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-black text-gray-900">Vendor profiles are unavailable</p>
        <p className="mt-3 text-sm text-gray-500">
          This route depended on frontend vendor records that were not backed by the API. Those records were removed because the backend does not provide vendor profile endpoints yet.
        </p>
        <Link href="/admin/vendors" className="mt-6 inline-block rounded-xl bg-gray-900 px-6 py-3 text-sm font-bold text-white transition hover:bg-black">
          Back to Vendors
        </Link>
      </div>
    </div>
  );
}
