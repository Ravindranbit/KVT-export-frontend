import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api, { TOKEN_KEY } from '../src/lib/api';

export interface User {
  id: string;
  name: string;
  email: string;
  storeName?: string;
  storeDescription?: string;
  role: 'buyer' | 'seller' | 'admin';
  vendorId?: string;
  avatar?: string;
  phone?: string;
  joinedDate?: string;
  permissions?: {
    dashboard: boolean;
    products: boolean;
    orders: boolean;
    users: boolean;
    vendors: boolean;
    categories: boolean;
    banners: boolean;
    settings: boolean;
    profile: boolean;
  };
}

interface AuthState {
  user: User | null;
  token: string | null;
  hasHydrated: boolean;
  pendingRegistration: {
    name: string;
    email: string;
    phone: string;
    password: string;
  } | null;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  setHasHydrated: (state: boolean) => void;
  registerInitiate: (payload: { name: string; email: string; phone: string; password: string } | string) => Promise<{ message: string }>;
  verifyOTP: (phone: string, otp: string) => Promise<{ message: string }>;
  login: (identifier: string, password: string) => Promise<{ message: string }>;
  getProfile: () => Promise<User | null>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      hasHydrated: false,
      pendingRegistration: null,
      setUser: (user) => set({ user }),
      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem(TOKEN_KEY, token);
          } else {
            localStorage.removeItem(TOKEN_KEY);
          }
        }
        set({ token });
      },
      setHasHydrated: (state) => set({ hasHydrated: state }),
      registerInitiate: async (payload) => {
        const registration = typeof payload === 'string'
          ? { name: '', email: '', phone: payload, password: '' }
          : payload;

        const response = await api.post('/auth/register/initiate', registration);
        const responsePayload = response?.data || {};

        set({
          pendingRegistration: registration,
        });

        return { message: response?.message || responsePayload?.message || 'OTP sent successfully' };
      },
      verifyOTP: async (phone, otp) => {
        const pending = get().pendingRegistration;

        if (!pending) {
          throw new Error('Registration session expired. Please start again.');
        }

        const response = await api.post('/auth/register/verify', {
          name: pending.name,
          email: pending.email,
          phone,
          password: pending.password,
          otp,
        });

        const payload = response?.data || {};
        const token = payload?.token || null;
        const backendUser = payload?.user;

        if (token) {
          get().setToken(token);
        }

        if (backendUser) {
          set({
            user: {
              id: backendUser.id,
              name: backendUser.name,
              email: backendUser.email,
              phone: backendUser.phone,
              role: 'buyer',
            },
            pendingRegistration: null,
          });
        }

        return { message: response?.message || payload?.message || 'Registration successful' };
      },
      login: async (identifier, password) => {
        const response = await api.post('/auth/login', {
          identifier,
          password,
        });

        const payload = response?.data || {};
        const token = payload?.token || null;
        const backendUser = payload?.user;

        if (!token || !backendUser) {
          throw new Error('Invalid login response from server');
        }

        get().setToken(token);
        set({
          user: {
            id: backendUser.id,
            name: backendUser.name,
            email: backendUser.email,
            phone: backendUser.phone,
            role: 'buyer',
          },
        });

        return { message: response?.message || payload?.message || 'Login successful' };
      },
      getProfile: async () => {
        const response = await api.get('/auth/me');
        const backendUser = response?.data;

        if (!backendUser) {
          set({ user: null });
          return null;
        }

        const mappedUser: User = {
          id: backendUser.id,
          name: backendUser.name,
          email: backendUser.email,
          phone: backendUser.phone,
          role: 'buyer',
        };

        set({ user: mappedUser });
        return mappedUser;
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(TOKEN_KEY);
        }
        set({ user: null, token: null, pendingRegistration: null });
      },
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem(TOKEN_KEY);
          if (storedToken) {
            state?.setToken(storedToken);
          }
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
