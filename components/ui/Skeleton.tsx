'use client';

interface SkeletonProps {
  className?: string;
  variant?: 'rect' | 'circle' | 'text';
}

export default function Skeleton({ className = '', variant = 'rect' }: SkeletonProps) {
  const baseClasses = "animate-pulse bg-gray-200 dark:bg-gray-800";
  const variantClasses = {
    rect: "rounded-lg",
    circle: "rounded-full",
    text: "rounded h-4 w-full"
  };

  return (
    <div 
      className={`${baseClasses} ${variantClasses[variant]} ${className} relative overflow-hidden`}
    >
      <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent" />
    </div>
  );
}
