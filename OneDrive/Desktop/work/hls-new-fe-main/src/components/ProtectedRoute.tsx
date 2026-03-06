
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: string;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, requiredRole }) => {
  const { isAuthenticated, user } = useStore();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/signin" replace />;
  }

  // If a specific role is required and the user doesn't have it, redirect to their appropriate homepage
  if (requiredRole && user?.role !== requiredRole) {
    // Redirect based on user role
    if (user?.role === 'principal') {
      return <Navigate to="/principal" replace />;
    } else if (user?.role === 'wholesaler') {
      return <Navigate to="/wholesaler" replace />;
    } else if (user?.role === 'benfek') {
      return <Navigate to="/benfek" replace />;
    } else {
      // Default homepage for other roles
      return <Navigate to="/" replace />;
    }
  }

  // Check if user is on the root path and redirect to their role-specific homepage
  if (location.pathname === '/' && user?.role) {
    if (user.role === 'principal') {
      return <Navigate to="/principal" replace />;
    } else if (user.role === 'wholesaler') {
      return <Navigate to="/wholesaler" replace />;
    } else if (user.role === 'benfek') {
      return <Navigate to="/benfek" replace />;
    }
  }

  return <>{children}</>;
};

export default ProtectedRoute;
