
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { tokenManager } from '@/utils/tokenManager';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();
  const role = String(user?.role ?? '').toLowerCase();
  const hasValidSession = isAuthenticated && Boolean(user) && tokenManager.hasValidTokens();

  if (!hasValidSession) {
    return <Navigate to="/auth/signin" replace state={{ from: location }} />;
  }

  // If a specific role is required and the user doesn't have it, redirect to their appropriate homepage
  if (requiredRole && role !== String(requiredRole).toLowerCase()) {
    // Redirect based on user role
    if (role === 'principal') {
      return <Navigate to="/principal" replace />;
    } else if (role === 'wholesaler') {
      return <Navigate to="/wholesaler" replace />;
    } else if (role === 'benfek') {
      return <Navigate to="/benfek" replace />;
    } else {
      // Default homepage for other roles
      return <Navigate to="/" replace />;
    }
  }

  // Check if user is on the root path and redirect to their role-specific homepage
  if (location.pathname === '/' && role) {
    if (role === 'principal') {
      return <Navigate to="/principal" replace />;
    } else if (role === 'wholesaler') {
      return <Navigate to="/wholesaler" replace />;
    } else if (role === 'benfek') {
      return <Navigate to="/benfek" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
