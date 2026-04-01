import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface WishlistStore {
  items: number[];
  toggleItem: (id: number) => void;
  clearWishlist: () => void;
}

export const useWishlistStore = create<WishlistStore>()(
  persist(
    (set) => ({
      items: [],
      
      toggleItem: (id: number) => {
        set((state) => {
          if (state.items.includes(id)) {
            return { items: state.items.filter((itemId) => itemId !== id) };
          }
          return { items: [...state.items, id] };
        });
      },
      
      clearWishlist: () => set({ items: [] }),
    }),
    {
      name: 'wishlist-storage',
    }
  )
);
