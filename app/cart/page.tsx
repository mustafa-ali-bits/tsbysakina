'use client';

import React from 'react';
import Link from 'next/link';
import { useCart } from '../../src/context/CartContext';
import { Trash2, Plus, Minus } from 'lucide-react';

const CartPage: React.FC = () => {
  const { cart, updateQuantity, removeFromCart, totalItems } = useCart();

  const subtotal = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const tax = subtotal * 0.1; // 10% tax
  const deliveryFee = subtotal > 500 ? 0 : 50; // Free delivery over ₹500
  const total = subtotal + tax + deliveryFee;

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-stone-50 py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">
            <h1 className="text-3xl font-serif font-bold text-amber-900 mb-8">Your Cart</h1>
            <div className="bg-white rounded-2xl shadow-md p-12">
              <div className="text-stone-400 mb-6">
                <svg className="w-24 h-24 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <h2 className="text-xl font-semibold text-stone-600 mb-4">Your cart is empty</h2>
              <p className="text-stone-500 mb-8">Add some delicious items to get started!</p>
              <Link href="/">
                <button className="bg-amber-800 text-white px-8 py-3 rounded-full font-semibold hover:bg-amber-700 transition-all shadow-md hover:shadow-lg">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="mb-8">
          <Link href="/">
            <button className="flex items-center gap-2 text-amber-900 hover:text-amber-700 transition-colors mb-4">
              ← Continue Shopping
            </button>
          </Link>
          <h1 className="text-3xl font-serif font-bold text-amber-900">Your Cart ({totalItems} items)</h1>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <div key={item.id} className="bg-white rounded-2xl shadow-md p-6">
                <div className="flex items-center gap-6">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-20 h-20 object-cover rounded-xl"
                  />
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-amber-900 mb-1">{item.name}</h3>
                    <p className="text-stone-600 text-sm mb-3">₹{item.price} each</p>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center bg-stone-100 rounded-full">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 text-amber-900 hover:bg-amber-100 rounded-full transition-colors"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="px-4 py-2 text-amber-900 font-semibold">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 text-amber-900 hover:bg-amber-100 rounded-full transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-amber-900">₹{item.price * item.quantity}</p>
                    <p className="text-sm text-stone-500">₹{item.price} × {item.quantity}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-2xl shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-serif font-bold text-amber-900 mb-6">Order Summary</h2>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-stone-600">
                  <span>Subtotal ({totalItems} items)</span>
                  <span>₹{subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Tax (10%)</span>
                  <span>₹{tax.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-stone-600">
                  <span>Delivery Fee</span>
                  <span className={deliveryFee === 0 ? 'text-green-600' : ''}>
                    {deliveryFee === 0 ? 'FREE' : `₹${deliveryFee}`}
                  </span>
                </div>
                {subtotal < 500 && (
                  <p className="text-xs text-stone-500">
                    Add ₹{(500 - subtotal).toFixed(2)} more for free delivery
                  </p>
                )}
              </div>

              <div className="border-t border-stone-200 pt-4 mb-6">
                <div className="flex justify-between text-xl font-bold text-amber-900">
                  <span>Total</span>
                  <span>₹{total.toFixed(2)}</span>
                </div>
              </div>

              <button className="w-full bg-amber-800 text-white py-3 rounded-full font-semibold hover:bg-amber-700 active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg mb-3">
                Proceed to Checkout
              </button>

              <Link href="/">
                <button className="w-full bg-stone-100 text-stone-700 py-3 rounded-full font-semibold hover:bg-stone-200 transition-all">
                  Continue Shopping
                </button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CartPage;
