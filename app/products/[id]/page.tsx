'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';

const PRODUCTS = [
  { id: 5, name: 'Front Pocket Jumper', price: 2884, image: 'product-05.jpg', category: 'men', description: 'Cozy front pocket jumper ideal for cold weather. Made with soft, breathable material for maximum comfort.', rating: 4.6, reviews: 22 },
  { id: 6, name: 'Vintage Inspired Classic', price: 7736, image: 'product-06.jpg', category: 'shoes', description: 'Elegant vintage inspired shoes with classic design. Comfortable to wear all day long.', rating: 4.7, reviews: 28 },
  { id: 7, name: 'Shirt in Stretch Cotton', price: 4371, image: 'product-07.jpg', category: 'women', description: 'Breathable shirt made from high-quality stretch cotton. Perfect for active lifestyle and everyday wear.', rating: 4.5, reviews: 19 },
  { id: 8, name: 'Pieces Metallic Printed', price: 1574, image: 'product-08.jpg', category: 'bag', description: 'Trendy bag with eye-catching metallic prints. Spacious enough for your daily essentials.', rating: 4.4, reviews: 15 },
  { id: 9, name: 'Converse All Star Hi Plimsolls', price: 6225, image: 'product-09.jpg', category: 'shoes', description: 'Iconic high-top sneakers loved by millions worldwide. Durable and stylish for casual or sporty looks.', rating: 4.8, reviews: 50 },
  { id: 10, name: 'Femme T-Shirt In Stripe', price: 2146, image: 'product-10.jpg', category: 'women', description: 'Classic striped t-shirt for women. Versatile piece that works with any outfit.', rating: 4.3, reviews: 16 },
  { id: 11, name: 'Herschel supply', price: 5242, image: 'product-11.jpg', category: 'bag', description: 'Durable bag perfect for travel or daily use. High-quality materials ensure long-lasting performance.', rating: 4.6, reviews: 26 },
  { id: 12, name: 'Mini Silver Mesh Watch', price: 7209, image: 'product-12.jpg', category: 'watches', description: 'Elegant silver mesh watch with minimalist design. Water-resistant and perfect for any occasion.', rating: 4.7, reviews: 31 },
];

