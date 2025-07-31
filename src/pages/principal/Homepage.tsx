import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, CreditCard, Users, ShoppingCart, UserPlus, Pill, FileText, Mic, RefreshCw, TrendingUp, Wallet } from 'lucide-react';

const principalDashboardSections = [
  {
    title: 'Wallet',
    items: [
      { icon: <RefreshCw className="h-6 w-6 mx-auto mb-2" />, label: 'Account', path: '/account' },
      { icon: <TrendingUp className="h-6 w-6 mx-auto mb-2" />, label: 'Earnings', path: '/earnings' },
      { icon: <Wallet className="h-6 w-6 mx-auto mb-2" />, label: 'Withdraw', path: '/withdraw' },
    ],
  },
  {
    title: 'Directory',
    items: [
      { icon: <Users className="h-6 w-6 mx-auto mb-2" />, label: 'Benfeks', path: '/benfeks' },
      { icon: <ShoppingCart className="h-6 w-6 mx-auto mb-2" />, label: 'Purchases', path: '/purchases' },
      { icon: <UserPlus className="h-6 w-6 mx-auto mb-2" />, label: 'Add benfek', path: '/add-benfek' },
    ],
  },
  {
    title: 'Publish',
    items: [
      { icon: <Pill className="h-6 w-6 mx-auto mb-2" />, label: 'Medications', path: '/supplements' },
      { icon: <FileText className="h-6 w-6 mx-auto mb-2" />, label: 'Articles', path: '/articles' },
      { icon: <Mic className="h-6 w-6 mx-auto mb-2" />, label: 'Podcasts', path: '/podcasts' },
    ],
  },
];

const PrincipalHomepage: React.FC = () => {
  const navigate = useNavigate();
  const [balance, setBalance] = useState(0);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshBalance = async () => {
    setIsRefreshing(true);
    try {
      // Simulate API call to refresh balance
      await new Promise(resolve => setTimeout(resolve, 1000));
      // TODO: Replace with actual API call to get real balance
      // setBalance(response.data.balance);
    } catch (error) {
      console.error('Failed to refresh balance:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const handleKeyPress = (event: React.KeyboardEvent, path: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      navigate(path);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center py-4 sm:py-8 pb-24 sm:pb-24">
        <div className="w-full max-w-4xl px-2 sm:px-0">
          <div className="rounded-t-2xl bg-white shadow-md overflow-hidden">
            {/* Header section styled like the image, but with current color */}
            <header className="relative bg-white flex flex-col items-center justify-center px-4 py-8 sm:py-10">
              {/* Profile icon - top left */}
              <User 
                className="h-7 w-7 text-gray-400 absolute left-4 top-4 sm:left-6 sm:top-6" 
                aria-label="User profile"
              />
              {/* Logout icon - top right */}
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-400 absolute right-4 top-4 sm:right-6 sm:top-6"
                aria-label="Logout"
              >
                <LogOut className="h-6 w-6" />
              </Button>
              {/* Centered content */}
              <div className="flex flex-col items-center justify-center min-h-[60px]">
                <div className="flex items-center justify-center">
                  <span 
                    className="text-2xl sm:text-3xl font-bold text-gray-900"
                    id="balance-amount"
                  >
                    {balance}
                  </span>
                  {/* Refresh icon */}
                  <button
                    onClick={refreshBalance}
                    disabled={isRefreshing}
                    className="ml-2 p-1 text-gray-400 hover:text-gray-600 transition-colors disabled:opacity-50 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 rounded"
                    aria-label="Refresh balance"
                    aria-describedby="balance-amount"
                    aria-live="polite"
                  >
                    <RefreshCw 
                      className={`h-5 w-5 ${isRefreshing ? 'animate-spin' : ''}`}
                      aria-hidden="true"
                    />
                  </button>
                </div>
                <div className="font-bold text-lg sm:text-xl text-gray-700 tracking-wide mt-2">NEJJE</div>
              </div>
            </header>
            {/* Divider below the header */}
            <hr className="border-gray-200" />
            {/* Dashboard sections */}
            <main className="divide-y">
              {principalDashboardSections.map((section) => (
                <section key={section.title} className="py-4 sm:py-6 px-2 sm:px-4">
                  <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-gray-900">
                    {section.title}
                  </h2>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {section.items.map((item) => (
                      <Card
                        key={item.label}
                        className="flex flex-col items-center justify-center py-6 sm:py-8 bg-gray-50 hover:shadow transition-shadow cursor-pointer focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                        onClick={() => navigate(item.path)}
                        onKeyDown={(e) => handleKeyPress(e, item.path)}
                        tabIndex={0}
                        role="button"
                        aria-label={`Navigate to ${item.label}`}
                      >
                        <span aria-hidden="true">
                          {item.icon}
                        </span>
                        <span className="text-xs sm:text-sm font-medium text-gray-800">
                          {item.label}
                        </span>
                      </Card>
                    ))}
                  </div>
                </section>
              ))}
            </main>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalHomepage;
