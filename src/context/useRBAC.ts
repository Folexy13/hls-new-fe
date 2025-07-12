import { useContext } from 'react';
import { RBACContext, RBACContextType } from './RBACContext';

// Custom hook for using the RBAC context
export const useRBAC = (): RBACContextType => {
  const context = useContext(RBACContext);
  
  if (context === null) {
    throw new Error('useRBAC must be used within an RBACProvider');
  }
  
  return context;
};
