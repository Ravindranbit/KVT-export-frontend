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
  Bell
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDetails() {
  const [notifiedProducts, setNotifiedProducts] = useState<number[]>([]);
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
          
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3">
             <button className="px-6 py-2.5 bg-gray-900 hover:bg-black text-white rounded-xl text-sm font-medium transition-colors border border-transparent flex items-center justify-center gap-2">
               <ExternalLink size={16} /> Live Storefront
             </button>
             <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-gray-700 rounded-xl text-sm font-medium transition-colors border border-gray-200 flex items-center justify-center gap-2">
               Contact Partner
             </button>
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
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Reviews</th>
                  <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {vendorProducts.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/50 transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <img src={p.image} className="w-12 h-12 rounded-lg object-cover bg-gray-50 border border-gray-200 object-top" alt={p.name} />
                        <div>
                          <p className="text-sm font-medium text-gray-900 group-hover:text-red-600 transition-colors">{p.name}</p>
                          <p className="text-xs text-gray-500 mt-0.5">ID: {p.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-sm text-gray-600 capitalize">
                        {p.category}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-sm font-medium text-gray-900">₹{p.price.toLocaleString()}</p>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-1.5 text-sm">
                          <span className="text-yellow-500">★</span>
                          <span className="font-medium text-gray-900">{p.rating}</span>
                          <span className="text-gray-500">({p.reviews})</span>
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors shadow-sm">
                          <EyeOff size={14} />
                          <span>Hide</span>
                        </button>
                        <button 
                          onClick={() => {
                            if (!notifiedProducts.includes(p.id)) {
                              setNotifiedProducts(prev => [...prev, p.id]);
                            }
                          }}
                          className={
                            notifiedProducts.includes(p.id)
                              ? "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-white bg-red-600 border border-red-600 rounded-lg shadow-sm"
                              : "inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-all shadow-sm"
                          }
                        >
                          <Bell size={14} />
                          <span>{notifiedProducts.includes(p.id) ? 'Notified' : 'Notify Store'}</span>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
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
  );
}

