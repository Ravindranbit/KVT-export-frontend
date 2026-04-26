import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import api from '../src/lib/api';

export interface Feedback {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  categoryId?: string;
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
  selectedProduct: Product | null;
  isLoading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  fetchProductById: (id: string) => Promise<Product | null>;
  clearSelectedProduct: () => void;
  addProduct: (product: Product) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  removeProduct: (id: string) => void;
  addFeedback: (productId: string, feedback: Feedback) => void;
  updateFeedback: (productId: string, feedbackId: string, updates: Partial<Feedback>) => void;
  removeFeedback: (productId: string, feedbackId: string) => void;
  getProductsByVendor: (vendorId: string) => Product[];
  getProductById: (id: string) => Product | undefined;
}

const mapProduct = (raw: any): Product => ({
  id: String(raw.id),
  name: raw.name || 'Untitled Product',
  price: Number(raw.price || 0),
  image: raw.imageUrl || raw.image || '',
  category: raw.category?.name || raw.categoryName || raw.category || raw.categoryId || 'uncategorized',
  categoryId: raw.categoryId || raw.category?.id,
  description: raw.description || '',
  rating: Number(raw.rating || 0),
  reviews: Number(raw.reviews || 0),
  vendorId: raw.vendorId || 'unknown',
  stock: typeof raw.stock === 'number' ? raw.stock : undefined,
  sku: raw.sku,
  brand: raw.brand,
  weight: raw.weight,
  dimensions: raw.dimensions,
  specifications: raw.specifications,
  colors: raw.colors,
  sizes: raw.sizes,
  feedbacks: raw.feedbacks || [],
});

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      selectedProduct: null,
      isLoading: false,
      error: null,
      fetchProducts: async () => {
        set({ isLoading: true, error: null });
        try {
          const response: any = await api.get('/products');
          const rawProducts = response?.data || [];
          const mappedProducts = Array.isArray(rawProducts) ? rawProducts.map(mapProduct) : [];
          set({ products: mappedProducts, isLoading: false });
        } catch (error: any) {
          set({
            isLoading: false,
            error: error?.message || 'Failed to load products',
          });
        }
      },
      fetchProductById: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          const response: any = await api.get(`/products/${id}`);
          const rawProduct = response?.data || null;

          if (!rawProduct) {
            set({ selectedProduct: null, isLoading: false, error: 'Product not found' });
            return null;
          }

          const mapped = mapProduct(rawProduct);
          set((state) => ({
            selectedProduct: mapped,
            products: state.products.some((p) => p.id === mapped.id)
              ? state.products.map((p) => (p.id === mapped.id ? mapped : p))
              : [mapped, ...state.products],
            isLoading: false,
          }));

          return mapped;
        } catch (error: any) {
          set({
            selectedProduct: null,
            isLoading: false,
            error: error?.message || 'Failed to load product',
          });
          return null;
        }
      },
      clearSelectedProduct: () => set({ selectedProduct: null }),
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
      partialize: (state) => ({
        products: state.products,
      }),
    }
  )
);
