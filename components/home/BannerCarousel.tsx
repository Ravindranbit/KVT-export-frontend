'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';

const BANNERS = [
  {
    id: 1,
    bg: 'from-[#0f2027] to-[#203a43]',
    accent: '#00d4ff',
    tag: '⚡ Best Deals',
    title: 'Up to 60% Off',
    subtitle: 'Electronics & Gadgets',
    desc: 'Smartphones, laptops, headphones & more — top brands at unbeatable prices.',
    cta: 'Shop Electronics',
    href: '/?category=electronics',
    image: 'https://images.unsplash.com/photo-1498049794561-7780e7231661?q=80&w=600',
    badge: '60% OFF',
    badgeBg: '#00d4ff',
    extra: 'Free Delivery',
  },
  {
    id: 2,
    bg: 'from-[#1a1a2e] to-[#16213e]',
    accent: '#e94560',
    tag: '🔥 Flash Sale',
    title: 'Buy 2 Get 1 Free',
    subtitle: 'Fashion & Accessories',
    desc: 'Mix & match 500+ styles for men and women — limited stock!',
    cta: 'Shop Fashion',
    href: '/?category=fashion',
    image: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?q=80&w=800',
    badge: 'B2G1',
    badgeBg: '#e94560',
    extra: '1200+ Sold Today',
  },
  {
    id: 3,
    bg: 'from-[#1b4332] to-[#2d6a4f]',
    accent: '#52b788',
    tag: '🏡 Home Makeover',
    title: 'Flat 35% Off',
    subtitle: 'Home & Living',
    desc: 'Furniture, décor, kitchen essentials — transform your space today.',
    cta: 'Shop Home',
    href: '/?category=home',
    image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=600',
    badge: '35% OFF',
    badgeBg: '#52b788',
    extra: 'Free Shipping',
  },
  {
    id: 4,
    bg: 'from-[#3c1053] to-[#6a0572]',
    accent: '#ff6bcb',
    tag: '💄 Beauty Special',
    title: 'Up to 50% Off',
    subtitle: 'Beauty & Personal Care',
    desc: 'Skincare, makeup, grooming essentials — all your favourites in one place.',
    cta: 'Shop Beauty',
    href: '/?category=beauty',
    image: 'https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?q=80&w=600',
    badge: '50% OFF',
    badgeBg: '#ff6bcb',
    extra: 'Authentic Products',
  },
];


export default function BannerCarousel() {
  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % BANNERS.length), []);
  const prev = useCallback(() => setCurrent(c => (c - 1 + BANNERS.length) % BANNERS.length), []);

  useEffect(() => {
    if (paused) return;
    const id = setInterval(next, 4500);
    return () => clearInterval(id);
  }, [paused, next]);

  const banner = BANNERS[current];

  return (
    <div
      className="relative w-full overflow-hidden select-none"
      style={{ height: '420px' }}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* Slides */}
      {BANNERS.map((b, i) => (
        <div
          key={b.id}
          className={`absolute inset-0 bg-gradient-to-br ${b.bg} transition-all duration-700 ease-in-out`}
          style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
        >
          {/* Glow effect */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: b.accent }} />
            <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: b.accent }} />
          </div>
          <div className="max-w-7xl mx-auto h-full flex items-center px-10 gap-10">
            {/* Left Content */}
            <div className="flex-1 text-white">
              <h2 className="text-5xl font-extrabold leading-[1.15] mb-2 tracking-tight">{b.title}</h2>
              <p className="text-xl font-bold mb-4" style={{ color: b.accent }}>{b.subtitle}</p>
              <p className="text-gray-300 text-sm font-medium mb-8 max-w-sm leading-relaxed">{b.desc}</p>
              <div className="flex items-center gap-4">
                <Link
                  href={b.href}
                  className="text-white font-extrabold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 shadow-lg active:scale-95 hover:shadow-xl"
                  style={{ backgroundColor: b.accent }}
                >
                  {b.cta} →
                </Link>
                <span className="text-gray-400 text-xs font-semibold flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full animate-pulse inline-block" style={{ backgroundColor: b.accent }} />
                  {b.extra}
                </span>
              </div>
            </div>

            {/* Right — Product Image */}
            <div className="relative w-[420px] shrink-0 flex-col items-center justify-center hidden md:flex">
              <div className="w-[380px] h-[340px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                <img src={b.image} alt={b.subtitle} className="w-full h-full object-cover object-top" />
              </div>
            </div>
          </div>
        </div>
      ))}

      {/* Left Arrow */}
      <button
        onClick={prev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
        </svg>
      </button>

      {/* Right Arrow */}
      <button
        onClick={next}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 bg-white/15 hover:bg-white/30 text-white rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
        </svg>
      </button>

      {/* Dot Indicators */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {BANNERS.map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrent(i)}
            className="transition-all rounded-full"
            style={{
              width: i === current ? '24px' : '8px',
              height: '8px',
              backgroundColor: i === current ? banner.accent : 'rgba(255,255,255,0.4)',
            }}
          />
        ))}
      </div>
    </div>
  );
}
