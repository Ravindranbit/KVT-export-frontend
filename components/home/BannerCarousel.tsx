'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useProductStore } from '../../store/useProductStore';
import { useCategoryStore } from '../../store/useCategoryStore';

// Fallback gradient bg based on index when no colour is set
const BG_GRADIENTS = [
  'from-[#0f2027] to-[#203a43]',
  'from-[#1a1a2e] to-[#16213e]',
  'from-[#1b4332] to-[#2d6a4f]',
  'from-[#3c1053] to-[#6a0572]',
  'from-[#1a1a2e] to-[#2d3561]',
];

const ACCENTS = ['#00d4ff', '#ff6b6b', '#fbbf24', '#34d399', '#a78bfa'];

export default function BannerCarousel() {
  const { products } = useProductStore();
  const { getCategoryNameById } = useCategoryStore();
  const activeBanners = products.slice(0, 3).map((product, index) => ({
    id: product.id,
    title: product.name,
    subtitle: getCategoryNameById(product.categoryId),
    desc: product.description,
    cta: 'View Product',
    href: `/products/${product.id}`,
    accent: ACCENTS[index % ACCENTS.length],
    image: product.image,
  }));

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent((value) => (value + 1) % Math.max(activeBanners.length, 1)), [activeBanners.length]);
  const prev = useCallback(() => setCurrent((value) => (value - 1 + Math.max(activeBanners.length, 1)) % Math.max(activeBanners.length, 1)), [activeBanners.length]);

  useEffect(() => {
    if (current >= activeBanners.length && activeBanners.length > 0) {
      setCurrent(0);
    }
  }, [activeBanners.length, current]);

  useEffect(() => {
    if (paused || activeBanners.length <= 1) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next, activeBanners.length]);

  if (activeBanners.length === 0) {
    return (
      <div className="w-full flex items-center justify-center bg-gradient-to-br from-gray-900 to-gray-800 text-white" style={{ height: '420px' }}>
        <div className="text-center opacity-40">
          <p className="text-2xl font-bold">No products available</p>
          <p className="text-sm mt-2">Add products in the backend to populate the storefront</p>
        </div>
      </div>
    );
  }

  const banner = activeBanners[current];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: '420px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {activeBanners.map((item, index) => {
        const bg = BG_GRADIENTS[index % BG_GRADIENTS.length];
        const accent = item.accent;
        return (
          <div
            key={item.id}
            className={`absolute inset-0 bg-gradient-to-br ${bg} transition-all duration-700 ease-in-out`}
            style={{ opacity: index === current ? 1 : 0, zIndex: index === current ? 1 : 0 }}
          >
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: accent }} />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: accent }} />
            </div>

            <div className="max-w-7xl mx-auto h-full flex items-center px-10 gap-10">
              <div className="flex-1 text-white">
                <h2 className="text-5xl font-extrabold leading-[1.15] mb-2 tracking-tight">{item.title}</h2>
                <p className="text-xl font-bold mb-4" style={{ color: accent }}>{item.subtitle}</p>
                {item.desc && <p className="text-gray-300 text-sm font-medium mb-8 max-w-sm leading-relaxed">{item.desc}</p>}
                <div className="flex items-center gap-4">
                  <Link
                    href={item.href}
                    className="text-white font-extrabold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 shadow-lg active:scale-95 hover:shadow-xl"
                    style={{ backgroundColor: accent }}
                  >
                    {item.cta} →
                  </Link>
                </div>
              </div>

              {item.image && (
                <div className="relative w-[420px] shrink-0 flex-col items-center justify-center hidden md:flex">
                  <div className="w-[380px] h-[340px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                    <img src={item.image} alt={item.subtitle} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {activeBanners.length > 1 && (
        <button
          onClick={prev}
          className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      )}

      {activeBanners.length > 1 && (
        <button
          onClick={next}
          className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>
      )}

      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrent(index)}
              className="transition-all rounded-full"
              style={{
                width: index === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: index === current ? banner.accent : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
