'use client';

import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/navigation';
import Header from '../components/layout/Header';
import BannerCarousel from '../components/home/BannerCarousel';
import { useProductStore } from '../store/useProductStore';
import { useCategoryStore } from '../store/useCategoryStore';
import { useCartStore } from '../store/useCartStore';
import { useWishlistStore } from '../store/useWishlistStore';

export default function HomePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const categoryQuery = searchParams.get('category') || 'all';

  const { products, fetchProducts, isLoading: productsLoading, error: productsError } = useProductStore();
  const {
    categories,
    fetchCategories,
    getCategoryNameById,
    getCategorySlugById,
    isLoading: categoriesLoading,
    error: categoriesError,
  } = useCategoryStore();

  const addToCart = useCartStore((state) => state.addToCart);
  const wishlistItems = useWishlistStore((state) => state.items);
  const toggleWishlist = useWishlistStore((state) => state.toggleItem);

  const [selectedCategory, setSelectedCategory] = useState(categoryQuery);

  useEffect(() => {
    fetchProducts();
    fetchCategories();
  }, [fetchProducts, fetchCategories]);

  useEffect(() => {
    setSelectedCategory(categoryQuery);
  }, [categoryQuery]);

  const categoryOptions = useMemo(() => {
    const walk = (nodes: typeof categories): { slug: string; name: string }[] =>
      nodes.flatMap((node) => [{ slug: node.slug, name: node.name }, ...walk(node.children)]);

    return walk(categories);
  }, [categories]);

  const filteredProducts = useMemo(() => {
    if (selectedCategory === 'all') return products;

    return products.filter((product) => getCategorySlugById(product.categoryId) === selectedCategory);
  }, [products, selectedCategory, getCategorySlugById]);

  const isLoading = productsLoading || categoriesLoading;
  const loadError = productsError || categoriesError;

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <BannerCarousel />

      <section className="max-w-7xl mx-auto px-4 py-10">
        <div className="flex flex-wrap gap-2 mb-8">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-lg text-sm font-semibold ${selectedCategory === 'all' ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
          >
            All
          </button>
          {categoryOptions.map((category) => (
            <button
              key={category.slug}
              onClick={() => setSelectedCategory(category.slug)}
              className={`px-4 py-2 rounded-lg text-sm font-semibold ${selectedCategory === category.slug ? 'bg-gray-900 text-white' : 'bg-gray-100 text-gray-700'}`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {isLoading && <p className="text-gray-500 text-sm">Loading products...</p>}
        {!isLoading && loadError && <p className="text-red-600 text-sm">{loadError}</p>}

        {!isLoading && !loadError && filteredProducts.length === 0 && (
          <p className="text-gray-500">No products found for this category.</p>
        )}

        {!isLoading && !loadError && filteredProducts.length > 0 && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {filteredProducts.map((product) => (
                <article key={product.id} className="border border-gray-100 rounded-xl overflow-hidden bg-white shadow-sm">
                  <Link href={`/products/${product.id}`}>
                    <img src={product.image} alt={product.name} className="w-full h-52 object-cover" />
                  </Link>
                  <div className="p-4 space-y-2">
                    <p className="text-xs text-gray-500">{getCategoryNameById(product.categoryId)}</p>
                    <Link href={`/products/${product.id}`} className="font-semibold text-gray-900 line-clamp-1 block">
                      {product.name}
                    </Link>
                    <p className="text-red-600 font-bold">₹{product.price.toFixed(2)}</p>
                    <div className="flex items-center justify-between pt-2">
                      <button
                        onClick={async () => {
                          try {
                            await addToCart(product.id, 1);
                          } catch {
                            router.push('/signin');
                          }
                        }}
                        className="text-sm font-semibold bg-gray-900 text-white px-3 py-1.5 rounded-lg"
                      >
                        Add to Cart
                      </button>
                      <button
                        onClick={() => toggleWishlist(product.id)}
                        className={`text-sm font-semibold ${wishlistItems.includes(product.id) ? 'text-red-600' : 'text-gray-400'}`}
                      >
                        Wishlist
                      </button>
                    </div>
                  </div>
                </article>
              ))}
            </div>
            <div className="mt-10">
              <Link href="/products" className="text-sm font-semibold text-red-600 hover:text-red-700">
                View all products
              </Link>
            </div>
          </>
        )}
      </section>
    </div>
  );
}
