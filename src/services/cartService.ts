import { apiClient } from '../config/axios';

export interface Supplement {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  supplement: Supplement;
}

export interface Cart {
  id: number;
  userId: number;
  items: CartItem[];
}

export interface CartResponse {
  cart: Cart;
}

export const cartService = {
  /**
   * Fetch the current user's cart
   * @returns Promise<CartResponse>
   */
  async getCart(): Promise<CartResponse> {
    const response = await apiClient.get<CartResponse>('/api/v2/cart');
    return response.data;
  },
}; 