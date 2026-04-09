import React, { useState, useEffect } from 'react';
import { 
  Table, TableBody, TableCaption, TableCell, 
  TableHead, TableHeader, TableRow 
} from '@/components/ui/table';
import { 
  Pagination, PaginationContent, PaginationItem, 
  PaginationLink, PaginationNext, PaginationPrevious 
} from '@/components/ui/pagination';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { 
  Search, Download, ArrowUpDown, TrendingUp, 
  Calendar, ChevronDown, BarChart2, PieChart,
  Users, ShoppingCart, DollarSign, ArrowUp
} from 'lucide-react';

// Define the Earning type
type Earning = {
  id: number;
  source: string;
  benfek: string;
  amount: string;
  date: string;
  category: string;
  commission: string;
};

// Mock data for earnings
const mockEarnings: Earning[] = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  source: ['Product Sale', 'Subscription', 'Referral Bonus', 'Commission', 'Service Fee'][Math.floor(Math.random() * 5)],
  benfek: `Benfek ${Math.floor(Math.random() * 20) + 1}`,
  amount: `₦${(Math.random() * 50000 + 1000).toFixed(2)}`,
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  category: ['Medications', 'Consultations', 'Subscriptions', 'Services'][Math.floor(Math.random() * 4)],
  commission: `${(Math.random() * 20 + 5).toFixed(1)}%`,
}));

// Mock data for charts
const monthlyEarnings = [
  { month: 'Jan', amount: 120000 },
  { month: 'Feb', amount: 145000 },
  { month: 'Mar', amount: 165000 },
  { month: 'Apr', amount: 140000 },
  { month: 'May', amount: 180000 },
  { month: 'Jun', amount: 210000 },
  { month: 'Jul', amount: 250000 },
  { month: 'Aug', amount: 220000 },
  { month: 'Sep', amount: 270000 },
  { month: 'Oct', amount: 290000 },
  { month: 'Nov', amount: 310000 },
  { month: 'Dec', amount: 350000 },
];

const categoryBreakdown = [
  { category: 'Medications', percentage: 45 },
  { category: 'Consultations', percentage: 25 },
  { category: 'Subscriptions', percentage: 20 },
  { category: 'Services', percentage: 10 },
];

const topSupplements = [
  { id: 1, name: 'Vitamin C Immune Boost', purchases: 120 },
  { id: 2, name: 'Omega-3 Plus', purchases: 98 },
  { id: 3, name: 'Magnesium Sleep Aid', purchases: 76 },
  { id: 4, name: 'Joint Care Max', purchases: 64 },
];

const topBenfeks = [
  { id: 1, name: 'Benfek James', totalSpent: 245000, frequency: 14, activity: '12 logins • 4h' },
  { id: 2, name: 'Benfek Linda', totalSpent: 198000, frequency: 10, activity: '9 logins • 3h' },
  { id: 3, name: 'Benfek Ade', totalSpent: 176500, frequency: 8, activity: '7 logins • 2h' },
];

const EarningsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState('all-time');
  const [insightsTab, setInsightsTab] = useState<'supplements' | 'benfeks'>('supplements');
  const [viewTab, setViewTab] = useState<'statistics' | 'performance'>('statistics');
  const [openBenfekId, setOpenBenfekId] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockEarnings.length / itemsPerPage);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setEarnings(mockEarnings);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Filter and sort data
  const filteredData = earnings.filter(earning => 
    earning.source.toLowerCase().includes(searchTerm.toLowerCase()) ||
    earning.benfek.toLowerCase().includes(searchTerm.toLowerCase()) ||
    earning.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField as keyof Earning] < b[sortField as keyof Earning]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField as keyof Earning] > b[sortField as keyof Earning]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Generate pagination items
  const getPaginationItems = () => {
    const items = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      items.push(
        <PaginationItem key={i}>
          <PaginationLink 
            onClick={() => setCurrentPage(i)} 
            isActive={currentPage === i}
          >
            {i}
          </PaginationLink>
        </PaginationItem>
      );
    }
    
    return items;
  };

  // Render bar chart (simplified version)
  const renderBarChart = () => {
    const maxAmount = Math.max(...monthlyEarnings.map(item => item.amount));
    
    return (
      <div className="h-64 flex items-end justify-between gap-1 mt-4">
        {monthlyEarnings.map((item, index) => {
          const height = (item.amount / maxAmount) * 100;
          return (
            <div key={index} className="flex flex-col items-center flex-1">
              <div 
                className="w-full bg-emerald-500 rounded-t-sm hover:bg-emerald-600 transition-colors relative group"
                style={{ height: `${height}%` }}
              >
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-1 bg-gray-800 text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
                  ₦{item.amount.toLocaleString()}
                </div>
              </div>
              <div className="text-xs font-medium mt-1 text-gray-600">{item.month}</div>
            </div>
          );
        })}
      </div>
    );
  };

  // Render pie chart (simplified version)
  const renderPieChart = () => {
    let cumulativePercentage = 0;
    
    return (
      <div className="relative h-64 w-64 mx-auto mt-4">
        <div className="h-full w-full rounded-full overflow-hidden">
          {categoryBreakdown.map((item, index) => {
            const startPercentage = cumulativePercentage;
            cumulativePercentage += item.percentage;
            
            const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];
            
            return (
              <div 
                key={index}
                className={`absolute inset-0 ${colors[index % colors.length]}`}
                style={{
                  clipPath: `polygon(50% 50%, ${50 + 50 * Math.cos(2 * Math.PI * startPercentage / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * startPercentage / 100)}%, ${50 + 50 * Math.cos(2 * Math.PI * cumulativePercentage / 100)}% ${50 + 50 * Math.sin(2 * Math.PI * cumulativePercentage / 100)}%)`
                }}
              />
            );
          })}
        </div>
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white h-32 w-32 rounded-full"></div>
        </div>
      </div>
    );
  };

  // Render pie chart legend
  const renderPieChartLegend = () => {
    const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];
    
    return (
      <div className="mt-6 grid grid-cols-2 gap-2">
        {categoryBreakdown.map((item, index) => (
          <div key={index} className="flex items-center">
            <div className={`h-3 w-3 rounded-sm ${colors[index % colors.length]} mr-2`}></div>
            <span className="text-sm text-gray-600">{item.category} ({item.percentage}%)</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-4">
      <BackToDashboardButton className="fixed left-3 top-[70px] z-50 text-black/90 hover:text-black/80" />
      {/* Page Header */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>

            </div>
            <div className="mt-4 md:mt-0 flex gap-2">
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar className="h-4 w-4" />
                <span>Date Range</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
        </div>
      </div> */}

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div
            role="tablist"
            aria-orientation="horizontal"
            className="grid grid-cols-2 w-full max-w-2xl mx-auto mb-4 h-10 items-center justify-center rounded-md bg-muted p-1 text-muted-foreground"
          >
            <button
              type="button"
              role="tab"
              aria-selected={viewTab === 'statistics'}
              onClick={() => setViewTab('statistics')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                viewTab === 'statistics'
                  ? 'bg-background text-foreground shadow-sm'
                  : ''
              }`}
            >
              Statistics
            </button>
            <button
              type="button"
              role="tab"
              aria-selected={viewTab === 'performance'}
              onClick={() => setViewTab('performance')}
              className={`inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium ring-offset-background transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ${
                viewTab === 'performance'
                  ? 'bg-background text-foreground shadow-sm'
                  : ''
              }`}
            >
              Performance
            </button>
          </div>
          {viewTab === 'statistics' ? (
            <>
              {/* Banner Carousel */}
        <div className="mb-8">
          <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory pb-2">
            <Card className="min-w-full snap-start overflow-hidden">
              <div className="h-[60vh] sm:h-52 w-full rounded-2xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white">
                <div className="h-full w-full p-6 flex flex-col gap-6">
                  <div className="text-sm uppercase tracking-[0.25em] text-white/70">Earnings Summary</div>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {[
                      { title: 'Total Earnings', value: '?5,750,000', change: '+15%' },
                      { title: 'Monthly Average', value: '?250,000', change: '+8%' },
                      { title: 'Active Benfeks', value: '124', change: '+12%' },
                      { title: 'Total Orders', value: '1,450', change: '+18%' },
                    ].map((stat) => (
                      <div key={stat.title} className="rounded-xl bg-white/10 border border-white/10 p-3">
                        <p className="text-xs font-semibold text-white/70">{stat.title}</p>
                        <p className="text-lg font-bold text-white mt-1">{stat.value}</p>
                        <p className="text-xs text-emerald-200 mt-1">{stat.change} from last month</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </Card>
            <Card className="min-w-full snap-start overflow-hidden">
              <div className="h-44 sm:h-52 w-full rounded-2xl bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 text-white border border-white/10">
                <div className="h-full w-full p-6 flex flex-col justify-between gap-4">
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <PieChart className="h-6 w-6 text-sky-300" />
                      <div>
                        <p className="text-xs uppercase tracking-widest text-white/70">Statistics Category</p>
                        <h3 className="text-xl font-semibold text-white">Earnings by Category</h3>
                      </div>
                    </div>
                    <div className="hidden sm:inline-flex rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-semibold text-white/70">
                      Swipe for more
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-[160px_1fr] items-center gap-4">
                    <div className="flex items-center justify-center">
                      <div
                        className="relative h-28 w-28 rounded-full"
                        style={{
                          background: `conic-gradient(
                            #10b981 0% 45%,
                            #3b82f6 45% 70%,
                            #a855f7 70% 90%,
                            #f59e0b 90% 100%
                          )`,
                        }}
                      >
                        <div className="absolute inset-3 rounded-full bg-slate-950 border border-white/10 flex flex-col items-center justify-center text-center px-2">
                          <p className="text-[10px] uppercase tracking-wider text-white/60 font-semibold">Top</p>
                          <p className="text-sm font-bold text-white leading-tight">Medications</p>
                          <p className="text-xs font-semibold text-emerald-300">45%</p>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      {categoryBreakdown.map((item, index) => {
                        const colors = ['bg-emerald-500', 'bg-blue-500', 'bg-purple-500', 'bg-amber-500'];
                        return (
                          <div key={item.category} className="flex items-center gap-3">
                            <div className={`h-3 w-3 rounded-sm ${colors[index % colors.length]}`} />
                            <div className="min-w-0 flex-1">
                              <div className="flex items-center justify-between gap-3">
                                <p className="text-xs font-semibold text-slate-900 truncate">{item.category}</p>
                                <p className="text-xs font-bold text-slate-950">{item.percentage}%</p>
                              </div>
                              <div className="mt-1 h-1.5 w-full rounded-full bg-white/10 overflow-hidden">
                                <div
                                  className={`h-full ${colors[index % colors.length]}`}
                                  style={{ width: `${item.percentage}%` }}
                                />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
              </Card>
              <Card className="min-w-full snap-start overflow-hidden">
                <div className="h-44 sm:h-52 w-full rounded-2xl bg-gradient-to-br from-indigo-950 via-slate-950 to-slate-900 text-white border border-white/10">
                  <div className="h-full w-full p-6 flex flex-col justify-between gap-4">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-widest text-white/70">Peer Rating</p>
                        <h3 className="text-xl font-semibold text-white">Performance vs Peers</h3>
                        <p className="text-xs text-white/60 mt-1">Current vs potential ranking</p>
                      </div>
                      <div className="hidden sm:flex items-center gap-2 text-xs font-semibold text-white/70">
                        <span className="inline-flex h-2 w-2 rounded-full bg-emerald-400" />
                        Current
                        <span className="ml-3 inline-flex h-2 w-2 rounded-full bg-sky-400" />
                        Potential
                      </div>
                    </div>

                    {/* Peer band: shows relative position against peers */}
                    <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                      <div className="flex items-center justify-between text-[11px] font-semibold text-white/60 uppercase tracking-wider">
                        <span>Bottom</span>
                        <span>Average</span>
                        <span>Top</span>
                      </div>
                      <div className="mt-2 relative h-3 w-full rounded-full overflow-hidden bg-white/10">
                        <div className="absolute inset-0 bg-gradient-to-r from-rose-200 via-amber-200 to-emerald-200" />

                        {/* Current marker (68%) */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: '68%' }}
                        >
                          <div className="h-5 w-1.5 rounded-full bg-emerald-400 shadow" />
                        </div>

                        {/* Potential marker (92%) */}
                        <div
                          className="absolute top-1/2 -translate-y-1/2"
                          style={{ left: '92%' }}
                        >
                          <div className="h-5 w-1.5 rounded-full bg-sky-400 shadow" />
                        </div>
                      </div>

                      <div className="mt-3 grid grid-cols-2 gap-3">
                        <div className="rounded-lg bg-white/10 border border-white/10 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-950/80">
                            Current
                          </p>
                          <p className="mt-1 text-lg font-bold text-slate-950">68%</p>
                        </div>
                        <div className="rounded-lg bg-white/10 border border-white/10 p-3">
                          <p className="text-[11px] font-semibold uppercase tracking-wider text-slate-900/80">
                            Potential
                          </p>
                          <p className="mt-1 text-lg font-bold text-slate-950">92%</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </div>
          </div>


            </>
          ) : (
            <Card className="overflow-hidden mb-8">
          <div className="p-6 border-b bg-[chocolate] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
            <h3 className="text-lg font-semibold text-gray-900">Top Performance</h3>
            <div className="inline-flex rounded-full border border-emerald-100 bg-emerald-50/70 p-1">
              <button
                type="button"
                onClick={() => setInsightsTab('supplements')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
                  insightsTab === 'supplements' ? 'bg-emerald-600 text-white' : 'text-emerald-700'
                }`}
              >
                Highest Sold Supplements
              </button>
              <button
                type="button"
                onClick={() => setInsightsTab('benfeks')}
                className={`px-4 py-2 text-xs font-semibold rounded-full transition ${
                  insightsTab === 'benfeks' ? 'bg-emerald-600 text-white' : 'text-emerald-700'
                }`}
              >
                Best Purchasing Benfeks
              </button>
            </div>
          </div>
          <div className="p-6 bg-white">
            {insightsTab === 'supplements' ? (
              <div className="space-y-3">
                {topSupplements.map((item, index) => (
                  <div
                    key={item.id}
                    className="flex items-center justify-between rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {index + 1}. {item.name}
                      </p>
                      <p className="text-xs text-slate-500">{item.purchases} purchases</p>
                    </div>
                    <span className="text-xs font-semibold text-emerald-700">Top seller</span>
                  </div>
                ))}
              </div>
            ) : (
              <div className="space-y-3">
                {topBenfeks.map((benfek) => (
                  <div
                    key={benfek.id}
                    className="rounded-xl border border-slate-200 bg-slate-50 p-4"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setOpenBenfekId((prev) => (prev === benfek.id ? null : benfek.id))
                      }
                      className="w-full flex items-center justify-between text-left"
                    >
                      <div>
                        <p className="text-sm font-semibold text-slate-900">{benfek.name}</p>
                        <p className="text-xs text-slate-500">₦{benfek.totalSpent.toLocaleString()} spent</p>
                      </div>
                      <span className="text-xs text-emerald-700 font-semibold">
                        {benfek.frequency} purchases
                      </span>
                    </button>
                    {openBenfekId === benfek.id && (
                      <div className="mt-3 flex flex-wrap gap-4 text-xs text-slate-600">
                        <div className="min-w-[140px]">
                          <p className="uppercase text-[10px] font-semibold text-slate-500">Frequency</p>
                          <p>{benfek.frequency} purchases</p>
                        </div>
                        <div className="min-w-[140px]">
                          <p className="uppercase text-[10px] font-semibold text-slate-500">Total Amount</p>
                          <p>₦{benfek.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="min-w-[160px]">
                          <p className="uppercase text-[10px] font-semibold text-slate-500">Activity Rating</p>
                          <p>{benfek.activity}</p>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
          </Card>
          )}
  
          {/* Earnings Table */}
        {/* <Card className="overflow-hidden">
          <div className="p-6 bg-white border-b">
            <h3 className="text-lg font-semibold text-gray-900">Earnings History</h3>
          </div>
          
          <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search earnings..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button variant="outline" size="sm" className="flex items-center gap-2">
              <Download className="h-4 w-4" />
              <span className="hidden sm:inline">Export</span>
            </Button>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of your earnings.</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('id')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      ID
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('source')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Source
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('benfek')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Benfek
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('category')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Category
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('commission')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Commission
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('date')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('amount')}
                      className="flex items-center gap-1 p-0 h-auto font-medium ml-auto"
                    >
                      Amount
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedData.length > 0 ? (
                  // Actual data
                  paginatedData.map((earning) => (
                    <TableRow key={earning.id}>
                      <TableCell className="font-medium">{earning.id}</TableCell>
                      <TableCell>{earning.source}</TableCell>
                      <TableCell className="hidden md:table-cell">{earning.benfek}</TableCell>
                      <TableCell className="hidden lg:table-cell">{earning.category}</TableCell>
                      <TableCell className="hidden md:table-cell">{earning.commission}</TableCell>
                      <TableCell className="hidden lg:table-cell">{earning.date}</TableCell>
                      <TableCell className="text-right font-medium text-emerald-600">{earning.amount}</TableCell>
                    </TableRow>
                  ))
                ) : (
                  // No results
                  <TableRow>
                    <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                      No earnings found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          <div className="p-4 bg-white border-t">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500 order-2 sm:order-1">
                Showing {isLoading ? '...' : `${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)}`} of {isLoading ? '...' : filteredData.length} entries
              </div>
              <Pagination className="order-1 sm:order-2">
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious 
                      onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                  
                  {getPaginationItems()}
                  
                  <PaginationItem>
                    <PaginationNext 
                      onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50' : ''}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </div>
        </Card> */}
      </div>
    </div>
  );
};

export default EarningsPage;
