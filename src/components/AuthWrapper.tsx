import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { refreshAuthTokens } from '../config/axios';
import { tokenManager } from '../utils/tokenManager';
import { cartService } from '../services/cartService';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { setUser, logout, isAuthenticated, user, setCartFromBackend } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      const hasRefreshSession = !!refreshToken && !tokenManager.isTokenExpired();
      const accessToken = tokenManager.getAccessToken();

      // If user is already authenticated from persisted state and has tokens available, keep session.
      if (isAuthenticated && user && tokenManager.hasValidTokens()) {
        console.log('User already authenticated from persisted state');
        setIsLoading(false);
        return;
      }

      // Recover the session whenever a non-expired refresh token exists, even if
      // access token state or persisted auth state is temporarily out of sync.
      if (hasRefreshSession && (!isAuthenticated || !user || !accessToken)) {
        try {
          const { accessToken } = await refreshAuthTokens();
          const claims = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')));
          // Update user state after successful token refresh
          setUser({
            id: String(claims.userId),
            email: String(claims.email || ''),
            name: '',
            role: String(claims.role || ''),
            isAuthenticated: true,
          });
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
      } else if (!hasRefreshSession && isAuthenticated) {
        // No recoverable session remains, so clear the persisted auth state.
        logout();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [setUser, logout, isAuthenticated, user, setCartFromBackend]);

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
