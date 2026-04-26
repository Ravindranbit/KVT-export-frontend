'use client';

import { useEffect, useRef, useState } from 'react';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import Header from '../../components/layout/Header';
import { useRouter } from 'next/navigation';
import api from '../../src/lib/api';

import { useProductStore } from '../../store/useProductStore';

const STEPS = ['Contact Details', 'Shipping Address', 'Payment'];
const RAZORPAY_CHECKOUT_SRC = 'https://checkout.razorpay.com/v1/checkout.js';

let razorpayScriptPromise: Promise<boolean> | null = null;

export default function Checkout() {
  const router = useRouter();
  const { products } = useProductStore();
  const [currentStep, setCurrentStep] = useState(0);
  const cartItems = useCartStore((state) => state.cart);
  const fetchCart = useCartStore((state) => state.fetchCart);
  
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentError, setPaymentError] = useState<string | null>(null);
  const [showPaymentRecovery, setShowPaymentRecovery] = useState(false);
  const isProcessingRef = useRef(false);
  
  const { user, token, hasHydrated, getProfile } = useAuthStore();

  useEffect(() => {
    if (!hasHydrated) return;

    if (!token) {
      router.push('/signin');
      return;
    }

    if (!user) {
      getProfile().catch(() => {
        router.push('/signin');
      });
    }
  }, [hasHydrated, token, user, getProfile, router]);

  useEffect(() => {
    if (!hasHydrated || !token) return;
    fetchCart().catch(() => {
      // Cart load errors are surfaced from store/UI state when needed.
    });
  }, [hasHydrated, token, fetchCart]);

  const [formData, setFormData] = useState({
    email: user?.email || '',
    phone: '',
    firstName: user?.name?.split(' ')[0] || '',
    lastName: user?.name?.split(' ')[1] || '',
    address: '',
    city: '',
    zip: '',
  });

  const getProductDetails = (id: string) => products.find(p => p.id === id);
  const getImage = (product: any) => product?.image || product?.imageUrl || '/placeholder.png';
  const loadRazorpayScript = () => {
    if (typeof window === 'undefined') {
      return Promise.resolve(false);
    }

    if ((window as any).Razorpay) {
      return Promise.resolve(true);
    }

    if (razorpayScriptPromise) {
      return razorpayScriptPromise;
    }

    razorpayScriptPromise = new Promise<boolean>((resolve) => {
      const existingScript = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_CHECKOUT_SRC}"]`);

      if (existingScript) {
        if ((window as any).Razorpay || existingScript.dataset.loaded === 'true') {
          resolve(true);
          return;
        }

        existingScript.addEventListener('load', () => {
          existingScript.dataset.loaded = 'true';
          resolve(true);
        }, { once: true });
        existingScript.addEventListener('error', () => {
          razorpayScriptPromise = null;
          resolve(false);
        }, { once: true });
        return;
      }

      if (!(window as any).Razorpay) {
        const script = document.createElement('script');
        script.src = RAZORPAY_CHECKOUT_SRC;
        script.async = true;
        script.onload = () => {
          script.dataset.loaded = 'true';
          resolve(true);
        };
        script.onerror = () => {
          razorpayScriptPromise = null;
          resolve(false);
        };
        document.body.appendChild(script);
      }
    });

    return razorpayScriptPromise;
  };

  const total = cartItems.reduce(
    (sum, item) => sum + ((item.product?.price || getProductDetails(item.productId)?.price || item.price || 0) * item.quantity),
    0,
  );

  if (!hasHydrated || !token) {
    return null;
  }

  const handleNext = (e: React.FormEvent) => { 
    e.preventDefault(); 
    setCurrentStep(prev => Math.min(prev + 1, 2)); 
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const handleBack = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const setProcessingState = (processing: boolean) => {
    isProcessingRef.current = processing;
    setIsProcessing(processing);
  };

  const handlePaymentFailure = (message: string) => {
    setPaymentError(message);
    setShowPaymentRecovery(true);
    setProcessingState(false);
  };

  const handlePlaceOrder = async () => {
    if (isProcessingRef.current) {
      return;
    }

    if (cartItems.length === 0) {
      setPaymentError('Your cart is empty');
      setShowPaymentRecovery(false);
      return;
    }

    setProcessingState(true);
    setPaymentError(null);
    setShowPaymentRecovery(false);

    try {
      const key = process.env.NEXT_PUBLIC_RAZORPAY_KEY;
      if (!key) {
        throw new Error('Razorpay key is not configured');
      }

      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error('Failed to load payment gateway');
      }

      const orderResponse: any = await api.post('/payment/create-order', {
        shippingAddress: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          address: formData.address,
          city: formData.city,
          zip: formData.zip,
          email: formData.email,
          phone: formData.phone,
        },
      });

      const { orderId, razorpayOrderId, amount } = orderResponse?.data || {};
      if (!orderId || !razorpayOrderId || !amount) {
        throw new Error('Invalid payment order response');
      }

      const options = {
        key,
        amount,
        currency: 'INR',
        order_id: razorpayOrderId,
        name: 'KVT Exports',
        description: `Order ${orderId}`,
        prefill: {
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          contact: formData.phone,
        },
        handler: async function (response: any) {
          try {
            await api.post('/payment/verify', {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            });

            await fetchCart();
            router.push(`/order-confirmation?orderId=${orderId}`);
          } catch (error: any) {
            handlePaymentFailure(error?.message || 'Payment verification failed');
          }
        },
        modal: {
          ondismiss: () => {
            handlePaymentFailure('Payment cancelled');
          },
        },
      };

      const RazorpayCtor = (window as any).Razorpay;
      const razorpay = new RazorpayCtor(options);
      razorpay.on('payment.failed', (response: any) => {
        handlePaymentFailure(response?.error?.description || 'Payment failed. Please try again.');
      });

      razorpay.open();
    } catch (error: any) {
      handlePaymentFailure(error?.message || 'Unable to initiate payment');
    }
  };

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
                        <input type="email" required value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} placeholder="you@example.com" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all" />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone number <span className="text-red-500">*</span></label>
                        <input type="tel" required value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} placeholder="+91 98765 43210" className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl focus:ring-2 focus:ring-gray-900 focus:border-transparent outline-none text-gray-900 placeholder:text-gray-400 transition-all" />
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
                          <input type="text" required value={formData.firstName} onChange={e => setFormData({...formData, firstName: e.target.value})} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Last name</label>
                          <input type="text" required value={formData.lastName} onChange={e => setFormData({...formData, lastName: e.target.value})} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                        <input type="text" required value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                      </div>
                      <div className="grid grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">City</label>
                          <input type="text" required value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">Postal code</label>
                          <input type="text" required value={formData.zip} onChange={e => setFormData({...formData, zip: e.target.value})} className="w-full px-5 py-4 bg-white border border-gray-300 rounded-xl outline-none focus:ring-2 focus:ring-gray-900 text-gray-900 placeholder:text-gray-400 transition-all" />
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

                    {paymentError && (
                      <div className="mb-6 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                        <p>{paymentError}</p>
                        {showPaymentRecovery && (
                          <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                            <button
                              type="button"
                              onClick={handlePlaceOrder}
                              disabled={isProcessing}
                              className="rounded-lg bg-red-600 px-4 py-2 font-semibold text-white transition-colors hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-70"
                            >
                              Retry Payment
                            </button>
                            <button
                              type="button"
                              onClick={() => router.push('/cart')}
                              className="rounded-lg border border-red-200 px-4 py-2 font-semibold text-red-700 transition-colors hover:bg-red-100"
                            >
                              Go to Cart
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
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
                          {isProcessing ? 'Processing...' : 'Place Order'}
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
                  const product = item.product || getProductDetails(item.productId);
                  if (!product) return null;
                  return (
                    <div key={item.id} className="flex gap-4">
                      <div className="w-20 h-20 bg-white rounded-xl overflow-hidden shrink-0 border border-gray-200 p-2 flex items-center justify-center">
                        <img src={getImage(product)} alt={product.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="flex-1 py-1">
                        <h4 className="text-sm font-bold text-gray-900 line-clamp-2 leading-snug">{product.name}</h4>
                        <p className="text-xs text-gray-500 mt-1">Qty: {item.quantity}</p>
                        <p className="text-red-600 font-bold mt-2">₹{((product.price || item.price || 0) * item.quantity).toFixed(2)}</p>
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
