import React, { createContext, useContext, ReactNode } from 'react';
import { useStore } from '../store/useStore';
import { UserRole } from './roles';

// Interface for the RBAC context
export interface RBACContextType {
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  userRole: UserRole | null;
  isLoading: boolean;
}

// Create the context
export const RBACContext = createContext<RBACContextType | null>(null);

// Provider component
export const RBACProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const { user, isAuthenticated } = useStore();

  // Function to check if user has one of the required roles
  const hasRole = (roles: UserRole | UserRole[]): boolean => {
    if (!isAuthenticated || !user) return false;
    
    // Convert single role to array for consistent handling
    const roleArray = Array.isArray(roles) ? roles : [roles];
    
    // Check if the user's role is in the array of allowed roles
    return roleArray.includes(user.role as UserRole);
  };

  const value = {
    hasRole,
    userRole: user?.role as UserRole || null,
    isLoading: false
  };

  return (
    <RBACContext.Provider value={value}>
      {children}
    </RBACContext.Provider>
  );
};


