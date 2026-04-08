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
  updateProduct: (id: number, product: Partial<Product>) => void;
  removeProduct: (id: number) => void;
  addFeedback: (productId: number, feedback: Feedback) => void;
  updateFeedback: (productId: number, feedbackId: string, updates: Partial<Feedback>) => void;
  removeFeedback: (productId: number, feedbackId: string) => void;
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
      updateProduct: (id, updatedProduct) => set((state) => ({
        products: state.products.map(p => p.id === id ? { ...p, ...updatedProduct } : p)
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
                rating: Number(((p.rating * p.reviews + feedback.rating) / (p.reviews + 1)).toFixed(1))
              } 
            : p
        )
      })),
      updateFeedback: (productId, feedbackId, updates) => set((state) => ({
        products: state.products.map(p => 
          p.id === productId 
            ? { 
                ...p, 
                feedbacks: p.feedbacks?.map(f => {
                  if (f.id === feedbackId) {
                    const updatedFeedback = { ...f, ...updates };
                    // Recalculate rating if rating changed
                    if (updates.rating !== undefined && updates.rating !== f.rating) {
                      const otherRatingsTotal = p.rating * p.reviews - f.rating;
                      p.rating = Number(((otherRatingsTotal + updates.rating) / p.reviews).toFixed(1));
                    }
                    return updatedFeedback;
                  }
                  return f;
                })
              } 
            : p
        )
      })),
      removeFeedback: (productId, feedbackId) => set((state) => ({
        products: state.products.map(p => {
          if (p.id === productId) {
            const feedbackToRemove = p.feedbacks?.find(f => f.id === feedbackId);
            if (!feedbackToRemove) return p;
            const updatedFeedbacks = p.feedbacks?.filter(f => f.id !== feedbackId) || [];
            const newReviews = Math.max(0, p.reviews - 1);
            const newRating = newReviews === 0 ? 0 : Number(((p.rating * p.reviews - feedbackToRemove.rating) / newReviews).toFixed(1));
            return { ...p, feedbacks: updatedFeedbacks, reviews: newReviews, rating: newRating };
          }
          return p;
        })
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
