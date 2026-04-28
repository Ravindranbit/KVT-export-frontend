'use client';

export default function AdminSettings() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-black text-gray-900">Settings</h2>
        <p className="text-sm text-gray-500">No backend settings endpoint available</p>
      </div>

      <div className="rounded-3xl border border-dashed border-gray-200 bg-white p-12 text-center shadow-sm">
        <p className="text-lg font-black text-gray-900">Settings management is unavailable</p>
        <p className="mt-3 text-sm text-gray-500">
          Site settings were previously stored only in the frontend. Those values were removed because the backend does not yet expose a settings API.
        </p>
      </div>
    </div>
  );
}
