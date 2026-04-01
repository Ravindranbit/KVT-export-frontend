'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '../../components/layout/Header';
import { useAuthStore } from '../../store/useAuthStore';

export default function BecomeSeller() {
  const router = useRouter();
  const setUser = useAuthStore((state) => state.setUser);
  
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    storeName: '',
    storeDescription: '',
    password: ''
  });

  const handleRegister = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Simulate Seller Registration
    const newUser = {
      id: `v-${Math.floor(Math.random() * 1000)}`,
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      storeName: formData.storeName,
      storeDescription: formData.storeDescription,
      role: 'seller' as const
    };
    
    setUser(newUser);
    router.push('/vendor/dashboard');
  };

  return (
    <div className="min-h-screen bg-white flex flex-col">
      <Header />
      
      {/* Hero Section */}
      <section className="bg-gray-900 text-white py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-gray-900 via-gray-900/80 to-transparent z-10" />
        <img src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=2070" alt="Vendor packing boxes" className="absolute inset-0 w-full h-full object-cover opacity-60" />
        
        <div className="max-w-7xl mx-auto px-4 relative z-20">
          <div className="max-w-2xl">
            <span className="inline-block py-1 pr-4 text-red-500 font-bold tracking-widest uppercase text-sm mb-4">Sell on KVT Platform</span>
            <h1 className="text-5xl md:text-7xl font-extrabold mb-6 tracking-tight drop-shadow-xl leading-tight">Grow Your Business Globally.</h1>
            <p className="text-xl font-medium text-gray-300 mb-10 leading-relaxed">
              Join thousands of vendors succeeding on our premium marketplace. We provide the platform, the traffic, and the tools you need exclusively.
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => document.getElementById('onboard-form')?.scrollIntoView({ behavior: 'smooth' })} 
                className="bg-red-600 hover:bg-red-700 text-white px-10 py-5 rounded-xl font-extrabold text-lg transition-all shadow-lg shadow-red-500/30 hover:-translate-y-1"
              >
                Start Selling Today
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section omitted for brevity */}

      {/* Registration Form */}
      <section className="py-24 bg-white" id="onboard-form">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white p-10 md:p-16 rounded-[40px] shadow-[0_20px_60px_rgba(0,0,0,0.08)] border border-gray-100">
            <h2 className="text-3xl md:text-4xl font-extrabold text-gray-900 mb-4 tracking-tight text-center">Create your Seller Central Account</h2>
            <p className="text-gray-500 text-center mb-10 font-medium">It only takes two minutes to set up your KVT Vendor account.</p>
            
            <form onSubmit={handleRegister} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="John" 
                    value={formData.firstName}
                    onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                    className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all placeholder:font-normal" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                  <input 
                    type="text" 
                    required 
                    placeholder="Doe" 
                    value={formData.lastName}
                    onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                    className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all placeholder:font-normal" 
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Business Email Address</label>
                <input 
                  type="email" 
                  required 
                  placeholder="name@yourbusiness.com" 
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all placeholder:font-normal" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Desired Storefront Name</label>
                <input 
                  type="text" 
                  required 
                  placeholder="Example: The Artisan Collection" 
                  value={formData.storeName}
                  onChange={(e) => setFormData({...formData, storeName: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all placeholder:font-normal" 
                />
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Store Description</label>
                <textarea 
                  required 
                  rows={3}
                  placeholder="Tell customers about your business and mission..." 
                  value={formData.storeDescription}
                  onChange={(e) => setFormData({...formData, storeDescription: e.target.value})}
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all placeholder:font-normal resize-none" 
                ></textarea>
              </div>
              
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Create Password</label>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                  autoComplete="off"
                  className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 outline-none font-medium text-gray-900 placeholder:text-gray-400 transition-all placeholder:font-normal" 
                />
              </div>

              <div className="pt-8">
                <button type="submit" className="w-full flex items-center justify-center bg-gray-900 hover:bg-black text-white font-extrabold pb-5 pt-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-1 text-lg">
                  Complete Registration & Open Dashboard
                </button>
              </div>
            </form>
          </div>
        </div>
      </section>

    </div>
  );
}
