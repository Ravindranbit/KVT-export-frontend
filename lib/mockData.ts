export const PRODUCTS = [
  // Fashion
  { 
    id: 1, 
    name: 'Premium Cotton T-Shirt', 
    price: 1299, 
    image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&q=80', 
    category: 'fashion', 
    description: 'Experience ultimate comfort with our premium 100% cotton t-shirt. Breathable and stylish, perfect for daily wear.', 
    rating: 4.5, 
    reviews: 120, 
    vendorId: 'v1',
    sizes: ['S', 'M', 'L', 'XL'],
    colors: [
      { name: 'White', hex: '#ffffff' },
      { name: 'Black', hex: '#000000' },
      { name: 'Gray', hex: '#9ca3af' }
    ],
    feedbacks: [
      { id: 'f1', userName: 'Rahul Sharma', rating: 5, comment: 'Amazing quality! The fabric feels premium and fits perfectly.', date: '12 March 2026' },
      { id: 'f2', userName: 'Priya Patel', rating: 4, comment: 'Good value for money. The white is a bit translucent but acceptable.', date: '5 March 2026' }
    ]
  },
  { 
    id: 2, 
    name: 'Classic Denim Jacket', 
    price: 3499, 
    image: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=400&q=80', 
    category: 'fashion', 
    description: 'A timeless classic. This rugged denim jacket offers a comfortable fit and lasting durability for any casual outfit.', 
    rating: 4.7, 
    reviews: 85, 
    vendorId: 'v2',
    sizes: ['M', 'L', 'XL'],
    colors: [
      { name: 'Indigo', hex: '#1e3a8a' },
      { name: 'Light Blue', hex: '#93c5fd' }
    ]
  },
  { 
    id: 3, 
    name: 'Running Sneakers', 
    price: 5499, 
    image: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&q=80', 
    category: 'fashion', 
    description: 'Lightweight performance running sneakers. Engineered for speed and comfort with advanced cushioning.', 
    rating: 4.8, 
    reviews: 210, 
    vendorId: 'v1',
    sizes: ['7', '8', '9', '10', '11'],
    colors: [
      { name: 'Red', hex: '#ef4444' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  { 
    id: 4, 
    name: 'Leather Crossbody Bag', 
    price: 2999, 
    image: 'https://images.unsplash.com/photo-1548036328-c9fa89d128fa?w=400&q=80', 
    category: 'fashion', 
    description: 'Genuine leather crossbody bag with multiple compartments. A perfect blend of style and practicality.', 
    rating: 4.6, 
    reviews: 94, 
    vendorId: 'v2',
    colors: [
      { name: 'Tan', hex: '#92400e' },
      { name: 'Black', hex: '#000000' }
    ]
  },
  
  // Electronics
  { id: 5, name: 'Wireless Headphones', price: 8999, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&q=80', category: 'electronics', description: 'Premium over-ear wireless headphones with active noise cancellation and up to 30 hours of battery life.', rating: 4.9, reviews: 340, vendorId: 'v1' },
  { id: 6, name: 'Smart Watch Series 5', price: 14999, image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400&q=80', category: 'electronics', description: 'Advanced smartwatch featuring health monitoring, fitness tracking, and seamless smartphone integration.', rating: 4.7, reviews: 520, vendorId: 'v2' },
  { id: 7, name: '4K Action Camera', price: 18500, image: 'https://images.unsplash.com/photo-1526170375885-4d8ecf77b99f?w=400&q=80', category: 'electronics', description: 'Capture every adventure in stunning 4K detail. Waterproof up to 10m without a case.', rating: 4.5, reviews: 155, vendorId: 'v1' },
  { id: 8, name: 'Bluetooth Speaker', price: 3200, image: 'https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=400&q=80', category: 'electronics', description: 'Portable Bluetooth speaker delivering deep bass and crystal-clear highs. IPX7 waterproof rating.', rating: 4.8, reviews: 89, vendorId: 'v2' },

  // Home
  { id: 9, name: 'Ceramic Table Lamp', price: 1599, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=400&q=80', category: 'home', description: 'Elegant ceramic table lamp to brighten your living space. Comes with a soft amber bulb for warm lighting.', rating: 4.4, reviews: 45, vendorId: 'v1' },
  { id: 10, name: 'Minimalist Wall Clock', price: 899, image: 'https://images.unsplash.com/photo-1563861826100-9cb868fdbe1c?w=400&q=80', category: 'home', description: 'Silent sweep non-ticking minimalist wall clock. Adds a modern touch to any room.', rating: 4.6, reviews: 200, vendorId: 'v2' },
  { id: 11, name: 'Modern Sofa Cushion', price: 599, image: 'https://images.unsplash.com/photo-1584100936595-c0654b355040?w=400&q=80', category: 'home', description: 'Plush decorative cushion with a modern geometric design. Removable and washable cover.', rating: 4.3, reviews: 67, vendorId: 'v1', colors: [{name: 'Beige', hex: '#f5f5dc'}, {name: 'Gray', hex: '#808080'}] },

  // Sports & Beauty
  { id: 12, name: 'Yoga Mat', price: 1100, image: 'https://images.unsplash.com/photo-1592432678016-e910b06b3840?w=400&q=80', category: 'sports', description: 'Eco-friendly, non-slip yoga mat. Provides excellent cushioning and support for your joints.', rating: 4.8, reviews: 310, vendorId: 'v2', colors: [{name: 'Purple', hex: '#a855f7'}, {name: 'Teal', hex: '#14b8a6'}] },
  { id: 13, name: 'Dumbbell Set', price: 2500, image: 'https://images.unsplash.com/photo-1583454110551-21f2fa2afe61?w=400&q=80', category: 'sports', description: 'Adjustable dumbbell set for home workouts. Space-saving design and anti-roll shape.', rating: 4.7, reviews: 180, vendorId: 'v1' },
  { id: 14, name: 'Organic Face Serum', price: 850, image: 'https://images.unsplash.com/photo-1620916566398-39f1143ab7be?w=400&q=80', category: 'beauty', description: 'Rejuvenating organic face serum with Vitamin C and Hyaluronic Acid. Brightens and hydrates skin.', rating: 4.6, reviews: 450, vendorId: 'v2' },
  { id: 15, name: 'Essential Oil Set', price: 1250, image: 'https://images.unsplash.com/photo-1608248543803-ba4f8c70ae0b?w=400&q=80', category: 'beauty', description: 'A collection of 6 pure therapeutic grade essential oils for aromatherapy and relaxation.', rating: 4.9, reviews: 225, vendorId: 'v1' },

  // Books / Toys
  { id: 16, name: 'Hardcover Notebook', price: 450, image: 'https://images.unsplash.com/photo-1531346878377-a541e4a113fb?w=400&q=80', category: 'books', description: 'Premium hardcover notebook with 200 pages of thick, lined ivory paper. Perfect for journaling or notes.', rating: 4.5, reviews: 110, vendorId: 'v2' },
];
