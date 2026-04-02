'use client';
import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = useCallback(() => setCurrentIndex(i => (i + 1) % images.length), [images.length]);
  const prev = useCallback(() => setCurrentIndex(i => (i - 1 + images.length) % images.length), [images.length]);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="relative flex items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white w-full group aspect-square">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Product visual"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-full object-contain transition-transform duration-500 group-hover:scale-110"
            style={{ cursor: 'zoom-in' }}
          />
        </AnimatePresence>

        {/* Left Arrow */}
        <button
          onClick={prev}
          className="absolute left-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-10 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>

        {/* Right Arrow */}
        <button
          onClick={next}
          className="absolute right-3 top-1/2 -translate-y-1/2 w-10 h-10 bg-white/80 hover:bg-white text-gray-700 rounded-full flex items-center justify-center transition-all duration-200 shadow-md opacity-0 group-hover:opacity-100 hover:scale-110 active:scale-95 z-10 backdrop-blur-sm"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
          </svg>
        </button>

        {/* Image counter */}
        <div className="absolute bottom-3 right-3 bg-black/50 text-white text-[10px] font-bold px-2.5 py-1 rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity">
          {currentIndex + 1} / {images.length}
        </div>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-3">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`aspect-square overflow-hidden rounded-lg border-2 transition-all duration-200 ${
              currentIndex === idx 
                ? 'border-gray-900 shadow-md -translate-y-0.5' 
                : 'border-gray-200 opacity-60 hover:opacity-100 hover:border-gray-400 hover:scale-105'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
    </div>
  );
}
