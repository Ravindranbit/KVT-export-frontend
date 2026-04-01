'use client';

interface VariantSelectorProps {
  sizes?: string[];
  colors?: { name: string; hex: string }[];
  selectedSize: string;
  setSelectedSize: (s: string) => void;
  selectedColor: string;
  setSelectedColor: (c: string) => void;
}

export default function VariantSelector({
  sizes, colors, selectedSize, setSelectedSize, selectedColor, setSelectedColor
}: VariantSelectorProps) {
  if (!sizes && !colors) return null;

  return (
    <div className="mb-8">
      {/* Colors */}
      {colors && colors.length > 0 && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-900 mb-3">Color</h4>
          <div className="flex gap-3">
            {colors.map((color) => (
              <button
                key={color.name}
                onClick={() => setSelectedColor(color.name)}
                className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center relative ${
                  selectedColor === color.name ? 'border-gray-900 scale-110' : 'border-gray-200 hover:scale-110'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              >
                {/* Inner ring for dark colors to be visible if selected */}
                {selectedColor === color.name && color.hex === '#000000' && (
                  <div className="w-8 h-8 rounded-full border border-white/50" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Sizes */}
      {sizes && sizes.length > 0 && (
        <div>
          <div className="flex justify-between items-center mb-3">
            <h4 className="text-sm font-medium text-gray-900">Size</h4>
            <button className="text-sm text-gray-500 hover:text-gray-900 underline outline-none focus:outline-none">Size Guide</button>
          </div>
          <div className="grid grid-cols-4 gap-3">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={() => setSelectedSize(size)}
                className={`py-3 text-sm font-bold tracking-wider rounded-md border-2 transition-all ${
                  selectedSize === size
                    ? 'border-gray-900 bg-gray-900 text-white shadow-lg transform -translate-y-0.5'
                    : 'border-gray-200 bg-white text-gray-900 hover:border-gray-900'
                }`}
              >
                {size}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
