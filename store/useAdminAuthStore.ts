import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import adminApi, { ADMIN_TOKEN_KEY } from '../src/lib/adminApi';

export interface AdminSession {
  id: string;
  name: string;
  email: string;
  role: 'SUPER_ADMIN' | 'ADMIN';
}

interface AdminAuthState {
  admin: AdminSession | null;
  token: string | null;
  hasHydrated: boolean;
  setToken: (token: string | null) => void;
  setAdmin: (admin: AdminSession | null) => void;
  setHasHydrated: (state: boolean) => void;
  login: (email: string, password: string) => Promise<{ message: string; forcePasswordChange: boolean }>;
  logout: () => void;
  updateProfile: (updates: Partial<AdminSession>) => void;
}

const mapAdminSession = (admin: any): AdminSession => ({
  id: String(admin.id),
  name: admin.name,
  email: admin.email,
  role: admin.role,
});

export const useAdminAuthStore = create<AdminAuthState>()(
  persist(
    (set, get) => ({
      admin: null,
      token: null,
      hasHydrated: false,
      setToken: (token) => {
        if (typeof window !== 'undefined') {
          if (token) {
            localStorage.setItem(ADMIN_TOKEN_KEY, token);
          } else {
            localStorage.removeItem(ADMIN_TOKEN_KEY);
          }
        }
        set({ token });
      },
      setAdmin: (admin) => set({ admin }),
      setHasHydrated: (state) => set({ hasHydrated: state }),
      login: async (email, password) => {
        const response = await adminApi.post('/admin/login', { email, password });
        const payload = response?.data || {};
        const token = payload?.token || null;
        const admin = payload?.admin || null;

        if (!token || !admin) {
          throw new Error('Invalid admin login response from server');
        }

        get().setToken(token);
        set({
          admin: mapAdminSession(admin),
        });

        return {
          message: response?.message || payload?.message || 'Admin login successful',
          forcePasswordChange: Boolean(payload?.forcePasswordChange),
        };
      },
      logout: () => {
        if (typeof window !== 'undefined') {
          localStorage.removeItem(ADMIN_TOKEN_KEY);
        }
        set({ admin: null, token: null });
      },
      updateProfile: (updates) =>
        set((state) => ({
          admin: state.admin ? { ...state.admin, ...updates } : null,
        })),
    }),
    {
      name: 'admin-auth-storage',
      partialize: (state) => ({
        admin: state.admin,
        token: state.token,
      }),
      onRehydrateStorage: () => (state) => {
        if (typeof window !== 'undefined') {
          const storedToken = localStorage.getItem(ADMIN_TOKEN_KEY);
          if (storedToken && !state?.token) {
            state?.setToken(storedToken);
          }
        }
        state?.setHasHydrated(true);
      },
    }
  )
);
