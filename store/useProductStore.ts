import { create } from 'zustand';
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
  images?: string[];
  category: string;
  categoryId?: string;
  description: string;
  rating: number;
  reviews: number;
  vendorId?: string;
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
  getProductById: (id: string) => Product | undefined;
  addProduct: (product: Product) => void;
  removeProduct: (id: string) => void;
  updateProduct: (id: string, updates: Partial<Product>) => void;
}

const mapProduct = (raw: any): Product => ({
  id: String(raw.id),
  name: raw.name || 'Untitled Product',
  price: Number(raw.price || 0),
  image: raw.imageUrl || raw.image || '',
  category: raw.category?.name || raw.categoryName || raw.category || '',
  categoryId: raw.categoryId || raw.category?.id,
  description: raw.description || '',
  rating: Number(raw.rating || 0),
  reviews: Number(raw.reviews || 0),
  vendorId: raw.vendorId ? String(raw.vendorId) : undefined,
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

export const useProductStore = create<ProductState>()((set, get) => ({
  products: [],
  selectedProduct: null,
  isLoading: false,
  error: null,
  fetchProducts: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get('/products');
      const rawProducts = Array.isArray(response?.data) ? response.data : [];
      const mappedProducts = rawProducts.map(mapProduct);
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
  getProductById: (id) => {
    return get().products.find((product) => product.id === id);
  },
  addProduct: (product) => set((state) => ({ products: [product, ...state.products] })),
  removeProduct: (id) => set((state) => ({ products: state.products.filter((p) => p.id !== id) })),
  updateProduct: (id, updates) =>
    set((state) => ({
      products: state.products.map((p) => (p.id === id ? { ...p, ...updates } : p)),
    })),
}));
