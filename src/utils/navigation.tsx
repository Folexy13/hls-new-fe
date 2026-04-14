import { Home, User, ShoppingCart, BookOpen, Headphones, Menu, X, FileText, LogOut, Shield, Users, Package, Briefcase, LifeBuoy, Gift } from 'lucide-react';
import { UserRole } from '../context/roles';

// Common navigation items for all users (public routes)
export const commonNavigation = [
  // { name: 'Home', href: '/', icon: Home },
  // These are now protected by role
  // { name: 'About', href: '/about', icon: BookOpen },
  // { name: 'Quiz', href: '/quiz', icon: User },
  // { name: 'Form', href: '/form', icon: FileText },
  // { name: 'Support', href: '/support', icon: BookOpen },
];

// Navigation items for authenticated users regardless of role
export const authenticatedNavigation = [
  // Cart has been moved to BENFEK-specific navigation
];

// Role-specific navigation items
export const roleNavigation = {
  [UserRole.PRINCIPAL]: [
    { name: 'Dashboard', href: '/principal', icon: Shield },
  ],
  [UserRole.WHOLESALER]: [
    { name: 'Wholesaler Dashboard', href: '/wholesaler', icon: Package },
  ],
  [UserRole.BENFEK]: [
    { name: 'My Profile', href: '/benfek/my-profile', icon: User },
    { name: 'Bonus', href: '/benfek/bonus', icon: Gift },
    { name: 'Support', href: '/support', icon: LifeBuoy },

    // Kept for routing elsewhere, but the Benfek hamburger menu hides these (footer owns primary nav).
    { name: 'Benfek Dashboard', href: '/benfek', icon: Briefcase },
    { name: 'Quiz', href: '/quiz', icon: User },
    { name: 'Form', href: '/form', icon: FileText },
    { name: 'Marketplace', href: '/marketplace', icon: ShoppingCart },
    { name: 'Podcast', href: '/podcast', icon: Headphones },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
  ],
  [UserRole.CUSTOMER]: [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
  ],
  [UserRole.ADMIN]: [
    { name: 'Admin Dashboard', href: '/admin', icon: Shield },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Settings', href: '/admin/settings', icon: FileText },
  ],
};

// Define the navigation item type
export interface NavigationItem {
  name: string;
  href: string;
  icon: React.FC<{ className?: string }>;
}

// Helper function to get navigation items based on user role
export const getNavigationByRole = (role: UserRole | null): NavigationItem[] => {
  if (!role) return commonNavigation;
  return [...(roleNavigation[role] || []), ...authenticatedNavigation];
};
