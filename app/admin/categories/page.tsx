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
  
  const defaultForm = { name: '', slug: '', description: '', visible: true, showInHeader: true, showInFilters: true };
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
      visible: cat.visible,
      showInHeader: cat.showInHeader ?? true,
      showInFilters: cat.showInFilters ?? true
    });
    setEditingId(cat.id);
    setShowModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header Container */}
      <div className="bg-white border border-gray-100 rounded-[28px] p-8 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-6 mb-8">
        <div>
          <h2 className="text-2xl font-black text-gray-900 tracking-tight leading-none">Categories</h2>
          <p className="text-sm font-bold text-gray-400 mt-2.5 opacity-80">Manage and group {categories.length} product sections</p>
        </div>
        
        <div className="flex items-center gap-4">
          <div className="relative group w-full lg:w-auto">
             <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary transition-colors" size={16} />
             <input
                type="text"
                placeholder="Search..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-11 pr-5 py-3 bg-[#f8fafc] border border-gray-100 rounded-2xl text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:bg-white focus:border-primary w-full lg:w-[320px] font-bold transition-all placeholder:text-gray-400 placeholder:font-medium"
             />
          </div>
          <button 
            onClick={() => setShowModal(true)} 
            className="bg-primary hover:opacity-90 text-white px-7 py-3 rounded-2xl text-[13px] font-black flex items-center gap-2.5 transition-all shadow-xl shadow-primary/20 active:scale-95 border-none shrink-0"
          >
            <Plus size={18} />
            + Add New
          </button>
        </div>
      </div>
 
      {/* Categories Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredCategories.sort((a, b) => a.order - b.order).map((cat) => (
          <div 
            key={cat.id} 
            className={`group bg-white border border-gray-100 rounded-[32px] p-6 shadow-sm hover:shadow-2xl hover:shadow-gray-200/50 transition-all duration-500 flex flex-col h-full ${!cat.visible ? 'opacity-70 grayscale-[20%]' : ''}`}
          >
            {/* Header: Layers & Trash */}
            <div className="flex justify-between items-start mb-5">
              <div className="w-12 h-12 bg-gray-50 rounded-2xl flex items-center justify-center text-gray-400 group-hover:bg-primary/5 group-hover:text-primary transition-all duration-500">
                 <Layers size={22} />
              </div>
              <button 
                onClick={() => deleteCategory(cat.id)}
                className="p-2 text-red-500 hover:bg-red-50 rounded-xl transition-all active:scale-95"
                title="Delete Category"
              >
                <Trash2 size={18} />
              </button>
            </div>
 
            {/* Body */}
            <div className="flex-1">
              <h3 className="text-xl font-black text-gray-900 tracking-tight leading-none group-hover:text-primary transition-colors">{cat.name}</h3>
              
              <div className="mt-3.5 mb-4 flex items-center gap-2 flex-wrap">
                 <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-gray-50 border border-gray-100 rounded-lg">
                   <Package size={12} className="text-gray-400" />
                   <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">{cat.productCount} Items</span>
                 </div>
                 {cat.showInHeader && (
                   <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
                     <Folder size={11} className="stroke-[3]" />
                     <span className="text-[9px] font-black uppercase tracking-tight">Header</span>
                   </div>
                 )}
                 {cat.showInFilters && (
                   <div className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-50 border border-blue-100 rounded-lg text-blue-600">
                     <Search size={11} className="stroke-[3]" />
                     <span className="text-[9px] font-black uppercase tracking-tight">Filters</span>
                   </div>
                 )}
              </div>
 
              <p className="text-[12px] text-gray-500 font-bold leading-relaxed opacity-80 line-clamp-2">
                {cat.description || 'Quickly organize and manage products within this specific category group.'}
              </p>
            </div>
 
            {/* Actions: Reverted colors with reduced brightness filter */}
            <div className="flex items-center gap-2.5 mt-8">
              <button 
                onClick={() => openEdit(cat)}
                className="flex-1 py-3 bg-[#1976d2] hover:brightness-90 brightness-[0.95] text-[10px] font-black uppercase tracking-[0.15em] text-white rounded-[16px] transition-all shadow-lg shadow-blue-600/10 active:scale-95 flex items-center justify-center gap-2"
              >
                <Edit2 size={12} className="stroke-[3]" />
                Edit
              </button>
              <button 
                onClick={() => updateCategory(cat.id, { visible: !cat.visible })}
                className={`flex-1 py-3 rounded-[16px] text-[10px] font-black uppercase tracking-[0.15em] transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg brightness-[0.95] hover:brightness-90 ${
                  cat.visible 
                    ? 'bg-[#ff6b2b] text-white shadow-orange-500/20' 
                    : 'bg-gray-900 text-white shadow-gray-900/20'
                }`}
              >
                {cat.visible ? <EyeOff size={13} className="stroke-[3]" /> : <Eye size={13} className="stroke-[3]" />}
                {cat.visible ? 'Hide' : 'Show'}
              </button>
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
                  className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm font-bold focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all bg-gray-50/50" 
                  placeholder="e.g. Footwear" 
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-gray-500 uppercase tracking-widest mb-2 px-1">Description</label>
                <textarea 
                  value={form.description} 
                  onChange={(e) => setForm({...form, description: e.target.value})} 
                  rows={4} 
                  className="w-full border border-gray-100 rounded-2xl px-5 py-4 text-sm focus:outline-none focus:ring-4 focus:ring-primary/5 focus:border-primary transition-all font-medium bg-gray-50/50 resize-none" 
                  placeholder="Additional context for this category..."
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <button
                  onClick={() => setForm({...form, showInHeader: !form.showInHeader})}
                  className={`p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 shadow-sm ${
                    form.showInHeader 
                      ? 'bg-[#1976d2] border-[#1976d2] text-white shadow-blue-100' 
                      : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${form.showInHeader ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Folder size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.1em]">Navigation</span>
                </button>
                <button
                  onClick={() => setForm({...form, showInFilters: !form.showInFilters})}
                  className={`p-5 rounded-3xl border-2 transition-all duration-300 flex flex-col items-center gap-3 shadow-sm ${
                    form.showInFilters 
                      ? 'bg-[#1976d2] border-[#1976d2] text-white shadow-blue-100' 
                      : 'bg-white border-gray-200 text-gray-400 hover:border-gray-300 hover:bg-gray-50'
                  }`}
                >
                  <div className={`p-2 rounded-xl ${form.showInFilters ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>
                    <Search size={20} className="stroke-[2.5]" />
                  </div>
                  <span className="text-[11px] font-black uppercase tracking-[0.1em]">Filters Bar</span>
                </button>
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
                className="px-8 py-3 bg-primary text-white rounded-2xl text-sm hover:opacity-90 transition-all shadow-lg shadow-primary/10 disabled:opacity-50 disabled:shadow-none border-none"
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
