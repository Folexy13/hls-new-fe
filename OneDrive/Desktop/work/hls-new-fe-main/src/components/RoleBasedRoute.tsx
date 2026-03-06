import React from 'react';
import { Navigate } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { useRBAC } from '../context/useRBAC';
import { UserRole } from '../context/roles';

interface RoleBasedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
  fallbackPath?: string;
}

const RoleBasedRoute: React.FC<RoleBasedRouteProps> = ({
  children,
  allowedRoles,
  fallbackPath = '/'
}) => {
  const { hasRole, userRole } = useRBAC();

  return (
    <ProtectedRoute>
      {hasRole(allowedRoles) ? (
        children
      ) : (
        <Navigate to={fallbackPath} replace />
      )}
    </ProtectedRoute>
  );
};

export default RoleBasedRoute;
