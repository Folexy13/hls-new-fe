import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  TrendingUp, DollarSign, Package, ShoppingCart,
  Pill, CreditCard, Activity, Calendar, Bell, Settings,
  Plus, Users, BarChart2
} from 'lucide-react';
import { useRBAC } from '../../context/useRBAC';

// Mock data for dashboard stats
const dashboardStats = [
  { title: 'Total Earnings', value: '₦850,000', icon: <DollarSign className="h-5 w-5" />, change: '+12%', color: 'bg-emerald-500' },
  { title: 'Active Products', value: '24', icon: <Pill className="h-5 w-5" />, change: '+5%', color: 'bg-blue-500' },
  { title: 'Total Orders', value: '156', icon: <ShoppingCart className="h-5 w-5" />, change: '+18%', color: 'bg-purple-500' },
  { title: 'Commission Rate', value: '15%', icon: <TrendingUp className="h-5 w-5" />, change: '+2%', color: 'bg-amber-500' },
];

// Mock data for recent activities
const recentActivities = [
  { id: 1, action: 'New order received', product: 'Paracetamol 500mg', time: '2 hours ago', icon: <ShoppingCart className="h-4 w-4 text-blue-500" /> },
  { id: 2, action: 'Product approved', product: 'Vitamin C 1000mg', time: '4 hours ago', icon: <Pill className="h-4 w-4 text-emerald-500" /> },
  { id: 3, action: 'Commission paid', amount: '₦25,000', time: 'Yesterday', icon: <CreditCard className="h-4 w-4 text-purple-500" /> },
  { id: 4, action: 'New product added', product: 'Ibuprofen 400mg', time: 'Yesterday', icon: <Plus className="h-4 w-4 text-amber-500" /> },
];

// Mock data for top selling products
const topSellingProducts = [
  { id: 1, name: 'Paracetamol 500mg', sales: 245, revenue: '₦122,500', image: 'https://via.placeholder.com/40/4299E1/FFFFFF?text=P' },
  { id: 2, name: 'Vitamin C 1000mg', sales: 189, revenue: '₦94,500', image: 'https://via.placeholder.com/40/48BB78/FFFFFF?text=V' },
  { id: 3, name: 'Ibuprofen 400mg', sales: 156, revenue: '₦78,000', image: 'https://via.placeholder.com/40/ED8936/FFFFFF?text=I' },
  { id: 4, name: 'Amoxicillin 250mg', sales: 132, revenue: '₦66,000', image: 'https://via.placeholder.com/40/9F7AEA/FFFFFF?text=A' },
  { id: 5, name: 'Multivitamin Complex', sales: 98, revenue: '₦49,000', image: 'https://via.placeholder.com/40/F56565/FFFFFF?text=M' },
];

