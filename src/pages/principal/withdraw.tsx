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
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { 
  Search, DollarSign, CreditCard,
  Calendar, AlertCircle, CheckCircle, Clock,
  ArrowDown, Building, Wallet, Plus,
  Filter, PhoneCall
} from 'lucide-react';
import { principalService } from '@/services/principalService';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

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

type UnresolvedCredit = {
  id: number;
  packId?: string;
  packName?: string;
  benfekName?: string;
  supplement: string;
  // Total amount the benfek paid (cost price + returns).
  amount: number;
  date: string;
  // Total cost price of the pack (principal's cost basis).
  costPrice: number;
  // Markup factor applied to cost price (e.g. 1.3 -> 30% markup).
  markupFactor: number;
  taxAmount?: number;
  serviceChargeAmount?: number;
  hlsCommissionAmount?: number;
  principalShare?: number;
};

type PaymentMethod = {
  id: number;
  type: string;
  name: string;
  accountNumber?: string;
  accountName?: string;
  phoneNumber?: string;
  default: boolean;
};

const MIN_WITHDRAWAL_AMOUNT = 100;

const parseWithdrawalAmount = (value: string) => Number(value.replace(/,/g, '').trim());

const WithdrawPage: React.FC = () => {
  const location = useLocation();
  const [isLoading, setIsLoading] = useState(true);
  const [isWalletLoading, setIsWalletLoading] = useState(true);
  const [withdrawals, setWithdrawals] = useState<Withdrawal[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('withdraw');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedMethod, setSelectedMethod] = useState(1);
  const [withdrawalSuccess, setWithdrawalSuccess] = useState(false);
  const [walletBalance, setWalletBalance] = useState(0);
  const [withdrawableBalance, setWithdrawableBalance] = useState(0);
  const [paymentMethods, setPaymentMethods] = useState<PaymentMethod[]>([]);
  const [unresolvedCredits, setUnresolvedCredits] = useState<UnresolvedCredit[]>([]);
  const [showFilters, setShowFilters] = useState(false);
  const [filterStatus, setFilterStatus] = useState<'all' | 'Completed' | 'Processing' | 'Pending' | 'Failed'>('all');
  const [filterMethod, setFilterMethod] = useState<'all' | 'Paystack'>('all');
  const [openWithdrawalId, setOpenWithdrawalId] = useState<number | null>(null);
  
  const itemsPerPage = 10;
  const primaryMethod = paymentMethods.find((method) => method.default) ?? paymentMethods[0];
  const displayedMethods = primaryMethod ? [primaryMethod] : [];

  useEffect(() => {
    const tab = new URLSearchParams(location.search).get('tab');
    if (tab === 'withdraw' || tab === 'unresolved') {
      setActiveTab(tab);
    }
  }, [location.search]);

  useEffect(() => {
    const loadPayoutDetails = async () => {
      setIsLoading(true);
      setIsWalletLoading(true);
      try {
        const [principal, incomeSummary, withdrawalsData] = await Promise.all([
          principalService.getMe(),
          principalService.getIncomeSummary(),
          principalService.getWithdrawals(),
        ]);

        const resolvedWalletBalance = Number(incomeSummary?.walletBalance || 0);
        const resolvedWithdrawableBalance = Number(incomeSummary?.withdrawableBalance || 0);
        setWalletBalance(resolvedWalletBalance);
        setWithdrawableBalance(resolvedWithdrawableBalance);
        setUnresolvedCredits(Array.isArray(incomeSummary?.unresolvedCredits) ? incomeSummary.unresolvedCredits : []);
        setWithdrawals(
          Array.isArray(withdrawalsData)
            ? withdrawalsData.map((item: any) => ({
                id: item.id,
                amount: `₦${Number(item.amount || 0).toLocaleString()}`,
                method: 'Paystack',
                date: item.createdAt ? new Date(item.createdAt).toLocaleDateString() : 'Recently',
                status: String(item.status || 'Pending'),
                reference: `WD-${String(item.id).padStart(6, '0')}`,
                processingTime: '1-3 business days',
              }))
            : []
        );

        const nextMethods: PaymentMethod[] = principal?.bankName || principal?.accountNumber || principal?.accountName
          ? [
              {
                id: 1,
                type: 'bank',
                name: principal.bankName || 'Paystack',
                accountNumber: principal.accountNumber || '',
                accountName: principal.accountName || '',
                default: true,
              },
            ]
          : [];

        setPaymentMethods(nextMethods);
      } catch (error) {
        console.error('Failed to load principal payout details:', error);
        setPaymentMethods([]);
        setWithdrawals([]);
        setWalletBalance(0);
        setWithdrawableBalance(0);
      } finally {
        setIsLoading(false);
        setIsWalletLoading(false);
      }
    };

    loadPayoutDetails();
  }, []);

  // Handle withdrawal submission
  const handleWithdrawal = (e: React.FormEvent) => {
    e.preventDefault();
    const method = displayedMethods[0];
    const amount = parseWithdrawalAmount(withdrawAmount);

    if (!method || !Number.isFinite(amount) || amount <= 0) {
      toast.error('Enter a valid withdrawal amount');
      return;
    }

    if (amount < MIN_WITHDRAWAL_AMOUNT) {
      toast.error(`Minimum withdrawal amount is ₦${MIN_WITHDRAWAL_AMOUNT.toLocaleString()}.00`);
      return;
    }

    if (false && amount < MIN_WITHDRAWAL_AMOUNT) {
      toast.error('Minimum withdrawal amount is ₦10,000.00');
      return;
    }

    if (amount > withdrawableBalance) {
      toast.error('Withdrawal amount exceeds your withdrawable balance');
      return;
    }

    setIsLoading(true);
    principalService.requestWithdrawal({
      amount,
      bankName: method.name,
      accountNumber: method.accountNumber || '',
      accountName: method.accountName || '',
    }).then(() => {
      setWithdrawableBalance((prev) => Math.max(0, prev - amount));
      setWalletBalance((prev) => Math.max(0, prev - amount));
      setWithdrawalSuccess(true);
      setWithdrawAmount('');
    }).catch((error) => {
      console.error('Withdrawal failed:', error);
      toast.error(error?.response?.data?.message || 'Failed to submit withdrawal request');
    }).finally(() => {
      setIsLoading(false);
    });
  };

  // Filter and sort data
  const filteredData = withdrawals.filter(withdrawal => {
    const matchesSearch =
      withdrawal.reference.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.method.toLowerCase().includes(searchTerm.toLowerCase()) ||
      withdrawal.status.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || withdrawal.status === filterStatus;
    const matchesMethod = filterMethod === 'all' || withdrawal.method === filterMethod;
    return matchesSearch && matchesStatus && matchesMethod;
  });

  // Paginate data
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );
  const totalPages = Math.max(1, Math.ceil(filteredData.length / itemsPerPage || 1));

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

  const handleResolveCredit = async (id: number) => {
    const resolvedCredit = unresolvedCredits.find((item) => item.id === id);
    if (!resolvedCredit) return;

    const creditPrincipalShare = Number(resolvedCredit.principalShare || 0);
    const previousWalletBalance = walletBalance;
    const previousWithdrawableBalance = withdrawableBalance;
    const previousCredits = unresolvedCredits;

    try {
      setWithdrawableBalance((prev) => prev + creditPrincipalShare);
      setUnresolvedCredits((prev) => prev.filter((item) => item.id !== id));

      const result = await principalService.resolveCredit(id);
      const summary = result?.summary;
      if (summary) {
        setWalletBalance(Number(summary.walletBalance || 0));
        setWithdrawableBalance(Number(summary.withdrawableBalance || 0));
        setUnresolvedCredits(Array.isArray(summary.unresolvedCredits) ? summary.unresolvedCredits : []);
      }
      toast.success('Credit resolved successfully');
    } catch (error) {
      setWalletBalance(previousWalletBalance);
      setWithdrawableBalance(previousWithdrawableBalance);
      setUnresolvedCredits(previousCredits);
      console.error('Failed to resolve credit:', error);
      toast.error('Failed to resolve credit');
    }
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
      <div className="fixed inset-x-0 top-16 z-40 flex items-center justify-between bg-white/95 px-4 py-2 shadow-sm backdrop-blur">
        <BackToDashboardButton />
        <div className="flex h-9 w-9 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-600">
          <PhoneCall className="h-4 w-4" />
        </div>
      </div>
      <div className="md:col-span-2 mt-8">
                <Card>
                  <div className="p-6 flex flex-col gap-1">
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
                      <form onSubmit={handleWithdrawal} className="flex flex-col gap-6">
                        {/* Balance Banner */}
                        <div>
                          <div className="relative w-full overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 p-5 text-white">
                            {isWalletLoading && (
                              <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-3 bg-slate-950/70 backdrop-blur-sm">
                                <LoadingSpinner className="h-7 w-7 text-white" />
                                <p className="text-sm font-semibold text-white/90">Loading wallet balances...</p>
                              </div>
                            )}
                            <div className="text-xs uppercase tracking-[0.2em] text-white/70">
                              Wallet Summary
                            </div>
                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                              <div className="rounded-xl bg-white/10 border border-white/10 p-4">
                                <p className="text-xs font-semibold text-white/70">Total Wallet Balance</p>
                                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
                                  ₦{walletBalance.toLocaleString()}
                                  <span className="text-2xl font-extrabold text-yellow-400">!</span>
                                </p>
                              </div>
                              <div className="rounded-xl bg-white/10 border border-white/10 p-4">
                                <p className="text-xs font-semibold text-white/70">Amount Withdrawable</p>
                                <p className="mt-1 flex items-center gap-2 text-2xl font-bold text-white">
                                  ₦{withdrawableBalance.toLocaleString()}
                                  <CheckCircle className="h-5 w-5 text-emerald-300" />
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* {unresolvedCredits.length > 0 && (
                          <div className="rounded-md border border-amber-200 bg-amber-50 p-4 text-sm text-amber-700">
                            New credits received. Resolve them to add your share to withdrawable balance.
                          </div>
                        )} */}
                        <div className="max-w-7xl sm:px-6 lg:px-8">
        <Tabs defaultValue="withdraw" value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 sm:grid-cols-4 w-full max-w-2xl mx-auto">
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            {/* <TabsTrigger value="history">Withdrawal History</TabsTrigger> */}
            <TabsTrigger value="unresolved" className="inline-flex items-center relative">
              Unresolved Credits
              {unresolvedCredits.length > 0 && (
                <span className="h-2 w-2 rounded-full bg-red-500 absolute top-0 right-1" />
              )}
            </TabsTrigger>
            {/* <TabsTrigger value="support">Support</TabsTrigger> */}
          </TabsList>
          
          {/* Withdraw Tab */}
          <TabsContent value="withdraw" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Withdrawal Form */}
              
              {/* Information Card */}
              {/* <div className="md:col-span-1">
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
              </div> */}
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
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:inline">Filter by Date</span>
                  </Button>
                  {showFilters && (
                    <div className="absolute right-0 left-0 sm:left-auto sm:right-0 top-11 z-10 w-[calc(100vw-2rem)] sm:w-64 rounded-xl border border-slate-200 bg-white p-4 shadow-lg">
                      <div className="space-y-3 text-sm text-slate-700">
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Method</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(['all', 'Paystack'] as const).map((value) => (
                              <button
                                key={value}
                                type="button"
                                onClick={() => setFilterMethod(value)}
                                className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                                  filterMethod === value
                                    ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                                    : 'border-slate-200 bg-white text-slate-600 hover:bg-slate-50'
                                }`}
                              >
                                {value === 'all' ? 'All' : value}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                          <div className="mt-2 flex flex-wrap gap-2">
                            {(['all', 'Completed', 'Processing', 'Pending', 'Failed'] as const).map((value) => (
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
                              setFilterMethod('all');
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

              {/* Table */}
              <div className="overflow-x-auto">
                <Table>
                  <TableBody>
                    {isLoading ? (
                      // Skeleton loading state
                      Array(itemsPerPage).fill(0).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-5 w-28" /></TableCell>
                          <TableCell className="text-right"><Skeleton className="h-5 w-20 ml-auto" /></TableCell>
                        </TableRow>
                      ))
                    ) : paginatedData.length > 0 ? (
                      // Actual data
                      paginatedData.map((withdrawal) => (
                        <React.Fragment key={withdrawal.id}>
                          <TableRow
                            onClick={() =>
                              setOpenWithdrawalId((prev) => (prev === withdrawal.id ? null : withdrawal.id))
                            }
                            className="cursor-pointer"
                          >
                            <TableCell className="font-medium text-slate-900">{withdrawal.method}</TableCell>
                            <TableCell className="text-sm text-slate-600">{withdrawal.reference}</TableCell>
                            <TableCell className="text-right font-medium">
                              <div className="flex items-center justify-end">
                                <ArrowDown className="h-3 w-3 text-red-500 mr-1" />
                                {withdrawal.amount}
                              </div>
                            </TableCell>
                          </TableRow>
                          {openWithdrawalId === withdrawal.id && (
                            <TableRow className="bg-slate-100/80">
                              <TableCell colSpan={3}>
                                <div className="flex flex-wrap gap-4 text-sm text-slate-600">
                                  <div className="min-w-[140px]">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Withdrawal ID</p>
                                    <p className="font-medium text-slate-900">{withdrawal.id}</p>
                                  </div>
                                  <div className="min-w-[140px]">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Status</p>
                                    <div className="mt-1">{renderStatusBadge(withdrawal.status)}</div>
                                  </div>
                                  <div className="min-w-[140px]">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Date</p>
                                    <p className="text-slate-700">{withdrawal.date}</p>
                                  </div>
                                  <div className="min-w-[160px]">
                                    <p className="text-xs font-semibold text-slate-500 uppercase">Processing Time</p>
                                    <p className="text-slate-700">{withdrawal.processingTime}</p>
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

          {/* Unresolved Credits Tab */}
          <TabsContent value="unresolved">
            {unresolvedCredits.length === 0 ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50/70 p-6 text-center text-sm font-medium text-emerald-700">
                You do not have any unresolved conflict
              </div>
            ) : (
              <Accordion type="single" collapsible className="space-y-4">
                {unresolvedCredits.map((credit) => {
                  const totalAmountPurchased =
                    credit.amount ?? Math.round(credit.costPrice * credit.markupFactor);
                  const returns = Math.max(0, totalAmountPurchased - credit.costPrice);

                  const tax = Number.isFinite(Number(credit.taxAmount))
                    ? Number(credit.taxAmount)
                    : returns * 0.075;
                  const serviceCharge = Number.isFinite(Number(credit.serviceChargeAmount))
                    ? Number(credit.serviceChargeAmount)
                    : returns * 0.05;
                  const amountAfterTax = returns - tax;
                  const hlsCommission = Number.isFinite(Number(credit.hlsCommissionAmount))
                    ? Number(credit.hlsCommissionAmount)
                    : amountAfterTax * 0.3;
                  const principalShare = Number.isFinite(Number(credit.principalShare))
                    ? Number(credit.principalShare)
                    : returns - tax - serviceCharge - hlsCommission;
                  const packLabel = credit.packName?.trim() || credit.packId?.trim() || 'Supplement Pack';

                  return (
                    <AccordionItem
                      key={credit.id}
                      value={`credit-${credit.id}`}
                      className="rounded-xl border border-red-200 bg-red-50/40"
                    >
                      <AccordionTrigger className="rounded-xl bg-white px-4 py-4 hover:no-underline">
                        <div className="flex w-full items-center justify-between gap-3 text-left">
                          <div className="min-w-0">
                            <p className="text-sm font-semibold text-slate-900 truncate">
                              {packLabel}
                            </p>
                            <p className="text-xs text-slate-500">
                              {credit.benfekName ? `${credit.benfekName} • ` : ''}{credit.date}
                            </p>
                          </div>
                          <div className="text-sm font-semibold text-red-600">
                            ₦{credit.amount.toLocaleString()}
                          </div>
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="px-4 pb-4 pt-2">
                        <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-sm text-slate-700">
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              Total Amount Purchased
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{totalAmountPurchased.toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              Cost Price
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{Math.round(credit.costPrice).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              Returns (Markup)
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{Math.round(returns).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              Principal Share
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{Math.round(principalShare).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              Tax Deducted (7.5% of returns)
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{Math.round(tax).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              Service Charge (5% of returns)
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{Math.round(serviceCharge).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex items-start justify-between gap-4">
                            <span className="text-xs font-semibold uppercase text-slate-500">
                              HLS Commission (30% of returns after tax)
                            </span>
                            <span className="font-semibold text-slate-900">
                              ₦{Math.round(hlsCommission).toLocaleString()}
                            </span>
                          </div>
                          <div className="flex justify-start">
                            <Button onClick={() => handleResolveCredit(credit.id)}>
                              Resolve
                            </Button>
                          </div>
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  );
                })}
              </Accordion>
            )}
          </TabsContent>

          {/* Support Tab */}
          <TabsContent value="support">
            <Card className="overflow-hidden">
              <div className="p-6 border-b bg-white">
                <h3 className="text-lg font-semibold text-gray-900">Support</h3>
                <p className="text-sm text-gray-500 mt-1">
                  Reach out if you need help with withdrawals.
                </p>
              </div>
              <div className="p-6 bg-white space-y-4">
                <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-600">
                  For urgent assistance, contact our support team and include your withdrawal reference.
                </div>
                <Button variant="outline">Contact Support</Button>
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
                        {activeTab === 'withdraw' && (
                          <>
                            {/* Payment Method */}
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Core Account
                              </label>
                              <div className="space-y-3">
                                {displayedMethods.length > 0 ? displayedMethods.map((method) => (
                                  <div
                                    key={method.id}
                                    className="border rounded-md p-4 bg-emerald-50 border-emerald-400"
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
                                              ? `${method.accountName || 'Account'} • ${method.accountNumber || 'Not set'}`
                                              : `Phone: ${method.phoneNumber}`}
                                          </p>
                                        </div>
                                      </div>
                                      <span className="text-xs bg-emerald-100 text-emerald-700 px-2 py-1 rounded-full">
                                        {primaryMethod?.type === 'bank' ? 'Bank payout' : 'Primary payout'}
                                      </span>
                                    </div>
                                  </div>
                                )) : (
                                  <div className="rounded-md border border-dashed border-slate-300 p-4 text-sm text-slate-500">
                                    No payout account set yet. Update your bank account details in My Profile.
                                  </div>
                                )}
                              </div>
                            </div>

                            {/* Amount */}
                            <div>
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
                                Minimum withdrawal amount: ₦{MIN_WITHDRAWAL_AMOUNT.toLocaleString()}.00
                              </p>
                            </div>
                            {/* Submit Button */}
                            <div>
                              <Button 
                                type="submit" 
                                className="w-full"
                                disabled={
                                  isLoading ||
                                  !withdrawAmount ||
                                  parseWithdrawalAmount(withdrawAmount) < MIN_WITHDRAWAL_AMOUNT ||
                                  parseWithdrawalAmount(withdrawAmount) > withdrawableBalance
                                }
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
                          </>
                        )}
                      </form>
                    )}
                  </div>
                </Card>
              </div>
      {/* Page Header */}
      {/* <div className="bg-white border-b">
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
      </div> */}

      {/* Main Content */}
    </div>
  );
};

export default WithdrawPage;

