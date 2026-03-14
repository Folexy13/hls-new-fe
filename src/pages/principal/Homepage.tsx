import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LogOut, User, TrendingUp, CreditCard, Users, ShoppingCart,
  UserPlus, Pill, FileText, Mic, Activity, DollarSign,
  BarChart2, Calendar, Bell, Settings
} from 'lucide-react';
import { apiClient } from '@/config/axios';

// Dashboard sections with navigation links
const principalDashboardSections = [
  {
    title: "Wallet",
    items: [
      { icon: <CreditCard className="h-6 w-6 text-emerald-600" />, label: "Account", href: "/principal/account" },
      { icon: <TrendingUp className="h-6 w-6 text-emerald-600" />, label: "Earnings", href: "/principal/earnings" },
      { icon: <DollarSign className="h-6 w-6 text-emerald-600" />, label: "Withdraw", href: "/principal/withdraw" },
    ]
  },

  {
    title: "Network",
    items: [
      { icon: <Users className="h-6 w-6 text-indigo-600" />, label: "Benfeks", href: "/principal/benfeks" },
      { icon: <UserPlus className="h-6 w-6 text-indigo-600" />, label: "Add Benfek", href: "/principal/add-benfek" },
      { icon: <User className="h-6 w-6 text-indigo-600" />, label: "Users", href: "/principal/users" },
    ]
  },

  {
    title: "Store",
    items: [
      { icon: <Pill className="h-6 w-6 text-purple-600" />, label: "Medications", href: "/principal/medications" },
      { icon: <ShoppingCart className="h-6 w-6 text-purple-600" />, label: "Purchases", href: "/principal/purchases" },
    ]
  },

  {
    title: "Content",
    items: [
      { icon: <FileText className="h-6 w-6 text-blue-600" />, label: "Articles", href: "/principal/articles" },
      { icon: <Mic className="h-6 w-6 text-blue-600" />, label: "Podcasts", href: "/principal/podcasts" },
    ]
  },

  {
    title: "System",
    items: [
      { icon: <Settings className="h-6 w-6 text-gray-600" />, label: "Settings", href: "/principal/settings" },
    ]
  }

];

// Interface for dashboard stats
interface DashboardStats {
  totalBenfeks: number;
  walletBalance: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
}

// Interface for benfek data
interface BenfekData {
  id: number;
  code: string;
  benfekName: string;
  benfekPhone: string;
  registrationStatus: string;
  createdAt?: string;
}

