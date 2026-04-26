import { create } from 'zustand';
import api from '../src/lib/api';

export interface CategoryNode {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  parentId?: string | null;
  isActive?: boolean;
  children: CategoryNode[];
}

interface CategoryStore {
  categories: CategoryNode[];
  selectedCategoryProducts: string[];
  isLoading: boolean;
  error: string | null;
  fetchCategories: () => Promise<void>;
  fetchCategoryProducts: (slug: string) => Promise<void>;
  getCategoryBySlug: (slug: string) => CategoryNode | undefined;
  getCategoryNameById: (id?: string) => string;
  getCategorySlugById: (id?: string) => string;
}

const mapCategory = (raw: any): CategoryNode => ({
  id: String(raw.id),
  name: raw.name || 'Unnamed Category',
  slug: raw.slug || '',
  description: raw.description || null,
  parentId: raw.parentId || null,
  isActive: typeof raw.isActive === 'boolean' ? raw.isActive : true,
  children: Array.isArray(raw.children) ? raw.children.map(mapCategory) : [],
});

const flattenCategories = (categories: CategoryNode[]): CategoryNode[] => {
  return categories.flatMap((category) => [category, ...flattenCategories(category.children)]);
};

export const useCategoryStore = create<CategoryStore>((set, get) => ({
  categories: [],
  selectedCategoryProducts: [],
  isLoading: false,
  error: null,
  fetchCategories: async () => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get('/categories');
      const rawCategories = response?.data || response?.categories || [];
      const categories = Array.isArray(rawCategories) ? rawCategories.map(mapCategory) : [];
      set({ categories, isLoading: false });
    } catch (error: any) {
      set({
        isLoading: false,
        error: error?.message || 'Failed to load categories',
      });
    }
  },
  fetchCategoryProducts: async (slug: string) => {
    set({ isLoading: true, error: null });
    try {
      const response: any = await api.get(`/categories/${slug}`);
      const products = response?.data?.products || [];
      const productIds = Array.isArray(products) ? products.map((p: any) => String(p.id)) : [];
      set({ selectedCategoryProducts: productIds, isLoading: false });
    } catch (error: any) {
      set({
        selectedCategoryProducts: [],
        isLoading: false,
        error: error?.message || 'Failed to load category products',
      });
    }
  },
  getCategoryBySlug: (slug: string) => {
    const all = flattenCategories(get().categories);
    return all.find((category) => category.slug === slug);
  },
  getCategoryNameById: (id?: string) => {
    if (!id) return 'Uncategorized';
    const all = flattenCategories(get().categories);
    return all.find((category) => category.id === id)?.name || 'Uncategorized';
  },
  getCategorySlugById: (id?: string) => {
    if (!id) return '';
    const all = flattenCategories(get().categories);
    return all.find((category) => category.id === id)?.slug || '';
  },
}));
