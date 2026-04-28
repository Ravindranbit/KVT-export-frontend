'use client';

export default function AdminBanners() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Banner Management</h2>
        <p className="text-sm text-gray-500">No banner records available</p>
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-black text-gray-900">Banner management is unavailable</p>
        <p className="mt-3 text-sm text-gray-500">
          The backend does not currently expose banner endpoints. Mock banner slides were removed, so this page now stays empty until the API is implemented.
        </p>
      </div>
    </div>
  );
}
