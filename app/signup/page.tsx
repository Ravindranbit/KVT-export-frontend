'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
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
        toast.success('OTP sent to your phone number');
      } else {
        await verifyOTP(formData.phone, otp);
        await getProfile();
        toast.success('Account created successfully');
        router.push('/');
      }
    } catch (error: any) {
      const message = error?.message || 'Registration failed. Please try again.';
      if (message.toLowerCase().includes('otp')) {
        toast.error('Invalid OTP');
      } else {
        toast.error(message);
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async () => {
    setIsSubmitting(true);
    try {
      const response = await api.post('/auth/register/resend-otp', {
        phone: formData.phone,
      });
      toast.success(response?.message || 'OTP resent successfully');
    } catch (error: any) {
      toast.error(error?.message || 'Failed to resend OTP');
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
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${errors.email ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
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
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${errors.phone ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
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
                className={`w-full px-3 py-2 border rounded focus:outline-none focus:ring-2 text-gray-900 placeholder-gray-500 text-sm transition ${errors.confirmPassword ? 'border-red-500 focus:ring-red-600' : 'border-gray-300 focus:ring-red-600'
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
        </div>
      </div>
    </div>
  );
}
