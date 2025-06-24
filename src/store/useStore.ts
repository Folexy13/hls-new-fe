import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { tokenManager } from '../utils/tokenManager';

export interface User {
  id: string;
  email: string;
  name: string;
  nutrientType?: string;
  isAuthenticated: boolean;
}

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
  setQuizData: (data: QuizData) => void;
  addToCart: (product: Product) => void;
  removeFromCart: (productId: string) => void;
  updateCartQuantity: (productId: string, quantity: number) => void;
  clearCart: () => void;
  setSidebarOpen: (open: boolean) => void;
  setCurrentTab: (tab: string) => void;
}

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      // Initial state
      user: null,
      isAuthenticated: false,
      quizData: null,
      quizCompleted: false,
      cartItems: [],
      cartTotal: 0,
      sidebarOpen: false,
      currentTab: 'overview',

      // Actions
      setUser: (user) =>
        set({ user, isAuthenticated: true }),

      login: (user, accessToken, refreshToken) => {
        tokenManager.setTokens(accessToken, refreshToken);
        set({ user, isAuthenticated: true });
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
          cartItems: [], 
          cartTotal: 0 
        });
      },

      setQuizData: (data) =>
        set({ quizData: data, quizCompleted: true }),

      addToCart: (product) =>
        set((state) => {
          const existingItem = state.cartItems.find(item => item.id === product.id);
          let newCartItems;
          
          if (existingItem) {
            newCartItems = state.cartItems.map(item =>
              item.id === product.id
                ? { ...item, quantity: item.quantity + 1 }
                : item
            );
          } else {
            newCartItems = [...state.cartItems, { ...product, quantity: 1 }];
          }
          
          const cartTotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          return { cartItems: newCartItems, cartTotal };
        }),

      removeFromCart: (productId) =>
        set((state) => {
          const newCartItems = state.cartItems.filter(item => item.id !== productId);
          const cartTotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          return { cartItems: newCartItems, cartTotal };
        }),

      updateCartQuantity: (productId, quantity) =>
        set((state) => {
          const newCartItems = state.cartItems.map(item =>
            item.id === productId ? { ...item, quantity } : item
          );
          const cartTotal = newCartItems.reduce((total, item) => total + (item.price * item.quantity), 0);
          return { cartItems: newCartItems, cartTotal };
        }),

      clearCart: () =>
        set({ cartItems: [], cartTotal: 0 }),

      setSidebarOpen: (open) =>
        set({ sidebarOpen: open }),

      setCurrentTab: (tab) =>
        set({ currentTab: tab }),
    }),
    {
      name: 'hls-storage',
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        quizData: state.quizData,
        quizCompleted: state.quizCompleted,
        cartItems: state.cartItems,
        cartTotal: state.cartTotal,
      }),
    }
  )
);
