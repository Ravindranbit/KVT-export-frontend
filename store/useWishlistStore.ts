import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiGet, apiPost, apiDelete } from '../lib/api';

interface WishlistStore {
  items: string[];
  fetchWishlist: () => Promise<void>;
  toggleItem: (id: string | number) => Promise<void>;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set, get) => ({
      items: [],
      fetchWishlist: async () => {
        try {
          const response = await apiGet<{ success: boolean; data: any[] }>('/users/me/wishlist', { auth: 'user' });
          if (response && response.data) {
            set({ items: response.data.map(p => String(p.id)) });
          }
        } catch (err) {
          console.error('Failed to fetch wishlist', err);
        }
      },
      
      toggleItem: async (idRaw: string | number) => {
        const id = String(idRaw);
        const isPresent = get().items.includes(id);
        try {
          if (isPresent) {
            await apiDelete(`/users/me/wishlist/${id}`, { auth: 'user' });
            set((state) => ({ items: state.items.filter((itemId) => itemId !== id) }));
          } else {
            await apiPost(`/users/me/wishlist/${id}`, {}, { auth: 'user' });
            set((state) => ({ items: [...state.items, id] }));
          }
        } catch (err) {
          console.error('Wishlist sync error:', err);
          // Fallback to local toggle if backend fails or user not logged in
          set((state) => {
            if (state.items.includes(id)) {
              return { items: state.items.filter((itemId) => itemId !== id) };
            }
            return { items: [...state.items, id] };
          });
        }
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage-v2',
    }
  )
);
