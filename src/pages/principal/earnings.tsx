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

const EarningsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState<Earning[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [dateFilter, setDateFilter] = useState('all-time');
  
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
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <BackToDashboardButton className="mb-3" />
              <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
              <p className="mt-1 text-sm text-gray-500">
                Track your revenue and earnings performance
              </p>
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
            [
              { 
                title: 'Total Earnings', 
                value: '₦5,750,000', 
                change: '+15%', 
                icon: <DollarSign className="h-5 w-5" />, 
                color: 'bg-emerald-500' 
              },
              { 
                title: 'Monthly Average', 
                value: '₦250,000', 
                change: '+8%', 
                icon: <BarChart2 className="h-5 w-5" />, 
                color: 'bg-blue-500' 
              },
              { 
                title: 'Active Benfeks', 
                value: '124', 
                change: '+12%', 
                icon: <Users className="h-5 w-5" />, 
                color: 'bg-purple-500' 
              },
              { 
                title: 'Total Orders', 
                value: '1,450', 
                change: '+18%', 
                icon: <ShoppingCart className="h-5 w-5" />, 
                color: 'bg-amber-500' 
              },
            ].map((stat, index) => (
              <Card key={index} className="p-6 border-l-4" style={{ borderLeftColor: stat.color.replace('bg-', '') }}>
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">{stat.title}</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{stat.value}</h3>
                    <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
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

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Monthly Earnings Chart */}
          <Card className="overflow-hidden">
            <div className="p-6 bg-white border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-emerald-500" />
                <h3 className="text-lg font-semibold text-gray-900">Monthly Earnings</h3>
              </div>
              <div>
                <Button variant="outline" size="sm" className="text-xs">
                  {dateFilter === 'all-time' ? 'All Time' : 'This Year'}
                </Button>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <Skeleton className="h-64 w-full" />
              ) : (
                renderBarChart()
              )}
            </div>
          </Card>

          {/* Category Breakdown Chart */}
          <Card className="overflow-hidden">
            <div className="p-6 bg-white border-b flex justify-between items-center">
              <div className="flex items-center gap-2">
                <PieChart className="h-5 w-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">Earnings by Category</h3>
              </div>
            </div>
            <div className="p-6">
              {isLoading ? (
                <div className="flex flex-col items-center">
                  <Skeleton className="h-64 w-64 rounded-full" />
                  <div className="mt-6 grid grid-cols-2 gap-2 w-full">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-4 w-24" />
                  </div>
                </div>
              ) : (
                <div>
                  {renderPieChart()}
                  {renderPieChartLegend()}
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* Earnings Table */}
        <Card className="overflow-hidden">
          <div className="p-6 bg-white border-b">
            <h3 className="text-lg font-semibold text-gray-900">Earnings History</h3>
          </div>
          
          {/* Table Controls */}
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

          {/* Table */}
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

          {/* Pagination */}
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
        </Card>
      </div>
    </div>
  );
};

export default EarningsPage;
