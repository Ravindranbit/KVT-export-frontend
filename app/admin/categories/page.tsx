'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [showAdd, setShowAdd] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editId, setEditId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', slug: '', description: '' });

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAdd = () => {
    addCategory({
      id: `cat_${Date.now()}`,
      name: form.name,
      slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
      description: form.description,
      productCount: 0,
      visible: true,
      order: categories.length + 1,
    });
    setShowAdd(false);
    setForm({ name: '', slug: '', description: '' });
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Category Management</h2>
          <p className="text-sm text-gray-500">{categories.length} categories</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search categories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-[#e60000]"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-[#e60000] hover:bg-[#cc0000] text-white font-bold px-6 py-2.5 rounded-lg text-sm transition-all shadow-sm">+ Add Category</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredCategories.sort((a, b) => a.order - b.order).map((cat) => (
          <div key={cat.id} className={`bg-white border rounded-xl p-5 transition-all hover:shadow-md ${!cat.visible ? 'opacity-50' : ''} ${cat.visible ? 'border-gray-200' : 'border-dashed border-gray-300'}`}>
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{cat.name}</h3>
              </div>

            </div>
            <p className="text-xs text-gray-500 mb-3 line-clamp-2">{cat.description}</p>
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">{cat.productCount} products</span>
              <div className="flex gap-2">

                <button 
                  onClick={() => deleteCategory(cat.id)} 
                  title="Delete Category" 
                  className="p-2 rounded-lg text-[#e60000] hover:text-[#cc0000] transition-colors flex items-center justify-center"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2"></path><line x1="10" y1="11" x2="10" y2="17"></line><line x1="14" y1="11" x2="14" y2="17"></line></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAdd(false)}>
          <div className="bg-white rounded-2xl w-full max-w-md shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-6 py-4 border-b border-gray-100">
              <h3 className="text-lg font-black text-gray-900">Add New Category</h3>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Name *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="e.g. Accessories" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Slug</label>
                <input value={form.slug} onChange={(e) => setForm({...form, slug: e.target.value})} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500" placeholder="auto-generated from name" />
              </div>
              <div>
                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={2} className="w-full border border-gray-200 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-red-500 resize-none" />
              </div>
            </div>
            <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3">
              <button onClick={() => setShowAdd(false)} className="px-5 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name} className="px-5 py-2.5 bg-red-600 text-white rounded-lg text-sm font-bold disabled:opacity-50">Add Category</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
