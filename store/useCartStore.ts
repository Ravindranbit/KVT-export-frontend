import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiDelete, apiGet, apiPatch, apiPost } from '../lib/api';

export interface CartItem {
  id: string | number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isOpen: boolean;
  fetchCart: () => Promise<void>;
  addItem: (id: string | number, quantity?: number) => Promise<void>;
  removeItem: (id: string | number) => Promise<void>;
  updateQuantity: (id: string | number, quantity: number) => Promise<void>;
  clearCart: () => void;
  getTotalItems: () => number;
  setIsOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,
      
      setIsOpen: (open: boolean) => set({ isOpen: open }),

      fetchCart: async () => {
        try {
          const response = await apiGet<{ data: any }>('/cart', { auth: 'user' });
          if (response && response.data && response.data.items) {
            const mappedItems: CartItem[] = response.data.items.map((item: any) => ({
              id: item.productId,
              quantity: item.quantity,
            }));
            set({ items: mappedItems });
          }
        } catch (err) {
          console.warn('Failed to fetch cart', err);
        }
      },
      
      addItem: async (id, quantity = 1) => {
        // Optimistic update
        set((state) => {
          const existingItem = state.items.find((item) => String(item.id) === String(id));
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                String(item.id) === String(id) ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }
          return { items: [...state.items, { id, quantity }] };
        });

        // Sync with API if token exists
        if (localStorage.getItem('userToken')) {
          try {
            await apiPost('/cart/add', { productId: id, quantity }, { auth: 'user' });
            // Optionally refetch to ensure sync
            get().fetchCart();
          } catch (err) {
            console.warn('Failed to sync cart item add', err);
          }
        }
      },
      
      removeItem: async (id) => {
        set((state) => ({
          items: state.items.filter((item) => String(item.id) !== String(id)),
        }));

        if (localStorage.getItem('userToken')) {
          try {
            await apiDelete(`/cart/remove/${id}`, { auth: 'user' });
          } catch (err) {
            console.warn('Failed to sync cart item removal', err);
          }
        }
      },
      
      updateQuantity: async (id, quantity) => {
        set((state) => ({
          items: quantity <= 0 
            ? state.items.filter((item) => String(item.id) !== String(id))
            : state.items.map((item) =>
                String(item.id) === String(id) ? { ...item, quantity } : item
              ),
        }));

        if (localStorage.getItem('userToken')) {
          try {
            await apiPatch('/cart/update', { productId: id, quantity }, { auth: 'user' });
          } catch (err) {
            console.warn('Failed to sync cart item update', err);
          }
        }
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage-v2',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
