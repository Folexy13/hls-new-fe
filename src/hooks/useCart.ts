import { useState, useEffect, useCallback } from 'react';
import { cartService, Cart } from '../services/cartService';
import { getApiErrorMessage } from '@/utils/apiError';

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

  const fetchCart = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await cartService.getCart();
      setCart(response.cart);
    } catch (err) {
      const errorMessage = getApiErrorMessage(err, 'Failed to fetch cart');
      setError(errorMessage);
      console.error('Error fetching cart:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  return {
    cart,
    loading,
    error,
    refetch: fetchCart,
  };
}; 
