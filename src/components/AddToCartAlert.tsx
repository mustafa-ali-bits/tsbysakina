'use client';

import React, { useEffect } from 'react';

interface AddToCartAlertProps {
  productName: string;
  variant?: string;
  quantity: number;
  show: boolean;
  productImage?: string;
  onClose: () => void;
}

const AddToCartAlert: React.FC<AddToCartAlertProps> = ({
  productName,
  variant,
  quantity,
  show,
  productImage,
  onClose
}) => {
  useEffect(() => {
    if (show) {
      const timer = setTimeout(() => {
        onClose();
      }, 2000); // 2 seconds

      return () => clearTimeout(timer);
    }
  }, [show, onClose]);

  if (!show) return null;

  return (
    <div className="fixed top-4 right-4 z-50 animate-in slide-in-from-right-2 fade-in duration-500">
      <div className="bg-gradient-to-r from-emerald-500 to-green-600 text-white px-6 py-4 rounded-2xl shadow-xl border border-emerald-400/20 backdrop-blur-sm flex items-center gap-4 max-w-sm">
        {productImage && (
          <div className="flex-shrink-0 w-12 h-12 rounded-xl overflow-hidden border-2 border-white/30">
            <img
              src={productImage}
              alt={productName}
              className="w-full h-full object-cover"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                const parent = target.parentElement;
                if (parent) {
                  parent.innerHTML = `
                    <div class="w-full h-full bg-white/20 rounded-xl flex items-center justify-center">
                      <svg class="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                      </svg>
                    </div>
                  `;
                }
              }}
            />
          </div>
        )}
        <div className="flex-1">
          <p className="font-bold text-lg mb-1">Added to Cart! 🎉</p>
          <p className="text-sm opacity-95 font-medium">
            {productName}
            {variant && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold ml-2">
                {variant}
              </span>
            )}
            {quantity > 1 && (
              <span className="bg-white/20 px-2 py-1 rounded-full text-xs font-semibold ml-2">
                × {quantity}
              </span>
            )}
          </p>
        </div>
        <button
          onClick={onClose}
          className="flex-shrink-0 w-6 h-6 bg-white/20 hover:bg-white/30 rounded-full flex items-center justify-center transition-colors duration-200 ml-2"
        >
          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
            <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
          </svg>
        </button>
      </div>
    </div>
  );
};

export default AddToCartAlert;
