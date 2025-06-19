import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, User, ShoppingCart, BookOpen, Headphones, Menu, X, FileText } from 'lucide-react';
import logo from '../images/logo.jpg';

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, cartItems, setSidebarOpen, sidebarOpen } = useStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navigation = [
    { name: 'Home', href: '/', icon: Home },
    { name: 'About', href: '/about', icon: BookOpen },
    { name: 'Quiz', href: '/quiz', icon: User },
    { name: 'Form', href: '/form', icon: FileText },
    { name: 'Support', href: '/support', icon: BookOpen },
  ];

  const privateNavigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Cart', href: '/cart', icon: ShoppingCart },
    { name: 'Form', href: '/form', icon: FileText },
    { name: 'Podcast', href: '/podcast', icon: Headphones },
  ];

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to="/">
            <img src={logo} alt="HLS Logo" className="h-8" />
          </Link>
          <div className="flex items-center space-x-4">
            {isAuthenticated && (
              <Link to="/cart" className="relative p-2">
                <ShoppingCart className="h-6 w-6 text-gray-600" />
                {cartItemCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-emerald-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {cartItemCount}
                  </span>
                )}
              </Link>
            )}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-gray-600"
            >
              {mobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white shadow-lg border-t z-40">
            <nav className="px-4 py-2 space-y-1">
              {navigation.map((item) => (
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
                    Sign In
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
              {navigation.map((item) => (
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
              {!isAuthenticated ? (
                <Link
                  to="/auth/signin"
                  className="bg-emerald-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-emerald-700 transition-colors"
                >
                  Sign In
                </Link>
              ) : (
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-600">Welcome back!</span>
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

      {/* Bottom Navigation for Mobile (Private Routes) */}
      {isAuthenticated && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="flex justify-around py-2">
            {privateNavigation.map((item) => (
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
