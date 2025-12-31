'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface CartItem {
  id: number;
  name: string;
  price: number;
  image: string;
  quantity: number;
  customization: string;
  variant?: string;
}

export interface AppliedCoupon {
  name: string;
  discount: number;
  discountType: 'Fixed' | 'Percentage';
  minOrderValue: number;
}

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: { id: number; name: string; price: number; image: string }, quantity: number, variant?: string, customizationNote?: string, startPosition?: { x: number; y: number }) => void;
  removeFromCart: (id: number, variant?: string) => void;
  updateQuantity: (id: number, quantity: number, variant?: string) => void;
  updateCustomization: (id: number, customization: string, variant?: string) => void;
  totalItems: number;
  clearCart: () => void;
  alert: { show: boolean; productName: string; variant?: string; quantity: number; startPosition?: { x: number; y: number }; productImage?: string } | null;
  closeAlert: () => void;
  // Coupon methods
  appliedCoupon: AppliedCoupon | null;
  applyCoupon: (coupon: AppliedCoupon) => void;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [appliedCoupon, setAppliedCoupon] = useState<AppliedCoupon | null>(null);
  const [alert, setAlert] = useState<{ show: boolean; productName: string; variant?: string; quantity: number; startPosition?: { x: number; y: number }; productImage?: string } | null>(null);
  const [isHydrated, setIsHydrated] = useState(false);

  // Load cart and coupon from localStorage after hydration
  React.useEffect(() => {
    try {
      const savedCart = localStorage.getItem('cart');
      if (savedCart) {
        setCart(JSON.parse(savedCart));
      }
      const savedCoupon = localStorage.getItem('appliedCoupon');
      if (savedCoupon) {
        setAppliedCoupon(JSON.parse(savedCoupon));
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error);
    }
    setIsHydrated(true);
  }, []);

  // Save cart to localStorage whenever it changes (only after hydration)
  React.useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        localStorage.setItem('cart', JSON.stringify(cart));
      } catch (error) {
        console.error('Error saving cart to localStorage:', error);
      }
    }
  }, [cart, isHydrated]);

  // Save coupon to localStorage whenever it changes (only after hydration)
  React.useEffect(() => {
    if (isHydrated && typeof window !== 'undefined') {
      try {
        if (appliedCoupon) {
          localStorage.setItem('appliedCoupon', JSON.stringify(appliedCoupon));
        } else {
          localStorage.removeItem('appliedCoupon');
        }
      } catch (error) {
        console.error('Error saving coupon to localStorage:', error);
      }
    }
  }, [appliedCoupon, isHydrated]);

  const addToCart = (product: { id: number; name: string; price: number; image: string }, quantity: number, variant?: string, customizationNote?: string, startPosition?: { x: number; y: number }) => {
    setCart(prevCart => {
      const cartKey = variant ? `${product.id}-${variant}` : product.id.toString();
      const existingItem = prevCart.find(item => {
        const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id.toString();
        return itemKey === cartKey;
      });

      if (existingItem) {
        return prevCart.map(item => {
          const itemKey = item.variant ? `${item.id}-${item.variant}` : item.id.toString();
          return itemKey === cartKey
            ? { ...item, quantity: item.quantity + quantity }
            : item;
        });
      } else {
        return [...prevCart, { ...product, quantity, customization: customizationNote || '', variant }];
      }
    });

    // Trigger alert
    setAlert({
      show: true,
      productName: product.name,
      variant,
      quantity,
      startPosition,
      productImage: product.image
    });
  };

  const closeAlert = () => {
    setAlert(null);
  };

  const removeFromCart = (id: number, variant?: string) => {
    setCart(prevCart => prevCart.filter(item => {
      if (variant) {
        return !(item.id === id && item.variant === variant);
      }
      return item.id !== id;
    }));
  };

  const updateQuantity = (id: number, quantity: number, variant?: string) => {
    if (quantity <= 0) {
      removeFromCart(id, variant);
    } else {
      setCart(prevCart =>
        prevCart.map(item => {
          if (variant) {
            return (item.id === id && item.variant === variant) ? { ...item, quantity } : item;
          }
          return item.id === id ? { ...item, quantity } : item;
        })
      );
    }
  };

  const updateCustomization = (id: number, customization: string, variant?: string) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (variant) {
          return (item.id === id && item.variant === variant) ? { ...item, customization } : item;
        }
        return item.id === id ? { ...item, customization } : item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
  };

  const applyCoupon = (coupon: AppliedCoupon) => {
    setAppliedCoupon(coupon);
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider value={{
      cart,
      addToCart,
      removeFromCart,
      updateQuantity,
      updateCustomization,
      totalItems,
      clearCart,
      alert,
      closeAlert,
      appliedCoupon,
      applyCoupon,
      removeCoupon
    }}>
      {children}
    </CartContext.Provider>
  );
};
