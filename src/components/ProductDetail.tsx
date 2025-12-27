'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Star } from 'lucide-react';
import { Product } from '../types/product';
import { ProductUtils } from '../lib/productUtils';
import { useCart } from '../context/CartContext';
import BackButton from './BackButton';
import Head from 'next/head';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const router = useRouter();
  const discount = ProductUtils.getDiscountPercentage(product.mrp, product.price);
  const savings = ProductUtils.getSavingsAmount(product.mrp, product.price);
  const { addToCart, cart, updateQuantity, totalItems } = useCart();
  const cartItem = cart.find(item => item.id === product.id);
  const quantity = cartItem ? cartItem.quantity : 0;

  const handleOrderNow = () => {
    if (quantity === 0) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1);
    }
    router.push('/cart');
  };

  const productImage = product.image.startsWith('http') ? product.image : `https://www.thesweettoothbysakina.in${product.image}`;

  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    "name": product.name,
    "description": product.description,
    "image": productImage,
    "brand": {
      "@type": "Brand",
      "name": "The Sweet Tooth by Sakina"
    },
    "category": product.category,
    "offers": {
      "@type": "Offer",
      "price": product.price,
      "priceCurrency": "INR",
      "availability": product.inventory ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      "seller": {
        "@type": "Organization",
        "name": "The Sweet Tooth by Sakina"
      }
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": product.rating,
      "reviewCount": Math.floor(product.rating * 10) // Estimated reviews
    }
  };

  return (
    <>
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(structuredData),
          }}
        />
      </Head>
      <div className="min-h-screen bg-stone-50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <BackButton href="/" productId={product.id} />

          <div className="grid md:grid-cols-2 gap-6 md:gap-12">
          <div className="space-y-6">
            <div className="relative w-full h-[28rem] bg-stone-100 rounded-2xl overflow-hidden">
              {product.image && (
                <div
                  className="absolute inset-0"
                  style={{
                    backgroundImage: `url(${product.image})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    backgroundRepeat: 'no-repeat',
                    filter: 'blur(20px)',
                    transform: 'scale(1.1)'
                  }}
                />
              )}
              {product.image ? (
                <img
                  src={product.image}
                  alt={product.name}
                  className="relative w-full h-full object-contain z-10"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-stone-200">
                  <p className="text-lg text-stone-500">No image available</p>
                </div>
              )}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-20">
                <span className="bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {discount}% OFF
                </span>
                <span className="bg-amber-900 text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg">
                  {product.category}
                </span>
                <span className="bg-white text-amber-900 text-xs font-semibold px-3 py-1 rounded-full shadow-lg">
                  {product.subcategory}
                </span>
              </div>

            </div>
          </div>

          <div className="space-y-6">
            <div>
              <h1 className="text-2xl md:text-4xl font-serif font-bold text-amber-900 mb-2">{product.name}</h1>
              <p className="text-stone-600 text-lg">{product.description}</p>
            </div>

            <div className="flex items-center gap-1">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                />
              ))}
              <span className="text-lg font-medium text-stone-700 ml-2">{product.rating} / 5.0</span>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-4">
                <span className="text-2xl md:text-3xl font-bold text-amber-900">₹{product.price}</span>
                <span className="text-xl text-stone-400 line-through">₹{product.mrp}</span>
                <span className="text-lg font-semibold text-green-600">Save ₹{savings}</span>
              </div>
              <p className="text-stone-600">Limited time offer - {discount}% discount!</p>
            </div>

            <div className="space-y-4">
              {product.inventory ? (
                <>
                  {quantity === 0 ? (
                    <button onClick={() => addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1)} className="w-full bg-amber-800 text-white py-4 rounded-full font-semibold hover:bg-amber-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
                      Add to Cart
                    </button>
                  ) : (
                    <div className="flex items-center justify-between w-full">
                      <button onClick={() => updateQuantity(product.id, quantity - 1)} className="bg-amber-900 text-white py-4 px-6 rounded-full font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
                        -
                      </button>
                      <span className="text-xl font-semibold text-amber-900 bg-stone-100 px-6 py-4 rounded-full transition-all duration-200">{quantity}</span>
                      <button onClick={() => updateQuantity(product.id, quantity + 1)} className="bg-amber-900 text-white py-4 px-6 rounded-full font-semibold hover:bg-amber-800 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg">
                        +
                      </button>
                    </div>
                  )}
                  <button onClick={handleOrderNow} className="w-full bg-white text-amber-900 py-4 rounded-full font-semibold hover:bg-stone-100 transition-all shadow-md border border-stone-200">
                    {quantity > 0 ? 'Go to Cart' : 'Order'}
                  </button>
                </>
              ) : (
                <button className="w-full bg-stone-400 text-stone-600 py-4 rounded-full font-semibold cursor-not-allowed" disabled>
                  Out of Stock
                </button>
              )}
            </div>

            <div className="bg-stone-100 p-4 md:p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-amber-900 mb-3">Product Details</h3>
              <div className="space-y-2 text-sm text-stone-700">
                <p><span className="font-medium">Category:</span> {product.category}</p>
                <p><span className="font-medium">Subcategory:</span> {product.subcategory}</p>
                <p><span className="font-medium">Rating:</span> {product.rating}/5</p>
                <p><span className="font-medium">MRP:</span> ₹{product.mrp}</p>
                <p><span className="font-medium">Price:</span> ₹{product.price}</p>
                <p><span className={`font-medium ${product.inventory ? 'text-green-600' : 'text-red-600'}`}>
                  Availability: {product.inventory ? 'In Stock' : 'Out of Stock'}
                </span></p>
              </div>
              {product.customizationNote && (
                <div className="mt-4 pt-4 border-t border-stone-200">
                  <h4 className="text-md font-semibold text-amber-900 mb-2">Customization Options</h4>
                  <p className="text-sm text-stone-600">{product.customizationNote}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
    </>
  );
};

export default ProductDetail;
