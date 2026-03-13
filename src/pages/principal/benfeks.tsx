import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
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
import {
  Search, UserPlus, Filter, Download, MoreHorizontal,
  ChevronDown, Eye, Edit, ArrowUpDown,
  Copy, CheckCircle
} from 'lucide-react';

// Mock data for benfeks
const mockBenfeks = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  code: `BFK-${Math.floor(10000 + Math.random() * 90000)}`,
  name: `Benfek ${i + 1}`,
  email: `benfek${i + 1}@example.com`,
  phone: `+234 ${Math.floor(Math.random() * 1000000000)}`,
  status: ['Active', 'Inactive', 'Pending'][Math.floor(Math.random() * 3)],
  joinDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  orders: Math.floor(Math.random() * 50),
}));

const BenfeksPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [benfeks, setBenfeks] = useState<Array<{
    id: number;
    code: string;
    name: string;
    email: string;
    phone: string;
    status: string;
    joinDate: string;
    orders: number;
  }>>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockBenfeks.length / itemsPerPage);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setBenfeks(mockBenfeks);
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

  // Copy benfek code to clipboard
  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter and sort data
  const filteredData = benfeks.filter(benfek =>
    benfek.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benfek.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benfek.phone.includes(searchTerm) ||
    benfek.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField] < b[sortField]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField] > b[sortField]) return sortDirection === 'asc' ? 1 : -1;
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
      case 'Active':
        bgColor = 'bg-emerald-100 text-emerald-800';
        break;
      case 'Inactive':
        bgColor = 'bg-gray-100 text-gray-800';
        break;
      case 'Pending':
        bgColor = 'bg-amber-100 text-amber-800';
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
              <h1 className="text-2xl font-bold text-gray-900">Benfeks</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage all your benfeks in one place
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/principal/add-benfek">
                <Button className="flex items-center gap-2">
                  <UserPlus className="h-4 w-4" />
                  Add New Benfek
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card className="overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search benfeks..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Filter className="h-4 w-4" />
                <span className="hidden sm:inline">Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex items-center gap-2">
                <Download className="h-4 w-4" />
                <span className="hidden sm:inline">Export</span>
              </Button>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <Table>
              <TableCaption>A list of all benfeks.</TableCaption>
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
                      onClick={() => handleSort('code')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Code
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleSort('name')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Name
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden md:table-cell">Email</TableHead>
                  <TableHead className="hidden lg:table-cell">Phone</TableHead>
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
                      onClick={() => handleSort('joinDate')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Join Date
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="hidden lg:table-cell">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => handleSort('orders')}
                      className="flex items-center gap-1 p-0 h-auto font-medium"
                    >
                      Orders
                      <ArrowUpDown className="h-3 w-3" />
                    </Button>
                  </TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {isLoading ? (
                  // Skeleton loading state
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-40" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-28" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedData.length > 0 ? (
                  // Actual data
                  paginatedData.map((benfek) => (
                    <TableRow key={benfek.id}>
                      <TableCell className="font-medium">{benfek.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <span className="font-mono text-xs mr-2">{benfek.code}</span>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-6 w-6"
                            onClick={() => copyCode(benfek.code)}
                          >
                            {copiedCode === benfek.code ? (
                              <CheckCircle className="h-3 w-3 text-emerald-500" />
                            ) : (
                              <Copy className="h-3 w-3 text-gray-400" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>{benfek.name}</TableCell>
                      <TableCell className="hidden md:table-cell">{benfek.email}</TableCell>
                      <TableCell className="hidden lg:table-cell">{benfek.phone}</TableCell>
                      <TableCell>{renderStatusBadge(benfek.status)}</TableCell>
                      <TableCell className="hidden md:table-cell">{benfek.joinDate}</TableCell>
                      <TableCell className="hidden lg:table-cell">{benfek.orders}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Eye className="h-4 w-4" />
                          </Button>
                          <Button variant="ghost" size="icon" className="h-8 w-8">
                            <Edit className="h-4 w-4" />
                          </Button>
                          
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  // No results
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No benfeks found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="p-4 bg-white border-t">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Showing {isLoading ? '...' : `${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)}`} of {isLoading ? '...' : filteredData.length} entries
              </div>
              <Pagination>
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

export default BenfeksPage;