import { createContext } from 'react';
import { UserRole } from './roles';

// Interface for the RBAC context
export interface RBACContextType {
  hasRole: (roles: UserRole | UserRole[]) => boolean;
  userRole: UserRole | null;
  isLoading: boolean;
}

// Create the context
export const RBACContext = createContext<RBACContextType | null>(null);
