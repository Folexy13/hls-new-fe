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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, Download, ArrowUpDown, CreditCard, 
  DollarSign, ArrowUp, ArrowDown, Calendar, 
  Copy, CheckCircle, User, Lock, Bell, Shield
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

  // Handle sorting
  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  // Copy account number
  const copyAccountNumber = () => {
    navigator.clipboard.writeText('1234567890');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Filter and sort data
  const filteredData = transactions.filter(transaction => 
    transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    transaction.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
      <div className="bg-white border-b">
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
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-3 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="transactions">Transactions</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Download className="h-4 w-4" />
                  <span className="hidden sm:inline">Export</span>
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>A list of your transactions.</TableCaption>
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
                          onClick={() => handleSort('type')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Type
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('description')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Description
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('reference')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Reference
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
                      <TableHead>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('status')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Status
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
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : paginatedData.length > 0 ? (
                      // Actual data
                      paginatedData.map((transaction) => (
                        <TableRow key={transaction.id}>
                          <TableCell className="font-medium">{transaction.id}</TableCell>
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
                          <TableCell>{transaction.description}</TableCell>
                          <TableCell className="hidden md:table-cell font-mono text-xs">{transaction.reference}</TableCell>
                          <TableCell className="hidden lg:table-cell">{transaction.date}</TableCell>
                          <TableCell>{renderStatusBadge(transaction.status)}</TableCell>
                          <TableCell className={`text-right font-medium ${transaction.type === 'credit' ? 'text-emerald-600' : 'text-red-600'}`}>
                            {transaction.type === 'credit' ? '+' : '-'}{transaction.amount}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // No results
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-1">
                <Card>
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Account Settings</h3>
                  </div>
                  <div className="p-4">
                    <nav className="space-y-1">
                      {[
                        { icon: <User className="h-5 w-5" />, label: 'Personal Information' },
                        { icon: <CreditCard className="h-5 w-5" />, label: 'Payment Methods' },
                        { icon: <Lock className="h-5 w-5" />, label: 'Security' },
                        { icon: <Bell className="h-5 w-5" />, label: 'Notifications' },
                        { icon: <Shield className="h-5 w-5" />, label: 'Privacy' },
                      ].map((item, index) => (
                        <div 
                          key={index}
                          className={`flex items-center px-3 py-2 text-sm font-medium rounded-md ${
                            index === 0 ? 'bg-emerald-50 text-emerald-700' : 'text-gray-600 hover:bg-gray-50'
                          }`}
                        >
                          <span className="mr-3">{item.icon}</span>
                          {item.label}
                        </div>
                      ))}
                    </nav>
                  </div>
                </Card>
              </div>
              
              <div className="md:col-span-2">
                <Card>
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Personal Information</h3>
                    <p className="mt-1 text-sm text-gray-500">Update your account details and personal information.</p>
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
                        <Skeleton className="h-10 w-32" />
                      </div>
                    ) : (
                      <form className="space-y-6">
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
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
                        
                        <div>
                          <Button>Save Changes</Button>
                        </div>
                      </form>
                    )}
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AccountPage;