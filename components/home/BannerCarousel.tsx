'use client';

import { useState, useEffect, useCallback } from 'react';
import Link from 'next/link';
import { useAdminStore } from '../../store/useAdminStore';

// Fallback gradient bg based on index when no colour is set
const BG_GRADIENTS = [
  'from-[#0f2027] to-[#203a43]',
  'from-[#1a1a2e] to-[#16213e]',
  'from-[#1b4332] to-[#2d6a4f]',
  'from-[#3c1053] to-[#6a0572]',
  'from-[#1a1a2e] to-[#2d3561]',
];

export default function BannerCarousel() {
  const { banners } = useAdminStore();
  // Only show active banners
  const activeBanners = banners.filter(b => b.active !== false);

  const [current, setCurrent] = useState(0);
  const [paused, setPaused] = useState(false);

  const next = useCallback(() => setCurrent(c => (c + 1) % Math.max(activeBanners.length, 1)), [activeBanners.length]);
  const prev = useCallback(() => setCurrent(c => (c - 1 + Math.max(activeBanners.length, 1)) % Math.max(activeBanners.length, 1)), [activeBanners.length]);

  // Reset slide index if banners change and current is out of bounds
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
          <p className="text-2xl font-bold">No Active Banners</p>
          <p className="text-sm mt-2">Add banners in the Admin → Banners section</p>
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
      {/* Slides */}
      {activeBanners.map((b, i) => {
        const bg = BG_GRADIENTS[i % BG_GRADIENTS.length];
        const accent = b.accent || '#e60000';
        return (
          <div
            key={b.id}
            className={`absolute inset-0 bg-gradient-to-br ${bg} transition-all duration-700 ease-in-out`}
            style={{ opacity: i === current ? 1 : 0, zIndex: i === current ? 1 : 0 }}
          >
            {/* Glow effect */}
            <div className="absolute inset-0 overflow-hidden">
              <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] rounded-full opacity-20 blur-[120px]" style={{ backgroundColor: accent }} />
              <div className="absolute bottom-0 right-0 w-[300px] h-[300px] rounded-full opacity-10 blur-[80px]" style={{ backgroundColor: accent }} />
            </div>

            <div className="max-w-7xl mx-auto h-full flex items-center px-10 gap-10">
              {/* Left Content */}
              <div className="flex-1 text-white">
                <h2 className="text-5xl font-extrabold leading-[1.15] mb-2 tracking-tight">{b.title}</h2>
                <p className="text-xl font-bold mb-4" style={{ color: accent }}>{b.subtitle}</p>
                {b.desc && <p className="text-gray-300 text-sm font-medium mb-8 max-w-sm leading-relaxed">{b.desc}</p>}
                {(b.cta || b.href) && (
                  <div className="flex items-center gap-4">
                    <Link
                      href={b.href || '/'}
                      className="text-white font-extrabold px-8 py-3.5 rounded-lg text-sm transition-all duration-200 hover:-translate-y-0.5 hover:scale-105 shadow-lg active:scale-95 hover:shadow-xl"
                      style={{ backgroundColor: accent }}
                    >
                      {b.cta || 'Shop Now'} →
                    </Link>
                  </div>
                )}
              </div>

              {/* Right — Product Image */}
              {b.image && (
                <div className="relative w-[420px] shrink-0 flex-col items-center justify-center hidden md:flex">
                  <div className="w-[380px] h-[340px] rounded-2xl overflow-hidden shadow-2xl border-4 border-white/10">
                    <img src={b.image} alt={b.subtitle} className="w-full h-full object-cover object-top" />
                  </div>
                </div>
              )}
            </div>
          </div>
        );
      })}

      {/* Left Arrow */}
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

      {/* Right Arrow */}
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

      {/* Dot Indicators */}
      {activeBanners.length > 1 && (
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
          {activeBanners.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrent(i)}
              className="transition-all rounded-full"
              style={{
                width: i === current ? '24px' : '8px',
                height: '8px',
                backgroundColor: i === current ? (banner.accent || '#e60000') : 'rgba(255,255,255,0.4)',
              }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
