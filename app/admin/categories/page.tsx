'use client';

import { useState } from 'react';
import { useAdminStore, Category } from '../../../store/useAdminStore';
import { 
  Plus, 
  Search, 
  Edit2, 
  Trash2, 
  Eye, 
  EyeOff, 
  Folder,
  Package,
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

export default function AdminCategories() {
  const { categories, addCategory, updateCategory, deleteCategory } = useAdminStore();
  const [showModal, setShowModal] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  
  const defaultForm = { name: '', slug: '', description: '', visible: true };
  const [form, setForm] = useState(defaultForm);

  const filteredCategories = categories.filter(cat => 
    cat.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    cat.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSave = () => {
    if (editingId) {
      updateCategory(editingId, form);
    } else {
      addCategory({
        id: `cat_${Date.now()}`,
        ...form,
        slug: form.slug || form.name.toLowerCase().replace(/\s+/g, '-'),
        productCount: 0,
        order: categories.length + 1,
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const openEdit = (cat: Category) => {
    setForm({ 
      name: cat.name, 
      slug: cat.slug, 
      description: cat.description, 
      visible: cat.visible 
    });
    setEditingId(cat.id);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Search & Add Header */}
      <div className="bg-white border border-gray-200 rounded-3xl p-6 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h2 className="text-xl font-black text-gray-900 tracking-tight">Categories</h2>
          <p className="text-sm font-medium text-gray-400 mt-1">Manage and group {categories.length} product sections</p>
        </div>
        <div className="flex items-center gap-4">
          <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
             <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 pr-4 py-2.5 bg-gray-50 border-none rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-red-500 w-[200px] md:w-[300px] font-medium"
             />
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2.5 rounded-xl text-sm font-bold flex items-center gap-2 transition-all shadow-lg shadow-red-600/10 active:scale-95"
          >
            <Plus size={18} />
            Add New
          </button>
        </div>
      </div>

      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.sort((a, b) => a.order - b.order).map((cat) => (
          <div 
            key={cat.id} 
            className={`group bg-white border rounded-[28px] overflow-hidden transition-all duration-300 hover:shadow-2xl hover:shadow-gray-200/40 ${!cat.visible ? 'opacity-60 border-dashed border-gray-300' : 'border-gray-100 shadow-sm'}`}
          >
            {/* Header Area */}
            <div className="p-6 pb-0 flex items-start justify-between">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-red-50 group-hover:text-red-500 transition-colors duration-500">
                 <Layers size={22} />
              </div>
              <button 
                onClick={() => deleteCategory(cat.id)}
                className="p-2.5 rounded-xl text-red-500 hover:bg-red-50 transition-all active:scale-95"
                title="Delete Category"
              >
                <Trash2 size={20} />
              </button>
            </div>

            <div className="p-6">
              <div>
                <h3 className="font-black text-gray-900 text-lg leading-tight tracking-tight">{cat.name}</h3>
                <div className="flex items-center gap-2 mt-2">
                   <div className="flex items-center gap-1.5 px-2 py-0.5 bg-gray-100 rounded-md text-[10px] font-black text-gray-500 uppercase tracking-widest">
                     <Package size={10} />
                     {cat.productCount} Items
                   </div>
                </div>
              </div>

              <div className="mt-5 mb-6">
                 <p className="text-xs text-gray-500 leading-relaxed font-medium line-clamp-2">
                   {cat.description || 'Quickly organize and manage products within this specific category group.'}
                 </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 pt-5 border-t border-gray-50">
                <button 
                  onClick={() => openEdit(cat)}
                  className="flex-1 py-3 rounded-2xl bg-[#1976d2] text-[11px] font-black uppercase tracking-widest text-white hover:bg-[#1565c0] transition-all shadow-lg shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-2"
                >
                  <Edit2 size={12} />
                  Edit
                </button>
                <button 
                  onClick={() => updateCategory(cat.id, { visible: !cat.visible })}
                  className={`flex-1 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-white transition-all active:scale-95 flex items-center justify-center gap-2 shadow-sm ${
                    cat.visible 
                      ? 'bg-orange-500 hover:bg-orange-600 shadow-orange-100/50 outline-none border-none' 
                      : 'bg-emerald-500 hover:bg-emerald-600 shadow-emerald-100/50 outline-none border-none'
                  }`}
                >
                  {cat.visible ? <EyeOff size={12} /> : <Eye size={12} />}
                  {cat.visible ? 'Hide' : 'Show'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Management Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-in fade-in duration-200" onClick={closeModal}>
          <div className="bg-white rounded-[32px] w-full max-w-md shadow-2xl overflow-hidden animate-in zoom-in duration-300 border border-gray-100" onClick={(e) => e.stopPropagation()}>
            <div className="px-10 py-8 border-b border-gray-50 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-black text-gray-900 tracking-tight">{editingId ? 'Edit Category' : 'New Category'}</h3>
                <p className="text-[10px] font-black text-gray-400 uppercase tracking-widest mt-1">System Configuration</p>
              </div>
              <button 
                onClick={closeModal} 
                className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 hover:text-gray-900 transition-all"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="p-10 space-y-6">
              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">DisplayName</label>
                <input 
                  value={form.name} 
                  onChange={(e) => setForm({...form, name: e.target.value})} 
                  className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-600 transition-all bg-gray-50/50" 
                  placeholder="e.g. Footwear" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                  rows={4} 
                  className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-600 transition-all font-medium bg-gray-50/50 resize-none" 
                  placeholder="Additional context for this category..."
                />
              </div>
            </div>

            <div className="px-10 py-6 border-t border-gray-50 bg-gray-50/30 flex justify-end gap-4 font-bold">
              <button 
                onClick={closeModal} 
                className="text-sm text-gray-500 hover:text-gray-900 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleSave} 
                disabled={!form.name} 
                className="px-8 py-3 bg-red-600 text-white rounded-2xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/10 disabled:opacity-50 disabled:shadow-none"
              >
                {editingId ? 'Save Changes' : 'Confirm Category'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
