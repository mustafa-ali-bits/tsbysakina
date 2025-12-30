'use client';

import React from 'react';
import Link from 'next/link';
import { RefreshCw, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import { useCart } from '../context/CartContext';

interface HeaderProps {
  onRefresh?: () => void;
  isLoading?: boolean;
}

const Header: React.FC<HeaderProps> = ({ onRefresh, isLoading }) => {
  const { totalItems } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <Link href="/">
              <img
                src="/Gemini_Generated_Image_h11okvh11okvh11o.png"
                alt="Logo"
                className="w-52 h-20 object-contain cursor-pointer"
              />
            </Link>
          </div>
          <div className="flex items-center gap-6">
            <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-stone-700">
              <Link href="/" className="hover:text-amber-900 transition-colors">Home</Link>
              <a href="#products" className="hover:text-amber-900 transition-colors">Products</a>
              <a href="#about" className="hover:text-amber-900 transition-colors">About</a>
              <a href="#contact" className="hover:text-amber-900 transition-colors">Contact</a>
            </nav>
            <Link href="/cart">
              <div className="relative" data-cart-icon>
                <ShoppingBag className="w-6 h-6 text-amber-900 cursor-pointer hover:text-amber-700 transition-colors" />
                {totalItems > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    key={totalItems} // Re-animate on change
                    className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center"
                  >
                    {totalItems}
                  </motion.span>
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
