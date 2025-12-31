'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Product } from '../types/product';
import { ProductUtils } from '../lib/productUtils';
import { useCart } from '../context/CartContext';
import VariantSelector from './VariantSelector';
import AnimatedAddToCartButton from './AnimatedAddToCartButton';
import { DEFAULT_VARIANT } from '../lib/constants';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = ProductUtils.getDiscountPercentage(product.mrp, product.price);
  const savings = ProductUtils.getSavingsAmount(product.mrp, product.price);
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = React.useState(DEFAULT_VARIANT);
  const [imageError, setImageError] = React.useState(false);
  const [isLoaded, setIsLoaded] = React.useState(false);
  const router = useRouter();

  const fallbackImage = 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400';
  const displayImage = imageError ? fallbackImage : product.image;

  return (
    <div id={`product-${product.id}`} className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer" onClick={() => router.push(`/products/${product.id}`)}>
      <div className="relative h-80 md:h-96 overflow-hidden bg-stone-100">
        {displayImage ? (
          <Image
            src={displayImage}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            onLoad={() => setIsLoaded(true)}
            className={`object-cover group-hover:scale-110 transition-all duration-700 ${isLoaded ? 'opacity-100' : 'opacity-0'}`}
            onError={() => !imageError && setImageError(true)}
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-stone-200">
            <div className="text-center text-stone-400">
              <svg className="w-16 h-16 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <p className="text-sm">No image</p>
            </div>
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>

        {!product.inventory && (
          <div className="absolute inset-0 bg-stone-500/50 backdrop-blur-sm flex items-center justify-center">
            <span className="text-white font-bold text-lg bg-stone-800/80 px-4 py-2 rounded-lg">
              Out of Stock
            </span>
          </div>
        )}

        {/* Vegetarian Symbol */}
        <div className="absolute top-4 right-4">
          <img
            src="/Veg_symbol.png"
            alt="Vegetarian"
            className="w-8 h-8 shadow-lg"
          />
        </div>

        <div className="absolute top-4 left-4 flex flex-col gap-2">
          <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {discount}% OFF
          </span>
          <span className="bg-amber-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
            {product.category}
          </span>
          <span className="bg-white text-amber-900 text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
            {product.subcategory}
          </span>
          {!product.inventory && (
            <span className="bg-stone-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
              Out of Stock
            </span>
          )}
        </div>
      </div>

      <div className="p-2 md:p-3">
        <div className="flex items-start justify-between mb-1">
          <h3 className="text-lg font-serif font-bold text-amber-900 flex-1 leading-tight">{product.name}</h3>
          <div className="flex items-center gap-1 ml-2">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
              />
            ))}
            <span className="text-xs font-medium text-stone-700 ml-1">{product.rating}</span>
          </div>
        </div>
        <p className="text-stone-600 text-xs mb-2 line-clamp-2 leading-tight">{product.description}</p>

        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <span className="text-xl font-bold text-amber-900">₹{product.price}</span>
            <span className="text-xs text-stone-400 line-through">₹{product.mrp}</span>
            <span className="text-xs text-green-600 font-semibold">
              Save ₹{savings}
            </span>
          </div>
        </div>

        {product.inventory ? (
          <>
            {product.category === 'Chocolates' && (
              <div className="mb-3">
                <VariantSelector
                  selectedVariant={selectedVariant}
                  onVariantChange={setSelectedVariant}
                  compact={true}
                />
              </div>
            )}
            <AnimatedAddToCartButton
              onClick={() => {
                addToCart(
                  { id: product.id, name: product.name, price: product.price, image: product.image },
                  1,
                  product.category === 'Chocolates' ? selectedVariant : undefined
                );
              }}
              className="w-full py-2 rounded-full mb-1 text-sm"
            />
            <Link href={`/products/${product.id}`}>
              <button className="w-full bg-amber-900 text-white py-2 rounded-full font-semibold hover:bg-amber-800 transition-all shadow-md hover:shadow-lg text-sm" onClick={(e) => e.stopPropagation()}>
                View Details
              </button>
            </Link>
          </>
        ) : (
          <button className="w-full bg-stone-400 text-stone-600 py-2 rounded-full font-semibold cursor-not-allowed text-sm" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
