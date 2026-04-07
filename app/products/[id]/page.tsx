'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { useCartStore } from '../../../store/useCartStore';
import Header from '../../../components/layout/Header';
import CartDrawer from '../../../components/cart/CartDrawer';
import ProductGallery from '../../../components/product/ProductGallery';
import VariantSelector from '../../../components/product/VariantSelector';
import ProductReviewForm from '../../../components/product/ProductReviewForm';
import { useProductStore } from '../../../store/useProductStore';

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const { products } = useProductStore();
  const product = products.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');
  
  // Variants State
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || '');
  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0]?.name || '');

  // Update selection if product changes (e.g., navigating between products)
  useEffect(() => {
    if (product) {
      if (product.sizes?.length) setSelectedSize(product.sizes[0]);
      if (product.colors?.length) setSelectedColor(product.colors[0].name);
    }
  }, [product]);

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
          <Link href="/" className="text-red-600 hover:text-red-700 mt-4 inline-block">Back to Home</Link>
        </div>
      </div>
    );
  }

  const addToCart = useCartStore((state) => state.addItem);

  const handleAddToCart = () => {
    addToCart(product.id, quantity);
    
    setCartMessage(`${quantity} ${product.name} added to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  const relatedProducts = products.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      <Header />
      <CartDrawer getProductDetails={(id) => products.find(p => p.id === id)} />

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
                  <Link href={`/vendor/${product.vendorId}`} className="font-bold text-red-600 hover:underline">
                    {product.vendorId === 'v1' ? 'Artisan Threadsco' : product.vendorId === 'v2' ? 'Urban Sole' : 'Verified Vendor'}
                  </Link>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Category</p>
                  <p className="font-medium text-gray-900 capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-500 text-sm mb-1">Availability</p>
                  <p className={`font-medium ${(product.stock === 0) ? 'text-red-600' : 'text-green-600'}`}>
                    {(product.stock === 0) ? 'Out of Stock' : (product.stock ? `${product.stock} Units In Stock` : 'In Stock')}
                  </p>
                </div>
              </div>
            </div>

            {cartMessage && (
              <div className="fixed top-24 left-1/2 -translate-x-1/2 z-[100] animate-in fade-in slide-in-from-top-4 duration-300">
                <div className="bg-white text-gray-900 px-6 py-4 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.12)] border border-gray-100 flex items-center gap-4 min-w-[320px]">
                  <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center shrink-0">
                    <svg className="w-6 h-6 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-gray-900">Added to Cart</p>
                    <p className="text-xs text-gray-500 font-medium">{product.name} (Qty: {quantity})</p>
                  </div>
                  <Link 
                    href="/cart" 
                    className="text-xs font-bold text-red-600 hover:text-red-700 bg-red-50 px-4 py-2.5 rounded-lg transition-colors whitespace-nowrap"
                  >
                    View Cart
                  </Link>
                </div>
              </div>
            )}
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

      {/* Footer */}
      <footer className="bg-[#222222] text-white mt-20">
        <div className="max-w-7xl mx-auto px-6 py-14">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12 mb-10">
            {/* Categories */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">CATEGORIES</h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition">Women</a></li>
                <li><a href="#" className="hover:text-white transition">Men</a></li>
                <li><a href="#" className="hover:text-white transition">Shoes</a></li>
                <li><a href="#" className="hover:text-white transition">Watches</a></li>
              </ul>
            </div>

            {/* Help */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">HELP</h4>
              <ul className="space-y-3 text-gray-300 text-sm">
                <li><a href="#" className="hover:text-white transition">Track Order</a></li>
                <li><a href="#" className="hover:text-white transition">Returns</a></li>
                <li><a href="#" className="hover:text-white transition">Shipping</a></li>
                <li><a href="#" className="hover:text-white transition">FAQs</a></li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">GET IN TOUCH</h4>
              <p className="text-gray-300 text-sm leading-relaxed mb-4">
                Any questions? Let us know in store at 8th floor, 379 Hudson St, New York, NY 10018 or call us on (+1) 96 716 6879
              </p>
              <div className="flex items-center gap-4 text-gray-300">
                <a href="#" className="hover:text-white" aria-label="Facebook">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M18 2h-3a4 4 0 00-4 4v3H8v4h3v9h4v-9h3l1-4h-4V6a1 1 0 011-1h3z" /></svg>
                </a>
                <a href="#" className="hover:text-white" aria-label="Instagram">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect width="20" height="20" x="2" y="2" rx="5" ry="5" strokeWidth="1.6" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.6" d="M17.5 6.5h.01" /></svg>
                </a>
                <a href="#" className="hover:text-white" aria-label="Twitter">
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24h-6.657l-5.214-6.817L5.769 21.75H2.462l7.726-8.835L1.54 2.25h6.826l4.853 6.093 5.825-6.093zM16.369 19.25h1.836L8.71 4.1H6.748l9.621 15.15z" /></svg>
                </a>
              </div>
            </div>

            {/* Newsletter */}
            <div>
              <h4 className="font-bold mb-5 text-sm tracking-wide">NEWSLETTER</h4>
              <div className="flex flex-col gap-4 max-w-xs">
                <input
                  type="email"
                  placeholder="email@example.com"
                  className="w-full bg-transparent border-b border-gray-500 text-gray-200 placeholder-gray-500 focus:outline-none pb-2 text-sm"
                />
                <button className="w-full max-w-[220px] bg-red-600 hover:bg-red-700 text-white px-6 py-3 rounded-full text-sm font-semibold transition">
                  SUBSCRIBE
                </button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-700 pt-8 text-center text-gray-400 text-sm">
            <p>Copyright ©2026 KVT exports. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
