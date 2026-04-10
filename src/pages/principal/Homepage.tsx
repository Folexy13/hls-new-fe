import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { useStore } from '@/store/useStore';
import { Skeleton } from '@/components/ui/skeleton';
import {
  LogOut,
  User,
  UserRound,
  TrendingUp,
  CreditCard,
  Users,
  UserPlus,
  Pill,
  FileText,
  Mic,
  DollarSign,
  Settings,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';
import { Icon } from '@iconify/react';
import { apiClient } from '@/config/axios';

const principalDashboardSections = [
  {
    title: 'Wallet',
    items: [
      {
        icon: <CreditCard className="h-6 w-6 text-emerald-600" />,
        label: 'Account',
        href: '/principal/account',
      },
      {
        icon: <TrendingUp className="h-6 w-6 text-emerald-600" />,
        label: 'Earnings',
        href: '/principal/earnings',
      },
      {
        icon: <DollarSign className="h-6 w-6 text-emerald-600" />,
        label: 'Withdraw',
        href: '/principal/withdraw',
      },
    ],
  },
  {
    title: 'Directory',
    items: [
      {
        icon: <Icon icon="healthicons:doctor-male-outline" className="h-9 w-9 text-emerald-600" />,
        label: 'My Profile',
        href: '/principal/my-profile',
      },
      {
        icon: <UserPlus className="h-6 w-6 text-emerald-600" />,
        label: 'Add Benfek',
        href: '/principal/add-benfek',
      },
      {
        icon: <Users className="h-6 w-6 text-emerald-600" />,
        label: 'Benfeks',
        href: '/principal/benfeks',
      },
    ],
  },
  {
    title: 'Build webpage',
    items: [
      {
        icon: <Pill className="h-6 w-6 text-emerald-600" />,
        label: 'Medications',
        href: '/principal/medications',
      },
      {
        icon: <FileText className="h-6 w-6 text-emerald-600" />,
        label: 'Articles',
        href: '/principal/articles',
      },
      {
        icon: <Mic className="h-6 w-6 text-emerald-600" />,
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

interface DashboardStats {
  totalBenfeks: number;
  walletBalance: number;
  totalWithdrawals: number;
  pendingWithdrawals: number;
}

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
  const [showRecentActivities, setShowRecentActivities] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalBenfeks: 0,
    walletBalance: 0,
    totalWithdrawals: 0,
    pendingWithdrawals: 0,
  });
  const [recentBenfeks, setRecentBenfeks] = useState<BenfekData[]>([]);
  const { user } = useStore();

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

  const formatCurrency = (amount: number) => {
    if (amount >= 1000000) {
      return `NGN ${(amount / 1000000).toFixed(1)}M`;
    }
    if (amount >= 1000) {
      return `NGN ${(amount / 1000).toFixed(1)}K`;
    }
    return `NGN ${amount.toLocaleString()}`;
  };

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

  const walletShortcutSections = principalDashboardSections.filter((section) =>
    ['Wallet', 'Directory', 'Build webpage'].includes(section.title)
  );

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
        <div className="max-w-6xl mx-auto px-4 py-6 sm:py-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300 font-semibold">Principal</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">Dashboard Overview</h1>
              <p className="mt-2 text-sm text-slate-300">
                Welcome back, {user?.name || 'Principal'}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 border border-white/10">
                <p className="text-xs text-slate-300">Wallet Balance</p>
                <p className="text-lg font-semibold">
                  {isLoading ? '...' : formatCurrency(stats.walletBalance)}
                </p>
              </div>
              <div className="rounded-2xl bg-white/10 px-4 py-3 border border-white/10">
                <p className="text-xs text-slate-300">Total Benfeks</p>
                <p className="text-lg font-semibold">{isLoading ? '...' : stats.totalBenfeks}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-6">
          {/* <div className="space-y-6">
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              <Card className="p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <Users className="h-5 w-5 text-indigo-600" />
                  <span className="text-xs text-slate-500">Benfeks</span>
                </div>
                <p className="text-xl font-semibold mt-3">
                  {isLoading ? '...' : stats.totalBenfeks}
                </p>
              </Card>
              <Card className="p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <CreditCard className="h-5 w-5 text-emerald-600" />
                  <span className="text-xs text-slate-500">Wallet</span>
                </div>
                <p className="text-xl font-semibold mt-3">
                  {isLoading ? '...' : formatCurrency(stats.walletBalance)}
                </p>
              </Card>
              <Card className="p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <TrendingUp className="h-5 w-5 text-blue-600" />
                  <span className="text-xs text-slate-500">Withdrawn</span>
                </div>
                <p className="text-xl font-semibold mt-3">
                  {isLoading ? '...' : stats.totalWithdrawals}
                </p>
              </Card>
              <Card className="p-4 border border-slate-200 shadow-sm">
                <div className="flex items-center justify-between">
                  <DollarSign className="h-5 w-5 text-amber-600" />
                  <span className="text-xs text-slate-500">Pending</span>
                </div>
                <p className="text-xl font-semibold mt-3">
                  {isLoading ? '...' : stats.pendingWithdrawals}
                </p>
              </Card>
            </div>

          </div> */}

          <div className="space-y-6">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() =>
                  setShowQuickAccess((prev) => {
                    const next = !prev;
                    if (next) {
                      setShowRecentActivities(false);
                    }
                    return next;
                  })
                }
                className="flex-1 rounded-full border border-yellow-200 bg-yellow-50 px-4 py-2 text-sm font-medium text-yellow-800 shadow-sm hover:bg-yellow-100 transition-colors flex items-center justify-between"
              >
                <span>Quick Actions</span>
                {showQuickAccess ? (
                  <ChevronUp className="h-4 w-4 text-yellow-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-yellow-500" />
                )}
              </button>
              <button
                type="button"
                onClick={() =>
                  setShowRecentActivities((prev) => {
                    const next = !prev;
                    if (next) {
                      setShowQuickAccess(false);
                    }
                    return next;
                  })
                }
                className="flex-1 rounded-full border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-medium text-rose-800 shadow-sm hover:bg-rose-100 transition-colors flex items-center justify-between"
              >
                <span>Recent Activities</span>
                {showRecentActivities ? (
                  <ChevronUp className="h-4 w-4 text-rose-500" />
                ) : (
                  <ChevronDown className="h-4 w-4 text-rose-500" />
                )}
              </button>
            </div>

            <div className="space-y-4">
              {showQuickAccess && (
                <Card className="border border-slate-200 shadow-sm overflow-hidden">
                  <div className="p-5 border-b bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">Quick Actions</h2>
                  </div>
                  <div className="p-6 text-sm text-slate-500">
                    Quick actions will be added soon.
                  </div>
                </Card>
              )}

              {showRecentActivities && (
                <Card className="border border-slate-200 shadow-sm">
                  <div className="p-5 border-b bg-white">
                    <h2 className="text-lg font-semibold text-gray-900">Recent Activity</h2>
                    <p className="text-sm text-gray-500 mt-1">Latest updates from your network.</p>
                  </div>
                  <div className="p-5 space-y-4">
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
                        <div key={activity.id} className="flex items-start space-x-3">
                          <div className="bg-slate-100 p-2 rounded-full">{activity.icon}</div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">
                              {activity.action}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              <span className="font-medium">{activity.user}</span> - {activity.time}
                            </p>
                          </div>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent activity yet.</p>
                    )}
                  </div>
                </Card>
              )}

              <Card className="border border-slate-200 shadow-sm">
                {/* <div className="p-5 border-b bg-white">
                  <h2 className="text-lg font-semibold text-gray-900">Wallet Shortcuts</h2>
                  <p className="text-sm text-gray-500 mt-1">Quick access to financial actions.</p>
                </div> */}
                <div className="p-5 space-y-4">
                  {walletShortcutSections.map((section, index) => (
                    <div key={section.title} className={index === 0 ? '' : 'pt-4 border-t'}>
                      <h3 className="text-md font-semibold text-gray-900 mb-4 uppercase tracking-wider">
                        {section.title}
                      </h3>
                      <div className="grid grid-cols-3 gap-3">
                        {section.items.map((item) => (
                          <Link
                            to={item.href}
                            key={item.label}
                            className="bg-slate-50 rounded-xl h-20 flex flex-col items-center justify-between py-3 text-center border border-slate-100 hover:bg-white hover:shadow-sm transition-all"
                          >
                            <div className="flex h-9 w-9 items-center justify-center">
                              {item.icon}
                            </div>
                            <span className="text-xs text-gray-700 leading-none">{item.label}</span>
                          </Link>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrincipalHomepage;
