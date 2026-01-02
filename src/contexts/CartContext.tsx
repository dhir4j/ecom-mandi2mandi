"use client";

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || 'https://www.mandi.ramhotravels.com';
const MINIMUM_AMOUNT = 2000; // Minimum purchase amount in rupees

interface CartItem {
  id: number;
  cartId: number;
  productId: string;
  productName: string;
  pricePerUnit: number;
  unit: string;
  quantity: number;
  imageUrl?: string;
  sellerName?: string;
  location?: string;
  subtotal: number;
  createdOn: string;
}

interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
  totalItems: number;
  totalAmount: number;
  createdOn: string;
  updatedOn: string;
}

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  cartCount: number;
  minimumAmount: number;
  fetchCart: () => Promise<void>;
  addToCart: (product: {
    productId: string;
    productName: string;
    pricePerUnit: number;
    unit: string;
    quantity: number;
    imageUrl?: string;
    sellerName?: string;
    location?: string;
  }) => Promise<{ success: boolean; message: string }>;
  updateCartItem: (itemId: number, quantity: number) => Promise<{ success: boolean; message: string }>;
  removeFromCart: (itemId: number) => Promise<{ success: boolean; message: string }>;
  clearCart: () => Promise<{ success: boolean; message: string }>;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [cartCount, setCartCount] = useState<number>(0);

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/cart`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        setCartCount(data.cart.totalItems || 0);
      } else {
        setError(data.message || 'Failed to fetch cart');
      }
    } catch (err) {
      setError('Network error while fetching cart');
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  const addToCart = useCallback(async (product: {
    productId: string;
    productName: string;
    pricePerUnit: number;
    unit: string;
    quantity: number;
    imageUrl?: string;
    sellerName?: string;
    location?: string;
  }): Promise<{ success: boolean; message: string }> => {
    try {
      setError(null);

      // Validate minimum amount
      const totalAmount = product.quantity * product.pricePerUnit;
      if (totalAmount < MINIMUM_AMOUNT) {
        return {
          success: false,
          message: `Minimum purchase amount is ₹${MINIMUM_AMOUNT}. Current: ₹${totalAmount.toLocaleString('en-IN')}`
        };
      }

      const response = await fetch(`${API_BASE_URL}/api/cart/add`, {
        method: 'POST',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(product),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        setCartCount(data.cart.totalItems || 0);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to add to cart' };
      }
    } catch (err) {
      console.error('Error adding to cart:', err);
      return { success: false, message: 'Network error while adding to cart' };
    }
  }, []);

  const updateCartItem = useCallback(async (itemId: number, quantity: number): Promise<{ success: boolean; message: string }> => {
    try {
      setError(null);

      const response = await fetch(`${API_BASE_URL}/api/cart/update/${itemId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quantity }),
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        setCartCount(data.cart.totalItems || 0);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to update cart item' };
      }
    } catch (err) {
      console.error('Error updating cart item:', err);
      return { success: false, message: 'Network error while updating cart item' };
    }
  }, []);

  const removeFromCart = useCallback(async (itemId: number): Promise<{ success: boolean; message: string }> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/cart/remove/${itemId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        setCartCount(data.cart.totalItems || 0);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to remove from cart' };
      }
    } catch (err) {
      console.error('Error removing from cart:', err);
      return { success: false, message: 'Network error while removing from cart' };
    }
  }, []);

  const clearCart = useCallback(async (): Promise<{ success: boolean; message: string }> => {
    try {
      setError(null);
      const response = await fetch(`${API_BASE_URL}/api/cart/clear`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();

      if (data.success) {
        setCart(data.cart);
        setCartCount(0);
        return { success: true, message: data.message };
      } else {
        return { success: false, message: data.message || 'Failed to clear cart' };
      }
    } catch (err) {
      console.error('Error clearing cart:', err);
      return { success: false, message: 'Network error while clearing cart' };
    }
  }, []);

  // Fetch cart on mount
  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return (
    <CartContext.Provider
      value={{
        cart,
        loading,
        error,
        cartCount,
        minimumAmount: MINIMUM_AMOUNT,
        fetchCart,
        addToCart,
        updateCartItem,
        removeFromCart,
        clearCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
}
