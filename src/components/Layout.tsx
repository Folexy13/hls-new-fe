import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { Home, ShoppingCart, BookOpen, Headphones, Menu, X, LogOut, Bell, Settings, LogIn, UserPlus, LayoutDashboard, CheckCheck, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import logo from '../images/logo.jpg';
import { useRBAC } from '../context/useRBAC';
import { UserRole } from '../context/roles';
import { commonNavigation, getNavigationByRole, NavigationItem } from '../utils/navigation';
import { principalService } from '@/services/principalService';

type PrincipalNotificationItem = {
  id: number;
  title: string;
  message: string;
  href?: string;
  count?: number;
  isRead?: boolean;
};

const Layout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const location = useLocation();
  const { isAuthenticated, cartItems, logout, user } = useStore();
  const { userRole } = useRBAC();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [hidePrincipalFooter, setHidePrincipalFooter] = useState(false);
  const [principalNotificationCount, setPrincipalNotificationCount] = useState(0);
  const [principalNotificationTitle, setPrincipalNotificationTitle] = useState('Notifications');
  const [principalNotificationItems, setPrincipalNotificationItems] = useState<PrincipalNotificationItem[]>([]);
  const [notificationMenuOpen, setNotificationMenuOpen] = useState(false);
  const [notificationRefreshKey, setNotificationRefreshKey] = useState(0);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);
  const mobileMenuButtonRef = useRef<HTMLButtonElement | null>(null);
  const notificationMenuRef = useRef<HTMLDivElement | null>(null);
  const notificationButtonRef = useRef<HTMLButtonElement | null>(null);

  // Get navigation items based on authentication and role
  // Only show common navigation items to unauthenticated users or if they match current role permission
  const navigation = isAuthenticated ? [] : commonNavigation.filter(item => item.href === '/');
  const privateNavigation = isAuthenticated ? getNavigationByRole(userRole) : [];
  const mobilePrivateNavigation = useMemo(() => {
    if (!isAuthenticated) return [];

    // Benfek hamburger menu should stay lightweight (footer handles primary navigation).
    if (userRole === UserRole.BENFEK) {
      const excluded = new Set([
        '/benfek', // benfek homepage
        '/quiz',
        '/form',
        '/podcast',
        '/marketplace',
        '/cart',
        '/',
        '/about',
      ]);
      return privateNavigation.filter((item) => !excluded.has(item.href));
    }

    return privateNavigation;
  }, [isAuthenticated, privateNavigation, userRole]);

  const showAboutInMobileMenu =
    userRole !== UserRole.BENFEK && !mobilePrivateNavigation.some((item) => item.href === '/about');

  const cartItemCount = cartItems.reduce((total, item) => total + item.quantity, 0);
  const unreadNotifications = userRole === UserRole.PRINCIPAL ? principalNotificationCount : 0;
  const homeHref = useMemo(() => {
    if (!isAuthenticated) return '/';
    switch (userRole) {
      case UserRole.BENFEK:
        return '/benfek/dashboard';
      case UserRole.PRINCIPAL:
        return '/principal';
      case UserRole.RESEARCHER:
        return '/researcher';
      case UserRole.WHOLESALER:
        return '/wholesaler';
      default:
        return '/';
    }
  }, [isAuthenticated, userRole]);
  const isIOS = useMemo(() => {
    if (typeof window === 'undefined') return false;
    return /iPad|iPhone|iPod/.test(navigator.userAgent);
  }, []);

  const handleLogout = () => {
    logout();
    setMobileMenuOpen(false);
    setNotificationMenuOpen(false);
  };

  const refreshPrincipalNotifications = () => setNotificationRefreshKey((key) => key + 1);

  const handleNotificationItemClick = async (item: PrincipalNotificationItem) => {
    if (!item.isRead) {
      setPrincipalNotificationItems((items) =>
        items.map((notification) =>
          notification.id === item.id ? { ...notification, isRead: true } : notification
        )
      );
      setPrincipalNotificationCount((count) => Math.max(0, count - Number(item.count || 0)));
      principalService.markNotificationRead(item.id).catch(refreshPrincipalNotifications);
    }
  };

  const handleMarkAllNotificationsRead = async () => {
    setPrincipalNotificationItems((items) => items.map((item) => ({ ...item, isRead: true })));
    setPrincipalNotificationCount(0);
    await principalService.markAllNotificationsRead();
    refreshPrincipalNotifications();
  };

  const handleDeleteNotification = async (id: number) => {
    const item = principalNotificationItems.find((notification) => notification.id === id);
    setPrincipalNotificationItems((items) => items.filter((notification) => notification.id !== id));
    if (item && !item.isRead) {
      setPrincipalNotificationCount((count) => Math.max(0, count - Number(item.count || 0)));
    }
    await principalService.deleteNotification(id);
    refreshPrincipalNotifications();
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

const onPointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null;
      if (!target) return;

      // Close when clicking outside both the menu panel and the hamburger button.
      if (mobileMenuRef.current?.contains(target)) return;
      if (mobileMenuButtonRef.current?.contains(target)) return;

      setMobileMenuOpen(false);
    };

    document.addEventListener('pointerdown', onPointerDown);
    return () => document.removeEventListener('pointerdown', onPointerDown);
  }, [mobileMenuOpen]);

  // Scroll restoration: ensure new pages start at the top on navigation.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    window.scrollTo(0, 0);
  }, [location.pathname]);

  useEffect(() => {
    let cancelled = false;

    const loadPrincipalNotifications = async () => {
      if (!isAuthenticated || userRole !== UserRole.PRINCIPAL) {
        setPrincipalNotificationCount(0);
        setPrincipalNotificationTitle('Notifications');
        setPrincipalNotificationItems([]);
        setNotificationMenuOpen(false);
        return;
      }

      try {
        const summary = await principalService.getNotificationSummary();
        if (cancelled) return;
        const count = Number(summary?.count || 0);
        const items = Array.isArray(summary?.items) ? summary.items : [];
        const title = items.length
          ? items.map((item) => `${item.title}: ${item.message}`).join('\n')
          : 'No new principal notifications';
        setPrincipalNotificationCount(count);
        setPrincipalNotificationItems(items);
        setPrincipalNotificationTitle(title);
      } catch {
        if (!cancelled) {
          setPrincipalNotificationCount(0);
          setPrincipalNotificationItems([]);
          setPrincipalNotificationTitle('Notifications unavailable');
        }
      }
    };

    loadPrincipalNotifications();
    const interval = window.setInterval(loadPrincipalNotifications, 60000);
    return () => {
      cancelled = true;
      window.clearInterval(interval);
    };
  }, [isAuthenticated, userRole, location.pathname, notificationRefreshKey]);

  // The researcher app is a self-contained UI (ported from `hls-researcher-app`).
  // Keep it unguarded and render it without the global layout chrome.
  if (location.pathname.startsWith('/researcher')) {
    return <>{children}</>;
  }

  const principalNotificationMenu = (
    <div
      ref={notificationMenuRef}
      className="absolute right-0 top-full mt-2 w-80 max-w-[calc(100vw-2rem)] overflow-hidden rounded-xl border border-slate-200 bg-white shadow-xl z-50"
    >
      <div className="border-b border-slate-100 px-4 py-3">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Notifications</p>
            <p className="text-xs text-slate-500">
              {unreadNotifications > 0 ? `${unreadNotifications} item${unreadNotifications === 1 ? '' : 's'} need attention` : 'No new principal notifications'}
            </p>
          </div>
          {principalNotificationItems.some((item) => !item.isRead) && (
            <button
              type="button"
              onClick={handleMarkAllNotificationsRead}
              className="inline-flex items-center gap-1 rounded-full border border-slate-200 px-2.5 py-1 text-[11px] font-semibold text-slate-700 transition hover:bg-slate-50"
            >
              <CheckCheck className="h-3.5 w-3.5" />
              Read all
            </button>
          )}
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto py-1">
        {principalNotificationItems.length > 0 ? (
          principalNotificationItems.map((item) => (
            <div
              key={item.id}
              className={`group flex w-full items-start gap-3 px-4 py-3 text-left transition hover:bg-slate-50 ${item.isRead ? 'opacity-70' : ''}`}
            >
              <span className={`mt-1 h-2.5 w-2.5 shrink-0 rounded-full ${item.isRead ? 'bg-slate-300' : 'bg-rose-500'}`} />
              <button
                type="button"
                onClick={() => handleNotificationItemClick(item)}
                className="min-w-0 flex-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-900/20"
              >
                <span className="block text-sm font-semibold text-slate-900">{item.title}</span>
                <span className="mt-0.5 block text-xs leading-5 text-slate-600">{item.message}</span>
              </button>
              <button
                type="button"
                onClick={() => handleDeleteNotification(item.id)}
                className="mt-0.5 inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-slate-400 transition hover:bg-rose-50 hover:text-rose-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-rose-500/30"
                aria-label={`Delete ${item.title}`}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </button>
            </div>
          ))
        ) : (
          <div className="px-4 py-5 text-sm text-slate-600">You are all caught up.</div>
        )}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Mobile Header */}
      <header className="lg:hidden bg-white shadow-sm border-b sticky top-0 z-50">
        <div className="flex items-center justify-between px-4 py-3">
          <Link to={homeHref}>
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
              <div className="relative">
                <button
                  ref={notificationButtonRef}
                  data-principal-notification-button="true"
                  type="button"
                  onClick={() => {
                    if (userRole === UserRole.PRINCIPAL) {
                      setNotificationMenuOpen((open) => !open);
                    }
                  }}
                  className="relative p-2 text-gray-600 hover:text-gray-900"
                  title={principalNotificationTitle}
                  aria-label="Notifications"
                  aria-expanded={notificationMenuOpen}
                >
                  <Bell className="h-6 w-6" />
                  {unreadNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                      {unreadNotifications > 9 ? '9+' : unreadNotifications}
                    </span>
                  )}
                </button>
                {notificationMenuOpen && userRole === UserRole.PRINCIPAL && principalNotificationMenu}
              </div>
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
          <div
            ref={mobileMenuRef}
            className="absolute top-full right-0 w-1/2 max-w-[320px] bg-white shadow-lg border-l border-t z-40 rounded-bl-2xl"
          >
            <nav className="px-4 py-3 space-y-1">
              {/* Always show Home link */}
              {!(isAuthenticated && userRole === UserRole.BENFEK) && (
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
              )}

              {showAboutInMobileMenu && (
                <Link
                  to="/about"
                  onClick={() => setMobileMenuOpen(false)}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === '/about'
                      ? 'bg-emerald-100 text-emerald-700'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  <BookOpen className="h-5 w-5 mr-3" />
                  About Us
                </Link>
              )}
              
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
                  {userRole !== UserRole.BENFEK && <hr className="my-2" />}
                  {mobilePrivateNavigation.map((item) => (
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
                    <LogIn className="h-5 w-5 mr-3" />
                    Login
                  </Link>
                  <Link
                    to="/auth/signup"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center px-3 py-2 rounded-md text-sm font-medium text-emerald-700 hover:bg-emerald-50"
                  >
                    <UserPlus className="h-5 w-5 mr-3" />
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
            <Link to={homeHref}>
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
                <div className="relative">
                  <button
                    ref={notificationButtonRef}
                    data-principal-notification-button="true"
                    type="button"
                    onClick={() => {
                      if (userRole === UserRole.PRINCIPAL) {
                        setNotificationMenuOpen((open) => !open);
                      }
                    }}
                    className="relative p-2 text-gray-600 hover:text-gray-900"
                    title={principalNotificationTitle}
                    aria-label="Notifications"
                    aria-expanded={notificationMenuOpen}
                  >
                    <Bell className="h-5 w-5" />
                    {unreadNotifications > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-[10px] rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadNotifications > 9 ? '9+' : unreadNotifications}
                      </span>
                    )}
                  </button>
                  {notificationMenuOpen && userRole === UserRole.PRINCIPAL && principalNotificationMenu}
                </div>
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
        <footer className={`fixed bottom-0 left-0 right-0 z-50 border-t bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 transition-transform ${hidePrincipalFooter ? 'translate-y-full' : 'translate-y-0'}`}>
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 gap-2 flex items-center justify-center">
            <Settings className="text-white" />
            <Link
              to="/principal/settings"
              className="text-md font-medium text-white tracking-widest"
            >
              Settings
            </Link>
          </div>
        </footer>
      )}

      {/* Benfek Bottom Navigation */}
      {isAuthenticated && userRole === UserRole.BENFEK && (
        <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
          <div className="max-w-6xl mx-auto px-4 py-3">
            <div className="grid grid-cols-3 text-center">
              <NavLink
                to="/benfek/dashboard"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`
                }
              >
                <LayoutDashboard className="h-5 w-5 text-white" />
                Dashboard
              </NavLink>
              <NavLink
                to="/blog"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`
                }
              >
                <BookOpen className="h-5 w-5 text-white" />
                Articles
              </NavLink>
              <NavLink
                to="/podcast"
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`
                }
              >
                <Headphones className="h-5 w-5 text-white" />
                Podcast
              </NavLink>
            </div>
          </div>
        </nav>
      )}

      {/* Bottom Navigation for Mobile (Private Routes) */}
      {isAuthenticated &&
        userRole !== UserRole.BENFEK &&
        (userRole === UserRole.PRINCIPAL
          ? privateNavigation.filter((item) => item.name !== 'Dashboard')
          : privateNavigation
        ).length > 0 && (
        <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t shadow-lg z-50">
          <div className="flex justify-around py-2">
            {(userRole === UserRole.PRINCIPAL
              ? privateNavigation.filter((item) => item.name !== 'Dashboard')
              : privateNavigation
            )
              .slice(0, 4)
              .map((item) => (
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
