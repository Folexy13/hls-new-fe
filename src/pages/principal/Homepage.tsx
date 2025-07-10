import React from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { LogOut, User, TrendingUp, CreditCard, Users, ShoppingCart, UserPlus, Pill, FileText, Mic } from 'lucide-react';

const principalDashboardSections = [
  {
    title: 'Wallet',
    items: [
      { icon: <CreditCard className="h-6 w-6 mx-auto mb-2" />, label: 'Account' },
      { icon: <TrendingUp className="h-6 w-6 mx-auto mb-2" />, label: 'Earnings' },
      { icon: <CreditCard className="h-6 w-6 mx-auto mb-2" />, label: 'Withdraw' },
    ],
  },
  {
    title: 'Directory',
    items: [
      { icon: <Users className="h-6 w-6 mx-auto mb-2" />, label: 'Benfeks' },
      { icon: <ShoppingCart className="h-6 w-6 mx-auto mb-2" />, label: 'Purchases' },
      { icon: <UserPlus className="h-6 w-6 mx-auto mb-2" />, label: 'Add benfek' },
    ],
  },
  {
    title: 'Publish',
    items: [
      { icon: <Pill className="h-6 w-6 mx-auto mb-2" />, label: 'Medications' },
      { icon: <FileText className="h-6 w-6 mx-auto mb-2" />, label: 'Articles' },
      { icon: <Mic className="h-6 w-6 mx-auto mb-2" />, label: 'Podcasts' },
    ],
  },
];

const PrincipalHomepage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navbar/Header is assumed to be included at a higher level (e.g., Layout) */}
      <div className="flex justify-center py-8">
        <div className="w-full max-w-4xl">
          <div className="rounded-t-2xl bg-white shadow-md overflow-hidden">
            <div className="bg-white flex flex-col items-center justify-center py-8 border-b">
              <div className="flex w-full items-center justify-between px-6">
                <User className="h-7 w-7 text-gray-400" />
                <div className="text-center flex-1">
                  <div className="text-2xl font-bold text-gray-900">0 <TrendingUp className="inline h-6 w-6 align-middle text-gray-400" /></div>
                  <div className="font-bold text-md text-gray-700 tracking-wide mt-1">NEJJE</div>
                </div>
                <Button variant="ghost" size="icon">
                  <LogOut className="h-6 w-6 text-gray-400" />
                </Button>
              </div>
            </div>
            <div className="divide-y">
              {principalDashboardSections.map((section) => (
                <div key={section.title} className="py-6 px-4">
                  <h2 className="font-semibold text-lg mb-4 text-gray-900">{section.title}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {section.items.map((item) => (
                      <Card key={item.label} className="flex flex-col items-center justify-center py-8 bg-gray-50 hover:shadow transition-shadow cursor-pointer">
                        {item.icon}
                        <span className="text-sm font-medium text-gray-800">{item.label}</span>
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
