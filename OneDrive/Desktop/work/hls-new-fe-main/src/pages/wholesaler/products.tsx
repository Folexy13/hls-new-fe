import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';
import { 
  Search, Plus, Filter, ArrowUpDown, MoreVertical, 
  Edit, Trash2, Eye, AlertCircle, CheckCircle
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

// Mock data for products
const mockProducts = [
  { 
    id: 1, 
    name: 'Paracetamol 500mg', 
    category: 'Pain Relief',
    price: '₦500',
    stock: 245,
    status: 'Active',
    image: 'https://via.placeholder.com/60/4299E1/FFFFFF?text=P',
    created: '2023-05-15',
    description: 'Effective pain relief medication for headaches and fever'
  },
  { 
    id: 2, 
    name: 'Vitamin C 1000mg', 
    category: 'Vitamins & Supplements',
    price: '₦1,200',
    stock: 189,
    status: 'Active',
    image: 'https://via.placeholder.com/60/48BB78/FFFFFF?text=V',
    created: '2023-06-22',
    description: 'Immune system support and antioxidant supplement'
  },
  { 
    id: 3, 
    name: 'Ibuprofen 400mg', 
    category: 'Pain Relief',
    price: '₦650',
    stock: 156,
    status: 'Active',
    image: 'https://via.placeholder.com/60/ED8936/FFFFFF?text=I',
    created: '2023-07-10',
    description: 'Anti-inflammatory pain reliever for muscle aches and pains'
  },
  { 
    id: 4, 
    name: 'Amoxicillin 250mg', 
    category: 'Antibiotics',
    price: '₦850',
    stock: 132,
    status: 'Low Stock',
    image: 'https://via.placeholder.com/60/9F7AEA/FFFFFF?text=A',
    created: '2023-08-05',
    description: 'Broad-spectrum antibiotic for bacterial infections'
  },
  { 
    id: 5, 
    name: 'Multivitamin Complex', 
    category: 'Vitamins & Supplements',
    price: '₦1,500',
    stock: 98,
    status: 'Low Stock',
    image: 'https://via.placeholder.com/60/F56565/FFFFFF?text=M',
    created: '2023-09-18',
    description: 'Complete daily multivitamin with essential nutrients'
  },
  { 
    id: 6, 
    name: 'Loratadine 10mg', 
    category: 'Allergy Relief',
    price: '₦750',
    stock: 0,
    status: 'Out of Stock',
    image: 'https://via.placeholder.com/60/667EEA/FFFFFF?text=L',
    created: '2023-10-30',
    description: 'Non-drowsy antihistamine for allergy symptoms'
  },
  { 
    id: 7, 
    name: 'Omeprazole 20mg', 
    category: 'Digestive Health',
    price: '₦950',
    stock: 75,
    status: 'Active',
    image: 'https://via.placeholder.com/60/F6AD55/FFFFFF?text=O',
    created: '2023-11-12',
    description: 'Proton pump inhibitor for acid reflux and heartburn'
  },
  { 
    id: 8, 
    name: 'Metformin 500mg', 
    category: 'Diabetes',
    price: '₦1,100',
    stock: 0,
    status: 'Pending Approval',
    image: 'https://via.placeholder.com/60/68D391/FFFFFF?text=M',
    created: '2023-12-05',
    description: 'Oral medication for type 2 diabetes management'
  },
];

const ProductsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [products, setProducts] = useState<typeof mockProducts>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedStatus, setSelectedStatus] = useState('All');
  
  // Categories derived from products
  const categories = ['All', ...Array.from(new Set(mockProducts.map(p => p.category)))];
  const statuses = ['All', 'Active', 'Low Stock', 'Out of Stock', 'Pending Approval'];
  
  // Simulate loading
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setProducts(mockProducts);
      setIsLoading(false);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, []);
  
  // Filter products based on search term, category, and status
  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          product.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    const matchesStatus = selectedStatus === 'All' || product.status === selectedStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });
  
  // Pagination
  const productsPerPage = 5;
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(indexOfFirstProduct, indexOfLastProduct);
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  
  const handlePageChange = (pageNumber: number) => {
    setCurrentPage(pageNumber);
  };
  
  // Status badge color mapping
  const getStatusColor = (status: string) => {
    switch(status) {
      case 'Active': return 'bg-emerald-100 text-emerald-800';
      case 'Low Stock': return 'bg-amber-100 text-amber-800';
      case 'Out of Stock': return 'bg-red-100 text-red-800';
      case 'Pending Approval': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };
  
  // Status icon mapping
  const getStatusIcon = (status: string) => {
    switch(status) {
      case 'Active': return <CheckCircle className="h-3 w-3 mr-1" />;
      case 'Low Stock': return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'Out of Stock': return <AlertCircle className="h-3 w-3 mr-1" />;
      case 'Pending Approval': return <AlertCircle className="h-3 w-3 mr-1" />;
      default: return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Products</h1>
              <p className="mt-1 text-sm text-gray-500">Manage your medication products</p>
            </div>
            <div className="mt-4 md:mt-0">
              <Link to="/wholesaler/add-product">
                <Button className="flex items-center gap-2">
                  <Plus className="h-4 w-4" />
                  Add New Product
                </Button>
              </Link>
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
                  placeholder="Search products..."
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="flex gap-3">
                <div className="w-40">
                  <select
                    className="w-full rounded-md border border-gray-300 py-2 pl-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                
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
          
          {/* Products Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 border-b">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <div className="flex items-center gap-1">
                      Product
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-3 text-left">Category</th>
                  <th className="px-6 py-3 text-left">Price</th>
                  <th className="px-6 py-3 text-left">Stock</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {isLoading ? (
                  // Skeleton loaders for products
                  Array(5).fill(0).map((_, index) => (
                    <tr key={index} className="bg-white">
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-3">
                          <Skeleton className="h-12 w-12 rounded" />
                          <div>
                            <Skeleton className="h-4 w-32 mb-1" />
                            <Skeleton className="h-3 w-24" />
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-20" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-16" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-4 w-12" /></td>
                      <td className="px-6 py-4"><Skeleton className="h-6 w-24 rounded-full" /></td>
                      <td className="px-6 py-4 text-right"><Skeleton className="h-8 w-8 rounded-full ml-auto" /></td>
                    </tr>
                  ))
                ) : (
                  currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product.id} className="bg-white hover:bg-gray-50">
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="h-12 w-12 rounded object-cover border"
                            />
                            <div>
                              <p className="font-medium text-gray-900">{product.name}</p>
                              <p className="text-xs text-gray-500 truncate max-w-xs">{product.description}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.category}</td>
                        <td className="px-6 py-4 text-sm font-medium text-gray-900">{product.price}</td>
                        <td className="px-6 py-4 text-sm text-gray-600">{product.stock}</td>
                        <td className="px-6 py-4">
                          <Badge variant="outline" className={`flex w-fit items-center ${getStatusColor(product.status)}`}>
                            {getStatusIcon(product.status)}
                            {product.status}
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
                                <Eye className="h-4 w-4" /> View Details
                              </DropdownMenuItem>
                              <DropdownMenuItem className="flex items-center gap-2">
                                <Edit className="h-4 w-4" /> Edit Product
                              </DropdownMenuItem>
                              <DropdownMenuSeparator />
                              <DropdownMenuItem className="flex items-center gap-2 text-red-600">
                                <Trash2 className="h-4 w-4" /> Delete
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
                            <Search className="h-6 w-6 text-gray-400" />
                          </div>
                          <p className="text-lg font-medium text-gray-900 mb-1">No products found</p>
                          <p className="text-sm text-gray-500 mb-4">Try adjusting your search or filter criteria</p>
                          <Link to="/wholesaler/add-product">
                            <Button size="sm" className="flex items-center gap-2">
                              <Plus className="h-4 w-4" />
                              Add New Product
                            </Button>
                          </Link>
                        </div>
                      </td>
                    </tr>
                  )
                )}
              </tbody>
            </table>
          </div>
          
          {/* Pagination */}
          {!isLoading && filteredProducts.length > 0 && (
            <div className="py-4 px-6 bg-white border-t">
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-500">
                  Showing <span className="font-medium">{indexOfFirstProduct + 1}</span> to{" "}
                  <span className="font-medium">
                    {Math.min(indexOfLastProduct, filteredProducts.length)}
                  </span>{" "}
                  of <span className="font-medium">{filteredProducts.length}</span> products
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
                      let pageNumber;
                      
                      // Logic to show relevant page numbers
                      if (totalPages <= 5) {
                        pageNumber = index + 1;
                      } else if (currentPage <= 3) {
                        pageNumber = index + 1;
                        if (index === 4) return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else if (currentPage >= totalPages - 2) {
                        pageNumber = totalPages - 4 + index;
                        if (index === 0) return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                      } else {
                        if (index === 0) return (
                          <PaginationItem key={index}>
                            <PaginationLink onClick={() => handlePageChange(1)}>1</PaginationLink>
                          </PaginationItem>
                        );
                        if (index === 1) return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                        if (index === 3) return (
                          <PaginationItem key={index}>
                            <PaginationEllipsis />
                          </PaginationItem>
                        );
                        if (index === 4) return (
                          <PaginationItem key={index}>
                            <PaginationLink onClick={() => handlePageChange(totalPages)}>
                              {totalPages}
                            </PaginationLink>
                          </PaginationItem>
                        );
                        pageNumber = currentPage + index - 2;
                      }
                      
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

export default ProductsPage;