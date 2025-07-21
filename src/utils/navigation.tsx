import { Home, User, ShoppingCart, BookOpen, Headphones, Menu, X, FileText, LogOut, Shield, Users, Package, Briefcase } from 'lucide-react';
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
    {
      name: 'Quick Access',
      icon: Menu,
      submenu: [
        { name: 'My Products', href: '/wholesaler/products', icon: Package },
        { name: 'Add Product', href: '/wholesaler/add-product', icon: Package },
        { name: 'Orders', href: '/wholesaler/orders', icon: ShoppingCart },
        { name: 'Earnings', href: '/wholesaler/earnings', icon: FileText },
        { name: 'Settings', href: '/wholesaler/settings', icon: FileText },
      ],
    },
  ],
  [UserRole.BENFEK]: [
    { name: 'Home', href: '/', icon: Home },
    { name: 'Benfek Dashboard', href: '/benfek', icon: Briefcase },
    { name: 'About', href: '/about', icon: BookOpen },
    { name: 'Quiz', href: '/quiz', icon: User },
    { name: 'Form', href: '/form', icon: FileText },
    { name: 'Support', href: '/support', icon: BookOpen },
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
