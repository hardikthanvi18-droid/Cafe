import React, { createContext, useContext, useState, useEffect } from 'react';
import { CartItem, Product } from '../types/cafe';

interface CartContextType {
  items: CartItem[];
  appliedCoupon: string | null;
  orderType: 'Pickup' | 'Delivery';
  setOrderType: (type: 'Pickup' | 'Delivery') => void;
  addToCart: (product: Product, quantity?: number) => void;
  updateQuantity: (productId: string, quantity: number) => void;
  removeFromCart: (productId: string) => void;
  clearCart: () => void;
  applyCoupon: (code: string) => Promise<{ success: boolean; message: string; discountAmount?: number }>;
  removeCoupon: () => void;
  itemCount: number;
  subtotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

const CART_STORAGE_KEY = 'sip_joy_cart_v1';
const COUPON_STORAGE_KEY = 'sip_joy_coupon_v1';
const ORDER_TYPE_KEY = 'sip_joy_ordertype_v1';

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [items, setItems] = useState<CartItem[]>(() => {
    try {
      const saved = localStorage.getItem(CART_STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(() => {
    return localStorage.getItem(COUPON_STORAGE_KEY) || null;
  });

  const [orderType, setOrderTypeState] = useState<'Pickup' | 'Delivery'>(() => {
    return (localStorage.getItem(ORDER_TYPE_KEY) as 'Pickup' | 'Delivery') || 'Pickup';
  });

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (e) {
      console.error(e);
    }
  }, [items]);

  useEffect(() => {
    if (appliedCoupon) {
      localStorage.setItem(COUPON_STORAGE_KEY, appliedCoupon);
    } else {
      localStorage.removeItem(COUPON_STORAGE_KEY);
    }
  }, [appliedCoupon]);

  const setOrderType = (type: 'Pickup' | 'Delivery') => {
    setOrderTypeState(type);
    localStorage.setItem(ORDER_TYPE_KEY, type);
  };

  const addToCart = (product: Product, quantity: number = 1) => {
    if (!product.isAvailable) return;
    const qty = Math.max(1, Math.min(20, quantity));

    setItems(prev => {
      const existing = prev.find(item => item.productId === product.id);
      if (existing) {
        return prev.map(item =>
          item.productId === product.id
            ? { ...item, quantity: Math.min(20, item.quantity + qty) }
            : item
        );
      }
      return [
        ...prev,
        {
          productId: product.id,
          name: product.name,
          price: product.price,
          quantity: qty,
          imageUrl: product.imageUrl,
          categoryName: product.categoryName
        }
      ];
    });
  };

  const updateQuantity = (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    const safeQty = Math.min(20, quantity);
    setItems(prev =>
      prev.map(item => (item.productId === productId ? { ...item, quantity: safeQty } : item))
    );
  };

  const removeFromCart = (productId: string) => {
    setItems(prev => prev.filter(item => item.productId !== productId));
  };

  const clearCart = () => {
    setItems([]);
    setAppliedCoupon(null);
    localStorage.removeItem(CART_STORAGE_KEY);
    localStorage.removeItem(COUPON_STORAGE_KEY);
  };

  const applyCoupon = async (code: string): Promise<{ success: boolean; message: string; discountAmount?: number }> => {
    const cleanCode = code.trim().toUpperCase();
    if (!cleanCode) {
      return { success: false, message: 'Please enter a coupon code.' };
    }

    const currentSubtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: cleanCode, subtotal: currentSubtotal })
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setAppliedCoupon(cleanCode);
        return {
          success: true,
          message: `Coupon ${cleanCode} applied! Saved ₹${data.discountAmount}`,
          discountAmount: data.discountAmount
        };
      } else {
        return { success: false, message: data.error || 'Invalid coupon code.' };
      }
    } catch {
      return { success: false, message: 'Could not validate coupon at this moment.' };
    }
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
  };

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = items.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        appliedCoupon,
        orderType,
        setOrderType,
        addToCart,
        updateQuantity,
        removeFromCart,
        clearCart,
        applyCoupon,
        removeCoupon,
        itemCount,
        subtotal
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
