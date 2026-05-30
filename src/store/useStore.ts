
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager } from '../utils/tokenManager';
import { cartService } from '../services/cartService';

export interface User {
  id: string;
  email: string;
  name: string;
  role: string;
  nutrientType?: string;
  isAuthenticated: boolean;
}

export interface BenfekProfile {
  rewardPoints: number;
  hasPassword: boolean;
  pharmacistRegistered: boolean;
}

export type BenfekUser = User & {
  role: 'benfek';
  profile?: BenfekProfile;
};

export const isBenfekUser = (user: User | null): user is BenfekUser => {
  return user?.role === 'benfek';
};

export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'vitamin' | 'mineral' | 'protein' | 'supplement';
}

export interface CartItem extends Product {
  quantity: number;
}

export interface QuizData {
  age: number;
  gender: 'male' | 'female' | 'other';
  activityLevel: 'low' | 'moderate' | 'high';
  healthGoals: string[];
  dietaryRestrictions: string[];
  nutrientType: string;
}

interface StoreState {
  // Auth
  user: User | null;
  isAuthenticated: boolean;
  benfekProfile: BenfekProfile | null;
  
  // Quiz
  quizData: QuizData | null;
  quizCompleted: boolean;
  
  // Cart
  cartItems: CartItem[];
  cartTotal: number;
  
  // UI
  sidebarOpen: boolean;
  currentTab: string;
  
  // Actions
  setUser: (user: User) => void;
  login: (user: User, accessToken: string, refreshToken: string) => void;
  logout: () => void;
  setBenfekProfile: (profile: BenfekProfile) => void;
  setQuizData: (data: QuizData) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentTab: (tab: string) => void;
  setCartFromBackend: (items: CartItem[]) => void;
}

const normalizeUser = (user: User): User => ({
  ...user,
  role: String(user.role ?? '').toLowerCase(),
});

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      benfekProfile: null,
      quizData: null,
      quizCompleted: false,
      cartItems: [],
      cartTotal: 0,
      sidebarOpen: false,
      currentTab: 'overview',

      // Actions
      setUser: (user) =>
        set({ user: normalizeUser(user), isAuthenticated: true }),

      login: (user, accessToken, refreshToken) => {
        console.log('User logged in:', user);
        // console.log('Access Token:', accessToken);  
        tokenManager.setTokens(accessToken, refreshToken);
        set({ user: normalizeUser(user), isAuthenticated: true });
      },

      logout: () => {
        const refreshToken = tokenManager.getRefreshToken();
        if (refreshToken) {
          // Fire and forget logout request
          import('../services/authService').then(({ authService }) => {
            authService.logout(refreshToken).catch(console.error);
          });
        }
        tokenManager.clearTokens();
        set({ 
          user: null, 
          isAuthenticated: false,
          benfekProfile: null,
          cartItems: [], 
          cartTotal: 0 
        });

        // Ensure we leave protected areas after logout (works even when logout is called
        // from non-route-aware places like AuthWrapper).
        if (typeof window !== 'undefined' && !window.location.pathname.startsWith('/auth')) {
          // Use replace to avoid leaving a "logged-in" page in history.
          window.location.replace('/auth/signin');
        }
      },
      setBenfekProfile: (profile) => set({ benfekProfile: profile }),

      setQuizData: (data) =>
        set({ quizData: data, quizCompleted: true }),

      addToCart: async (product) => {
        const addLocalItem = () => set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id);
          const newCartItems = existingItem
            ? state.cartItems.map(item =>
                item.id === product.id
                  ? { ...item, quantity: item.quantity + 1 }
                  : item
              )
            : [...state.cartItems, { ...product, quantity: 1 }];
          const cartTotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          return { cartItems: newCartItems, cartTotal };
        });

        if (!get().isAuthenticated) {
          addLocalItem();
          return;
        }

        try {
          await cartService.addItemToCart(Number(product.id), 1);
          addLocalItem();
        } catch (error) {
          console.error('Failed to add item to cart:', error);
          throw error;
        }
      },

      removeFromCart: async (productId) => {
        const removeLocalItem = () => set((state) => {
          const newCartItems = state.cartItems.filter(item => item.id !== productId);
          const cartTotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          return { cartItems: newCartItems, cartTotal };
        });

        if (!get().isAuthenticated) {
          removeLocalItem();
          return;
        }

        try {
          await cartService.removeCartItem(Number(productId));
          removeLocalItem();
        } catch (error) {
          console.error('Failed to remove item from cart:', error);
          throw error;
        }
      },

      updateCartQuantity: async (productId: string, quantity: number) => {
        // Find the cart item to get its numeric id (API expects number)
        const state = get();
        const item = state.cartItems.find(item => item.id === productId);
        if (!item) return;
        const updateLocalItem = () => set((state) => {
          const newCartItems = state.cartItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
          );
          const cartTotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          return { cartItems: newCartItems, cartTotal };
        });

        if (!state.isAuthenticated) {
          updateLocalItem();
          return;
        }

        try {
          await cartService.updateCartItem(Number(productId), quantity);
          updateLocalItem();
        } catch (error) {
          console.error('Failed to update cart item quantity:', error);
          // Optionally, show a toast or error message here
        }
      },

      clearCart: async () => {
        if (!get().isAuthenticated) {
          set({ cartItems: [], cartTotal: 0 });
          return;
        }

        try {
          await cartService.clearCart();
          set({ cartItems: [], cartTotal: 0 });
        } catch (error) {
          console.error('Failed to clear cart:', error);
        }
      },

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      setCurrentTab: (tab) =>
        set({ currentTab: tab }),

      setCartFromBackend: (items) => set({
        cartItems: items,
        cartTotal: items.reduce((total, item) => total + (item.price * item.quantity), 0)
      }),
    }),
    {
      name: 'hls-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        benfekProfile: state.benfekProfile,
        quizData: state.quizData,
        quizCompleted: state.quizCompleted,
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
      }),
    }
  )
);
