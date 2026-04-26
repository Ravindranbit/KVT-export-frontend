'use client';

import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useEffect } from 'react';
import Header from '../../../components/layout/Header';
import { useProductStore } from '../../../store/useProductStore';
import { useCategoryStore } from '../../../store/useCategoryStore';

export default function CategoryPage() {
  const params = useParams();
  const slug = String(params.slug || '');

  const { products, fetchProducts } = useProductStore();
  const {
    fetchCategories,
    fetchCategoryProducts,
    getCategoryBySlug,
    selectedCategoryProducts,
    isLoading,
    error,
  } = useCategoryStore();

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, [fetchCategories, fetchProducts]);

  useEffect(() => {
    if (slug) {
      fetchCategoryProducts(slug);
    }
  }, [slug, fetchCategoryProducts]);

  const category = getCategoryBySlug(slug);
  const categoryProducts = products.filter((product) => selectedCategoryProducts.includes(product.id));

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <main className="max-w-7xl mx-auto px-4 py-10">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{category?.name || 'Category'}</h1>
        {category?.description && <p className="text-gray-600 mb-8">{category.description}</p>}

        {isLoading && <p className="text-gray-500">Loading category products...</p>}
        {!isLoading && error && <p className="text-red-600">{error}</p>}

        {!isLoading && !error && categoryProducts.length === 0 && (
          <p className="text-gray-500">No products found for this category.</p>
        )}

        {!isLoading && !error && categoryProducts.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categoryProducts.map((product) => (
              <article key={product.id} className="border border-gray-100 rounded-xl overflow-hidden shadow-sm bg-white">
                <Link href={`/products/${product.id}`}>
                  <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
                </Link>
                <div className="p-4 space-y-2">
                  <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 block line-clamp-1">
                    {product.name}
                  </Link>
                  <p className="font-bold text-red-600">₹{product.price.toFixed(2)}</p>
                </div>
              </article>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
