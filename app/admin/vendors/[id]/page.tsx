'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAdminStore, Vendor } from '../../../../store/useAdminStore';
import { useProductStore, Product } from '../../../../store/useProductStore';
import { useParams, useRouter } from 'next/navigation';
import { 
  Building2, 
  Mail, 
  Phone, 
  Calendar, 
  TrendingUp, 
  Package, 
  ArrowLeft,
  Settings,
  ChevronRight,
  ExternalLink,
  ShoppingBag,
  EyeOff,
  Eye
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDetails() {
  const [hiddenProducts, setHiddenProducts] = useState<number[]>([]);
  const [showHideModal, setShowHideModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [hideReason, setHideReason] = useState('');
  const params = useParams();
  const router = useRouter();
  const { vendors } = useAdminStore();
  const { products } = useProductStore();
  const vendorId = params?.id as string;

  const vendor = vendors.find(v => v.id === vendorId);
  const vendorProducts = products.filter(p => p.vendorId === vendorId);

  if (!vendor) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center text-center">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center text-gray-400 mb-4">
          <Building2 size={32} />
        </div>
        <h2 className="text-xl font-black text-gray-900">Enterprise Not Found</h2>
        <p className="text-sm text-gray-500 mt-2">The requested vendor entity could not be located in our systems.</p>
        <button onClick={() => router.back()} className="mt-6 px-6 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold flex items-center gap-2">
          <ArrowLeft size={16} /> Return to Network
        </button>
      </div>
    );
  }

  const stats = [
    { label: 'Inventory Count', value: vendorProducts.length, icon: Package, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Settled Revenue', value: `₹${vendor.totalRevenue.toLocaleString()}`, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
    { label: 'Fee Profile', value: `${vendor.commission}%`, icon: Settings, color: 'text-purple-600', bg: 'bg-purple-50' },
  ];

  return (
    <>
      <div className="space-y-8 pb-20">
        {/* Navigation */}
        <button 
          onClick={() => router.back()}
          className="group flex items-center gap-2 text-gray-400 hover:text-gray-900 transition-colors"
        >
          <div className="p-2 rounded-lg bg-white border border-gray-100 group-hover:border-gray-200 shadow-sm transition-all">
            <ArrowLeft size={16} />
          </div>
          <span className="text-[11px] font-black uppercase tracking-widest">Back to Management</span>
        </button>

        {/* Header Profile */}
        <div className="bg-white border border-gray-200 rounded-3xl p-8 lg:p-10 shadow-sm relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-[0.03]">
             <Building2 size={180} />
          </div>
          
          <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
            <div className="flex items-start gap-6">
               <div className="w-20 h-20 bg-gradient-to-br from-gray-800 to-gray-900 rounded-2xl flex items-center justify-center text-3xl font-bold text-white shadow-md">
                 {vendor.storeName.charAt(0)}
               </div>
               <div>
                 <div className="flex items-center gap-3 mb-1">
                   <h1 className="text-2xl font-bold text-gray-900">{vendor.storeName}</h1>
                 </div>
                 <p className="text-sm text-gray-500 max-w-xl leading-relaxed">{vendor.storeDescription}</p>
                 
                 <div className="flex flex-wrap items-center gap-6 mt-5">
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Mail size={16} className="text-gray-400" />
                     {vendor.email}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Phone size={16} className="text-gray-400" />
                     {vendor.phone}
                   </div>
                   <div className="flex items-center gap-2 text-sm text-gray-600">
                     <Calendar size={16} className="text-gray-400" />
                     Joined {vendor.joinedDate}
                   </div>
                 </div>
               </div>
            </div>
          </div>
        </div>

        {/* Numerical Intelligence */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {stats.map((s, i) => {
            const Icon = s.icon;
            return (
              <div
                key={i}
                className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm flex items-center gap-4 hover:border-gray-300 transition-colors"
              >
                <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-xl flex items-center justify-center shrink-0`}>
                  <Icon size={24} />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">{s.label}</p>
                  <h3 className="text-2xl font-bold text-gray-900 mt-0.5">{s.value}</h3>
                </div>
              </div>
            );
          })}
        </div>

        {/* Product Inventory Operations */}
        <div className="space-y-4">
          <div className="flex items-center justify-between px-1">
            <div className="flex items-center gap-3">
               <div className="p-2 bg-gray-100 rounded-lg text-gray-700">
                 <Package size={20} />
               </div>
               <div>
                 <h2 className="text-lg font-bold text-gray-900">Partner Inventory</h2>
                 <p className="text-sm text-gray-500">Managing products for {vendor.storeName}</p>
               </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[35%]">Product</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%] text-center">Category</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%] text-center">Price</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[15%] text-center">Reviews</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider w-[20%] text-center">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 font-medium">
                  {vendorProducts.map((p) => {
                    const isHidden = hiddenProducts.includes(p.id);
                    return (
                    <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                      <td className={`px-6 py-4 transition-opacity ${isHidden ? 'opacity-30' : ''}`}>
                        <div className="flex items-center gap-4">
                          <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-200 object-top" alt={p.name} />
                          <div>
                            <p className="text-sm font-bold text-gray-900 group-hover:text-red-600 transition-colors">{p.name}</p>
                            <p className="text-[11px] text-gray-400 mt-0.5 font-bold uppercase tracking-tight">ID: {p.id}</p>
                          </div>
                        </div>
                      </td>
                      <td className={`px-6 py-4 text-center transition-opacity ${isHidden ? 'opacity-30' : ''}`}>
                        <span className="text-xs font-bold text-gray-600 bg-gray-100 px-3 py-1 rounded-full capitalize shadow-sm">
                          {p.category}
                        </span>
                      </td>
                      <td className={`px-6 py-4 text-center transition-opacity ${isHidden ? 'opacity-30' : ''}`}>
                        <p className="text-sm font-black text-gray-900">₹{p.price.toLocaleString()}</p>
                      </td>
                      <td className={`px-6 py-4 text-center transition-opacity ${isHidden ? 'opacity-30' : ''}`}>
                         <div className="flex items-center justify-center gap-1.5 text-xs">
                            <span className="text-yellow-500 text-sm">★</span>
                            <span className="font-black text-gray-900">{p.rating}</span>
                            <span className="text-gray-400 font-bold">({p.reviews})</span>
                         </div>
                      </td>
                      <td className="px-6 py-4 text-center">
                        <div className="flex items-center justify-center gap-2">
                          <button
                            onClick={() => {
                              if (isHidden) {
                                setHiddenProducts(prev => prev.filter(id => id !== p.id));
                              } else {
                                setSelectedProduct(p);
                                setHideReason('');
                                setShowHideModal(true);
                              }
                            }}
                            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-black uppercase tracking-wider rounded-lg border transition-all shadow-sm ${
                              isHidden
                                ? 'text-white bg-blue-600 border-blue-600 hover:bg-blue-700'
                                : 'text-gray-700 bg-white border-gray-200 hover:bg-gray-50'
                            }`}
                          >
                            <span>{isHidden ? 'Unhide' : 'Hide'}</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                    );
                  })}
                </tbody>
              </table>
              {vendorProducts.length === 0 && (
                <div className="p-12 text-center flex flex-col items-center">
                   <Package size={48} className="text-gray-200 mb-3" />
                   <h3 className="text-sm font-medium text-gray-900">No products found</h3>
                   <p className="text-sm text-gray-500 mt-1">This vendor hasn't added any products yet.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Hide Reason Modal */}
      {showHideModal && selectedProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-[60] p-4">
          <div className="bg-white rounded-3xl w-full max-w-md shadow-2xl animate-in fade-in zoom-in duration-200 border border-gray-100 overflow-hidden">
            <div className="px-8 py-6 border-b border-gray-50">
              <h3 className="text-xl font-black text-gray-900 tracking-tight">Hide Product</h3>
              <p className="text-xs text-gray-500 font-medium mt-1">Reason for hiding <span className="text-red-600 font-bold">"{selectedProduct.name}"</span></p>
            </div>
            
            <div className="p-8">
              <label className="block text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-3">Your Message to Vendor</label>
              <textarea
                value={hideReason}
                onChange={(e) => setHideReason(e.target.value)}
                placeholder="e.g. Product images are low quality or incorrect pricing..."
                className="w-full h-32 border border-gray-200 rounded-2xl p-4 text-sm focus:outline-none focus:ring-4 focus:ring-red-500/5 focus:border-red-500 transition-all font-medium bg-gray-50/50 resize-none"
              />
            </div>

            <div className="px-8 py-5 bg-gray-50/50 border-t border-gray-100 flex justify-end gap-3 font-bold">
              <button 
                onClick={() => {
                  setShowHideModal(false);
                  setSelectedProduct(null);
                  setHideReason('');
                }}
                className="px-6 py-2.5 text-sm text-gray-500 bg-white border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={() => {
                  if (selectedProduct) {
                    console.log(`Product ${selectedProduct.id} hidden. Reason sent to vendor: ${hideReason}`);
                    setHiddenProducts(prev => [...prev, selectedProduct.id]);
                  }
                  setShowHideModal(false);
                  setSelectedProduct(null);
                  setHideReason('');
                }}
                disabled={!hideReason.trim()}
                className="px-8 py-2.5 bg-red-600 text-white rounded-xl text-sm hover:bg-red-700 transition-all shadow-lg shadow-red-600/20 disabled:opacity-50 disabled:shadow-none"
              >
                Hide & Notify
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

