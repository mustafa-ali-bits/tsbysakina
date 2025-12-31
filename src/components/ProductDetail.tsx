'use client';

import React from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Star, Plus, Minus, ShoppingCart } from 'lucide-react';
import { Product } from '../types/product';
import { ProductUtils } from '../lib/productUtils';
import { useCart } from '../context/CartContext';
import BackButton from './BackButton';
import VariantSelector from './VariantSelector';
import AnimatedAddToCartButton from './AnimatedAddToCartButton';
import { DEFAULT_VARIANT } from '../lib/constants';

interface ProductDetailProps {
  product: Product;
}

const ProductDetail: React.FC<ProductDetailProps> = ({ product }) => {
  const router = useRouter();
  const discount = ProductUtils.getDiscountPercentage(product.mrp, product.price);
  const savings = ProductUtils.getSavingsAmount(product.mrp, product.price);
  const { addToCart } = useCart();
  const [selectedVariant, setSelectedVariant] = React.useState(DEFAULT_VARIANT);
  const [quantity, setQuantity] = React.useState(1);
  const [imageError, setImageError] = React.useState(false);

  const handleOrderNow = () => {
    if (quantity === 0) {
      addToCart({ id: product.id, name: product.name, price: product.price, image: product.image }, 1);
    }
    router.push('/cart');
  };

  const handleImageError = () => {
    if (!imageError) {
      setImageError(true);
    }
  };

  const fallbackImage = 'https://images.unsplash.com/photo-1548907040-4baa42d10919?w=400';
  const displayImage = imageError ? fallbackImage : product.image;

  return (
    <>
      <div className="min-h-screen bg-stone-50 w-full overflow-x-hidden">
        <div className="max-w-7xl mx-auto px-4 py-8 w-full">
          <BackButton href="/" productId={product.id} />

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            <div className="space-y-4">
              <div className="relative w-full h-[28rem] bg-stone-100 rounded-2xl overflow-hidden">
                {!imageError && product.image && (
                  <div
                    className="absolute inset-0"
                    style={{
                      backgroundImage: `url(${displayImage})`,
                      backgroundSize: 'cover',
                      backgroundPosition: 'center',
                      backgroundRepeat: 'no-repeat',
                      filter: 'blur(20px)',
                      transform: 'scale(1.1)'
                    }}
                  />
                )}
                {displayImage ? (
                  <Image
                    src={displayImage}
                    alt={product.name}
                    fill
                    priority
                    sizes="(max-width: 768px) 100vw, 50vw"
                    className="relative object-contain z-10"
                    onError={handleImageError}
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

                {/* Vegetarian Symbol */}
                <div className="absolute top-4 right-4 z-20">
                  <img
                    src="/Veg_symbol.png"
                    alt="Vegetarian"
                    className="w-10 h-10 shadow-lg"
                  />
                </div>

              </div>
            </div>

            <div className="space-y-2">
              <div>
                <h1 className="text-lg md:text-2xl font-serif font-bold text-amber-900 leading-tight">{product.name}</h1>
                <p className="text-stone-600 text-sm md:text-base leading-tight mt-1">{product.description}</p>
              </div>

              <div className="flex items-center justify-between">
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="text-xl md:text-2xl font-bold text-amber-900">₹{product.price}</span>
                    <span className="text-sm text-stone-400 line-through">₹{product.mrp}</span>
                  </div>
                  <p className="text-xs text-green-600 font-medium">Save ₹{savings} ({discount}% off)</p>
                </div>
                <div className="flex items-center gap-1">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-stone-300'}`}
                    />
                  ))}
                  <span className="text-sm font-medium text-stone-700 ml-1">{product.rating}</span>
                </div>
              </div>

              <div className="space-y-4">
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

                    {/* Quantity Selector */}
                    <div className="mb-3">
                      <div className="flex items-center justify-center gap-4">
                        <label className="text-sm font-medium text-stone-700">Quantity</label>
                        <div className="flex items-center gap-3">
                          <button
                            onClick={() => setQuantity(Math.max(1, quantity - 1))}
                            className="w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-xl font-bold text-amber-900 min-w-[2.5rem] text-center">
                            {quantity}
                          </span>
                          <button
                            onClick={() => setQuantity(quantity + 1)}
                            className="w-10 h-10 bg-stone-100 hover:bg-stone-200 text-stone-600 rounded-full flex items-center justify-center transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <AnimatedAddToCartButton
                        onClick={() => {
                          addToCart(
                            { id: product.id, name: product.name, price: product.price, image: product.image },
                            quantity,
                            product.category === 'Chocolates' ? selectedVariant : undefined
                          );
                          router.push('/cart');
                        }}
                        className="w-full py-2 md:py-3 text-sm md:text-base"
                      >
                        Order Now 🚀
                      </AnimatedAddToCartButton>
                      <AnimatedAddToCartButton
                        onClick={() => {
                          addToCart(
                            { id: product.id, name: product.name, price: product.price, image: product.image },
                            quantity,
                            product.category === 'Chocolates' ? selectedVariant : undefined
                          );
                        }}
                        className="w-full py-2 md:py-3 bg-amber-600 text-white border-2 border-amber-500 text-sm md:text-base"
                      >
                        <ShoppingCart className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        Add to Cart
                      </AnimatedAddToCartButton>
                    </div>
                  </>
                ) : (
                  <button className="w-full bg-stone-400 text-stone-600 py-4 rounded-full font-semibold cursor-not-allowed" disabled>
                    Out of Stock
                  </button>
                )}
              </div>

              <div className="bg-stone-100 p-3 md:p-4 rounded-xl">
                <h3 className="text-base font-semibold text-amber-900 mb-2">Product Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-stone-700">
                  <p><span className="font-medium">Category:</span> {product.category}</p>
                  <p><span className="font-medium">Rating:</span> {product.rating}/5</p>
                  <p><span className="font-medium">Subcategory:</span> {product.subcategory}</p>
                  <p><span className="font-medium">Price:</span> ₹{product.price}</p>
                  <p><span className="font-medium">MRP:</span> ₹{product.mrp}</p>
                  <p><span className={`font-medium ${product.inventory ? 'text-green-600' : 'text-red-600'}`}>
                    {product.inventory ? 'In Stock' : 'Out of Stock'}
                  </span></p>
                </div>
                {product.customizationNote && (
                  <div className="mt-2">
                    <p className="text-xs text-stone-500 italic">{product.customizationNote}</p>
                  </div>
                )}
              </div>

              {product.storageCare && (
                <div className="bg-amber-50 p-3 md:p-4 rounded-xl border border-amber-200">
                  <h3 className="text-base font-semibold text-amber-900 mb-2">Storage & Care</h3>
                  <div className="text-sm text-stone-700 whitespace-pre-line leading-relaxed">
                    {product.storageCare}
                  </div>
                </div>
              )}

              {product.shelfLife && (
                <div className="bg-amber-50 p-3 md:p-4 rounded-xl border border-amber-200">
                  <h3 className="text-base font-semibold text-amber-900 mb-2">Shelf Life</h3>
                  <p className="text-sm text-stone-700">{product.shelfLife} days</p>
                </div>
              )}
            </div>
          </div>
        </div>


      </div>
    </>
  );
};

export default ProductDetail;
