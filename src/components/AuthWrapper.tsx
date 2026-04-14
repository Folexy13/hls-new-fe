import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { authService } from '../services/authService';
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
      // If user is already authenticated from persisted state and has valid tokens, skip refresh
      if (isAuthenticated && user && tokenManager.hasValidTokens()) {
        console.log('User already authenticated from persisted state');
        setIsLoading(false);
        return;
      }

      const refreshToken = tokenManager.getRefreshToken();
      
      // Only try to refresh if we have a token but no authenticated user
      if (refreshToken && !tokenManager.isTokenExpired() && !isAuthenticated) {
        try {
          const response = await authService.refreshToken(refreshToken);
          tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
          // Update user state after successful token refresh
          setUser({
            id: response.user.id,
            email: response.user.email,
            name: `${response.user.firstName} ${response.user.lastName}`,
            role: response.user.role,
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
      } else if (!tokenManager.hasValidTokens() && isAuthenticated) {
        // Tokens expired but user thinks they're authenticated - log them out
        logout();
      }
      
      setIsLoading(false);
    };

    initializeAuth();
  }, [setUser, logout, isAuthenticated, user, setCartFromBackend]);

  // Proactively refresh access tokens so idle users don't get logged out when they return.
  useEffect(() => {
    if (!isAuthenticated) return;

    const tick = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      if (!refreshToken) return;
      if (tokenManager.isTokenExpired()) {
        logout();
        return;
      }

      const accessExp = tokenManager.getAccessTokenExpiresAt();
      if (!accessExp) return;

      // Refresh when the access token is within 60 seconds of expiring.
      const msLeft = accessExp.getTime() - Date.now();
      if (msLeft > 60_000) return;

      try {
        const response = await authService.refreshToken(refreshToken);
        tokenManager.setTokens(response.tokens.accessToken, response.tokens.refreshToken);
      } catch (error) {
        console.error('Proactive token refresh failed:', error);
        tokenManager.clearTokens();
        logout();
      }
    };

    // Run once quickly, then periodically.
    const immediate = window.setTimeout(() => tick(), 500);
    const interval = window.setInterval(() => tick(), 30_000);
    return () => {
      window.clearTimeout(immediate);
      window.clearInterval(interval);
    };
  }, [isAuthenticated, logout]);

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
