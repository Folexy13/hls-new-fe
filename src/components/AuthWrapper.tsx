import React, { useEffect, useState } from 'react';
import { useStore } from '../store/useStore';
import { authService } from '../services/authService';
import { tokenManager } from '../utils/tokenManager';

interface AuthWrapperProps {
  children: React.ReactNode;
}

const AuthWrapper: React.FC<AuthWrapperProps> = ({ children }) => {
  const { setUser, logout, isAuthenticated } = useStore();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initializeAuth = async () => {
      const refreshToken = tokenManager.getRefreshToken();
      
      if (refreshToken && !tokenManager.isTokenExpired()) {
        try {
          const response = await authService.refreshToken(refreshToken);
          tokenManager.setTokens(response.accessToken, response.refreshToken);
          // setUser({
          //   id: response.user.id,
          //   email: response.user.email,
          //   name: `${response.user.firstName} ${response.user.lastName}`,
          //   isAuthenticated: true,
          // });
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
  }, [setUser, logout, isAuthenticated]);

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
