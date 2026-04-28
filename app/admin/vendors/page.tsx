'use client';

export default function AdminVendors() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Vendor Management</h2>
        <p className="text-sm text-gray-500">No vendor records available</p>
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-black text-gray-900">Vendor management is unavailable</p>
        <p className="mt-3 text-sm text-gray-500">
          The backend currently has no vendor module. Mock vendor cards were removed, so this page will stay empty until vendor APIs are added.
        </p>
      </div>
    </div>
  );
}
