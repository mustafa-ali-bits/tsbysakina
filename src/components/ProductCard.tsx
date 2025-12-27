'use client';

import React from 'react';
import Link from 'next/link';
import { Heart, Star } from 'lucide-react';
import { Product } from '../types/product';
import { ProductUtils } from '../lib/productUtils';
import { useCart } from '../context/CartContext';

interface ProductCardProps {
  product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const discount = ProductUtils.getDiscountPercentage(product.mrp, product.price);
  const savings = ProductUtils.getSavingsAmount(product.mrp, product.price);
  const { addToCart, cart, updateQuantity } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  return (
    <div id={`product-${product.id}`} className="group bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1">
      <div className="relative h-72 overflow-hidden bg-stone-100">
        {product.image ? (
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
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

        <button className="absolute top-4 right-4 p-3 bg-white/90 backdrop-blur-sm rounded-full shadow-lg hover:bg-white transition-all">
          <Heart className="w-5 h-5 text-amber-900" />
        </button>
        
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

      <div className="p-6">
        <div className="flex items-start justify-between mb-2">
          <h3 className="text-xl font-serif font-bold text-amber-900 flex-1">{product.name}</h3>
          <div className="flex items-center gap-1 ml-4">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-4 h-4 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
              />
            ))}
            <span className="text-sm font-medium text-stone-700 ml-1">{product.rating}</span>
          </div>
        </div>
        <p className="text-stone-600 text-sm mb-4 line-clamp-2">{product.description}</p>

        <div className="flex items-center justify-between mb-4">
          <div className="flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-amber-900">₹{product.price}</span>
              <span className="text-sm text-stone-400 line-through">₹{product.mrp}</span>
            </div>
            <span className="text-xs text-green-600 font-semibold">
              You save ₹{savings}
            </span>
          </div>
        </div>

        {product.inventory ? (
          <>
            {quantity === 0 ? (
              <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)} className="w-full bg-amber-800 text-white py-3 rounded-full font-semibold hover:bg-amber-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg mb-2">
                Add to Cart
              </button>
            ) : (
              <div className="flex items-center justify-between mb-2 transition-all duration-300">
                <button onClick={() => updateQuantity(product.id, quantity - 1)} className="bg-amber-900 text-white py-2 px-4 rounded-full font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
                  -
                </button>
                <span className="text-lg font-semibold text-amber-900 bg-stone-100 px-4 py-2 rounded-full transition-all duration-200">{quantity}</span>
                <button onClick={() => updateQuantity(product.id, quantity + 1)} className="bg-amber-900 text-white py-2 px-4 rounded-full font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
                  +
                </button>
              </div>
            )}
            <Link href={`/products/${product.id}`}>
              <button className="w-full bg-amber-900 text-white py-3 rounded-full font-semibold hover:bg-amber-800 transition-all shadow-md hover:shadow-lg">
                View Details
              </button>
            </Link>
          </>
        ) : (
          <button className="w-full bg-stone-400 text-stone-600 py-3 rounded-full font-semibold cursor-not-allowed" disabled>
            Out of Stock
          </button>
        )}
      </div>
    </div>
  );
};

export default ProductCard;
