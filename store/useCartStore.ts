import { create } from 'zustand';
import api from '../src/lib/api';
import { TOKEN_KEY } from '../src/lib/api';

export interface CartItem {
  id: string;
  productId: string;
  quantity: number;
  price: number;
  product?: {
    id: string;
    name: string;
    price: number;
    image?: string;
    imageUrl?: string;
    vendorId?: string;
    categoryId?: string;
    stock?: number;
  };
}

interface CartStore {
  cart: CartItem[];
  isOpen: boolean;
  isLoading: boolean;
  error: string | null;
  fetchCart: () => Promise<void>;
  addToCart: (productId: string, quantity?: number) => Promise<void>;
  updateCart: (productId: string, quantity: number) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  getTotalItems: () => number;
  setIsOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()((set, get) => ({
  cart: [],
  isOpen: false,
  isLoading: false,
  error: null,

  setIsOpen: (open: boolean) => set({ isOpen: open }),

  fetchCart: async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      set({ cart: [], error: 'Authentication required' });
      return;
    }

    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get('/cart');
      const backendItems = response?.data?.items || [];
      const cartItems: CartItem[] = backendItems.map((item: any) => ({
        id: String(item.id),
        productId: String(item.productId),
        quantity: Number(item.quantity || 0),
        price: Number(item.price || item.product?.price || 0),
        product: item.product
          ? {
              id: String(item.product.id),
              name: item.product.name,
              price: Number(item.product.price || 0),
              image: item.product.image,
              imageUrl: item.product.imageUrl,
              vendorId: item.product.vendorId,
              categoryId: item.product.categoryId,
              stock: item.product.stock,
            }
          : undefined,
      }));

      set({ cart: cartItems, isLoading: false, error: null });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || 'Failed to fetch cart',
      });
    }
  },

  addToCart: async (productId: string, quantity: number = 1) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      throw new Error('Authentication required');
    }

    set({ isLoading: true, error: null });
    try {
      await api.post('/cart/add', {
        productId,
        quantity,
      });
      await get().fetchCart();
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to add item to cart' });
      throw error;
    }
  },

  updateCart: async (productId: string, quantity: number) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      throw new Error('Authentication required');
    }

    set({ isLoading: true, error: null });
    try {
      await api.patch('/cart/update', {
        productId,
        quantity,
      });
      await get().fetchCart();
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to update cart item' });
      throw error;
    }
  },

  removeFromCart: async (productId: string) => {
    const token = typeof window !== 'undefined' ? localStorage.getItem(TOKEN_KEY) : null;
    if (!token) {
      throw new Error('Authentication required');
    }

    set({ isLoading: true, error: null });
    try {
      await api.delete(`/cart/remove/${productId}`);
      await get().fetchCart();
    } catch (error: any) {
      set({ isLoading: false, error: error?.message || 'Failed to remove cart item' });
      throw error;
    }
  },

  getTotalItems: () => {
    return get().cart.reduce((total, item) => total + item.quantity, 0);
  },
}));
