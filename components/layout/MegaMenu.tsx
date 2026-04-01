'use client';

import { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

const CATEGORIES = [
  {
    name: "Electronics",
    featuredImage: "https://images.unsplash.com/photo-1468495244123-6c6c332eeece?q=80&w=800",
    sections: [
      {
        title: "Devices",
        links: [
          { name: "Smartphones", href: "/#", category: 'electronics' },
          { name: "Laptops", href: "/#", category: 'electronics' },
          { name: "Tablets", href: "/#", category: 'electronics' },
        ]
      },
      {
        title: "Accessories",
        links: [
          { name: "Headphones", href: "/#", category: 'electronics' },
          { name: "Chargers", href: "/#", category: 'electronics' },
          { name: "Smart Watches", href: "/#", category: 'electronics' },
        ]
      },
      {
        title: "Appliances",
        links: [
          { name: "Kitchen", href: "/#", category: 'home' },
          { name: "Cameras", href: "/#", category: 'electronics' },
          { name: "Speakers", href: "/#", category: 'electronics' },
        ]
      }
    ]
  },
  {
    name: "Fashion",
    featuredImage: "https://images.unsplash.com/photo-1445205170230-053b83016050?q=80&w=800",
    sections: [
      {
        title: "Women",
        links: [
          { name: "Dresses", href: "/#", category: 'fashion' },
          { name: "Tops", href: "/#", category: 'fashion' },
          { name: "Footwear", href: "/#", category: 'fashion' },
        ]
      },
      {
        title: "Men",
        links: [
          { name: "Shirts", href: "/#", category: 'fashion' },
          { name: "Jeans", href: "/#", category: 'fashion' },
          { name: "Outerwear", href: "/#", category: 'fashion' },
        ]
      },
      {
        title: "Accessories",
        links: [
          { name: "Bags", href: "/#", category: 'fashion' },
          { name: "Watches", href: "/#", category: 'fashion' },
          { name: "Sunglasses", href: "/#", category: 'fashion' },
        ]
      }
    ]
  },
  {
    name: "Home",
    featuredImage: "https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=800",
    sections: [
      {
        title: "Furniture",
        links: [
          { name: "Sofas", href: "/#", category: 'home' },
          { name: "Beds", href: "/#", category: 'home' },
          { name: "Tables", href: "/#", category: 'home' },
        ]
      },
      {
        title: "Decor",
        links: [
          { name: "Lighting", href: "/#", category: 'home' },
          { name: "Wall Art", href: "/#", category: 'home' },
          { name: "Rugs", href: "/#", category: 'home' },
        ]
      },
      {
        title: "Kitchen",
        links: [
          { name: "Cookware", href: "/#", category: 'home' },
          { name: "Storage", href: "/#", category: 'home' },
          { name: "Appliances", href: "/#", category: 'home' },
        ]
      }
    ]
  },
  {
    name: "Sports & Beauty",
    featuredImage: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=800",
    sections: [
      {
        title: "Fitness",
        links: [
          { name: "Yoga Mats", href: "/#", category: 'sports' },
          { name: "Dumbbells", href: "/#", category: 'sports' },
          { name: "Accessories", href: "/#", category: 'sports' },
        ]
      },
      {
        title: "Skincare",
        links: [
          { name: "Serums", href: "/#", category: 'beauty' },
          { name: "Oils", href: "/#", category: 'beauty' },
          { name: "Kits", href: "/#", category: 'beauty' },
        ]
      },
      {
        title: "Stationery",
        links: [
          { name: "Notebooks", href: "/#", category: 'books' },
          { name: "Planners", href: "/#", category: 'books' },
          { name: "Pens", href: "/#", category: 'books' },
        ]
      }
    ]
  }
];


export default function MegaMenu() {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);

  // Small delay to prevent accidental closing when moving mouse slightly off
  const [timeoutId, setTimeoutId] = useState<NodeJS.Timeout | null>(null);

  const handleMouseEnter = (menuName: string) => {
    if (timeoutId) clearTimeout(timeoutId);
    setActiveMenu(menuName);
  };

  const handleMouseLeave = () => {
    const id = setTimeout(() => setActiveMenu(null), 150);
    setTimeoutId(id);
  };

  return (
    <nav className="hidden md:flex gap-6 flex-1 justify-center relative items-center z-50">
      {/* Dynamic Mega Menu Dropdowns */}
      {CATEGORIES.map((cat) => (
        <div
          key={cat.name}
          className="relative group h-full flex items-center"
          onMouseEnter={() => handleMouseEnter(cat.name)}
          onMouseLeave={handleMouseLeave}
        >
          <button className="flex items-center gap-1 text-gray-700 font-medium hover:text-red-500 transition py-4 outline-none">
            {cat.name}
            <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          <AnimatePresence>
            {activeMenu === cat.name && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 15 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-b-xl border border-gray-100 overflow-hidden origin-top"
              >
                <div className="flex p-8 gap-8">
                  {/* Left Side Links */}
                  <div className="flex-1 grid grid-cols-3 gap-8">
                    {cat.sections.map((section) => (
                      <div key={section.title}>
                        <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 tracking-wide uppercase text-sm">
                          {section.title}
                        </h4>
                        <ul className="space-y-3 justify-start items-start text-left">
                          {section.links.map((link) => (
                            <li key={link.name}>
                              <Link href={`/?category=${link.category}`} className="text-gray-500 hover:text-red-600 hover:translate-x-1 transition-all duration-200 block text-sm">
                                {link.name}
                              </Link>
                            </li>
                          ))}
                        </ul>
                      </div>
                    ))}
                  </div>
                  
                  {/* Right Side Featured Image */}
                  <div className="w-[250px] shrink-0">
                    <div className="relative h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-100 group/image">
                      <img 
                        src={cat.featuredImage} 
                        alt={`${cat.name} collection`}
                        className="absolute inset-0 w-full h-full object-cover group-hover/image:scale-110 transition duration-700"
                      />
                      <div className="absolute inset-0 bg-black/20 flex justify-center items-end pb-6">
                        <Link href={`/?category=${cat.name.split(' ')[0].toLowerCase()}`} className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-6 py-2.5 rounded shadow-lg hover:bg-white transition text-sm">
                          Shop {cat.name}
                        </Link>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}

      <Link href="/about" className="text-gray-700 font-medium hover:text-red-500 transition py-4">About</Link>
      <Link href="/contact" className="text-gray-700 font-medium hover:text-red-500 transition py-4">Contact</Link>
    </nav>
  );
}
