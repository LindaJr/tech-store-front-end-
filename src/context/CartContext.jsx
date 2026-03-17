import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from './AuthContext';

const CartContext = createContext(null);

export const CartProvider = ({ children }) => {
  const { user } = useAuth();
  const [cart, setCart] = useState({ items: [], total: 0, count: 0 });
  const [loading, setLoading] = useState(false);

  const fetchCart = useCallback(async () => {
    if (!user) { setCart({ items: [], total: 0, count: 0 }); return; }
    try {
      const res = await api.get('/cart');
      setCart(res.data);
    } catch {}
  }, [user]);

  useEffect(() => { fetchCart(); }, [fetchCart]);

  const addToCart = async (productId, quantity = 1) => {
    await api.post('/cart/add', { productId, quantity });
    await fetchCart();
  };

  const updateQuantity = async (productId, quantity) => {
    await api.put('/cart/update', { productId, quantity });
    await fetchCart();
  };

  const removeItem = async (productId) => {
    await api.delete(`/cart/remove/${productId}`);
    await fetchCart();
  };

  const clearCart = async () => {
    await api.delete('/cart/clear');
    setCart({ items: [], total: 0, count: 0 });
  };

  return (
    <CartContext.Provider value={{ cart, loading, addToCart, updateQuantity, removeItem, clearCart, fetchCart }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => useContext(CartContext);
