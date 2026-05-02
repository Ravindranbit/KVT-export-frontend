import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { apiGet, apiPost, apiPut, apiPatch, apiDelete } from '../lib/api';

export interface Feedback {
  id: string;
  userName: string;
  rating: number;
  comment: string;
  date: string;
}

export interface Product {
  id: string | number;
  name: string;
  price: number;
  image: string;
  images?: string[];
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
  categories: { id: string; name: string }[];
  fetchProducts: (params?: { search?: string; vendorId?: string; categoryId?: string }) => Promise<void>;
  fetchCategories: () => Promise<void>;
  addProduct: (product: Partial<Product>) => Promise<void>;
  updateProduct: (id: string | number, product: Partial<Product>) => Promise<void>;
  removeProduct: (id: string | number) => Promise<void>;
  fetchReviews: (productId: string | number) => Promise<void>;
  addFeedback: (productId: string | number, feedback: Feedback) => Promise<void>;
  updateFeedback: (productId: string | number, feedbackId: string, updates: Partial<Feedback>) => Promise<void>;
  removeFeedback: (productId: string | number, feedbackId: string) => Promise<void>;
  getProductsByVendor: (vendorId: string) => Product[];
  getProductById: (id: string | number) => Product | undefined;
  fetchProductById: (id: string | number) => Promise<void>;
}

