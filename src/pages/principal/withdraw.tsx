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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Search, ArrowUpDown, DollarSign, CreditCard,
  Calendar, AlertCircle, CheckCircle, Clock,
  ArrowDown, Building, Wallet, Plus
} from 'lucide-react';

// Define the Withdrawal type
type Withdrawal = {
  id: number;
  amount: string;
  method: string;
  date: string;
  status: string;
  reference: string;
  processingTime: string;
};

// Mock data for withdrawals
const mockWithdrawals: Withdrawal[] = Array(30).fill(0).map((_, i) => ({
  id: i + 1,
  amount: `₦${(Math.random() * 100000 + 10000).toFixed(2)}`,
  method: ['Bank Transfer', 'Mobile Money', 'Paystack', 'Flutterwave'][Math.floor(Math.random() * 4)],
  date: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  status: ['Completed', 'Processing', 'Pending', 'Failed'][Math.floor(Math.random() * 4)],
  reference: `WD-${Math.floor(100000 + Math.random() * 900000)}`,
  processingTime: ['1-2 business days', '2-3 business days', 'Instant', '3-5 business days'][Math.floor(Math.random() * 4)],
}));

// Mock data for payment methods
const paymentMethods = [
  { id: 1, type: 'bank', name: 'First Bank of Nigeria', accountNumber: '1234567890', default: true },
  { id: 2, type: 'bank', name: 'Guaranty Trust Bank', accountNumber: '0987654321', default: false },
  { id: 3, type: 'mobile', name: 'Mobile Money', phoneNumber: '+234 812 345 6789', default: false },
];

const WithdrawPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [activeTab, setActiveTab] = useState('withdraw');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(1);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockWithdrawals.length / itemsPerPage);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setWithdrawals(mockWithdrawals);
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

  // Handle withdrawal submission
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setWithdrawalSuccess(true);
      
      // Reset after showing success message
      setTimeout(() => {
        setWithdrawalSuccess(false);
        setWithdrawAmount('');
      }, 3000);
    }, 1500);
  };

  // Filter and sort data
  const filteredData = withdrawals.filter(withdrawal => 
    withdrawal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
    withdrawal.status.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField as keyof Withdrawal] < b[sortField as keyof Withdrawal]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField as keyof Withdrawal] > b[sortField as keyof Withdrawal]) return sortDirection === 'asc' ? 1 : -1;
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
    let icon = null;
    
    switch (status) {
      case 'Completed':
        bgColor = 'bg-emerald-100 text-emerald-800';
        icon = <CheckCircle className="h-3 w-3 mr-1" />;
        break;
      case 'Processing':
        bgColor = 'bg-blue-100 text-blue-800';
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case 'Pending':
        bgColor = 'bg-amber-100 text-amber-800';
        icon = <Clock className="h-3 w-3 mr-1" />;
        break;
      case 'Failed':
        bgColor = 'bg-red-100 text-red-800';
        icon = <AlertCircle className="h-3 w-3 mr-1" />;
        break;
      default:
        bgColor = 'bg-gray-100 text-gray-800';
    }
    
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${bgColor} flex items-center w-fit`}>
        {icon}
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
              <BackToDashboardButton className="mb-3" />
              <h1 className="text-2xl font-bold text-gray-900">Withdraw Funds</h1>
              <p className="mt-1 text-sm text-gray-500">
                Withdraw your earnings to your preferred payment method
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs defaultValue="withdraw" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 w-full max-w-md mx-auto mb-8">
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="history">Withdrawal History</TabsTrigger>
          </TabsList>
          
          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Withdrawal Form */}
              <div className="md:col-span-2">
                <Card>
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Withdraw Funds</h3>
                  </div>
                  <div className="p-6">
                    {withdrawalSuccess ? (
                      <div className="bg-emerald-50 border border-emerald-200 rounded-md p-4 flex items-start">
                        <CheckCircle className="h-5 w-5 text-emerald-500 mt-0.5 mr-3" />
                        <div>
                          <h4 className="text-emerald-800 font-medium">Withdrawal Request Submitted</h4>
                          <p className="text-emerald-700 text-sm mt-1">
                            Your withdrawal request has been submitted successfully. It will be processed according to the selected payment method's processing time.
                          </p>
                        </div>
                      </div>
                    ) : (
                      <form onSubmit={handleWithdrawal}>
                        {/* Available Balance */}
                        <div className="mb-6 bg-gray-50 p-4 rounded-md border">
                          <div className="flex items-center justify-between">
                            <div>
                              <p className="text-sm text-gray-500">Available Balance</p>
                              <p className="text-2xl font-bold text-gray-900">₦1,250,000.00</p>
                            </div>
                            <DollarSign className="h-8 w-8 text-emerald-500" />
                          </div>
                        </div>
                        
                        {/* Amount */}
                        <div className="mb-6">
                          <label htmlFor="amount" className="block text-sm font-medium text-gray-700 mb-1">
                            Withdrawal Amount
                          </label>
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <span className="text-gray-500 sm:text-sm">₦</span>
                            </div>
                            <Input
                              id="amount"
                              type="text"
                              placeholder="0.00"
                              className="pl-8"
                              value={withdrawAmount}
                              onChange={(e) => setWithdrawAmount(e.target.value)}
                              required
                            />
                          </div>
                          <p className="mt-1 text-xs text-gray-500">
                            Minimum withdrawal amount: ₦10,000.00
                          </p>
                        </div>
                        
                        {/* Payment Method */}
                        <div className="mb-6">
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Select Payment Method
                          </label>
                          <div className="space-y-3">
                            {paymentMethods.map((method) => (
                              <div 
                                key={method.id}
                                className={`border rounded-md p-4 cursor-pointer transition-colors ${
                                  selectedMethod === method.id 
                                    ? 'border-emerald-500 bg-emerald-50' 
                                    : 'border-gray-200 hover:border-gray-300'
                                }`}
                                onClick={() => setSelectedMethod(method.id)}
                              >
                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    {method.type === 'bank' ? (
                                      <Building className="h-5 w-5 text-gray-400 mr-3" />
                                    ) : (
                                      <Wallet className="h-5 w-5 text-gray-400 mr-3" />
                                    )}
                                    <div>
                                      <p className="font-medium text-gray-900">{method.name}</p>
                                      <p className="text-sm text-gray-500">
                                        {method.type === 'bank' 
                                          ? `Account: ${method.accountNumber}` 
                                          : `Phone: ${method.phoneNumber}`
                                        }
                                      </p>
                                    </div>
                                  </div>
                                  <div className="flex items-center">
                                    {method.default && (
                                      <span className="text-xs bg-gray-100 text-gray-800 px-2 py-1 rounded-full mr-2">
                                        Default
                                      </span>
                                    )}
                                    <div className={`h-5 w-5 rounded-full border flex items-center justify-center ${
                                      selectedMethod === method.id 
                                        ? 'border-emerald-500' 
                                        : 'border-gray-300'
                                    }`}>
                                      {selectedMethod === method.id && (
                                        <div className="h-3 w-3 rounded-full bg-emerald-500" />
                                      )}
                                    </div>
                                  </div>
                                </div>
                              </div>
                            ))}
                            
                            <div className="border border-dashed rounded-md p-4 cursor-pointer hover:bg-gray-50 transition-colors flex items-center justify-center">
                              <Plus className="h-4 w-4 text-gray-400 mr-2" />
                              <span className="text-sm text-gray-600">Add New Payment Method</span>
                            </div>
                          </div>
                        </div>
                        
                        {/* Submit Button */}
                        <div className="mt-8">
                          <Button 
                            type="submit" 
                            className="w-full"
                            disabled={isLoading || !withdrawAmount}
                          >
                            {isLoading ? (
                              <div className="flex items-center">
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                </svg>
                                Processing...
                              </div>
                            ) : (
                              'Withdraw Funds'
                            )}
                          </Button>
                        </div>
                      </form>
                    )}
                  </div>
                </Card>
              </div>
              
              {/* Information Card */}
              <div className="md:col-span-1">
                <Card>
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-semibold text-gray-900">Withdrawal Information</h3>
                  </div>
                  <div className="p-6">
                    <div className="space-y-4">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Processing Time</h4>
                        <p className="text-sm text-gray-600">
                          Withdrawals are typically processed within 1-3 business days, depending on your payment method.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Minimum Withdrawal</h4>
                        <p className="text-sm text-gray-600">
                          The minimum withdrawal amount is ₦10,000.00.
                        </p>
                      </div>
                      
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">Fees</h4>
                        <p className="text-sm text-gray-600">
                          A processing fee of 1.5% applies to all withdrawals.
                        </p>
                      </div>
                      
                      <div className="pt-4 border-t">
                        <h4 className="font-medium text-gray-900 mb-1">Need Help?</h4>
                        <p className="text-sm text-gray-600">
                          If you have any questions about withdrawals, please contact our support team.
                        </p>
                        <Button variant="outline" className="mt-2 w-full text-sm">
                          Contact Support
                        </Button>
                      </div>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          {/* History Tab */}
          <TabsContent value="history">
            <Card className="overflow-hidden">
              {/* Table Controls */}
              <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div className="relative w-full sm:w-64">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search withdrawals..."
                    className="pl-8"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  <span className="hidden sm:inline">Filter by Date</span>
                </Button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableCaption>A list of your withdrawal history.</TableCaption>
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
                          onClick={() => handleSort('reference')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Reference
                          <ArrowUpDown className="h-3 w-3" />
                        </Button>
                      </TableHead>
                      <TableHead className="hidden md:table-cell">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('method')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Method
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
                      <TableHead className="hidden md:table-cell">
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => handleSort('processingTime')}
                          className="flex items-center gap-1 p-0 h-auto font-medium"
                        >
                          Processing Time
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
                          <TableCell><Skeleton className="h-5 w-20" /></TableCell>
                          <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-32" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : paginatedData.length > 0 ? (
                      // Actual data
                      paginatedData.map((withdrawal) => (
                        <TableRow key={withdrawal.id}>
                          <TableCell className="font-medium">{withdrawal.id}</TableCell>
                          <TableCell className="font-mono text-xs">{withdrawal.reference}</TableCell>
                          <TableCell className="hidden md:table-cell">{withdrawal.method}</TableCell>
                          <TableCell className="hidden lg:table-cell">{withdrawal.date}</TableCell>
                          <TableCell>{renderStatusBadge(withdrawal.status)}</TableCell>
                          <TableCell className="hidden md:table-cell text-sm">{withdrawal.processingTime}</TableCell>
                          <TableCell className="text-right font-medium">
                            <div className="flex items-center justify-end">
                              <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                              {withdrawal.amount}
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      // No results
                      <TableRow>
                        <TableCell colSpan={7} className="text-center py-8 text-gray-500">
                          No withdrawals found. Try adjusting your search.
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
        </Tabs>
      </div>
    </div>
  );
};

export default WithdrawPage;
