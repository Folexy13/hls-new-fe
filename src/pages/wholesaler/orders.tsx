import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Filter, ArrowUpDown, MoreVertical, 
  Eye, Package, TruckIcon, CheckCircle, Clock, 
  AlertCircle, Calendar, Download
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
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Mock data for orders
const mockOrders = [
  { 
    id: 'ORD-2023-1001', 
    customer: 'Lagos Medical Center',
    customerType: 'Hospital',
    date: '2023-12-15',
    total: '₦45,000',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    shippingAddress: '123 Medical Avenue, Lagos',
    trackingNumber: 'TRK-789012',
    notes: 'Deliver to reception area'
  },
  { 
    id: 'ORD-2023-1002', 
    customer: 'Abuja Pharmacy Plus',
    customerType: 'Pharmacy',
    date: '2023-12-14',
    total: '₦32,500',
    status: 'Processing',
    paymentStatus: 'Pending',
    paymentMethod: 'Credit Card',
    shippingAddress: '45 Pharmacy Road, Abuja',
    trackingNumber: '',
    notes: ''
  },
  { 
    id: 'ORD-2023-1003', 
    customer: 'Port Harcourt Health Clinic',
    customerType: 'Clinic',
    date: '2023-12-12',
    total: '₦18,750',
    status: 'Shipped',
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    shippingAddress: '78 Health Street, Port Harcourt',
    trackingNumber: 'TRK-789013',
    notes: 'Fragile items, handle with care'
  },
  { 
    id: 'ORD-2023-1004', 
    customer: 'Kano Medical Supplies',
    customerType: 'Distributor',
    date: '2023-12-10',
    total: '₦67,500',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    shippingAddress: '15 Supply Road, Kano',
    trackingNumber: 'TRK-789014',
    notes: ''
  },
  { 
    id: 'ORD-2023-1005', 
    customer: 'Enugu General Hospital',
    customerType: 'Hospital',
    date: '2023-12-08',
    total: '₦52,000',
    status: 'Cancelled',
    paymentStatus: 'Refunded',
    paymentMethod: 'Credit Card',
    shippingAddress: '32 Hospital Road, Enugu',
    trackingNumber: '',
    notes: 'Cancelled due to stock issues'
  },
  { 
    id: 'ORD-2023-1006', 
    customer: 'Ibadan Community Clinic',
    customerType: 'Clinic',
    date: '2023-12-05',
    total: '₦28,500',
    status: 'Delivered',
    paymentStatus: 'Paid',
    paymentMethod: 'Bank Transfer',
    shippingAddress: '56 Community Road, Ibadan',
    trackingNumber: 'TRK-789015',
    notes: ''
  },
  { 
    id: 'ORD-2023-1007', 
    customer: 'Benin Medical Store',
    customerType: 'Pharmacy',
    date: '2023-12-03',
    total: '₦41,250',
    status: 'Processing',
    paymentStatus: 'Pending',
    paymentMethod: 'Credit Card',
    shippingAddress: '89 Medical Street, Benin',
    trackingNumber: '',
    notes: 'Expedite shipping if possible'
  },
];

const OrdersPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<typeof mockOrders>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedStatus, setSelectedStatus] = useState('All');
  const [selectedOrder, setSelectedOrder] = useState<typeof mockOrders[0] | null>(null);
  const [isOrderDetailsOpen, setIsOrderDetailsOpen] = useState(false);
  
  // Statuses for filter
  const statuses = ['All', 'Processing', 'Shipped', 'Delivered', 'Cancelled'];
  
  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setOrders(mockOrders);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter orders based on search term and status
  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.id.toLowerCase().includes(searchTerm.toLowerCase()) || 
      order.customer.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = selectedStatus === 'All' || order.status === selectedStatus;
    
    return matchesSearch && matchesStatus;
  });
  
  // Pagination
  const ordersPerPage = 5;
  const indexOfLastOrder = currentPage * ordersPerPage;
  const indexOfFirstOrder = indexOfLastOrder - ordersPerPage;
  const currentOrders = filteredOrders.slice(indexOfFirstOrder, indexOfLastOrder);
  const totalPages = Math.ceil(filteredOrders.length / ordersPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // View order details
  const handleViewOrderDetails = (order: typeof mockOrders[0]) => {
    setSelectedOrder(order);
    setIsOrderDetailsOpen(true);
  };
  
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Delivered': return 'bg-emerald-100 text-emerald-800';
      case 'Processing': return 'bg-blue-100 text-blue-800';
      case 'Shipped': return 'bg-amber-100 text-amber-800';
      case 'Cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Delivered': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'Processing': return <Clock className="h-3 w-3 mr-1" />;
      case 'Shipped': return <TruckIcon className="h-3 w-3 mr-1" />;
      case 'Cancelled': return <AlertCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };
  
  // Payment status badge color mapping
  const getPaymentStatusColor = (status: string) => {
    switch(status) {
      case 'Paid': return 'bg-emerald-100 text-emerald-800';
      case 'Pending': return 'bg-amber-100 text-amber-800';
      case 'Refunded': return 'bg-red-100 text-red-800';
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
              <h1 className="text-2xl font-bold text-gray-900">Orders</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your product orders</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button variant="outline" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                Export Orders
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Filters and Search */}
          <div className="p-6 border-b bg-white">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  placeholder="Search orders by ID or customer..."
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
          
          {/* Orders Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Order ID
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Customer</th>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Date
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Total</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  // Skeleton loaders for orders
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
                  currentOrders.length > 0 ? (
                    currentOrders.map((order) => (
                      <tr key={order.id} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4 font-medium text-gray-900">{order.id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="text-sm font-medium text-gray-900">{order.customer}</p>
                            <p className="text-xs text-gray-500">{order.customerType}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <Calendar className="h-3 w-3 mr-1 text-gray-400" />
                            {new Date(order.date).toLocaleDateString()}
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{order.total}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`flex w-fit items-center ${getStatusColor(order.status)}`}>
                            {getStatusIcon(order.status)}
                            {order.status}
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
                              <DropdownMenuItem 
                                className="flex items-center gap-2"
                                onClick={() => handleViewOrderDetails(order)}
                              >
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Package className="h-4 w-4" /> Update Status
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Download className="h-4 w-4" /> Download Invoice
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
                            <Package className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-1">No orders found</p>
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
          {!isLoading && filteredOrders.length > 0 && (
            <div className="py-4 px-6 bg-white border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{indexOfFirstOrder + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastOrder, filteredOrders.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredOrders.length}</span> orders
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
      
      {/* Order Details Dialog */}
      <Dialog open={isOrderDetailsOpen} onOpenChange={setIsOrderDetailsOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>Order Details</DialogTitle>
            <DialogDescription>
              Complete information about order {selectedOrder?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="mt-4 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Order Information</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Order ID:</span>
                        <span className="text-sm font-medium">{selectedOrder.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Date:</span>
                        <span className="text-sm font-medium">{new Date(selectedOrder.date).toLocaleDateString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Amount:</span>
                        <span className="text-sm font-medium">{selectedOrder.total}</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Customer Information</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Customer:</span>
                        <span className="text-sm font-medium">{selectedOrder.customer}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Type:</span>
                        <span className="text-sm font-medium">{selectedOrder.customerType}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Address:</span>
                        <span className="text-sm font-medium">{selectedOrder.shippingAddress}</span>
                      </div>
                    </div>
                  </Card>
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Payment Information</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Status:</span>
                        <Badge variant="outline" className={`${getPaymentStatusColor(selectedOrder.paymentStatus)}`}>
                          {selectedOrder.paymentStatus}
                        </Badge>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Payment Method:</span>
                        <span className="text-sm font-medium">{selectedOrder.paymentMethod}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Total Amount:</span>
                        <span className="text-sm font-medium">{selectedOrder.total}</span>
                      </div>
                    </div>
                  </Card>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Shipping Information</h3>
                  <Card className="p-4">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Shipping Address:</span>
                        <span className="text-sm font-medium">{selectedOrder.shippingAddress}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge variant="outline" className={`${getStatusColor(selectedOrder.status)}`}>
                          {selectedOrder.status}
                        </Badge>
                      </div>
                      {selectedOrder.trackingNumber && (
                        <div className="flex justify-between">
                          <span className="text-sm text-gray-500">Tracking Number:</span>
                          <span className="text-sm font-medium">{selectedOrder.trackingNumber}</span>
                        </div>
                      )}
                    </div>
                  </Card>
                </div>
              </div>
              
              {selectedOrder.notes && (
                <div>
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Notes</h3>
                  <Card className="p-4">
                    <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                  </Card>
                </div>
              )}
              
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsOrderDetailsOpen(false)}>Close</Button>
                <Button>Download Invoice</Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default OrdersPage;