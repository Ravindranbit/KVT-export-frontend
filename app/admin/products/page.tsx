'use client';

import { useState } from 'react';
import { useProductStore, Product } from '../../../store/useProductStore';

export default function AdminProducts() {
  const { products, addProduct, removeProduct } = useProductStore();
  const [search, setSearch] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editProduct, setEditProduct] = useState<Product | null>(null);
  const [deleteConfirm, setDeleteConfirm] = useState<number | null>(null);

  const [form, setForm] = useState({ name: '', price: '', category: 'fashion', description: '', image: '', vendorId: 'admin', stock: '100', sku: '', brand: '' });

  const categories = ['all', ...new Set(products.map(p => p.category))];

  const filtered = products.filter(p => {
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) || p.id.toString().includes(search);
    const matchCat = filterCategory === 'all' || p.category === filterCategory;
    return matchSearch && matchCat;
  });

  const handleAdd = () => {
    const newProduct: Product = {
      id: Date.now(),
      name: form.name,
      price: parseFloat(form.price),
      category: form.category,
      description: form.description,
      image: form.image || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
      vendorId: form.vendorId,
      rating: 0,
      reviews: 0,
      stock: parseInt(form.stock),
      sku: form.sku,
      brand: form.brand,
    };
    addProduct(newProduct);
    setShowAddModal(false);
    setForm({ name: '', price: '', category: 'fashion', description: '', image: '', vendorId: 'admin', stock: '100', sku: '', brand: '' });
  };

  const handleDelete = (id: number) => {
    removeProduct(id);
    setDeleteConfirm(null);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Product Management</h2>
          <p className="text-sm text-gray-500">{products.length} total products</p>
        </div>
        <button onClick={() => setShowAddModal(true)} className="bg-primary hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/10 border-none">
          + Add Product
        </button>
      </div>

      {/* Filters */}
      <div className="bg-white border border-gray-200 rounded-xl p-4 flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          <input
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
          />
        </div>
        <select value={filterCategory} onChange={(e) => setFilterCategory(e.target.value)} className="px-4 py-2.5 bg-gray-50 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary">
          {categories.map(c => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
        </select>
      </div>

      {/* Products Table */}
      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
        <table className="w-full table-fixed">
          <thead>
            <tr className="bg-gray-50 border-b border-gray-200">
              <th className="text-left text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 w-[20%]">Product</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-3 w-[16%]">Category</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-3 w-[16%]">Price</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-3 w-[16%]">Rating</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-2 py-3 w-[16%]">Reviews</th>
              <th className="text-center text-xs font-bold text-gray-500 uppercase tracking-wider px-4 py-3 w-[16%]">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-50">
            {filtered.map((p) => (
              <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-4">
                    <img src={p.image} alt={p.name} className="w-11 h-11 rounded-xl object-cover border border-gray-100 shadow-sm shrink-0" />
                    <div className="min-w-0">
                      <p className="text-sm font-black text-gray-900 truncate leading-tight">{p.name}</p>
                      <p className="text-[10px] font-bold text-gray-400 mt-0.5 uppercase tracking-wide">ID: {p.id}</p>
                    </div>
                  </div>
                </td>
                <td className="px-2 py-3 text-center">
                  <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{p.category}</span>
                </td>
                <td className="px-2 py-3 text-center text-sm font-black text-gray-900">₹{p.price.toLocaleString()}</td>
                <td className="px-2 py-3 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <svg className="w-3.5 h-3.5 text-yellow-400 fill-current" viewBox="0 0 20 20"><path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" /></svg>
                    <span className="text-sm font-black text-gray-800">{p.rating}</span>
                  </div>
                </td>
                <td className="px-2 py-3 text-center text-sm font-bold text-gray-500">{p.reviews}</td>
                <td className="px-4 py-3">
                  <div className="flex items-center justify-center gap-2">
                    <button 
                      onClick={() => setEditProduct(p)} 
                      className="text-[10px] font-black uppercase tracking-wider text-white bg-[#1976d2] px-4 py-2 rounded-lg hover:bg-blue-700 transition-all shadow-sm"
                    >
                      Edit
                    </button>
                    <button 
                      onClick={() => setDeleteConfirm(p.id)} 
                      className="p-2 text-[#e60000] hover:bg-red-50 rounded-lg transition-all transform hover:scale-110"
                      title="Delete Product"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-400 text-sm">No products found</div>
        )}
      </div>

      {/* Add Product Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setShowAddModal(false)}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Add New Product</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Product Name *</label>
                <input value={form.name} onChange={(e) => setForm({...form, name: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="e.g. Premium Cotton T-Shirt" />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Price (₹) *</label>
                  <input type="number" value={form.price} onChange={(e) => setForm({...form, price: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="1299" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Category *</label>
                  <select value={form.category} onChange={(e) => setForm({...form, category: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors bg-white">
                    <option value="electronics">Electronics</option>
                    <option value="fashion">Fashion</option>
                    <option value="home">Home</option>
                    <option value="sports">Sports</option>
                    <option value="beauty">Beauty</option>
                    <option value="books">Books</option>
                    <option value="toys">Toys</option>
                  </select>
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Description</label>
                <textarea value={form.description} onChange={(e) => setForm({...form, description: e.target.value})} rows={3} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors resize-none" placeholder="Product description..." />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Stock</label>
                  <input type="number" value={form.stock} onChange={(e) => setForm({...form, stock: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">SKU</label>
                  <input value={form.sku} onChange={(e) => setForm({...form, sku: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="SKU-001" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Brand</label>
                  <input value={form.brand} onChange={(e) => setForm({...form, brand: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="KVT" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Product Image</label>
                <div className="relative group p-4 border-2 border-dashed border-gray-300 hover:border-primary rounded-2xl bg-gray-50 hover:bg-primary/5 transition-colors flex items-center gap-6">
                  {form.image ? (
                    <img src={form.image} alt="" className="w-16 h-16 rounded-xl object-cover shadow-md bg-white shrink-0 border border-gray-200" />
                  ) : (
                    <div className="w-16 h-16 rounded-xl bg-gray-100 flex items-center justify-center shrink-0 border border-gray-200 text-gray-400">
                      <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
                    </div>
                  )}
                  <input type="file" accept="image/*" onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setForm({...form, image: URL.createObjectURL(file)});
                    }
                  }} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" />
                  <div>
                    <p className="text-sm font-bold text-gray-700 group-hover:text-primary transition-colors">Click to upload or drag and drop</p>
                    <p className="text-xs text-gray-500 mt-1">SVG, PNG, JPG or WEBP (max. 5MB)</p>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="px-8 py-5 border-t border-gray-100 bg-gray-50/50 flex justify-end gap-3 shrink-0">
              <button onClick={() => setShowAddModal(false)} className="px-6 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
              <button onClick={handleAdd} disabled={!form.name || !form.price} className="px-6 py-3 bg-primary text-white hover:opacity-90 rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-primary/10 border-none">Publish Product</button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm !== null && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl w-full max-w-sm p-6 shadow-2xl text-center">
            <div className="w-14 h-14 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">🗑️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-900 mb-2">Delete Product?</h3>
            <p className="text-sm text-gray-500 mb-6">This action cannot be undone. The product will be permanently removed.</p>
            <div className="flex gap-3">
              <button onClick={() => setDeleteConfirm(null)} className="flex-1 px-4 py-2.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
              <button onClick={() => handleDelete(deleteConfirm)} className="flex-1 px-4 py-2.5 bg-red-600 hover:bg-red-700 text-white rounded-lg text-sm font-bold transition-colors">Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={() => setEditProduct(null)}>
          <div className="bg-white rounded-2xl w-full max-w-lg p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-black text-gray-900 mb-4">Edit Product</h3>
            <p className="text-sm text-gray-500 mb-4">Editing: <span className="font-bold text-gray-900">{editProduct.name}</span></p>
            <p className="text-xs text-gray-400 bg-gray-50 p-3 rounded-lg">Full edit functionality will be available with backend integration. For now, you can delete and re-add with updated details.</p>
            <div className="mt-4 flex justify-end">
              <button onClick={() => setEditProduct(null)} className="px-5 py-2.5 bg-gray-900 text-white rounded-lg text-sm font-bold hover:bg-gray-800 transition-colors">Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
