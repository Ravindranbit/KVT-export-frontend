import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (id: number, quantity?: number) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (id: number, quantity: number = 1) => {
        set((state) => {
          const existingItem = state.items.find((item) => item.id === id);
          if (existingItem) {
            return {
              items: state.items.map((item) =>
                item.id === id ? { ...item, quantity: item.quantity + quantity } : item
              ),
            };
          }
          return { items: [...state.items, { id, quantity }] };
        });
      },
      
      removeItem: (id: number) => {
        set((state) => ({
          items: state.items.filter((item) => item.id !== id),
        }));
      },
      
      updateQuantity: (id: number, quantity: number) => {
        set((state) => ({
          items: quantity <= 0 
            ? state.items.filter((item) => item.id !== id)
            : state.items.map((item) =>
                item.id === id ? { ...item, quantity } : item
              ),
        }));
      },
      
      clearCart: () => set({ items: [] }),
      
      getTotalItems: () => {
        return get().items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: 'cart-storage', // Persist cart to localStorage
      partialize: (state) => ({ items: state.items }), // Only persist the items, not the 'isOpen' state
    }
  )
);
