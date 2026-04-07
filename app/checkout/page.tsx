'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useCartStore } from '../../store/useCartStore';
import Header from '../../components/layout/Header';

import { useProductStore } from '../../store/useProductStore';

const STEPS = ['Contact Details', 'Shipping Address', 'Payment'];

export default function Checkout() {
  const { products } = useProductStore();
  const [currentStep, setCurrentStep] = useState(0);
  const cartItems = useCartStore((state) => state.items);
  const clearCart = useCartStore((state) => state.clearCart);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const getProductDetails = (id: number) => products.find(p => p.id === id);
  const total = cartItems.reduce((sum, item) => sum + ((getProductDetails(item.id)?.price || 0) * item.quantity), 0);

  const handleNext = (e: React.FormEvent) => { 
    e.preventDefault(); 
    setCurrentStep(prev => Math.min(prev + 1, 2)); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePlaceOrder = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setIsSuccess(true);
      clearCart();
    }, 2500);
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
        <div className="bg-white p-10 rounded-xl shadow-sm border border-gray-200 max-w-md w-full text-center">
          <div className="w-16 h-16 bg-green-50 border border-green-200 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">Order Confirmed</h2>
          <p className="text-gray-500 mb-8 text-sm leading-relaxed">
            Your order <span className="font-semibold text-gray-900">#KVT-{Math.floor(Math.random() * 89999 + 10000)}</span> has been placed successfully. 
            We'll send you a shipping confirmation email shortly.
          </p>
          <Link href="/dashboard" className="block w-full bg-gray-900 hover:bg-black text-white font-medium py-3 rounded-lg transition-colors mb-3 text-sm">
            View Order Dashboard
          </Link>
          <Link href="/" className="block text-sm text-gray-500 hover:text-gray-900 font-medium transition-colors">
            Continue Shopping
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 py-12 md:py-20">
        <div className="text-center mb-12">
          <h1 className="text-2xl md:text-3xl font-semibold text-gray-900 mb-2">Checkout</h1>
          <p className="text-gray-500 text-sm">Complete your purchase securely</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-20">
          
          {/* Left Form Column */}
          <div className="flex-1">
            {/* Stepper Logic */}
            <div className="flex items-center justify-between mb-12 relative before:absolute before:top-1/2 before:left-0 before:w-full before:h-0.5 before:bg-gray-200 before:-z-10">
              {STEPS.map((step, idx) => (
                <div key={step} className="flex flex-col items-center gap-3 bg-gray-50 px-2 relative z-10 w-1/3">
                  <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300 ${
                    idx < currentStep ? 'bg-gray-900 text-white shadow-lg' : 
                    idx === currentStep ? 'bg-red-600 text-white ring-4 ring-red-100 shadow-xl scale-110' : 
                    'bg-white text-gray-400 border-2 border-gray-200'
                  }`}>
                    {idx < currentStep ? '✓' : idx + 1}
                  </div>
                  <span className={`text-xs md:text-sm font-semibold tracking-wide uppercase ${idx <= currentStep ? 'text-gray-900' : 'text-gray-400'}`}>
                    {step}
                  </span>
                </div>
              ))}
            </div>

            <div className="bg-white p-8 md:p-10 rounded-xl shadow-sm border border-gray-200">
              <form onSubmit={handleNext}>
                
                {/* Step 1: Contact Detail */}
                {currentStep === 0 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Contact Details</h2>
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email address</label>
                        <input type="email" required placeholder="you@example.com" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone number <span className="text-red-500">*</span></label>
                        <input type="tel" required placeholder="+91 98765 43210" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all" />
                      </div>
                      <div className="pt-6">
                        <button type="submit" className="w-full bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-xl hover:-translate-y-0.5">
                          Continue to Shipping
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 2: Shipping */}
                {currentStep === 1 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Shipping Address</h2>
                    <div className="space-y-6">
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">First name</label>
                          <input type="text" required className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                          <input type="text" required className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input type="text" required className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input type="text" required className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                          <input type="text" required className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                      </div>
                      <div className="pt-6 flex gap-4">
                        <button type="button" onClick={handleBack} className="w-1/3 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold py-4 rounded-xl transition-all">
                          Back
                        </button>
                        <button type="submit" className="w-2/3 bg-gray-900 hover:bg-black text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:-translate-y-0.5">
                          Continue to Payment
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Step 3: Payment */}
                {currentStep === 2 && (
                  <div className="animate-in fade-in slide-in-from-right-8 duration-500">
                    <h2 className="text-2xl font-bold text-gray-900 mb-8">Payment Method</h2>
                    
                    <div className="space-y-4 mb-8">
                      <label className="flex items-center p-5 border-2 border-red-600 bg-red-50 rounded-xl cursor-pointer">
                        <input type="radio" name="payment" defaultChecked className="w-5 h-5 text-red-600 focus:ring-red-500 border-gray-300" />
                        <span className="ml-4 font-bold text-gray-900">Credit / Debit Card</span>
                        <div className="ml-auto flex gap-2">
                          <img src="https://upload.wikimedia.org/wikipedia/commons/2/2a/Mastercard-logo.svg" className="h-6" alt="Mastercard" />
                          <img src="https://upload.wikimedia.org/wikipedia/commons/0/04/Visa.svg" className="h-6" alt="Visa" />
                        </div>
                      </label>

                      <label className="flex items-center p-5 border-2 border-gray-200 hover:border-gray-900 rounded-xl cursor-pointer transition-colors">
                        <input type="radio" name="payment" className="w-5 h-5 text-gray-900 focus:ring-gray-900 border-gray-300" />
                        <span className="ml-4 font-bold text-gray-900">PayPal</span>
                        <img src="https://upload.wikimedia.org/wikipedia/commons/b/b5/PayPal.svg" className="h-6 ml-auto" alt="PayPal" />
                      </label>
                    </div>

                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Card number</label>
                        <input type="text" placeholder="0000 0000 0000 0000" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all font-mono" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Expiry date</label>
                          <input type="text" placeholder="MM/YY" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all font-mono" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">CVC</label>
                          <input type="text" placeholder="123" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all font-mono" />
                        </div>
                      </div>
                      
                      <div className="pt-6 flex gap-4">
                        <button type="button" onClick={handleBack} className="w-1/3 bg-white border-2 border-gray-200 hover:border-gray-900 text-gray-900 font-bold py-4 rounded-xl transition-all">
                          Back
                        </button>
                        <button 
                          type="button" 
                          onClick={handlePlaceOrder}
                          disabled={isProcessing}
                          className="w-2/3 bg-red-600 relative overflow-hidden flex justify-center items-center hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-red-500/30 hover:-translate-y-0.5 disabled:opacity-70 disabled:hover:translate-y-0"
                        >
                          {isProcessing ? (
                            <svg className="animate-spin h-6 w-6 text-white text-center" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                          ) : (
                            `Pay ₹${total.toFixed(2)}`
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </form>
            </div>
          </div>

          {/* Right Order Summary Column */}
          <div className="w-full lg:w-[400px]">
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-200 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-6 pb-6 border-b border-gray-200">Order Summary ({cartItems.length})</h3>
              
              <div className="space-y-6 mb-8 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {cartItems.map(item => {
                  const product = getProductDetails(item.id);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 p-2 flex items-center justify-center">
                        <img src={product.image} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 py-1">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-red-600 font-bold mt-2">₹{(product.price * item.quantity).toFixed(2)}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="space-y-4 pt-6 border-t border-gray-100 text-sm">
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Subtotal</span>
                  <span className="text-gray-900">₹{total.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-gray-600 font-medium">
                  <span>Shipping</span>
                  <span className={total > 4150 ? "text-green-600 font-bold tracking-wide uppercase" : "text-gray-900"}>{total > 4150 ? 'Free' : '₹415.00'}</span>
                </div>
                <div className="flex justify-between text-lg font-semibold text-gray-900 pt-4 border-t border-gray-200">
                  <span>Total</span>
                  <span className="text-red-600">₹{(total > 4150 ? total : total + 415).toFixed(2)}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </main>
    </div>
  );
}
