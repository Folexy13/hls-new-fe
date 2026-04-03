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
    'Payment from Benfek',
    'Commission',
    'Withdrawal',
    'Refund',
    'Subscription fee',
    'Service charge',
    'Bonus payment'
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
  const [activeTab, setActiveTab] = useState('overview');
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
    <div className="min-h-screen bg-gray-50 pb-16">
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
      <BackToDashboardButton className="ml-3 mt-3 " />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            {/* <TabsTrigger value="settings">Settings</TabsTrigger> */}
          </TabsList>
          
          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Account Summary */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Balance Card */}
              <Card className="p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-500">Available Balance</h3>
                      <DollarSign className="h-5 w-5 text-emerald-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">₦1,250,000.00</div>
                    <div className="text-xs text-emerald-600 flex items-center">
                      <ArrowUp className="h-3 w-3 mr-1" />
                      +12.5% from last month
                    </div>
                  </>
                )}
              </Card>
              
              {/* Total Earnings Card */}
              <Card className="p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-500">Total Earnings</h3>
                      <ArrowUp className="h-5 w-5 text-blue-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">₦5,750,000.00</div>
                    <div className="text-xs text-gray-500">Lifetime earnings</div>
                  </>
                )}
              </Card>
              
              {/* Pending Payouts Card */}
              <Card className="p-6">
                {isLoading ? (
                  <div className="space-y-3">
                    <Skeleton className="h-5 w-24" />
                    <Skeleton className="h-10 w-32" />
                    <Skeleton className="h-4 w-20" />
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-sm font-medium text-gray-500">Pending Payouts</h3>
                      <Calendar className="h-5 w-5 text-amber-500" />
                    </div>
                    <div className="text-3xl font-bold text-gray-900 mb-1">₦250,000.00</div>
                    <div className="text-xs text-amber-600">Processing (2-3 business days)</div>
                  </>
                )}
              </Card>
            </div>
            
            {/* Account Details */}
            <Card>
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
                        <span className="font-medium">NEJJE HEALTH SOLUTIONS</span>
                      </div>
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Account Number</label>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-md border">
                        <span className="font-medium">1234567890</span>
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
                        <span className="font-medium">First Bank of Nigeria</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </Card>
            
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
                            <p className="text-xs text-gray-500 mt-1">{transaction.date} • {transaction.reference}</p>
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
                    <div className="absolute right-0 top-11 z-10 w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
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
                            Done
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    {isLoading ? (
                      // Skeleton loading state
                      Array(itemsPerPage).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : paginatedData.length > 0 ? (
                      // Actual data
                      paginatedData.map((transaction) => (
                        <React.Fragment key={transaction.id}>
                          <TableRow
                            onClick={() =>
                              setOpenTransactionId((prev) => (prev === transaction.id ? null : transaction.id))
                            }
                            className="cursor-pointer"
                          >
                            <TableCell>
                              <span className={`flex items-center ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                                {transaction.type === 'credit' ? (
                                  <ArrowDown className="h-4 w-4 mr-1" />
                                ) : (
                                  <ArrowUp className="h-4 w-4 mr-1" />
                                )}
                                {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                              </span>
                            </TableCell>
                            <TableCell className="font-medium text-slate-900">{transaction.description}</TableCell>
                            <TableCell className={`text-right font-medium ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                              {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                            </TableCell>
                          </TableRow>
                          {openTransactionId === transaction.id && (
                            <TableRow className="bg-slate-50/70">
                              <TableCell colSpan={3}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Transaction ID</p>
                                    <p className="font-medium text-slate-900">{transaction.id}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                                    <div className="mt-1">{renderStatusBadge(transaction.status)}</div>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Reference</p>
                                    <p className="font-mono text-xs text-slate-700">{transaction.reference}</p>
                                  </div>
                                  <div>
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Date</p>
                                    <p className="text-slate-700">{transaction.date}</p>
                                  </div>
                                </div>
                              </TableCell>
                            </TableRow>
                          )}
                        </React.Fragment>
                      ))
                    ) : (
                      // No results
                      <TableRow>
                        <TableCell colSpan={3} className="text-center py-8 text-gray-500">
                          No transactions found. Try adjusting your search.
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
          </TabsContent>
          
          {/* Settings Tab */}
          <TabsContent value="settings">
            <Card>
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                <p className="mt-1 text-sm text-gray-500">
                  Manage your profile, security, notifications, and support.
                </p>
              </div>
              <div className="p-6">
                <Accordion type="single" collapsible className="space-y-2">
                  <AccordionItem value="personal" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <User className="h-5 w-5" />
                        <span>Personal Information</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      {isLoading ? (
                        <div className="space-y-4">
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                          <Skeleton className="h-10 w-full" />
                        </div>
                      ) : (
                        <form className="space-y-4">
                          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                            <div>
                              <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                                First Name
                              </label>
                              <Input id="firstName" defaultValue="NEJJE" />
                            </div>
                            <div>
                              <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                                Last Name
                              </label>
                              <Input id="lastName" defaultValue="Health Solutions" />
                            </div>
                          </div>
                          <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                              Email Address
                            </label>
                            <Input id="email" type="email" defaultValue="contact@nejje.com" />
                          </div>
                          <div>
                            <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                              Phone Number
                            </label>
                            <Input id="phone" defaultValue="+234 123 456 7890" />
                          </div>
                          <Button>Save Changes</Button>
                        </form>
                      )}
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="payments" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <CreditCard className="h-5 w-5" />
                        <span>Payment Methods</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between rounded-md border p-3 bg-gray-50">
                          <div>
                            <p className="text-sm font-medium text-gray-900">First Bank •••• 7890</p>
                            <p className="text-xs text-gray-500">Primary payout account</p>
                          </div>
                          <Button variant="outline" size="sm">Change</Button>
                        </div>
                        <Button variant="outline">Add new bank account</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="security" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Lock className="h-5 w-5" />
                        <span>Security</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Current Password
                          </label>
                          <Input id="currentPassword" type="password" placeholder="Enter current password" />
                        </div>
                        <div>
                          <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            New Password
                          </label>
                          <Input id="newPassword" type="password" placeholder="Enter new password" />
                        </div>
                        <div>
                          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                            Confirm New Password
                          </label>
                          <Input id="confirmPassword" type="password" placeholder="Confirm new password" />
                        </div>
                        <Button>Update Password</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="notifications" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <Bell className="h-5 w-5" />
                        <span>Notifications</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <div className="space-y-3">
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                          Email updates and reports
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <input type="checkbox" defaultChecked className="h-4 w-4" />
                          Benfek registration alerts
                        </label>
                        <label className="flex items-center gap-3 text-sm text-gray-700">
                          <input type="checkbox" className="h-4 w-4" />
                          Product and order notifications
                        </label>
                        <Button>Save Notification Preferences</Button>
                      </div>
                    </AccordionContent>
                  </AccordionItem>

                  <AccordionItem value="complaints" className="border rounded-lg px-4">
                    <AccordionTrigger className="py-4">
                      <div className="flex items-center gap-3 text-left">
                        <AlertTriangle className="h-5 w-5" />
                        <span>Make Complaints</span>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4">
                      <form className="space-y-4">
                        <div>
                          <label htmlFor="complaintSubject" className="block text-sm font-medium text-gray-700 mb-1">
                            Subject
                          </label>
                          <Input id="complaintSubject" placeholder="Short summary" />
                        </div>
                        <div>
                          <label htmlFor="complaintMessage" className="block text-sm font-medium text-gray-700 mb-1">
                            Message
                          </label>
                          <Textarea id="complaintMessage" placeholder="Describe the issue..." />
                        </div>
                        <Button variant="outline">Submit Complaint</Button>
                      </form>
                    </AccordionContent>
                  </AccordionItem>
                </Accordion>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;
