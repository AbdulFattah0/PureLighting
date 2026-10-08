import { useState } from 'react';
import type { CartItem, StoreProduct } from '@/types/shop';

function readCart(): CartItem[] {
  try { return JSON.parse(localStorage.getItem('pure-cart') || '[]') as CartItem[]; } catch { return []; }
}

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>(readCart);
  const cartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartTotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  function persist(next: CartItem[]) {
    localStorage.setItem('pure-cart', JSON.stringify(next));
    setCart(next);
  }

  function addToCart(product: StoreProduct) {
    const existing = cart.find((item) => item.product.id === product.id);
    const next = existing
      ? cart.map((item) => item.product.id === product.id ? { ...item, quantity: item.quantity + 1 } : item)
      : [...cart, { product, quantity: 1 }];
    persist(next);
  }

  function updateQuantity(id: string, delta: number) {
    persist(cart.map((item) => item.product.id === id ? { ...item, quantity: Math.max(0, item.quantity + delta) } : item).filter((item) => item.quantity > 0));
  }

  function clearCart() {
    localStorage.removeItem('pure-cart');
    setCart([]);
  }

  return { cart, cartCount, cartTotal, addToCart, updateQuantity, clearCart };
}
