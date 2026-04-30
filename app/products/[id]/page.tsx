'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useCartStore } from '../../../store/useCartStore';
import Header from '../../../components/layout/Header';
import ProductGallery from '../../../components/product/ProductGallery';
import VariantSelector from '../../../components/product/VariantSelector';
import ProductReviewForm from '../../../components/product/ProductReviewForm';
import { useProductStore } from '../../../store/useProductStore';
import { useCategoryStore } from '../../../store/useCategoryStore';

export default function ProductDetail() {
  const router = useRouter();
  const params = useParams();
  const productId = String(params.id);
  const { products, selectedProduct, fetchProductById, clearSelectedProduct, isLoading, error } = useProductStore();
  const { fetchCategories, getCategoryNameById } = useCategoryStore();
  const product = selectedProduct && selectedProduct.id === productId
    ? selectedProduct
    : products.find((p) => p.id === productId);

  const [quantity, setQuantity] = useState(1);
  const addToCart = useCartStore((state) => state.addToCart);

  // Variants State
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');

  // Update selection if product changes (e.g., navigating between products)
  useEffect(() => {
    fetchProductById(productId);
    fetchCategories();
    return () => {
      clearSelectedProduct();
    };
  }, [productId, fetchProductById, fetchCategories, clearSelectedProduct]);

  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0].name);
    }
  }, [product]);

  const handleAddToCart = async () => {
    if (!product) return;
    try {
      await addToCart(product.id, quantity);
      toast.success(`${product.name} added to cart`);
    } catch {
      toast.error('Please sign in to add items to your cart');
      router.push('/signin');
    }
  };

  if (isLoading && !product) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center text-gray-500">
        Loading product...
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen bg-white">
        <header className="border-b border-gray-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 py-4">
            <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>
          </div>
        </header>
        <div className="max-w-7xl mx-auto px-4 py-20 text-center">
          <h1 className="text-3xl font-bold text-gray-900">Product not found</h1>
          {error && <p className="text-sm text-red-600 mt-2">{error}</p>}
          <Link href="/" className="text-red-600 hover:text-red-700 mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = products.filter((candidate) => candidate.categoryId === product.categoryId && candidate.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">
          {/* Product Image Gallery */}
          <div className="lg:w-[55%] w-full">
            <ProductGallery
              images={[
                product.image,
                product.image,
                product.image,
                product.image
              ]}
            />
          </div>

          {/* Product Info */}
          <div className="lg:w-[45%] w-full flex flex-col py-4">
            <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center mb-6">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    {i < Math.floor(product.rating) ? '★' : '☆'}
                  </span>
                ))}
              </div>
              <span className="ml-2 text-gray-500 text-sm">({product.reviews} customer reviews)</span>
            </div>

            {/* Price */}
            <div className="text-3xl font-bold text-gray-900 mb-8">₹{product.price.toFixed(2)}</div>

            {/* Variants */}
            <VariantSelector
              sizes={product.sizes}
              colors={product.colors}
              selectedSize={selectedSize}
              setSelectedSize={setSelectedSize}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
            />

            {/* Quantity and Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-4 mb-10 pt-4 border-t border-gray-100">
              <div className="flex items-center border-2 border-gray-200 rounded-md bg-white">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-5 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  −
                </button>
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-x-2 border-gray-200 outline-none py-3 text-gray-900 font-semibold"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-5 py-3 text-gray-500 hover:text-gray-900 hover:bg-gray-50 transition"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded-md transition shadow-lg shadow-red-200"
              >
                ADD TO CART
              </button>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

            {/* Product Details Specs */}
            <div className="border-t border-gray-100 py-6">
              <div className="grid grid-cols-2 gap-y-6">
                <div>
                  <p className="text-gray-500 text-sm mb-1">Sold By</p>
                  <p className="font-bold text-gray-900 transition-colors">
                    {product.vendorId ? `Vendor ${product.vendorId}` : 'Verified Vendor'}
                  </p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Category</p>
                  <p className="font-medium text-gray-900 capitalize">{getCategoryNameById(product.categoryId) || 'Uncategorized'}</p>
                </div>
                {product.stock === 0 && (
                  <div>
                    <p className="text-gray-500 text-sm mb-1">Availability</p>
                    <p className="font-medium text-red-600">Out of Stock</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-12 border-t">
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Related Products</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {relatedProducts.map((p) => (
              <Link
                key={p.id}
                href={`/products/${p.id}`}
                className="group rounded-xl border border-gray-100 bg-white overflow-hidden hover:shadow-xl hover:shadow-gray-200/60 hover:-translate-y-1.5 transition-all duration-300"
              >
                <div className="bg-gray-50 overflow-hidden">
                  <div className="aspect-square w-full overflow-hidden">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                </div>
                <div className="p-4 bg-white">
                  <h3 className="text-sm font-semibold text-gray-700 group-hover:text-red-600 transition-colors line-clamp-1">{p.name}</h3>
                  <p className="mt-2 text-lg font-bold text-gray-900">₹{p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Customer Feedback section */}
      <section className="max-w-7xl mx-auto px-4 py-12 border-t">
        <ProductReviewForm productId={product.id} />
      </section>
    </div>
  );
}
