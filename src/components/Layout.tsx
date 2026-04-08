import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, User, ShoppingCart, BookOpen, Headphones, Menu, X, FileText, LogOut, Bell, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '../images/logo.jpg';
import { useRBAC } from '../context/useRBAC';
import { UserRole } from '../context/roles';
import { commonNavigation, getNavigationByRole, NavigationItem } from '../utils/navigation';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, cartItems, logout, user } = useStore();
  const { userRole } = useRBAC();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidePrincipalFooter, setHidePrincipalFooter] = useState(false);
  const mobileMenuRef = useRef<HTMLDivElement>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement>(null);

  // Get navigation items based on authentication and role
  // Only show common navigation items to unauthenticated users or if they match current role permission
  const navigation = isAuthenticated ? [] : commonNavigation.filter(item => item.href === '/');
  const privateNavigation = isAuthenticated ? getNavigationByRole(userRole) : [];

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = 3;
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
  };

  useEffect(() => {
    if (!isIOS) return;
    const handleScroll = () => {
      setHidePrincipalFooter(window.scrollY > 0);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isIOS]);

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const handlePointerDown = (event: MouseEvent | TouchEvent) => {
      const target = event.target as Node;

      if (
        mobileMenuRef.current?.contains(target) ||
        mobileMenuButtonRef.current?.contains(target)
      ) {
        return;
      }

      setMobileMenuOpen(false);
    };

    document.addEventListener('mousedown', handlePointerDown);
    document.addEventListener('touchstart', handlePointerDown);

    return () => {
      document.removeEventListener('mousedown', handlePointerDown);
      document.removeEventListener('touchstart', handlePointerDown);
    };
  }, [mobileMenuOpen]);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/">
            <img src={logo} alt="HLS Logo" className="h-8" />
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated && userRole === UserRole.BENFEK && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            {isAuthenticated && (
              <button className="relative p-2 text-gray-600 hover:text-gray-900">
                <Bell className="h-6 w-6" />
                {unreadNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                    {unreadNotifications}
                  </span>
                )}
              </button>
            )}
            <button
              ref={mobileMenuButtonRef}
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full right-0 w-1/2 max-w-[320px] bg-white shadow-lg border-l border-t z-40 rounded-bl-2xl">
            <nav className="px-4 py-3 space-y-1">
              {/* Always show Home link */}
              <Link
                to="/"
                onClick={() => setMobileMenuOpen(false)}
                className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                  location.pathname === '/'
                    ? 'bg-emerald-100 text-emerald-700'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Home className="h-5 w-5 mr-3" />
                Home
              </Link>
              
              {/* Show other public navigation only for unauthenticated users */}
              {!isAuthenticated && navigation.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.href
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <item.icon className="h-5 w-5 mr-3" />
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && (
                <>
                  <hr className="my-2" />
                  {privateNavigation.map((item) => (
                    <Link
                      key={item.name}
                      to={item.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                        location.pathname === item.href
                          ? 'bg-emerald-100 text-emerald-700'
                          : 'text-gray-600 hover:bg-gray-50'
                      }`}
                    >
                      <item.icon className="h-5 w-5 mr-3" />
                      {item.name}
                      {item.name === 'Cart' && cartItemCount > 0 && (
                        <span className="ml-auto bg-emerald-500 text-white text-xs rounded-full px-2 py-0.5">
                          {cartItemCount}
                        </span>
                      )}
                    </Link>
                  ))}
                  <hr className="my-2" />
                  <button
                    onClick={handleLogout}
                    className="flex items-center w-full px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    <LogOut className="h-5 w-5 mr-3" />
                    Logout
                  </button>
                </>
              )}
              
              {!isAuthenticated && (
                <>
                  <hr className="my-2" />
                  <Link
                    to="/auth/signin"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-gray-600 hover:bg-gray-50"
                  >
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    Join Us
                  </Link>
                </>
              )}
            </nav>
          </div>
        )}
      </header>

      {/* Desktop Header */}
      <header className="hidden lg:block bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <Link to="/">
              <img src={logo} alt="HLS Logo" className="h-10" />
            </Link>
            
            <nav className="flex space-x-8">
              {/* Always show Home link */}
              <Link
                to="/"
                className={`text-sm font-medium transition-colors ${
                  location.pathname === '/'
                    ? 'text-emerald-600'
                    : 'text-gray-600 hover:text-emerald-500'
                }`}
              >
                Home
              </Link>
              
              {/* Show navigation based on authentication status */}
              {!isAuthenticated && navigation.slice(1).map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors ${
                    location.pathname === item.href
                      ? 'text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-500'
                  }`}
                >
                  {item.name}
                </Link>
              ))}
              
              {isAuthenticated && privateNavigation.map((item) => (
                <Link
                  key={item.name}
                  to={item.href}
                  className={`text-sm font-medium transition-colors relative ${
                    location.pathname === item.href
                      ? 'text-emerald-600'
                      : 'text-gray-600 hover:text-emerald-500'
                  }`}
                >
                  {item.name}
                  {item.name === 'Cart' && cartItemCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {cartItemCount}
                    </span>
                  )}
                </Link>
              ))}
            </nav>

            <div className="flex items-center space-x-4">
              {isAuthenticated && (
                <button className="relative p-2 text-gray-600 hover:text-gray-900">
                  <Bell className="h-5 w-5" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications}
                    </span>
                  )}
                </button>
              )}
              {!isAuthenticated ? (
                <Link
                  to="/auth/signin"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Login
                </Link>
              ) : (
                <div className="flex items-center space-x-4">
                  <span className="text-sm text-gray-600">
                    Hi, {user?.name || 'User'}!
                    {userRole && <span className="ml-1 text-xs text-gray-500">({userRole})</span>}
                  </span>
                  <Button 
                    onClick={handleLogout}
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                  >
                    <LogOut className="h-4 w-4" />
                    Logout
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        {children}
      </main>

      {isAuthenticated && userRole === UserRole.PRINCIPAL && (
        <footer className={`fixed bottom-0 left-0 right-0 z-40 border-t bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 transition-transform ${hidePrincipalFooter ? 'translate-y-full' : 'translate-y-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-2 flex items-center justify-center">
            <User className="text-white" />
            <Link
              to="/principal/settings"
              className="text-md font-medium text-white tracking-widest"
            >
              User Profile
            </Link>
          </div>
        </footer>
      )}

      {/* Bottom Navigation for Mobile (Private Routes) */}
      {isAuthenticated && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="flex justify-around py-2">
            {privateNavigation.slice(0, 4).map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={`flex flex-col items-center py-2 px-3 relative ${
                  location.pathname === item.href
                    ? 'text-emerald-600'
                    : 'text-gray-600'
                }`}
              >
                <item.icon className="h-6 w-6" />
                <span className="text-xs mt-1">{item.name}</span>
                {item.name === 'Cart' && cartItemCount > 0 && (
                  <span className="absolute -top-1 right-2 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            ))}
          </div>
        </nav>
      )}
    </div>
  );
};

export default Layout;
