'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ProductGalleryProps {
  images: string[];
}

export default function ProductGallery({ images }: ProductGalleryProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  return (
    <div className="flex flex-col gap-4">
      {/* Main Image */}
      <div className="flex items-center justify-center overflow-hidden rounded-xl border border-gray-100 bg-white dark:border-gray-800 dark:bg-[#0a0a0a] w-full relative group">
        <AnimatePresence mode="wait">
          <motion.img
            key={currentIndex}
            src={images[currentIndex]}
            alt="Product visual"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className="w-full h-auto object-contain transition-transform duration-700 group-hover:scale-125"
            style={{ cursor: 'zoom-in' }}
          />
        </AnimatePresence>
      </div>

      {/* Thumbnails */}
      <div className="grid grid-cols-4 gap-4">
        {images.map((img, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentIndex(idx)}
            className={`flex items-center justify-center overflow-hidden rounded-lg border-2 transition-all ${
              currentIndex === idx ? 'border-gray-900 border-2 shadow-md transform -translate-y-1' : 'border-transparent opacity-60 hover:opacity-100 border-gray-200'
            }`}
          >
            <img src={img} alt={`Thumbnail ${idx}`} className="w-full h-auto object-contain block" />
          </button>
        ))}
      </div>
    </div>
  );
}
