import React, { useMemo, useState, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { 
  Search, Download, CreditCard, 
  DollarSign, ArrowUp, ArrowDown, Calendar, 
  Copy, CheckCircle, User, Lock, Bell, Shield,
  MessageCircle,
  Filter,
  AlertTriangle
} from 'lucide-react';

// Define the Transaction type
type Transaction = {
  id: number;
  type: 'credit' | 'debit';
  amount: string;
  description: string;
  date: string;
  status: string;
  reference: string;
};

// Mock data for transactions
const mockTransactions: Transaction[] = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  type: Math.random() > 0.5 ? 'credit' : 'debit',
  amount: `₦${(Math.random() * 10000).toFixed(2)}`,
  description: [
    'Payment',
    'Commission',
    'Withdrawal',
    'Refund',
    'Subscription',
    'Service fee',
    'Bonus'
  ][Math.floor(Math.random() * 7)],
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  status: ['Completed', 'Pending', 'Failed'][Math.floor(Math.random() * 3)],
  reference: `REF-${Math.floor(100000 + Math.random() * 900000)}`,
}));

const AccountPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('update-account');
  const [copied, setCopied] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filterType, setFilterType] = useState<'all' | 'credit' | 'debit'>('all');
  const [filterStatus, setFilterStatus] = useState<'all' | 'Completed' | 'Pending' | 'Failed'>('all');
  const [openTransactionId, setOpenTransactionId] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockTransactions.length / itemsPerPage);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setTransactions(mockTransactions);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);

  // Copy account number
  const copyAccountNumber = () => {
    navigator.clipboard.writeText('1234567890');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter and sort data
  const filteredData = transactions.filter(transaction => {
    const matchesSearch =
      transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      transaction.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || transaction.type === filterType;
    const matchesStatus = filterStatus === 'all' || transaction.status === filterStatus;
    return matchesSearch && matchesType && matchesStatus;
  });

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField as keyof Transaction] < b[sortField as keyof Transaction]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField as keyof Transaction] > b[sortField as keyof Transaction]) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const weeklyStats = useMemo(() => {
    const now = new Date();
    const weekAgo = new Date(now);
    weekAgo.setDate(now.getDate() - 7);
    let totalCredit = 0;
    let totalDebit = 0;
    transactions.forEach((transaction) => {
      const date = new Date(transaction.date);
      if (Number.isNaN(date.getTime()) || date < weekAgo) return;
      const amount = Number(transaction.amount.replace(/[^\d.-]/g, '')) || 0;
      if (transaction.type === 'credit') {
        totalCredit += amount;
      } else {
        totalDebit += amount;
      }
    });
    return { totalCredit, totalDebit };
  }, [transactions]);

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

  // Render status badge
  const renderStatusBadge = (status: string) => {
    let bgColor = '';
    switch (status) {
      case 'Completed':
        bgColor = 'bg-emerald-100 text-emerald-800';
        break;
      case 'Pending':
        bgColor = 'bg-amber-100 text-amber-800';
        break;
      case 'Failed':
        bgColor = 'bg-red-100 text-red-800';
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor}`}>
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[70px]">
      {/* Page Header */}
      {/* <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Account</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your wallet and transactions
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Withdraw Funds
              </Button>
            </div>
          </div>
        </div>
      </div> */}
      {/* Main Content */}
      <Tabs defaultValue="update-account" value={activeTab} onValueChange={setActiveTab} className="w-full">
        {/* Fixed Header (Back + Tabs) */}
          <div className="fixed left-0 right-0 top-[64px] z-30 bg-gray-50">
            <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 -b-1 space-y-3">
              <BackToDashboardButton className="text-black/90 hover:text-black/80" />
            <TabsList className="grid grid-cols-1 w-full max-w-2xl mx-auto">
              <TabsTrigger value="update-account">Update Account</TabsTrigger>
            </TabsList>
          </div>
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 sm:py-6 pt-8">
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Weekly Summary */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Card className="flex-1 p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-500">Total Credit (7 days)</h3>
                      <ArrowUp className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">?{weeklyStats.totalCredit.toLocaleString()}</div>
                  </>
                )}
              </Card>
              <Card className="flex-1 p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-32" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-sm font-medium text-gray-500">Total Debit (7 days)</h3>
                      <ArrowDown className="h-5 w-5 text-red-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900">?{weeklyStats.totalDebit.toLocaleString()}</div>
                  </>
                )}
              </Card>
            </div>

            {/* Update Account Details */}
            {/* <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Account Details</h3>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <span>NEJJE HEALTH SOLUTIONS</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <span>1234567890</span>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={copyAccountNumber}
                          className="flex items-center gap-1"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <span>First Bank of Nigeria</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card> */}
            
            {/* Recent Transactions */}
            <Card>
              <div className="p-6 border-b flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900">Recent Transactions</h3>
                <Button 
                  variant="link" 
                  onClick={() => setActiveTab('transactions')}
                  className="text-sm"
                >
                  View All
                </Button>
              </div>
              <div className="divide-y">
                {isLoading ? (
                  // Skeleton loading state
                  Array(5).fill(0).map((_, index) => (
                    <div key={index} className="p-4 flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div>
                          <Skeleton className="h-5 w-32 mb-1" />
                          <Skeleton className="h-4 w-24" />
                        </div>
                      </div>
                      <Skeleton className="h-6 w-20" />
                    </div>
                  ))
                ) : (
                  // Actual data (limited to 5)
                  transactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="p-4 hover:bg-gray-50">
                      <div className="flex items-start justify-between">
                        <div className="flex items-start space-x-3">
                          <div className={`p-2 rounded-full ${transaction.type === 'credit' ? 'bg-emerald-100' : 'bg-red-100'}`}>
                            {transaction.type === 'credit' ? (
                              <ArrowDown className="h-5 w-5 text-emerald-600" />
                            ) : (
                              <ArrowUp className="h-5 w-5 text-red-600" />
                            )}
                          </div>
                          <div>
                            <p className="font-medium text-gray-900">{transaction.description}</p>
                            {/* <p className="text-xs text-gray-500 mt-1">{transaction.date} • {transaction.reference}</p> */}
                          </div>
                        </div>
                        <div className={`font-medium ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                          {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </TabsContent>
          
          {/* Transactions Tab */}
          <TabsContent value="transactions">
            <Card className="overflow-hidden">
              {/* Table Controls */}
              <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search transactions..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <div className="relative flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex items-center gap-2"
                    onClick={() => setShowFilters((prev) => !prev)}
                  >
                    <Filter className="h-4 w-4" />
                  </Button>
                  <Button variant="outline" size="sm" className="flex items-center gap-2">
                    <Download className="h-4 w-4" />
                    <span className="hidden sm:inline">Export</span>
                  </Button>
                  {showFilters && (
                    <div className="absolute right-0 left-0 sm:left-auto sm:right-0 top-11 z-10 w-[calc(100vw-2rem)] sm:w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                      <div className="space-y-3 text-sm text-slate-700">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Type</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(['all', 'credit', 'debit'] as const).map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setFilterType(value)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                  filterType === value
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {value === 'all' ? 'All' : value === 'credit' ? 'Credit' : 'Debit'}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(['all', 'Completed', 'Pending', 'Failed'] as const).map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setFilterStatus(value)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                  filterStatus === value
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {value === 'all' ? 'All' : value}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div className="flex justify-between pt-2">
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setFilterType('all');
                              setFilterStatus('all');
                            }}
                          >
                            Reset
                          </Button>
                          <Button type="button" size="sm" onClick={() => setShowFilters(false)}>
                            Apply
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Transactions List (Accordion) */}
              <div className="p-4 space-y-2">
                {isLoading ? (
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                      <div className="flex items-center justify-between gap-4">
                        <Skeleton className="h-5 w-28" />
                        <Skeleton className="h-5 w-40" />
                        <Skeleton className="h-5 w-20" />
                      </div>
                    </div>
                  ))
                ) : paginatedData.length > 0 ? (
                  <Accordion
                    type="single"
                    collapsible
                    value={openTransactionId ? `transaction-${openTransactionId}` : undefined}
                    onValueChange={(value) =>
                      setOpenTransactionId(
                        value ? Number(value.replace('transaction-', '')) : null
                      )
                    }
                    className="space-y-2"
                  >
                    {paginatedData.map((transaction) => (
                      <AccordionItem
                        key={transaction.id}
                        value={`transaction-${transaction.id}`}
                        className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm"
                      >
                        <AccordionTrigger className="rounded-lg bg-white py-4 hover:no-underline hover:bg-slate-50/70">
                          <div className="flex w-full flex-row items-start gap-2 text-left sm:items-center">
                            <div className="flex w-1/3 items-center gap-3 justify-start">
                              <span className={`flex items-center text-sm font-semibold ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {transaction.type === 'credit' ? (
                                  <ArrowDown className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowUp className="h-4 w-4 mr-1" />
                                )}
                                {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                              </span>
                            </div>
                            <div className="min-w-0 w-1/3 text-center">
                              <p className="text-sm font-semibold text-slate-900 break-words">{transaction.description}</p>
                            </div>
                            <div className={`w-1/3 text-right text-sm font-semibold ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="pb-4 pt-2">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-sm text-slate-600">
                            
                            {/* Transaction ID - Pinned Start */}
                            <div className="flex flex-col min-w-0">
                              <p className="font-bold text-slate-500 uppercase">Transaction ID</p>
                              <p className="mt-1 text-slate-900">{transaction.id}</p>
                            </div>
                        
                            {/* Status - Middle (Centered on Desktop) */}
                            <div className="flex flex-col min-w-0 md:items-center items-end">
                              <p className="font-bold text-slate-500 uppercase">Status</p>
                              <div className="mt-1">{renderStatusBadge(transaction.status)}</div>
                            </div>
                        
                            {/* Reference - Middle (Centered on Desktop) */}
                            <div className="flex flex-col min-w-0 md:items-center">
                              <p className="font-bold text-slate-500 uppercase">Reference</p>
                              <p className="mt-1 font-mono text-xs text-slate-700 break-all">
                                {transaction.reference}
                              </p>
                            </div>
                        
                            {/* Date - Pinned End (Right-aligned on Desktop) */}
                            <div className="flex flex-col min-w-0 items-end">
                              <p className="font-bold text-slate-500 uppercase">Date</p>
                              <p className="mt-1 text-slate-700 whitespace-nowrap">{transaction.date}</p>
                            </div>
                        
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                    No transactions found. Try adjusting your search.
                  </div>
                )}
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
          </TabsContent>
          <TabsContent value="update-account">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Update Account Details</h3>
              </div>
              <div className="p-6">
                {isLoading ? (
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-24" />
                      <Skeleton className="h-10 w-full" />
                    </div>
                  </div>
                ) : (
                  <div className="space-y-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Name</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <p className='text-sm'>NEJJE HEALTH SOLUTIONS</p>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <p className='text-sm'>1234567890</p>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={copyAccountNumber}
                          className="flex items-center gap-1"
                        >
                          {copied ? (
                            <>
                              <CheckCircle className="h-4 w-4 text-emerald-500" />
                              <span className="text-xs text-emerald-500">Copied</span>
                            </>
                          ) : (
                            <>
                              <Copy className="h-4 w-4" />
                              <span className="text-xs">Copy</span>
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <p className='text-sm'>First Bank of Nigeria</p>
                        <Button variant="outline" size="sm">Change Account</Button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>

        </div>
      </Tabs>
    </div>
  );
};

export default AccountPage;
