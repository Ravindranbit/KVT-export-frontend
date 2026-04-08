import Skeleton from '../ui/Skeleton';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-white">
      {/* Header Skeleton */}
      <div className="border-b border-gray-100 bg-white/80 backdrop-blur-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Skeleton className="h-8 w-32" />
          <div className="hidden md:flex gap-8">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-20" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-10" variant="circle" />
            <Skeleton className="h-10 w-10" variant="circle" />
          </div>
        </div>
      </div>

      {/* Hero Skeleton */}
      <div className="max-w-7xl mx-auto px-4 pt-12">
        <Skeleton className="h-[450px] w-full rounded-[40px]" />
      </div>

      {/* Products Grid Skeleton */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="space-y-4">
              <Skeleton className="aspect-square w-full rounded-[32px]" />
              <div className="space-y-2 px-2">
                <Skeleton className="h-4 w-3/4" variant="text" />
                <Skeleton className="h-4 w-1/2" variant="text" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
