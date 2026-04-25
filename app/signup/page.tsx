'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import api from '../../src/lib/api';
import { useAuthStore } from '../../store/useAuthStore';

export default function SignUp() {
  const router = useRouter();
  const { registerInitiate, verifyOTP, getProfile } = useAuthStore();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: ''
  });
  const [otp, setOtp] = useState('');
  const [otpStep, setOtpStep] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [apiMessage, setApiMessage] = useState('');
  const [errors, setErrors] = useState({
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    terms: ''
  });
  const [termsAccepted, setTermsAccepted] = useState(false);

  const validateEmail = (value: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (value && !emailRegex.test(value)) {
      setErrors(prev => ({ ...prev, email: 'Please enter a valid email address' }));
      return false;
    } else {
      setErrors(prev => ({ ...prev, email: '' }));
      return true;
    }
  };

  const validatePhone = (value: string) => {
    const phoneRegex = /^\+?[0-9]{10,15}$/;
    if (value && !phoneRegex.test(value)) {
      setErrors(prev => ({ ...prev, phone: 'Please enter a valid phone number' }));
      return false;
    }

    setErrors(prev => ({ ...prev, phone: '' }));
    return true;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });

    // Validate email on change
    if (name === 'email') {
      validateEmail(value);
    }

    if (name === 'phone') {
      validatePhone(value);
    }

    // Validate password match
    if (name === 'confirmPassword' || name === 'password') {
      if (formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword) {
        setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      } else {
        setErrors(prev => ({ ...prev, confirmPassword: '' }));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiMessage('');
    
    // Validate all fields
    if (!formData.fullName) {
      return;
    }
    
    if (!validateEmail(formData.email)) {
      return;
    }

    if (!validatePhone(formData.phone)) {
      return;
    }

    if (!formData.password) {
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors(prev => ({ ...prev, confirmPassword: 'Passwords do not match' }));
      return;
    }

    if (!termsAccepted) {
      setErrors(prev => ({ ...prev, terms: 'You must agree to the terms' }));
      return;
    }

    setIsSubmitting(true);
    try {
      if (!otpStep) {
        await registerInitiate({
          name: formData.fullName,
          email: formData.email,
          phone: formData.phone,
          password: formData.password,
        });
        setOtpStep(true);
        setApiMessage('OTP sent to your phone number');
      } else {
        await verifyOTP(formData.phone, otp);
        await getProfile();
        router.push('/');
      }
    } catch (error: any) {
      const message = error?.message || 'Registration failed. Please try again.';
      if (message.toLowerCase().includes('otp')) {
        setApiMessage('Invalid OTP');
      } else {
        setApiMessage(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setApiMessage('');
    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/register/resend-otp', {
        phone: formData.phone,
      });
      setApiMessage(response?.message || 'OTP resent successfully');
    } catch (error: any) {
      setApiMessage(error?.message || 'Failed to resend OTP');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white py-3">
        <div className="max-w-7xl mx-auto px-4">
          <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>
        </div>
      </header>

      {/* Sign Up Form - Centered container */}
      <div className="flex-1 flex items-center justify-center px-4 py-8">
        <div className="w-full max-w-[400px] bg-white rounded-lg shadow-lg p-6">
          <h1 className="text-3xl font-bold text-gray-900 mb-5 text-center">Create Account</h1>
          {apiMessage && (
            <p className={`mb-3 text-xs text-center ${apiMessage.toLowerCase().includes('success') || apiMessage.toLowerCase().includes('sent') ? 'text-green-600' : 'text-red-600'}`}>
              {apiMessage}
            </p>
          )}
          
          <form onSubmit={handleSubmit} className="space-y-3.5">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 mb-1.5">
                Full Name <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="fullName"
                name="fullName"
                value={formData.fullName}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="Enter your full name"
                required
              />
            </div>

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1.5">
                Email Address <span className="text-red-600">*</span>
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${
                  errors.email ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                }`}
                placeholder="Enter your email"
                required
              />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1.5">
                Phone Number <span className="text-red-600">*</span>
              </label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${
                  errors.phone ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                }`}
                placeholder="Enter your phone number"
                required
              />
              {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1.5">
                Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                autoComplete="off"
                className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                placeholder="Create a password"
                required
              />
            </div>

            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1.5">
                Confirm Password <span className="text-red-600">*</span>
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                autoComplete="off"
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${
                  errors.confirmPassword ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
                }`}
                placeholder="Confirm your password"
                required
              />
              {errors.confirmPassword && <p className="text-red-500 text-xs mt-1">{errors.confirmPassword}</p>}
            </div>

            {otpStep && (
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 mb-1.5">
                  OTP <span className="text-red-600">*</span>
                </label>
                <input
                  type="text"
                  id="otp"
                  name="otp"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-red-600 text-gray-900 placeholder-gray-500 text-sm"
                  placeholder="Enter OTP"
                  required
                />
                <button
                  type="button"
                  onClick={handleResendOtp}
                  disabled={isSubmitting}
                  className="mt-2 text-xs text-red-600 hover:text-red-700 font-semibold disabled:opacity-60"
                >
                  Resend OTP
                </button>
              </div>
            )}

            <div className="flex items-start">
              <input 
                type="checkbox" 
                id="terms"
                checked={termsAccepted}
                onChange={(e) => setTermsAccepted(e.target.checked)}
                className="mt-1 mr-2" 
                required 
              />
              <span className="text-xs text-gray-600">
                I agree to the{' '}
                <a href="#" className="text-red-600 hover:text-red-700">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-red-600 hover:text-red-700">Privacy Policy</a>
                <span className="text-red-600"> *</span>
              </span>
            </div>
            {errors.terms && <p className="text-red-500 text-xs -mt-2">{errors.terms}</p>}

            <button
              type="submit"
              className="w-full bg-red-600 hover:bg-red-700 text-white font-bold py-2.5 rounded transition text-sm disabled:cursor-not-allowed"
              disabled={!formData.fullName || !!errors.email || !!errors.phone || !formData.email || !formData.phone || !formData.password || !formData.confirmPassword || !termsAccepted || (otpStep && !otp) || isSubmitting}
            >
              {isSubmitting ? 'Please wait...' : otpStep ? 'Verify OTP' : 'Create Account'}
            </button>
          </form>

          <div className="mt-3.5 text-center">
            <p className="text-gray-600 text-sm">
              Already have an account?{' '}
              <Link href="/signin" className="text-red-600 hover:text-red-700 font-semibold">
                Sign In
              </Link>
            </p>
          </div>

          <div className="mt-3.5 pt-3.5 border-t border-gray-200">
            <p className="text-center text-gray-600 mb-2 text-xs">Or sign up with</p>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 text-gray-900 text-sm">
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                  <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="flex items-center justify-center gap-2 border border-gray-300 py-2 rounded hover:bg-gray-50 text-gray-900 text-sm">
                <svg className="w-5 h-5" fill="#1877F2" viewBox="0 0 24 24">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                </svg>
                Facebook
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