const PrincipalHomepage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState<DashboardStats>({
    totalBenfeks: 0,
    walletBalance: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
  });
  const [recentBenfeks, setRecentBenfeks] = useState<BenfekData[]>([]);
  const { user } = useStore();

  // Fetch real data from API
  useEffect(() => {
    const fetchDashboardData = async () => {
      setIsLoading(true);
      try {
        // Fetch benfeks count
        const benfeksResponse = await apiClient.get('/quiz-code/benfeks?page=1&limit=5');
        const benfeksData = benfeksResponse.data?.data;
        
        // Fetch income summary
        const incomeResponse = await apiClient.get('/principals/me/income-summary');
        const incomeData = incomeResponse.data?.data;

        setStats({
          totalBenfeks: benfeksData?.pagination?.total || 0,
          walletBalance: incomeData?.walletBalance || 0,
          totalWithdrawals: incomeData?.withdrawals?.totalCompleted || 0,
          pendingWithdrawals: incomeData?.withdrawals?.totalPending || 0,
        });

        // Set recent benfeks for activity feed
        setRecentBenfeks(benfeksData?.benfeks || []);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  // Format currency
  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `₦${(amount / 1000000).toFixed(1)}M`;
    } else if (amount >= 1000) {
      return `₦${(amount / 1000).toFixed(1)}K`;
    }
    return `₦${amount.toLocaleString()}`;
  };

  // Dynamic dashboard stats based on real data
  const dashboardStats = [
    { title: 'Total Benfeks', value: stats.totalBenfeks.toString(), icon: <Users className="h-5 w-5" />, change: '', color: 'bg-blue-500' },
    { title: 'Wallet Balance', value: formatCurrency(stats.walletBalance), icon: <DollarSign className="h-5 w-5" />, change: '', color: 'bg-emerald-500' },
    { title: 'Total Withdrawn', value: formatCurrency(stats.totalWithdrawals), icon: <CreditCard className="h-5 w-5" />, change: '', color: 'bg-purple-500' },
    { title: 'Pending Withdrawals', value: formatCurrency(stats.pendingWithdrawals), icon: <Activity className="h-5 w-5" />, change: '', color: 'bg-amber-500' },
  ];

  // Dynamic recent activities based on real benfeks
  const recentActivities = recentBenfeks.map((benfek, index) => ({
    id: benfek.id || index,
    action: benfek.registrationStatus === 'registered' ? 'Benfek registered' : 'Quiz code created',
    user: benfek.benfekName || 'Unknown',
    time: benfek.createdAt ? new Date(benfek.createdAt).toLocaleDateString() : 'Recently',
    icon: benfek.registrationStatus === 'registered' 
      ? <UserPlus className="h-4 w-4 text-emerald-500" />
      : <FileText className="h-4 w-4 text-blue-500" />,
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Principal Dashboard</h1>
              <p className="mt-1 text-sm text-gray-500">Welcome back, {user?.name || 'Principal'}</p>
            </div>
            <div className="mt-4 md:mt-0 flex space-x-3">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {isLoading ? (
            // Skeleton loaders for stats
            Array(4).fill(0).map((_, index) => (
              <Card key={index} className="p-6">
                <Skeleton className="h-7 w-1/2 mb-2" />
                <Skeleton className="h-9 w-1/3 mb-2" />
                <Skeleton className="h-5 w-1/4" />
              </Card>
            ))
          ) : (
            // Actual stats cards
            dashboardStats.map((stat, index) => (
              <Card key={index} className="p-6 border-l-4" style={{ borderLeftColor: stat.color.replace('bg-', '') }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                    <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      {stat.change} from last month
                    </p>
                  </div>
                  <div className={`${stat.color} text-white p-2 rounded-lg`}>
                    {stat.icon}
                  </div>
                </div>
              </Card>
            ))
          )}
        </div>

        {/* Quick Access Menu */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {isLoading ? (
              // Skeleton loaders for quick access
              Array(6).fill(0).map((_, index) => (
                <Card key={index} className="p-4 flex flex-col items-center">
                  <Skeleton className="h-10 w-10 rounded-full mb-3" />
                  <Skeleton className="h-4 w-20" />
                </Card>
              ))
            ) : (
              // Quick access buttons
              [
                
                  { icon: <Users className="h-6 w-6 text-indigo-600" />, label: "Benfeks", href: "/principal/benfeks" },
                  { icon: <UserPlus className="h-6 w-6 text-indigo-600" />, label: "Add Benfek", href: "/principal/add-benfek" },
                  { icon: <Pill className="h-6 w-6 text-purple-600" />, label: "Medications", href: "/principal/medications" },
                  { icon: <ShoppingCart className="h-6 w-6 text-emerald-600" />, label: "Purchases", href: "/principal/purchases" },
                  { icon: <TrendingUp className="h-6 w-6 text-amber-600" />, label: "Earnings", href: "/principal/earnings" },
                  { icon: <DollarSign className="h-6 w-6 text-green-600" />, label: "Withdraw", href: "/principal/withdraw" },
                

              ].map((item, index) => (
                <Link to={item.href} key={index}>
                  <Card className="p-4 flex flex-col items-center hover:bg-gray-50 transition-colors cursor-pointer">
                    <div className="bg-gray-100 p-3 rounded-full mb-3">
                      {item.icon}
                    </div>
                    <span className="text-sm font-medium text-gray-700">{item.label}</span>
                  </Card>
                </Link>
              ))
            )}
          </div>
        </div>

        {/* Two-column layout for Recent Activity and Menu Sections */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Activity */}
          <div className="lg:col-span-1">
            <Card className="overflow-hidden">
              <div className="p-6 bg-white border-b">
                <h2 className="text-lg font-semibold text-gray-900 flex items-center">
                  <Activity className="h-5 w-5 mr-2 text-emerald-600" />
                  Recent Activity
                </h2>
              </div>
              <div className="divide-y">
                {isLoading ? (
                  // Skeleton loaders for activities
                  Array(4).fill(0).map((_, index) => (
                    <div key={index} className="p-4 flex items-start space-x-3">
                      <Skeleton className="h-8 w-8 rounded-full" />
                      <div className="flex-1">
                        <Skeleton className="h-4 w-3/4 mb-2" />
                        <Skeleton className="h-3 w-1/2" />
                      </div>
                    </div>
                  ))
                ) : (
                  // Actual activity items
                  recentActivities.map((activity) => (
                    <div key={activity.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start space-x-3">
                        <div className="bg-gray-100 p-2 rounded-full">
                          {activity.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">{activity.user}</span> • {activity.time}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t">
                <Button variant="link" className="w-full text-sm text-emerald-600">
                  View All Activity
                </Button>
              </div>
            </Card>
          </div>

          {/* Menu Sections */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="p-6 bg-white border-b">
                <h2 className="text-lg font-semibold text-gray-900">Dashboard Menu</h2>
              </div>
              <div className="divide-y">
                {principalDashboardSections.map((section) => (
                  <div key={section.title} className="p-6">
                    <h3 className="font-semibold text-md mb-4 text-gray-700">{section.title}</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {isLoading ? (
                        // Skeleton loaders for menu items
                        Array(3).fill(0).map((_, index) => (
                          <Card key={index} className="p-6">
                            <Skeleton className="h-8 w-8 mx-auto mb-3 rounded-full" />
                            <Skeleton className="h-4 w-20 mx-auto" />
                          </Card>
                        ))
                      ) : (
                        // Actual menu items
                        section.items.map((item) => (
                          <Link to={item.href} key={item.label}>
                            <Card className="flex flex-col items-center justify-center py-6 hover:shadow-md transition-shadow cursor-pointer border-t-4 border-t-transparent hover:border-t-emerald-500">
                              <div className="bg-gray-100 p-3 rounded-full mb-3">
                                {item.icon}
                              </div>
                              <span className="text-sm font-medium text-gray-800">{item.label}</span>
                            </Card>
                          </Link>
                        ))
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalHomepage;
