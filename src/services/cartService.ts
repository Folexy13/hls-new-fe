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
    const response = await apiClient.get<any>('/api/v2/cart');
    console.log('Cart fetched:', response.data);
    const cart = response.data.data;
    return cart;
  },

  /**
   * Clear the user's cart
   * @returns Promise<void>
   */
  async clearCart(): Promise<void> {
    try {
      const response = await apiClient.delete('/api/v2/cart');
      console.log('Cart cleared:', response.data);
    } catch (error) {
      console.error('Error clearing cart:', error);
      throw error;
    }
  },

  /**
   * Add an item to the cart
   * @param itemId - ID of the item to add
   * @param quantity - Quantity to add
   * @returns Promise<any>
   */
  async addItemToCart(itemId: number, quantity: number): Promise<any> {
    try {
      const response = await apiClient.post('/api/v2/cart/items', { itemId, quantity });
      console.log('Item added to cart:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error adding item to cart:', error);
      throw error;
    }
  },

  /**
   * Update the quantity of a cart item
   * @param id - Cart item ID
   * @param quantity - New quantity
   * @returns Promise<any>
   */
  async updateCartItem(id: number, quantity: number): Promise<any> {
    try {
      const response = await apiClient.put(`/api/v2/cart/items/${id}`, { quantity });
      console.log('Cart item updated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error updating cart item:', error);
      throw error;
    }
  },

  /**
   * Remove an item from the cart
   * @param id - Cart item ID
   * @returns Promise<void>
   */
  async removeCartItem(id: number): Promise<void> {
    try {
      const response = await apiClient.delete(`/api/v2/cart/items/${id}`);
      console.log('Cart item removed:', response.data);
    } catch (error) {
      console.error('Error removing cart item:', error);
      throw error;
    }
  },
}; 