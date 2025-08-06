import { useState, useEffect } from 'react';
import { cartService, Cart, CartItem } from '../services/cartService';

interface UseCartReturn {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useCart = (): UseCartReturn => {
  const [cart, setCart] = useState<Cart | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCart = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.cart);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to fetch cart';
      setError(errorMessage);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  return {
    cart,
    loading,
    error,
    refetch: fetchCart,
  };
}; 