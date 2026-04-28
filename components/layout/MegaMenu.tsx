'use client';

import { useMemo, useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';

export default function MegaMenu() {
  const { products } = useProductStore();
  const { categories } = useCategoryStore();
  const menuCategories = useMemo(() => {
    const findCategoryImage = (categoryId: string): string => {
      return products.find((product) => product.categoryId === categoryId)?.image || '';
    };

    return categories.map((category) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      featuredImage: findCategoryImage(category.id),
      sections: category.children.map((child) => ({
        title: child.name,
        links: child.children.length > 0
          ? child.children.map((grandChild) => ({
              name: grandChild.name,
              slug: grandChild.slug,
            }))
          : [
              {
                name: child.name,
                slug: child.slug,
              },
            ],
      })),
    }));
  }, [categories, products]);

  const [activeMenu, setActiveMenu] = useState<string | null>(null);
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
      {menuCategories.map((category) => (
        category.sections.length > 0 ? (
          <div
            key={category.id}
            className="relative group h-full flex items-center"
            onMouseEnter={() => handleMouseEnter(category.name)}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 text-gray-700 font-medium whitespace-nowrap hover:text-red-500 transition py-4 outline-none">
              {category.name}
              <svg className="w-4 h-4 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            <AnimatePresence>
              {activeMenu === category.name && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 15 }}
                  transition={{ duration: 0.2, ease: 'easeOut' }}
                  className="absolute top-[100%] left-1/2 -translate-x-1/2 w-[800px] bg-white shadow-[0_20px_40px_rgba(0,0,0,0.1)] rounded-b-xl border border-gray-100 overflow-hidden origin-top"
                >
                  <div className="flex p-8 gap-8">
                    <div className="flex-1 grid grid-cols-3 gap-8">
                      {category.sections.map((section) => (
                        <div key={section.title}>
                          <h4 className="font-bold text-gray-900 border-b border-gray-100 pb-2 mb-4 tracking-wide uppercase text-sm">
                            {section.title}
                          </h4>
                          <ul className="space-y-3 justify-start items-start text-left">
                            {section.links.map((link) => (
                              <li key={link.slug}>
                                <Link href={`/?category=${link.slug}`} className="text-gray-500 hover:text-red-600 hover:translate-x-1 transition-all duration-200 block text-sm">
                                  {link.name}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        </div>
                      ))}
                    </div>

                    <div className="w-[250px] shrink-0">
                      <div className="relative h-full min-h-[200px] rounded-lg overflow-hidden bg-gray-100 group/image">
                        {category.featuredImage ? (
                          <img
                            src={category.featuredImage}
                            alt={`${category.name} collection`}
                            className="absolute inset-0 w-full h-full object-cover group-hover/image:scale-110 transition duration-700"
                          />
                        ) : (
                          <div className="absolute inset-0 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center px-6 text-center text-sm font-semibold text-gray-500">
                            No products available in this category yet
                          </div>
                        )}
                        <div className="absolute inset-0 bg-black/20 flex justify-center items-end pb-6">
                          <Link href={`/?category=${category.slug}`} className="bg-white/90 backdrop-blur-sm text-gray-900 font-bold px-6 py-2.5 rounded shadow-lg hover:bg-white transition text-sm">
                            Shop {category.name}
                          </Link>
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <Link key={category.id} href={`/?category=${category.slug}`} className="text-gray-700 font-medium whitespace-nowrap hover:text-red-500 transition py-4">
            {category.name}
          </Link>
        )
      ))}

      <Link href="/about" className="text-gray-700 font-medium whitespace-nowrap hover:text-red-500 transition py-4">About</Link>
      <Link href="/contact" className="text-gray-700 font-medium whitespace-nowrap hover:text-red-500 transition py-4">Contact</Link>
    </nav>
  );
}