export default function ProductDetail() {
  const params = useParams();
  const productId = parseInt(params.id as string);
  const product = PRODUCTS.find(p => p.id === productId);
  const [quantity, setQuantity] = useState(1);
  const [cartMessage, setCartMessage] = useState('');

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

  const handleAddToCart = () => {
    const saved = localStorage.getItem('cart');
    const cart = saved ? JSON.parse(saved) : [];
    
    const existingItem = cart.find((item: any) => item.id === product.id);
    
    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        image: product.image,
        quantity: quantity
      });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    window.dispatchEvent(new Event('cartUpdated'));
    
    setCartMessage(`${quantity} ${product.name} added to cart!`);
    setTimeout(() => setCartMessage(''), 3000);
  };

  const relatedProducts = PRODUCTS.filter(p => p.category === product.category && p.id !== product.id).slice(0, 4);

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold text-gray-900" style={{ fontFamily: 'var(--font-kumar-one)' }}>KVT exports</Link>
          
          <nav className="hidden md:flex gap-8">
            <Link href="/" className="text-gray-700 hover:text-red-500 transition">Home</Link>
            <Link href="#" className="text-gray-700 hover:text-red-500 transition">About</Link>
            <Link href="#" className="text-gray-700 hover:text-red-500 transition">Contact</Link>
          </nav>

          <Link href="/" className="text-gray-700 hover:text-gray-900">Back</Link>
        </div>
      </header>

      {/* Product Detail */}
      <section className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product Image */}
          <div className="bg-gray-100 h-[600px] flex items-center justify-center overflow-hidden">
            <img
              src={`https://themewagon.github.io/cozastore/images/${product.image}`}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>

          {/* Product Info */}
          <div>
            <div className="mb-6">
              <h1 className="text-4xl font-bold text-gray-900 mb-3">{product.name}</h1>
              
              {/* Rating */}
              <div className="flex items-center mb-4">
                <div className="flex text-yellow-400">
                  {[...Array(5)].map((_, i) => (
                    <span key={i}>
                      {i < Math.floor(product.rating) ? '★' : '☆'}
                    </span>
                  ))}
                </div>
                <span className="ml-2 text-gray-600">({product.reviews} reviews)</span>
              </div>

              {/* Price */}
              <div className="text-3xl font-bold text-red-600 mb-4">₹{product.price.toFixed(2)}</div>

              {/* Category Badge */}
              <div className="mb-4">
                <span className="bg-gray-900 text-white px-4 py-1 rounded capitalize text-sm">
                  {product.category}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Product Description</h3>
              <p className="text-gray-600 leading-relaxed">{product.description}</p>
            </div>

                       {/* Product Details */}
            <div className="mb-8 border-t border-b py-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-gray-600 text-sm">Category</p>
                  <p className="font-semibold text-gray-900 capitalize">{product.category}</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Rating</p>
                  <p className="font-semibold text-gray-900">{product.rating}/5</p>
                </div>
                <div>
                  <p className="text-gray-600 text-sm">Stock Status</p>
                  <p className="font-semibold text-green-600">In Stock</p>
                </div>
              </div>
            </div>

            {/* Quantity and Add to Cart */}
            <div className="flex gap-4 mb-8">
              <div className="flex items-center border border-gray-300 rounded">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-16 text-center border-l border-r border-gray-300 outline-none py-2 text-gray-900"
                />
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-4 py-2 text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>

              <button
                onClick={handleAddToCart}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white font-bold py-3 rounded transition"
              >
                ADD TO CART
              </button>
            </div>

            {cartMessage && (
              <>
                <div className="fixed inset-0 z-40 flex items-center justify-center">
                  <div className="bg-white rounded-lg p-8 max-w-xl w-full mx-4 z-50 shadow-xl relative">
                    <button
                      onClick={() => setCartMessage('')}
                      className="absolute top-6 right-6 text-gray-400 hover:text-gray-600 text-3xl"
                    >
                      ×
                    </button>
                    
                    <p className="text-green-500 font-semibold text-lg mb-8">Successfully added to your cart.</p>
                    
                    <div className="flex gap-6 mb-8">
                      <img
                        src={`https://themewagon.github.io/cozastore/images/${product.image}`}
                        alt={product.name}
                        className="w-32 h-32 object-cover bg-gray-100"
                      />
                      <div className="flex-1">
                        <h3 className="text-gray-900 font-medium text-xl mb-2">{product.name}</h3>
                        <p className="text-red-600 font-semibold text-lg mb-2">₹{product.price.toFixed(2)}</p>
                        <p className="text-gray-600 text-base">QTY: {quantity}</p>
                      </div>
                    </div>
                    
                    <div className="flex gap-4">
                      <button
                        onClick={() => setCartMessage('')}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded font-semibold text-base transition"
                      >
                        Continue Shopping
                      </button>
                      <button
                        onClick={() => window.location.href = '/cart'}
                        className="flex-1 bg-red-600 hover:bg-red-700 text-white py-4 rounded font-semibold text-base transition"
                      >
                        Proceed to Checkout
                      </button>
                    </div>
                  </div>
                </div>
              </>
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
                className="group rounded-lg border border-gray-200 bg-white overflow-hidden hover:shadow-md hover:-translate-y-1 transition"
              >
                <div className="bg-gray-100 h-72 flex items-center justify-center overflow-hidden">
                  <img
                    src={`https://themewagon.github.io/cozastore/images/${p.image}`}
                    alt={p.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <div className="p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <h3 className="text-base font-medium text-[#6b7280]">{p.name}</h3>
                    <span className="text-gray-400">
                      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.6} d="M12 21s-6.75-4.35-9-9.09C1.17 9.23 2.2 6.33 4.62 4.92a5.13 5.13 0 015.89.62L12 6.95l1.49-1.41a5.13 5.13 0 015.89-.62c2.42 1.41 3.45 4.31 1.62 7 0 0-1.62 3.24-9 9.08z" />
                      </svg>
                    </span>
                  </div>
                  <p className="mt-2 text-base font-semibold text-[#6b7280]">${p.price.toFixed(2)}</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      )}

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
