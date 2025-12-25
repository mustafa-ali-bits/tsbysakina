'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onRefresh: () => void;
  isLoading: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading }) => {
  const { totalItems } = useCart();

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-gradient-to-br from-amber-100 to-stone-200 rounded-full flex items-center justify-center overflow-hidden">
              <img
                src="/header-logo.jpeg"
                alt="The Sweet Tooth by Sakina"
                className="w-full h-full object-cover rounded-full"
              />
            </div>
            <div>
              <h1 className="text-2xl font-serif font-bold text-amber-900">The Sweet Tooth</h1>
              <p className="text-sm text-stone-600 italic">by Sakina</p>
            </div>
          </div>
          <div className="flex items-center gap-6">
            <button
              onClick={onRefresh}
              className="flex items-center gap-2 px-4 py-2 bg-amber-100 text-amber-900 rounded-full hover:bg-amber-200 transition-all text-sm font-medium"
              disabled={isLoading}
            >
              <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
              Refresh
            </button>
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
              <a href="#" className="hover:text-amber-900 transition-colors">Home</a>
              <a href="#products" className="hover:text-amber-900 transition-colors">Products</a>
              <a href="#about" className="hover:text-amber-900 transition-colors">About</a>
              <a href="#contact" className="hover:text-amber-900 transition-colors">Contact</a>
            </nav>
            <Link href="/cart">
              <div className="relative">
                <ShoppingBag className="w-6 h-6 text-amber-900 cursor-pointer hover:text-amber-700 transition-colors" />
                {totalItems > 0 && (
                  <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                    {totalItems}
                  </span>
                )}
              </div>
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