const WholesalerHomepage: React.FC = () => {
  const { userRole } = useRBAC();
  const [isLoading, setIsLoading] = useState(false);
  const [currentStat, setCurrentStat] = useState(0); // for mobile stat navigation

  // Simulate loading for demonstration
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Responsive check for mobile
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640); // Tailwind's sm breakpoint
    };
    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handlePrevStat = () => {
    setCurrentStat((prev) => (prev === 0 ? dashboardStats.length - 1 : prev - 1));
  };
  const handleNextStat = () => {
    setCurrentStat((prev) => (prev === dashboardStats.length - 1 ? 0 : prev + 1));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Dashboard Header */}
      <div className="bg-emerald-600 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-left w-full">
              <h1 className="text-3xl font-bold text-white">Wholesaler Dashboard</h1>
              <p className="mt-1 text-lg text-emerald-100 text-center md:text-left">Welcome back, Wholesaler</p>
            </div>
            <div className="mt-3 md:mt-0 flex space-x-3 w-full md:w-auto justify-center md:justify-end">
              <Button variant="secondary" size="sm" className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 border-none">
                <Bell className="h-4 w-4" />
                <span className="hidden sm:inline">Notifications</span>
              </Button>
              <Button variant="secondary" size="sm" className="flex items-center gap-2 bg-white text-emerald-700 hover:bg-emerald-50 border-none">
                <Settings className="h-4 w-4" />
                <span className="hidden sm:inline">Settings</span>
              </Button>
            </div>
          </div>
          {/* Add extra spacing for mobile */}
          <div className="block md:hidden h-2" />

          {/* Stats Cards inside header */}
          <div className="mt-10">
            {/* Desktop: show all stats in a row; Mobile: show one stat with arrows */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="p-6">
                    <Skeleton className="h-7 w-1/2 mb-2" />
                    <Skeleton className="h-9 w-1/3 mb-2" />
                    <Skeleton className="h-5 w-1/4" />
                  </Card>
                ))
              ) : (
                dashboardStats.map((stat, index) => (
                  <div
                    key={index}
                    className={
                      `flex items-center gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105 hover:shadow-lg min-h-[110px]`
                    }
                  >
                    <div className={`flex items-center justify-center w-12 h-12 rounded-full ${stat.color} bg-opacity-20`}>
                      <span className={`text-xl ${stat.color} flex items-center`}>{stat.icon}</span>
                    </div>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-500 mb-1">{stat.title}</p>
                      <h3 className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</h3>
                      <p className="text-xs font-medium text-emerald-600 flex items-center">
                        <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                        {stat.change} from last month
                      </p>
                    </div>
                  </div>
                ))
              )}
            </div>
            {/* Mobile: show one stat with arrows */}
            <div className="sm:hidden flex items-center justify-center gap-2">
              <Button size="icon" variant="secondary" className="bg-white text-emerald-700 border-none" onClick={handlePrevStat} aria-label="Previous Stat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
              </Button>
              {isLoading ? (
                <Card className="p-6 w-64">
                  <Skeleton className="h-7 w-1/2 mb-2" />
                  <Skeleton className="h-9 w-1/3 mb-2" />
                  <Skeleton className="h-5 w-1/4" />
                </Card>
              ) : (
                <div
                  className={`flex items-center gap-4 p-6 w-64 bg-white rounded-xl shadow-md border border-gray-100 min-h-[110px]`}
                >
                  <div className={`flex items-center justify-center w-12 h-12 rounded-full ${dashboardStats[currentStat].color} bg-opacity-20`}>
                    <span className={`text-xl ${dashboardStats[currentStat].color} flex items-center`}>{dashboardStats[currentStat].icon}</span>
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-500 mb-1">{dashboardStats[currentStat].title}</p>
                    <h3 className="text-2xl font-bold text-gray-900 mb-1">{dashboardStats[currentStat].value}</h3>
                    <p className="text-xs font-medium text-emerald-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1 text-emerald-600" />
                      {dashboardStats[currentStat].change} from last month
                    </p>
                  </div>
                </div>
              )}
              <Button size="icon" variant="secondary" className="bg-white text-emerald-700 border-none" onClick={handleNextStat} aria-label="Next Stat">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Access Menu */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Access</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {isLoading ? (
              // Skeleton loaders for quick access
              Array(5).fill(0).map((_, index) => (
                <Card key={index} className="p-4 flex flex-col items-center">
                  <Skeleton className="h-10 w-10 rounded-full mb-3" />
                  <Skeleton className="h-4 w-20" />
                </Card>
              ))
            ) : (
              // Quick access buttons
              [
                { icon: <Pill className="h-6 w-6 text-blue-600" />, label: 'My Products', href: '/wholesaler/products' },
                { icon: <Plus className="h-6 w-6 text-emerald-600" />, label: 'Add Product', href: '/wholesaler/add-product' },
                { icon: <ShoppingCart className="h-6 w-6 text-purple-600" />, label: 'Orders', href: '/wholesaler/orders' },
                { icon: <DollarSign className="h-6 w-6 text-amber-600" />, label: 'Earnings', href: '/wholesaler/earnings' },
                { icon: <Settings className="h-6 w-6 text-gray-600" />, label: 'Settings', href: '/wholesaler/settings' },
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

        {/* Two-column layout for Recent Activity and Top Selling Products */}
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
                            {activity.product && <span className="font-medium">{activity.product}</span>}
                            {activity.amount && <span className="font-medium">{activity.amount}</span>}
                            {' • '}{activity.time}
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

          {/* Top Selling Products */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="p-6 bg-white border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                </div>
                <Link to="/wholesaler/products">
                  <Button variant="outline" size="sm">View All</Button>
                </Link>
              </div>
              <div className="p-6">
                {isLoading ? (
                  // Skeleton loaders for products
                  Array(5).fill(0).map((_, index) => (
                    <div key={index} className="flex items-center justify-between py-3 border-b last:border-0">
                      <div className="flex items-center space-x-3">
                        <Skeleton className="h-10 w-10 rounded" />
                        <div>
                          <Skeleton className="h-4 w-32 mb-1" />
                          <Skeleton className="h-3 w-16" />
                        </div>
                      </div>
                      <div className="text-right">
                        <Skeleton className="h-4 w-16 mb-1 ml-auto" />
                        <Skeleton className="h-3 w-20 ml-auto" />
                      </div>
                    </div>
                  ))
                ) : (
                  // Actual product items
                  topSellingProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between py-3 border-b last:border-0 hover:bg-gray-50 px-2 rounded-md">
                      <div className="flex items-center space-x-3">
                        <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                        <div>
                          <p className="font-medium text-gray-900">{product.name}</p>
                          <p className="text-xs text-gray-500">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-emerald-600">{product.revenue}</p>
                        <p className="text-xs text-gray-500">Total Revenue</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="p-4 bg-gray-50 border-t">
                <Link to="/wholesaler/add-product">
                  <Button className="w-full flex items-center justify-center gap-2">
                    <Plus className="h-4 w-4" />
                    Add New Product
                  </Button>
                </Link>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WholesalerHomepage;
