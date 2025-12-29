'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FiShoppingCart, FiCheck } from 'react-icons/fi';

interface AnimatedAddToCartButtonProps {
  onClick: (e?: React.MouseEvent) => void;
  className?: string;
  children?: React.ReactNode;
  disabled?: boolean;
}

const AnimatedAddToCartButton: React.FC<AnimatedAddToCartButtonProps> = ({
  onClick,
  className = '',
  children,
  disabled = false
}) => {
  const [phase, setPhase] = useState<'idle' | 'loading' | 'sliding' | 'success'>('idle');

  function handleClick(e: React.MouseEvent) {
    if (disabled || phase !== 'idle') return;

    // Stop event propagation to prevent card click
    e.stopPropagation();

    // Start the sequence
    setPhase('loading');
    onClick(e);

    // Move to sliding phase after short delay
    setTimeout(() => setPhase('sliding'), 600);

    // Move to success phase
    setTimeout(() => setPhase('success'), 1200);

    // Reset to idle
    setTimeout(() => setPhase('idle'), 2500);
  }

  return (
    <motion.button
      className={`relative flex items-center justify-center px-4 py-2 bg-amber-800 text-white rounded-full font-semibold overflow-hidden hover:bg-amber-700 transition-colors ${className}`}
      onClick={handleClick}
      initial={false}
      disabled={disabled || phase !== 'idle'}
    >
      {/* Idle State */}
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.span
            key="idle"
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <FiShoppingCart size={16} />
            {children || 'Add to Cart'}
          </motion.span>
        )}

        {/* Loading State */}
        {phase === 'loading' && (
          <motion.span
            key="loading"
            className="flex items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            ...
          </motion.span>
        )}

        {/* Sliding Cart */}
        {phase === 'sliding' && (
          <motion.div
            key="sliding"
            className="flex items-center justify-center w-full h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              initial={{ x: -80, opacity: 0 }}
              animate={{ x: 80, opacity: 1 }}
              transition={{ duration: 0.8, ease: "easeInOut" }}
              className="flex items-center justify-center"
            >
              <FiShoppingCart size={28} className="text-white" />
            </motion.div>
          </motion.div>
        )}

        {/* Success State */}
        {phase === 'success' && (
          <motion.span
            key="success"
            className="flex items-center gap-2"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.3 }}
          >
            <FiCheck size={16} />
            Added
          </motion.span>
        )}
      </AnimatePresence>
    </motion.button>
  );
};

export default AnimatedAddToCartButton;
