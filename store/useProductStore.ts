import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { PRODUCTS as INITIAL_PRODUCTS } from '../lib/mockData';

export interface Feedback {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: number;
  reviews: number;
  vendorId: string;
  stock?: number;
  sku?: string;
  brand?: string;
  weight?: string;
  dimensions?: { l: string; w: string; h: string };
  specifications?: Record<string, string>;
  colors?: { name: string; hex: string }[];
  sizes?: string[];
  feedbacks?: Feedback[];
}

interface ProductState {
  products: Product[];
  addProduct: (product: Product) => void;
  removeProduct: (id: number) => void;
  addFeedback: (productId: number, feedback: Feedback) => void;
  getProductsByVendor: (vendorId: string) => Product[];
  getProductById: (id: number) => Product | undefined;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: INITIAL_PRODUCTS,
      addProduct: (product) => set((state) => ({ 
        products: [product, ...state.products] 
      })),
      removeProduct: (id) => set((state) => ({ 
        products: state.products.filter(p => p.id !== id) 
      })),
      addFeedback: (productId, feedback) => set((state) => ({
        products: state.products.map(p => 
          p.id === productId 
            ? { 
                ...p, 
                feedbacks: [...(p.feedbacks || []), feedback],
                reviews: p.reviews + 1,
                // Simple rating recalculation (can be more sophisticated later)
                rating: Number(((p.rating * p.reviews + feedback.rating) / (p.reviews + 1)).toFixed(1))
              } 
            : p
        )
      })),
      getProductsByVendor: (vendorId) => {
        return get().products.filter(p => p.vendorId === vendorId);
      },
      getProductById: (id) => {
        return get().products.find(p => p.id === id);
      }
    }),
    {
      name: 'product-storage',
    }
  )
);
