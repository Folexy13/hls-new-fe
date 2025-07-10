import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, TrendingUp, CreditCard, Users, ShoppingCart, UserPlus, Pill, FileText, Mic } from 'lucide-react';

const principalDashboardSections = [
  {
    title: 'Wallet',
    items: [
      { icon: <CreditCard className="h-6 w-6 mx-auto mb-2" />, label: 'Account', path: '/account' },
      { icon: <TrendingUp className="h-6 w-6 mx-auto mb-2" />, label: 'Earnings', path: '/earnings' },
      { icon: <CreditCard className="h-6 w-6 mx-auto mb-2" />, label: 'Withdraw', path: '/withdraw' },
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

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex justify-center py-4 sm:py-8">
        <div className="w-full max-w-4xl px-2 sm:px-0">
          <div className="rounded-t-2xl bg-white shadow-md overflow-hidden">
            <div className="bg-white flex flex-col items-center justify-center py-6 sm:py-8 border-b">
              <div className="flex w-full items-center justify-between px-2 sm:px-6">
                <User className="h-7 w-7 text-gray-400" />
                <div className="text-center flex-1">
                  <div className="text-xl sm:text-2xl font-bold text-gray-900">
                    0 <TrendingUp className="inline h-6 w-6 align-middle text-gray-400" />
                  </div>
                  <div className="font-bold text-md text-gray-700 tracking-wide mt-1">NEJJE</div>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-6 w-6 text-gray-400" />
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {principalDashboardSections.map((section) => (
                <div key={section.title} className="py-4 sm:py-6 px-2 sm:px-4">
                  <h2 className="font-semibold text-base sm:text-lg mb-3 sm:mb-4 text-gray-900">{section.title}</h2>
                  <div className="grid grid-cols-3 gap-3 sm:gap-4">
                    {section.items.map((item) => (
                      <Card
                        key={item.label}
                        className="flex flex-col items-center justify-center py-6 sm:py-8 bg-gray-50 hover:shadow transition-shadow cursor-pointer"
                        onClick={() => navigate(item.path)}
                      >
                        {item.icon}
                        <span className="text-xs sm:text-sm font-medium text-gray-800">{item.label}</span>
                      </Card>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalHomepage;
