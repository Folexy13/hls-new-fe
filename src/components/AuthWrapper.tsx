import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { authService } from '../services/authService';
import { tokenManager } from '../utils/tokenManager';
import { cartService } from '../services/cartService';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { setUser, logout, isAuthenticated, setCartFromBackend } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken && !tokenManager.isTokenExpired()) {
        try {
          const response = await authService.refreshToken(refreshToken);
          tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
          // setUser({
          //   id: response.user.id,
          //   email: response.user.email,
          //   name: `${response.user.firstName} ${response.user.lastName}`,
          //   isAuthenticated: true,
          // });
          // Fetch cart from backend and sync store
          try {
            const cartResp = await cartService.getCart();
            if (cartResp && cartResp.cart && cartResp.cart.items) {
              setCartFromBackend(cartResp.cart.items.map(i => ({
                id: i.supplement.id.toString(),
                name: i.supplement.name,
                price: i.supplement.price,
                image: i.supplement.image,
                description: i.supplement.description,
                category: 'supplement', // or map actual category if available
                quantity: i.quantity
              })));
            }
          } catch (cartErr) {
            // Optionally handle cart fetch error
          }
        } catch (error) {
          console.error('Token refresh failed:', error);
          tokenManager.clearTokens();
          logout();
        }
      } else if (!tokenManager.hasValidTokens() && isAuthenticated) {
        logout();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [setUser, logout, isAuthenticated, setCartFromBackend]);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-emerald-500"></div>
      </div>
    );
  }

  return <>{children}</>;
};

export default AuthWrapper;
