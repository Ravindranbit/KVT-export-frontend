'use client';

import { useState } from 'react';
import { useAdminStore } from '../../../store/useAdminStore';
import { useProductStore } from '../../../store/useProductStore';
import { ChevronDown } from 'lucide-react';

export default function AdminBanners() {
  const { products } = useProductStore();
  const { banners, addBanner, updateBanner, deleteBanner } = useAdminStore();
  const [showAdd, setShowAdd] = useState(false);
  const [showProductSelect, setShowProductSelect] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const defaultForm = { title: '', subtitle: '', desc: '', cta: '', href: '', accent: '#ff6b6b', image: '', tag: '' };
  const [form, setForm] = useState(defaultForm);

  const filteredBanners = banners.filter(b => 
    b.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    b.subtitle.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (b.desc && b.desc.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (b.tag && b.tag.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const handleSave = () => {
    let finalImage = form.image;
    if (!finalImage && form.href) {
      const linkedProd = products.find(p => `/product/${p.id}` === form.href);
      if (linkedProd) finalImage = linkedProd.image;
    }
    const finalForm = { ...form, image: finalImage };

    if (editingId) {
      updateBanner(editingId, finalForm);
    } else {
      addBanner({
        id: `b_${Date.now()}`,
        ...finalForm,
        active: true,
      });
    }
    closeModal();
  };

  const closeModal = () => {
    setShowAdd(false);
    setEditingId(null);
    setForm(defaultForm);
  };

  const openEdit = (b: any) => {
    setForm({ title: b.title || '', subtitle: b.subtitle || '', desc: b.desc || '', cta: b.cta || '', href: b.href || '', accent: b.accent || '#ff6b6b', image: b.image || '', tag: b.tag || '' });
    setEditingId(b.id);
    setShowAdd(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-black text-gray-900">Banner Management</h2>
          <p className="text-sm text-gray-500">{banners.length} banner slides</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="Search banners..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2.5 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:border-primary transition-all"
            />
            <svg className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <button onClick={() => setShowAdd(true)} className="bg-primary hover:opacity-90 text-white font-bold px-6 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-primary/10 border-none">+ Add Banner</button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredBanners.map((b) => (
          <div key={b.id} className={`bg-white border rounded-[20px] flex flex-col overflow-hidden transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${b.active ? 'border-gray-200 shadow-sm' : 'border-dashed border-gray-300 opacity-80 grayscale-[20%]'}`}>
            
            {/* Banner Preview (Top) */}
            <div className="w-full h-44 relative overflow-hidden flex-shrink-0 group" style={{ background: `linear-gradient(135deg, #0f172a, #1e293b)` }}>
              <div className="absolute inset-0 opacity-20 blur-[50px] transition-opacity group-hover:opacity-40" style={{ backgroundColor: b.accent }} />
              


              <div className="relative p-5 h-full flex flex-col justify-center z-10 w-[70%]">
                <p className="text-white text-lg font-extrabold leading-tight shadow-sm drop-shadow-md">{b.title}</p>
                <p className="text-[11px] font-black uppercase tracking-wider mt-1.5 drop-shadow-sm" style={{ color: b.accent }}>{b.subtitle}</p>
              </div>
              
              {/* Image with fancy hover effect */}
              {b.image && (
                <div className="absolute -right-4 -bottom-4 w-32 h-36 z-10 rotate-[-5deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 drop-shadow-2xl">
                  <img src={b.image} alt="" className="w-full h-full object-cover rounded-xl border-4 border-white/10" />
                </div>
              )}
            </div>

            {/* Details & Actions (Bottom) */}
            <div className="p-5 flex flex-col flex-1 pb-4">
              <div className="flex-1">
                <p className="text-xs text-gray-500 line-clamp-2 leading-relaxed mb-4 italic font-medium">"{b.desc || 'No description provided.'}"</p>
                
              </div>

              <div className="flex gap-2.5 mt-auto items-center">
                <button onClick={() => openEdit(b)} className="flex-1 text-[11px] font-black uppercase tracking-wider text-gray-600 bg-gray-100 border border-gray-200 py-2.5 rounded-xl hover:bg-gray-200 hover:text-gray-900 transition-colors shadow-sm active:scale-95">
                  Edit
                </button>
                <button onClick={() => updateBanner(b.id, { active: !b.active })} className={`flex-1 text-[11px] font-black uppercase tracking-wider text-white py-2.5 rounded-xl transition-all shadow-sm active:scale-95 ${b.active ? 'bg-[#ff9800] hover:bg-[#e68a00]' : 'bg-[#3b8c41] hover:bg-[#2e6e33]'}`}>
                  {b.active ? 'Disable' : 'Enable'}
                </button>
                <button onClick={() => deleteBanner(b.id)} className="p-2.5 text-[#e60000] hover:text-[#cc0000] shrink-0 transition-colors" title="Delete">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Banner Modal */}
      {showAdd && (
        <div className="fixed inset-0 bg-gray-900/60 backdrop-blur-sm flex items-center justify-center z-50 p-4" onClick={closeModal}>
          <div className="bg-white rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="px-8 py-6 border-b border-gray-100 flex items-center justify-between">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">{editingId ? 'Edit Banner Slide' : 'Add New Banner Slide'}</h3>
              <button onClick={closeModal} className="text-gray-400 hover:text-gray-600 transition-colors">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
              </button>
            </div>
            <div className="p-8 overflow-y-auto space-y-6 flex-1">
              
              {/* Live Preview */}
              <div className="mb-8">
                <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-3">Live Preview</label>
                <div className="w-full h-44 relative overflow-hidden flex-shrink-0 group rounded-[20px] shadow-sm border border-gray-200" style={{ background: `linear-gradient(135deg, #0f172a, #1e293b)` }}>
                  <div className="absolute inset-0 opacity-20 blur-[50px] transition-opacity group-hover:opacity-40" style={{ backgroundColor: form.accent || '#ff6b6b' }} />

                  <div className="relative p-5 h-full flex flex-col justify-center z-10 w-[70%]">
                    <p className="text-white text-lg font-extrabold leading-tight shadow-sm drop-shadow-md">{form.title || 'Enter a spectacular title'}</p>
                    <p className="text-[11px] font-black uppercase tracking-wider mt-1.5 drop-shadow-sm" style={{ color: form.accent || '#ff6b6b' }}>{form.subtitle || 'And a catchy subtitle'}</p>
                    <div className="mt-4">
                      <span className="inline-flex items-center px-4 py-1.5 rounded-lg text-[10px] font-extrabold text-white shadow-lg border border-white/20 transition-transform group-hover:-translate-y-0.5" style={{ backgroundColor: form.accent || '#ff6b6b' }}>
                        {form.cta || 'Shop Now'} →
                      </span>
                    </div>
                  </div>
                  
                  {(() => {
                    const linkedProd = form.href ? products.find(p => `/product/${p.id}` === form.href) : null;
                    const previewImage = form.image || (linkedProd ? linkedProd.image : null);
                    
                    if (previewImage) {
                      return (
                        <div className="absolute -right-4 -bottom-4 w-32 h-36 z-10 rotate-[-5deg] group-hover:rotate-0 group-hover:scale-105 transition-all duration-500 drop-shadow-2xl">
                          <img src={previewImage} alt="" className="w-full h-full object-cover rounded-xl border-4 border-white/10 p-1 bg-white/50 backdrop-blur-sm" />
                        </div>
                      );
                    }
                    return null;
                  })()}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Title *</label>
                  <input value={form.title} onChange={(e) => setForm({...form, title: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Up to 60% Off" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Subtitle *</label>
                  <input value={form.subtitle} onChange={(e) => setForm({...form, subtitle: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Electronics & Gadgets" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">CTA Text</label>
                  <input value={form.cta} onChange={(e) => setForm({...form, cta: e.target.value})} className="w-full border border-gray-200 rounded-xl px-4 py-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" placeholder="Shop Now" />
                </div>
                <div>
                  <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Linked Product</label>
                  <div className="relative">
                    <div 
                      onClick={() => setShowProductSelect(!showProductSelect)}
                      className="w-full border border-gray-200 rounded-xl px-4 py-2.5 bg-white flex items-center justify-between cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors min-h-[48px]"
                    >
                      {form.href ? (
                        (() => {
                           const linkedProd = products.find(p => `/product/${p.id}` === form.href);
                           if (linkedProd) {
                             return (
                               <div className="flex items-center gap-3">
                                 <img src={linkedProd.image} className="w-6 h-6 rounded-md object-cover bg-gray-50 border border-gray-100" />
                                 <span className="text-sm font-medium text-gray-900 truncate max-w-[120px]">{linkedProd.name}</span>
                               </div>
                             );
                           }
                           return <span className="text-sm font-medium text-gray-900 truncate">{form.href}</span>;
                        })()
                      ) : (
                        <span className="text-sm text-gray-400">Select a product...</span>
                      )}
                      <ChevronDown size={16} className={`text-gray-400 transition-transform ${showProductSelect ? 'rotate-180' : ''}`} />
                    </div>

                    {showProductSelect && (
                       <div className="absolute top-full right-0 left-0 mt-2 bg-white border border-gray-100 shadow-2xl rounded-2xl max-h-64 overflow-y-auto z-50 p-2">
                         <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider px-3 pb-2 pt-1 border-b border-gray-50 mb-2">Products</div>
                         {products.map(p => (
                            <div 
                              key={p.id} 
                              onClick={() => { setForm({...form, href: `/product/${p.id}`}); setShowProductSelect(false); }} 
                              className="p-2.5 rounded-xl hover:bg-gray-50 flex items-center gap-3 cursor-pointer transition-colors"
                            >
                               <img src={p.image} className="w-10 h-10 rounded-lg object-cover border border-gray-100 bg-gray-50" />
                               <div>
                                 <p className="text-sm font-bold text-gray-900 line-clamp-1">{p.name}</p>
                                 <p className="text-xs text-gray-500 font-medium mt-0.5">₹{p.price.toLocaleString()}</p>
                               </div>
                            </div>
                         ))}
                         {products.length === 0 && (
                            <div className="p-4 text-center text-sm text-gray-500">No products available</div>
                         )}
                       </div>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Accent Color</label>
                <div className="flex items-center gap-3">
                  <input type="color" value={form.accent} onChange={(e) => setForm({...form, accent: e.target.value})} className="w-12 h-12 rounded-xl border border-gray-200 cursor-pointer p-1 bg-white" />
                  <input value={form.accent} onChange={(e) => setForm({...form, accent: e.target.value})} className="flex-1 border border-gray-200 rounded-xl px-4 py-3.5 text-sm font-mono focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-colors" />
                </div>
              </div>

              <div>
                <label className="block text-[10px] font-bold text-gray-500 uppercase tracking-wider mb-2">Upload Image Background</label>
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
              <button onClick={closeModal} className="px-6 py-3 border border-gray-200 bg-white rounded-xl text-sm font-bold text-gray-600 hover:bg-gray-50 transition-colors shadow-sm">Cancel</button>
              <button onClick={handleSave} disabled={!form.title || !form.subtitle} className="px-6 py-3 bg-primary text-white hover:opacity-90 rounded-xl text-sm font-bold disabled:opacity-50 transition-all shadow-lg shadow-primary/10 border-none">{editingId ? 'Save Changes' : 'Publish Banner'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
