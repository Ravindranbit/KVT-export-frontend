import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  name: string;
  email: string;
  storeName?: string;
  storeDescription?: string;
  role: 'buyer' | 'seller' | 'admin';
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
  hasHydrated: boolean;
  setUser: (user: User | null) => void;
  setHasHydrated: (state: boolean) => void;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      hasHydrated: false,
      setUser: (user) => set({ user }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      logout: () => set({ user: null }),
      updateProfile: (updates) => set((state) => ({
        user: state.user ? { ...state.user, ...updates } : null,
      })),
    }),
    {
      name: 'auth-storage',
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    }
  )
);
