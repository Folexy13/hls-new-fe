import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, ArrowUpDown, MoreVertical, 
  DollarSign, Calendar, Download, CreditCard,
  TrendingUp, BarChart2, Wallet, Building
} from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

// Mock data for earnings
const mockEarnings = [
  { 
    id: 'TRX-2023-1001', 
    date: '2023-12-15',
    amount: '₦25,000',
    type: 'Sales Commission',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-789012',
    product: 'Paracetamol 500mg',
    customer: 'Lagos Medical Center',
    orderID: 'ORD-2023-1001'
  },
  { 
    id: 'TRX-2023-1002', 
    date: '2023-12-14',
    amount: '₦18,500',
    type: 'Sales Commission',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    reference: '',
    product: 'Vitamin C 1000mg',
    customer: 'Abuja Pharmacy Plus',
    orderID: 'ORD-2023-1002'
  },
  { 
    id: 'TRX-2023-1003', 
    date: '2023-12-12',
    amount: '₦12,750',
    type: 'Sales Commission',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-789013',
    product: 'Multivitamin Complex',
    customer: 'Port Harcourt Health Clinic',
    orderID: 'ORD-2023-1003'
  },
  { 
    id: 'TRX-2023-1004', 
    date: '2023-12-10',
    amount: '₦32,500',
    type: 'Sales Commission',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-789014',
    product: 'Paracetamol 500mg',
    customer: 'Kano Medical Supplies',
    orderID: 'ORD-2023-1004'
  },
  { 
    id: 'TRX-2023-1005', 
    date: '2023-12-08',
    amount: '₦22,000',
    type: 'Sales Commission',
    status: 'Cancelled',
    paymentMethod: 'Bank Transfer',
    reference: '',
    product: 'Amoxicillin 250mg',
    customer: 'Enugu General Hospital',
    orderID: 'ORD-2023-1005'
  },
  { 
    id: 'TRX-2023-1006', 
    date: '2023-12-05',
    amount: '₦15,500',
    type: 'Sales Commission',
    status: 'Paid',
    paymentMethod: 'Bank Transfer',
    reference: 'REF-789015',
    product: 'Ibuprofen 400mg',
    customer: 'Ibadan Community Clinic',
    orderID: 'ORD-2023-1006'
  },
  { 
    id: 'TRX-2023-1007', 
    date: '2023-12-03',
    amount: '₦21,250',
    type: 'Sales Commission',
    status: 'Pending',
    paymentMethod: 'Bank Transfer',
    reference: '',
    product: 'Multivitamin Complex',
    customer: 'Benin Medical Store',
    orderID: 'ORD-2023-1007'
  },
];

const EarningsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [earnings, setEarnings] = useState<typeof mockEarnings>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Statuses for filter
  const statuses = ['All', 'Paid', 'Pending', 'Cancelled'];
  
  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setEarnings(mockEarnings);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter earnings based on search term and status
  const filteredEarnings = earnings.filter(earning => {
    const matchesSearch = 
      earning.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      earning.product.toLowerCase().includes(searchTerm.toLowerCase()) ||
      earning.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || earning.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const earningsPerPage = 5;
  const indexOfLastEarning = currentPage * earningsPerPage;
  const indexOfFirstEarning = indexOfLastEarning - earningsPerPage;
  const currentEarnings = filteredEarnings.slice(indexOfFirstEarning, indexOfLastEarning);
  const totalPages = Math.ceil(filteredEarnings.length / earningsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Calculate total earnings
  const totalEarnings = mockEarnings
    .filter(earning => earning.status !== 'Cancelled')
    .reduce((total, earning) => {
      return total + parseInt(earning.amount.replace(/[^\d]/g, ''));
    }, 0);
  
  // Calculate pending earnings
  const pendingEarnings = mockEarnings
    .filter(earning => earning.status === 'Pending')
    .reduce((total, earning) => {
      return total + parseInt(earning.amount.replace(/[^\d]/g, ''));
    }, 0);
  
  // Format currency
  const formatCurrency = (amount: number) => {
    return `₦${amount.toLocaleString()}`;
  };
  
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
              <p className="mt-1 text-sm text-gray-500">Track your earnings and payments</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Statement
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
            <>
              <Card className="p-6 border-l-4 border-emerald-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(totalEarnings)}</h3>
                    <p className="text-xs font-medium text-emerald-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15% from last month
                    </p>
                  </div>
                  <div className="bg-emerald-500 text-white p-2 rounded-lg">
                    <DollarSign className="h-5 w-5" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-amber-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Pending Earnings</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(pendingEarnings)}</h3>
                    <p className="text-xs font-medium text-amber-600 mt-1 flex items-center">
                      <Calendar className="h-3 w-3 mr-1" />
                      Expected within 7 days
                    </p>
                  </div>
                  <div className="bg-amber-500 text-white p-2 rounded-lg">
                    <CreditCard className="h-5 w-5" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-blue-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Commission Rate</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">15%</h3>
                    <p className="text-xs font-medium text-blue-600 mt-1 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +2% from last quarter
                    </p>
                  </div>
                  <div className="bg-blue-500 text-white p-2 rounded-lg">
                    <BarChart2 className="h-5 w-5" />
                  </div>
                </div>
              </Card>
              
              <Card className="p-6 border-l-4 border-purple-500">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Available Balance</p>
                    <h3 className="text-2xl font-bold mt-1 text-gray-900">{formatCurrency(totalEarnings - pendingEarnings)}</h3>
                    <p className="text-xs font-medium text-purple-600 mt-1 flex items-center">
                      <Wallet className="h-3 w-3 mr-1" />
                      Available for withdrawal
                    </p>
                  </div>
                  <div className="bg-purple-500 text-white p-2 rounded-lg">
                    <Building className="h-5 w-5" />
                  </div>
                </div>
              </Card>
            </>
          )}
        </div>
        
        {/* Transactions */}
        <Card className="overflow-hidden">
          {/* Filters and Search */}
          <div className="p-6 border-b bg-white">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search transactions..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <div className="w-40">
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={selectedStatus}
                    onChange={(e) => setSelectedStatus(e.target.value)}
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>{status}</option>
                    ))}
                  </select>
                </div>
                
                <Button variant="outline" size="icon" className="hidden md:flex">
                  <Filter className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Transaction ID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Product</th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Amount</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  // Skeleton loaders for transactions
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4"><Skeleton className="h-4 w-24" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-32" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  currentEarnings.length > 0 ? (
                    currentEarnings.map((earning) => (
                      <tr key={earning.id} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{earning.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{earning.product}</p>
                            <p className="text-xs text-gray-500">{earning.customer}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {new Date(earning.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{earning.amount}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`flex w-fit items-center ${getStatusColor(earning.status)}`}>
                            {earning.status}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 text-right">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon">
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuLabel>Actions</DropdownMenuLabel>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2">
                                <DollarSign className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> Download Receipt
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr className="bg-white">
                      <td colSpan={6} className="px-6 py-12 text-center">
                        <div className="flex flex-col items-center">
                          <div className="bg-gray-100 p-3 rounded-full mb-3">
                            <DollarSign className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-1">No transactions found</p>
                          <p className="text-sm text-gray-500">Try adjusting your search or filter criteria</p>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!isLoading && filteredEarnings.length > 0 && (
            <div className="py-4 px-6 bg-white border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{indexOfFirstEarning + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastEarning, filteredEarnings.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredEarnings.length}</span> transactions
                </p>
                
                <Pagination>
                  <PaginationContent>
                    <PaginationItem>
                      <PaginationPrevious 
                        onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                        className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                    
                    {Array.from({ length: Math.min(5, totalPages) }).map((_, index) => {
                      const pageNumber = index + 1;
                      return (
                        <PaginationItem key={index}>
                          <PaginationLink
                            onClick={() => handlePageChange(pageNumber)}
                            isActive={currentPage === pageNumber}
                          >
                            {pageNumber}
                          </PaginationLink>
                        </PaginationItem>
                      );
                    })}
                    
                    <PaginationItem>
                      <PaginationNext 
                        onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                        className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
};

export default EarningsPage;