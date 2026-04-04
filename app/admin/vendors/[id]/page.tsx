'use client';

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
  ShoppingBag
} from 'lucide-react';
import Link from 'next/link';

export default function VendorDetails() {
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
      <div className="bg-white border border-gray-200 rounded-[32px] p-8 lg:p-12 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-5">
           <Building2 size={240} />
        </div>
        
        <div className="relative flex flex-col lg:flex-row lg:items-center justify-between gap-8">
          <div className="flex items-start gap-8">
             <div className="w-24 h-24 bg-gray-900 rounded-[28px] flex items-center justify-center text-4xl font-black text-white shadow-xl rotate-3">
               {vendor.storeName.charAt(0)}
             </div>
             <div>
               <div className="flex items-center gap-3">
                 <h1 className="text-3xl font-black text-gray-950 tracking-tighter">{vendor.storeName}</h1>
                 <span className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border border-gray-100 shadow-sm ${
                   vendor.status === 'approved' ? 'text-green-600 bg-green-50' : 
                   vendor.status === 'pending' ? 'text-amber-600 bg-amber-50' : 'text-red-600 bg-red-50'
                 }`}>
                   {vendor.status}
                 </span>
               </div>
               <p className="text-base text-gray-500 font-medium mt-2 max-w-xl leading-relaxed italic">"{vendor.storeDescription}"</p>
               
               <div className="flex flex-wrap items-center gap-6 mt-6">
                 <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600">
                   <Mail size={16} className="text-gray-300" />
                   {vendor.email}
                 </div>
                 <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600">
                   <Phone size={16} className="text-gray-300" />
                   {vendor.phone}
                 </div>
                 <div className="flex items-center gap-2.5 text-sm font-bold text-gray-600">
                   <Calendar size={16} className="text-gray-300" />
                   Joined {vendor.joinedDate}
                 </div>
               </div>
             </div>
          </div>
          
          <div className="flex flex-col gap-3">
             <button className="px-8 py-3.5 bg-gray-900 hover:bg-black text-white rounded-2xl text-sm font-black transition-all shadow-lg flex items-center justify-center gap-3 group">
               <ExternalLink size={18} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
               Live Storefront
             </button>
             <button className="px-8 py-3.5 bg-white border border-gray-200 hover:bg-gray-50 text-gray-900 rounded-2xl text-sm font-black transition-all shadow-sm flex items-center justify-center gap-3">
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
            <motion.div
              key={i}
              whileHover={{ y: -4 }}
              className="bg-white border border-gray-100 p-8 rounded-[28px] shadow-sm hover:shadow-xl transition-all group"
            >
              <div className={`w-12 h-12 ${s.bg} ${s.color} rounded-2xl flex items-center justify-center mb-5 group-hover:scale-110 transition-transform`}>
                <Icon size={24} />
              </div>
              <p className="text-[11px] font-black text-gray-400 uppercase tracking-widest">{s.label}</p>
              <h3 className="text-3xl font-black text-gray-900 mt-2 tracking-tighter leading-none">{s.value}</h3>
            </motion.div>
          );
        })}
      </div>

      {/* Product Inventory Operations */}
      <div className="space-y-6">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-4">
             <div className="p-2.5 bg-[#e60000]/10 rounded-xl text-[#e60000]">
               <ShoppingBag size={20} />
             </div>
             <div>
               <h2 className="text-xl font-black text-gray-900 tracking-tighter">Partner Inventory</h2>
               <p className="text-[11px] text-gray-400 font-bold uppercase tracking-widest mt-1">Management Console for {vendor.storeName}</p>
             </div>
          </div>
          <Link href="/admin/products" className="text-xs font-black text-red-600 hover:text-red-700 bg-red-50 hover:bg-red-100 px-5 py-2.5 rounded-full transition-all border border-red-100">
             Master Database View
          </Link>
        </div>

        <div className="bg-white border border-gray-100 rounded-[32px] overflow-hidden shadow-sm">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-50/50 border-b border-gray-100">
                <th className="text-left text-[10px] font-black text-gray-400 uppercase tracking-widest p-6">SKU / Product Info</th>
                <th className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest p-6 text-center">Category</th>
                <th className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest p-6 text-center">Price</th>
                <th className="text-center text-[10px] font-black text-gray-400 uppercase tracking-widest p-6 text-center">Reviews</th>
                <th className="text-right text-[10px] font-black text-gray-400 uppercase tracking-widest p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {vendorProducts.map((p) => (
                <tr key={p.id} className="group hover:bg-gray-50/30 transition-colors">
                  <td className="p-6">
                    <div className="flex items-center gap-5">
                      <img src={p.image} className="w-14 h-14 rounded-2xl object-cover bg-gray-50 border border-gray-100/50 shadow-sm" />
                      <div>
                        <p className="text-sm font-black text-gray-900 tracking-tight group-hover:text-red-600 transition-colors">{p.name}</p>
                        <p className="text-[10px] text-gray-400 font-bold mt-1 uppercase tracking-widest bg-gray-50 px-2 py-0.5 rounded-md border border-gray-100 inline-block">ID: #{p.id}</p>
                      </div>
                    </div>
                  </td>
                  <td className="p-6 text-center">
                    <span className="text-[10px] font-black text-gray-500 bg-gray-100 px-3 py-1.5 rounded-full uppercase tracking-widest">{p.category}</span>
                  </td>
                  <td className="p-6 text-center">
                    <p className="text-sm font-black text-gray-900 tracking-tight">₹{p.price.toLocaleString()}</p>
                  </td>
                  <td className="p-6">
                     <div className="flex flex-col items-center">
                        <div className="flex items-center gap-1.5 bg-yellow-50 px-2.5 py-1 rounded-full border border-yellow-100">
                          <span className="text-[11px] font-black text-yellow-700">{p.rating}</span>
                          <p className="text-[8px] text-yellow-400">★</p>
                        </div>
                        <p className="text-[10px] text-gray-400 font-bold mt-1.5 truncate">{p.reviews} Feedbacks</p>
                     </div>
                  </td>
                  <td className="p-6 text-right">
                    <Link 
                      href={`/admin/products`} 
                      className="inline-flex items-center gap-2 text-[10px] font-black text-gray-400 uppercase tracking-widest hover:text-red-600 transition-all border border-transparent hover:border-red-100 hover:bg-red-50 p-2.5 px-4 rounded-xl"
                    >
                      Audit
                      <ChevronRight size={14} />
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {vendorProducts.length === 0 && (
            <div className="p-20 text-center flex flex-col items-center">
               <div className="w-12 h-12 bg-gray-50 rounded-full flex items-center justify-center text-gray-200 mb-4 italic">∅</div>
               <p className="text-sm font-bold text-gray-400">No Inventory Items Discovered</p>
               <p className="text-[10px] text-gray-300 uppercase mt-1 tracking-widest">This partner has not published any stock metrics</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