export const useProductStore = create<ProductState>()(
  persist(
    (set, get) => ({
      products: [],
      categories: [],
      fetchProducts: async (params?: { search?: string; vendorId?: string; categoryId?: string }) => {
        try {
          const response = await apiGet<{ success: boolean; data: any[] }>('/products', { query: params });
          if (response && Array.isArray(response.data)) {
            const mappedProducts: Product[] = response.data.map((p: any) => ({
              id: p.id,
              name: p.name,
              price: Number(p.price),
              image: p.imageUrl || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
              images: p.images || [],
              category: p.category?.name || 'fashion',
              description: p.description || '',
              rating: Number(p.rating || 0),
              reviews: Number(p.reviews || 0),
              vendorId: p.vendorId || 'admin',
              stock: Number(p.stock || 0),
              feedbacks: p.feedbacks || [],
            }));
            set({ products: mappedProducts });
          }
        } catch (err) {
          console.warn('Failed to fetch products', err);
        }
      },
      fetchCategories: async () => {
        try {
          const response = await apiGet<{ success: boolean; data: any[] }>('/categories');
          if (response && response.data) {
            set({ categories: response.data.map((c: any) => ({ id: c.id, name: c.name })) });
          }
        } catch (err) {
          console.error('Failed to fetch categories', err);
        }
      },
      addProduct: async (productData: Partial<Product>) => {
        try {
          const response = await apiPost<{ success: boolean; data: any }>('/products', {
            name: productData.name,
            price: productData.price,
            description: productData.description,
            stock: productData.stock,
            categoryId: productData.category, // Backend expects categoryId
            imageUrl: productData.images?.[0] || productData.image,
            images: productData.images || (productData.image ? [productData.image] : []),
          });

          if (response && response.data) {
            const p = response.data;
            const newProduct: Product = {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              image: p.imageUrl || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
              images: p.images || [],
              category: p.category?.name || 'fashion',
              description: p.description || '',
              rating: 0,
              reviews: 0,
              vendorId: p.vendorId || 'admin',
              stock: Number(p.stock || 0),
            };
            set((state) => ({ products: [newProduct, ...state.products] }));
          }
        } catch (err) {
          console.error('Failed to add product', err);
        }
      },
      updateProduct: async (id, updatedProduct) => {
        try {
          const response = await apiPut<{ success: boolean; data: any }>(`/products/${id}`, {
            name: updatedProduct.name,
            price: updatedProduct.price,
            description: updatedProduct.description,
            stock: updatedProduct.stock,
            categoryId: updatedProduct.category,
            imageUrl: updatedProduct.images?.[0] || updatedProduct.image,
            images: updatedProduct.images || (updatedProduct.image ? [updatedProduct.image] : undefined),
          });

          if (response && response.data) {
            const p = response.data;
            const mappedProduct: Product = {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              image: p.imageUrl || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
              images: p.images || [],
              category: p.category?.name || 'fashion',
              description: p.description || '',
              rating: Number(p.rating || 0),
              reviews: Number(p.reviews || 0),
              vendorId: p.vendorId || 'admin',
              stock: Number(p.stock || 0),
            };
            set((state) => ({
              products: state.products.map(item => item.id === id ? mappedProduct : item)
            }));
          }
        } catch (err) {
          console.error('Failed to update product', err);
        }
      },
      removeProduct: async (id) => {
        try {
          // Changed from soft delete (PATCH) to hard delete (DELETE) as per user request
          await apiDelete(`/products/${id}`, { auth: 'user' });
          set((state) => ({ 
            products: state.products.filter(p => p.id !== id) 
          }));
        } catch (err) {
          console.error('Failed to delete product permanently', err);
        }
      },
      fetchReviews: async (productId: string | number) => {
        try {
          const response = await apiGet<{ success: boolean; data: any[] }>(`/products/${productId}/reviews`, { auth: 'none' });
          if (response && Array.isArray(response.data)) {
            const feedbacks: Feedback[] = response.data.map((f: any) => ({
              id: f.id,
              userName: f.userName || f.user?.name || 'Anonymous',
              rating: f.rating,
              comment: f.comment,
              date: f.date || (f.createdAt ? new Date(f.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' }) : '')
            }));
            set((state) => ({
              products: state.products.map(p => 
                String(p.id) === String(productId) ? { ...p, feedbacks, reviews: feedbacks.length } : p
              )
            }));
          }
        } catch (err) {
          console.error('Failed to fetch reviews', err);
        }
      },
      addFeedback: async (productId, feedback) => {
        try {
          const response = await apiPost<any>(`/products/${productId}/reviews`, {
            rating: feedback.rating,
            comment: feedback.comment,
          }, { auth: 'user' });

          if (response) {
            const newFeedback: Feedback = {
              id: response.id,
              userName: response.user?.name || feedback.userName,
              rating: response.rating,
              comment: response.comment,
              date: new Date(response.createdAt).toLocaleDateString('en-IN', { day: 'numeric', month: 'long', year: 'numeric' })
            };

            set((state) => ({
              products: state.products.map(p => 
                String(p.id) === String(productId) 
                  ? { ...p, feedbacks: [newFeedback, ...(p.feedbacks || [])], reviews: (p.reviews || 0) + 1 } 
                  : p
              )
            }));
          }
        } catch (err) {
          console.error('Failed to add review', err);
        }
      },
      updateFeedback: async (productId, feedbackId, updates) => {
        try {
          const response = await apiPatch<any>(`/products/${productId}/reviews/${feedbackId}`, {
            rating: updates.rating,
            comment: updates.comment,
          }, { auth: 'user' });

          if (response) {
            set((state) => ({
              products: state.products.map(p => 
                String(p.id) === String(productId) 
                  ? { 
                      ...p, 
                      feedbacks: (p.feedbacks || []).map(f => 
                        f.id === feedbackId ? { ...f, rating: response.rating, comment: response.comment } : f
                      ) 
                    } 
                  : p
              )
            }));
          }
        } catch (err) {
          console.error('Failed to update review', err);
        }
      },
      removeFeedback: async (productId, feedbackId) => {
        try {
          await apiDelete(`/products/${productId}/reviews/${feedbackId}`, { auth: 'user' });
          set((state) => ({
            products: state.products.map(p => 
              String(p.id) === String(productId) 
                ? { 
                    ...p, 
                    feedbacks: (p.feedbacks || []).filter(f => f.id !== feedbackId),
                    reviews: Math.max(0, (p.reviews || 0) - 1)
                  } 
                : p
            )
          }));
        } catch (err) {
          console.error('Failed to remove review', err);
        }
      },
      getProductsByVendor: (vendorId) => {
        return get().products.filter(p => p.vendorId === vendorId);
      },
      getProductById: (id) => {
        return get().products.find(p => String(p.id) === String(id));
      },
      fetchProductById: async (id) => {
        try {
          const response = await apiGet<{ success: boolean; data: any }>(`/products/${id}`);
          if (response && response.data) {
            const p = response.data;
            const mappedProduct: Product = {
              id: p.id,
              name: p.name,
              price: Number(p.price),
              image: p.imageUrl || p.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400&q=80',
              images: p.images || [],
              category: p.category?.name || 'fashion',
              description: p.description || '',
              rating: Number(p.rating || 0),
              reviews: Number(p.reviews || 0),
              vendorId: p.vendorId || 'admin',
              stock: Number(p.stock || 0),
              feedbacks: p.feedbacks || [],
            };
            
            set((state) => ({
              products: state.products.some(item => item.id === mappedProduct.id)
                ? state.products.map(item => item.id === mappedProduct.id ? mappedProduct : item)
                : [mappedProduct, ...state.products]
            }));
          }
        } catch (err) {
          console.warn('Failed to fetch product', err);
        }
      }
    }),
    {
      name: 'product-storage-v2',
    }
  )
);
