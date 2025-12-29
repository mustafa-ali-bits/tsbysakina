import React from 'react';
import { CHOCOLATE_VARIANTS } from '../lib/constants';

interface VariantSelectorProps {
  selectedVariant: string;
  onVariantChange: (variant: string) => void;
  compact?: boolean;
}

const VariantSelector: React.FC<VariantSelectorProps> = ({
  selectedVariant,
  onVariantChange,
  compact = false
}) => {
  const selectedIndex = CHOCOLATE_VARIANTS.indexOf(selectedVariant as typeof CHOCOLATE_VARIANTS[number]);

  // No icons needed

  return (
    <div className="relative bg-stone-100 rounded-xl shadow-sm p-1">
      {/* Animated Background Slider */}
      <div
        className="absolute top-1 bottom-1 bg-gradient-to-r from-amber-600 to-amber-800 rounded-lg transition-all duration-300 ease-out shadow-md"
        style={{
          left: `${(selectedIndex * 100) / 3}%`,
          width: `${100 / 3}%`,
        }}
      />

      {/* Options */}
      <div className="relative flex">
        {CHOCOLATE_VARIANTS.map((variant, index) => (
          <button
            key={variant}
            onClick={(e) => {
              e.stopPropagation(); // Prevent card click when selecting variant
              onVariantChange(variant);
            }}
            className={`flex-1 py-3 px-4 rounded-lg font-semibold transition-all duration-300 flex items-center justify-center ${
              selectedIndex === index
                ? 'text-white scale-105'
                : 'text-stone-600 hover:text-stone-800'
            } ${compact ? 'text-xs px-2 py-2' : 'text-sm'}`}
          >
            {compact ? variant.split(' ')[0] : variant}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VariantSelector;
