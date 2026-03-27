import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LogOut,
  User,
  TrendingUp,
  CreditCard,
  Users,
  ShoppingCart,
  UserPlus,
  Pill,
  FileText,
  Mic,
  Activity,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { apiClient } from '@/config/axios';

// Dashboard sections with navigation links
const principalDashboardSections = [
  {
    title: 'Directory',
    items: [
      {
        icon: <Users className="h-6 w-6 text-indigo-600" />,
        label: 'Benfeks',
        href: '/principal/benfeks',
      },
      {
        icon: <UserPlus className="h-6 w-6 text-indigo-600" />,
        label: 'Add Benfek',
        href: '/principal/add-benfek',
      },
      {
        icon: <User className="h-6 w-6 text-indigo-600" />,
        label: 'Users',
        href: '/principal/users',
      },
    ],
  },
  {
    title: 'Store',
    items: [
      {
        icon: <Pill className="h-6 w-6 text-purple-600" />,
        label: 'Medications',
        href: '/principal/medications',
      },
      {
        icon: <ShoppingCart className="h-6 w-6 text-purple-600" />,
        label: 'Purchases',
        href: '/principal/purchases',
      },
    ],
  },
  {
    title: 'Content',
    items: [
      {
        icon: <FileText className="h-6 w-6 text-blue-600" />,
        label: 'Articles',
        href: '/principal/articles',
      },
      {
        icon: <Mic className="h-6 w-6 text-blue-600" />,
        label: 'Podcasts',
        href: '/principal/podcasts',
      },
    ],
  },
  {
    title: 'System',
    items: [
      {
        icon: <Settings className="h-6 w-6 text-gray-600" />,
        label: 'Settings',
        href: '/principal/settings',
      },
    ],
  },
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
  const [showQuickAccess, setShowQuickAccess] = useState(false);
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
        const benfeksResponse = await apiClient.get(
          '/api/v2/quiz-code/benfeks?page=1&limit=5'
        );
        const benfeksData = benfeksResponse.data?.data;

        const incomeResponse = await apiClient.get(
          '/api/v2/principals/me/income-summary'
        );
        const incomeData = incomeResponse.data?.data;

        setStats({
          totalBenfeks: benfeksData?.pagination?.total || 0,
          walletBalance: incomeData?.walletBalance || 0,
          totalWithdrawals: incomeData?.withdrawals?.totalCompleted || 0,
          pendingWithdrawals: incomeData?.withdrawals?.totalPending || 0,
        });

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

  // Dynamic recent activities based on real benfeks
  const recentActivities = recentBenfeks.map((benfek, index) => ({
    id: benfek.id || index,
    action:
      benfek.registrationStatus === 'registered'
        ? 'Benfek registered'
        : 'Quiz code created',
    user: benfek.benfekName || 'Unknown',
    time: benfek.createdAt
      ? new Date(benfek.createdAt).toLocaleDateString()
      : 'Recently',
    icon:
      benfek.registrationStatus === 'registered' ? (
        <UserPlus className="h-4 w-4 text-emerald-500" />
      ) : (
        <FileText className="h-4 w-4 text-blue-500" />
      ),
  }));

  return (
    <div className="min-h-screen bg-gray-50 pb-10">
      {/* Dashboard Header */}
      <div className="bg-white border-b">
        <div className="max-w-md mx-auto px-4 py-5">
          <div>
            <h1 className="text-xl font-bold text-gray-900">
              Principal Dashboard
            </h1>
            <p className="mt-1 text-sm text-gray-500">
              Welcome back, {user?.name || 'Principal'}
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-md mx-auto px-4 py-6">
        {/* Top Dashboard Card */}
        <div className="bg-gray-100 rounded-2xl px-5 py-6 shadow-sm mb-4 border border-gray-200">
          <div className="flex items-center justify-between mb-5">
            <User className="h-5 w-5 text-gray-700" />
            <LogOut className="h-5 w-5 text-gray-700" />
          </div>

          <div className="text-center mb-6">
            <p className="text-3xl font-bold text-gray-900 leading-none">
              {isLoading ? '...' : formatCurrency(stats.walletBalance)}
            </p>
            <p className="text-xs mt-2 tracking-wide font-medium uppercase text-gray-600">
              Principal Dashboard
            </p>
          </div>

          {/* Wallet inside dashboard */}
          <div>
            <h2 className="text-lg font-semibold text-gray-800 mb-3">Wallet</h2>

            <div className="grid grid-cols-3 gap-3">
              <Link
                to="/principal/account"
                className="bg-white rounded-xl h-20 flex flex-col items-center justify-center text-center border border-gray-200"
              >
                <CreditCard className="h-5 w-5 text-gray-800 mb-1" />
                <span className="text-xs text-gray-700">Account</span>
              </Link>

              <Link
                to="/principal/earnings"
                className="bg-white rounded-xl h-20 flex flex-col items-center justify-center text-center border border-gray-200"
              >
                <TrendingUp className="h-5 w-5 text-gray-800 mb-1" />
                <span className="text-xs text-gray-700">Earnings</span>
              </Link>

              <Link
                to="/principal/withdraw"
                className="bg-white rounded-xl h-20 flex flex-col items-center justify-center text-center border border-gray-200"
              >
                <DollarSign className="h-5 w-5 text-gray-800 mb-1" />
                <span className="text-xs text-gray-700">Withdraw</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Quick Access Dropdown */}
        <Card className="overflow-hidden rounded-2xl border border-gray-200 shadow-sm">
          <button
            onClick={() => setShowQuickAccess(!showQuickAccess)}
            className="w-full flex items-center justify-between px-5 py-4 bg-white"
          >
            <h2 className="text-lg font-semibold text-gray-900">
              Quick Access
            </h2>

            <div className="flex items-center gap-2 text-sm text-gray-500">
              <span>{showQuickAccess ? 'Hide' : 'Show'}</span>
              {showQuickAccess ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </div>
          </button>

          {showQuickAccess && (
            <div className="divide-y">
              {principalDashboardSections.map((section) => (
                <div key={section.title} className="p-5">
                  <h3 className="font-semibold text-base mb-4 text-gray-700">
                    {section.title}
                  </h3>

                  <div className="grid grid-cols-3 gap-3">
                    {section.items.map((item) => (
                      <Link to={item.href} key={item.label}>
                        <div className="bg-gray-50 rounded-xl h-24 flex flex-col items-center justify-center text-center border border-gray-100 hover:bg-gray-100 transition-colors">
                          <div className="mb-2">{item.icon}</div>
                          <span className="text-xs font-medium text-gray-800 px-1 leading-tight">
                            {item.label}
                          </span>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              ))}

              {/* Recent Activity under quick access */}
              <div className="p-5">
                <h3 className="font-semibold text-base mb-4 text-gray-700">
                  Recent Activity
                </h3>

                <div className="space-y-3">
                  {isLoading ? (
                    Array(3)
                      .fill(0)
                      .map((_, index) => (
                        <div key={index} className="flex items-start space-x-3">
                          <Skeleton className="h-8 w-8 rounded-full" />
                          <div className="flex-1">
                            <Skeleton className="h-4 w-3/4 mb-2" />
                            <Skeleton className="h-3 w-1/2" />
                          </div>
                        </div>
                      ))
                  ) : recentActivities.length > 0 ? (
                    recentActivities.map((activity) => (
                      <div
                        key={activity.id}
                        className="flex items-start space-x-3"
                      >
                        <div className="bg-gray-100 p-2 rounded-full">
                          {activity.icon}
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900">
                            {activity.action}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            <span className="font-medium">{activity.user}</span>{' '}
                            • {activity.time}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-gray-500">
                      No recent activity yet.
                    </p>
                  )}
                </div>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default PrincipalHomepage;