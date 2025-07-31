import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  TrendingUp, DollarSign, Package, ShoppingCart,
  Pill, CreditCard, Activity, Calendar, Bell, Settings,
  Plus, Users, BarChart2
} from 'lucide-react';

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

// Mock data for top selling products with local image placeholders
const topSellingProducts = [
  { id: 1, name: 'Paracetamol 500mg', sales: 245, revenue: '₦122,500', color: 'bg-blue-500', letter: 'P' },
  { id: 2, name: 'Vitamin C 1000mg', sales: 189, revenue: '₦94,500', color: 'bg-green-500', letter: 'V' },
  { id: 3, name: 'Ibuprofen 400mg', sales: 156, revenue: '₦78,000', color: 'bg-orange-500', letter: 'I' },
  { id: 4, name: 'Amoxicillin 250mg', sales: 132, revenue: '₦66,000', color: 'bg-purple-500', letter: 'A' },
  { id: 5, name: 'Multivitamin Complex', sales: 98, revenue: '₦49,000', color: 'bg-red-500', letter: 'M' },
];

const WholesalerHomepage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentStat, setCurrentStat] = useState(0);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Simulate loading for demonstration
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // Responsive check for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640);
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
      <div className="bg-emerald-600 border-b relative">
        {/* Mobile: Settings and Notifications at corners */}
        <div className="absolute top-3 left-3 right-3 flex justify-between items-center md:hidden z-10">
          <Button variant="ghost" size="icon" className="text-white">
            <Settings className="h-5 w-5" />
          </Button>
          <Button variant="ghost" size="icon" className="text-white">
            <Bell className="h-5 w-5" />
          </Button>
        </div>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 pt-14 md:pt-5">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="text-left w-full">
              <h1 className="text-3xl font-bold text-white text-center md:text-left">Wholesaler Dashboard</h1>
              <p className="mt-1 text-lg text-emerald-100 text-center md:text-left">Welcome back, Wholesaler</p>
            </div>
            <div className="mt-3 md:mt-0 flex space-x-3 w-full md:w-auto justify-center md:justify-end hidden md:flex">
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
          <div className="block md:hidden h-2" />

          {/* Stats Cards inside header */}
          <div className="mt-10">
            {/* Desktop: show all stats in a row */}
            <div className="hidden sm:grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <Card key={index} className="p-6">
                    <div className="h-7 w-1/2 mb-2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-9 w-1/3 mb-2 bg-gray-200 rounded animate-pulse" />
                    <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse" />
                  </Card>
                ))
              ) : (
                dashboardStats.map((stat, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-4 p-6 bg-white rounded-xl shadow-md border border-gray-100 transition-transform hover:scale-105 hover:shadow-lg min-h-[110px]"
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </Button>
              {isLoading ? (
                <Card className="p-6 w-64">
                  <div className="h-7 w-1/2 mb-2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-9 w-1/3 mb-2 bg-gray-200 rounded animate-pulse" />
                  <div className="h-5 w-1/4 bg-gray-200 rounded animate-pulse" />
                </Card>
              ) : (
                <div className="flex items-center gap-4 p-6 w-64 bg-white rounded-xl shadow-md border border-gray-100 min-h-[110px]">
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
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Top Selling Products */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden">
              <div className="p-6 bg-white border-b flex justify-between items-center">
                <div className="flex items-center gap-2">
                  <BarChart2 className="h-5 w-5 text-blue-500" />
                  <h2 className="text-lg font-semibold text-gray-900">Top Selling Products</h2>
                </div>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {topSellingProducts.map((product) => (
                    <div key={product.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-4">
                        <div className={`w-10 h-10 rounded flex items-center justify-center text-white font-bold ${product.color}`}>
                          {product.letter}
                        </div>
                        <div>
                          <h3 className="font-medium text-gray-900">{product.name}</h3>
                          <p className="text-sm text-gray-500">{product.sales} units sold</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-medium text-gray-900">{product.revenue}</p>
                        <p className="text-sm text-gray-500">Revenue</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Mobile footer */}
      <footer className="fixed bottom-0 left-0 w-full bg-white border-t shadow-lg z-50 md:hidden">
        <div className="flex flex-col items-center py-2">
          <span className="text-xs text-gray-500 flex items-center gap-1">
            <Package className="h-4 w-4 text-emerald-600" />
            Wholesaler Dashboard
          </span>
        </div>
      </footer>

      {/* FAB for Recent Activities (mobile only) */}
      <button
        className="fixed bottom-20 right-5 z-50 md:hidden bg-emerald-600 text-white rounded-full shadow-lg w-14 h-14 flex items-center justify-center active:scale-95 transition-all"
        onClick={() => setDrawerOpen(true)}
        aria-label="Show Recent Activities"
      >
        <Bell className="h-7 w-7" />
      </button>

      {/* Drawer/modal for full recent activity section */}
      {drawerOpen && (
        <div className="fixed inset-0 z-50 flex items-end md:hidden">
          <div className="absolute inset-0 bg-black bg-opacity-40" onClick={() => setDrawerOpen(false)} />
          <div className="relative w-full bg-white rounded-t-2xl shadow-lg max-h-[80vh] overflow-y-auto">
            <div className="flex justify-between items-center px-4 pt-4 pb-2 border-b">
              <span className="font-semibold text-lg text-gray-900 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-emerald-600" />
                Recent Activity
              </span>
              <button onClick={() => setDrawerOpen(false)} className="text-gray-500 text-2xl font-bold">&times;</button>
            </div>
            <div className="divide-y">
              {isLoading ? (
                Array(4).fill(0).map((_, index) => (
                  <div key={index} className="p-4 flex items-start space-x-3">
                    <div className="h-8 w-8 rounded-full bg-gray-200 animate-pulse" />
                    <div className="flex-1">
                      <div className="h-4 w-3/4 mb-2 bg-gray-200 rounded animate-pulse" />
                      <div className="h-3 w-1/2 bg-gray-200 rounded animate-pulse" />
                    </div>
                  </div>
                ))
              ) : (
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
              <Button variant="link" className="w-full text-sm text-emerald-600" onClick={() => setDrawerOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default WholesalerHomepage; 