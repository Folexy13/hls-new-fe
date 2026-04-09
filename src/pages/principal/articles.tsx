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
  Search, Filter, Download, Eye, ArrowUpDown,
  ChevronDown, Plus, Edit, Trash2, FileText
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

// Define the Article type
type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  status: string;
  publishDate: string;
  views: number;
  likes: number;
};

// Mock data for articles
const mockArticles: Article[] = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  title: [
    'The Benefits of Regular Exercise',
    'Understanding Diabetes Management',
    'Healthy Eating Habits for Busy Professionals',
    'Mental Health Awareness in the Workplace',
    'The Importance of Vaccination',
    'Managing Chronic Pain Naturally',
    'Sleep Hygiene: Tips for Better Rest',
    'Heart Health: Prevention and Care',
    'Stress Management Techniques',
    'Nutrition Myths Debunked'
  ][Math.floor(Math.random() * 10)],
  category: ['Health', 'Nutrition', 'Fitness', 'Mental Health', 'Medical', 'Wellness'][Math.floor(Math.random() * 6)],
  author: ['Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Brown', 'Dr. Emily Davis', 'Dr. Robert Wilson'][Math.floor(Math.random() * 5)],
  status: ['Published', 'Draft', 'Under Review', 'Archived'][Math.floor(Math.random() * 4)],
  publishDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  views: Math.floor(Math.random() * 10000),
  likes: Math.floor(Math.random() * 1000),
}));

const ArticlesPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openArticleId, setOpenArticleId] = useState()
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockArticles.length / itemsPerPage);

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setArticles(mockArticles);
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
  const filteredData = articles.filter(article => 
    article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    article.author.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField as keyof Article] < b[sortField as keyof Article]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField as keyof Article] > b[sortField as keyof Article]) return sortDirection === 'asc' ? 1 : -1;
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
      case 'Published':
        bgColor = 'bg-emerald-100 text-emerald-800';
        break;
      case 'Draft':
        bgColor = 'bg-gray-100 text-gray-800';
        break;
      case 'Under Review':
        bgColor = 'bg-amber-100 text-amber-800';
        break;
      case 'Archived':
        bgColor = 'bg-blue-100 text-blue-800';
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

  const statusIconColor = (status: string) => {
    switch (status) {
      case 'Published':
        return 'text-emerald-500';
      case 'Archived':
        return 'text-blue-500';
      case 'Under Review':
        return 'text-amber-500';
      case 'Draft':
      default:
        return 'text-slate-400';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <BackToDashboardButton className="fixed left-3 top-16 z-50 text-black/90 hover:text-black/80" />
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Articles</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your health articles and publications
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Article
              </Button>
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
                placeholder="Search articles..."
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

          {/* Articles List (Accordion) */}
          <div className="p-4 space-y-2">
            {isLoading ? (
              Array(itemsPerPage).fill(0).map((_, index) => (
                <div key={index} className="rounded-xl border border-slate-200 bg-white p-4">
                  <div className="flex items-center justify-between gap-4">
                    <Skeleton className="h-5 w-40" />
                    <Skeleton className="h-5 w-20" />
                    <Skeleton className="h-8 w-20" />
                  </div>
                </div>
              ))
            ) : paginatedData.length > 0 ? (
              <Accordion
                type="single"
                collapsible
                value={openArticleId ? `article-${openArticleId}` : undefined}
                onValueChange={(value) =>
                  setOpenArticleId(value ? Number(value.replace('article-', '')) : null)
                }
                className="space-y-2"
              >
                {paginatedData.map((article, index) => (
                  <AccordionItem
                    key={article.id}
                    value={`article-${index}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm"
                  >
                    <AccordionTrigger className="w-full rounded-lg bg-white py-4 hover:no-underline hover:bg-slate-50/70">
                      <div className="flex w-full justify-between flex-row items-center gap-2 text-left sm:items-center">
                        <div className="flex w-full items-center gap-2 justify-start min-w-0">
                          <FileText className={`h-5 w-5 ${statusIconColor(article.status)}`} />
                          <span className="text-sm font-semibold text-slate-900 truncate w-[90%]">
                            {article.title}
                          </span>
                        </div>
                        <div className="ml-auto flex w-1/3 justify-end text-right">
                          <Eye className="h-4 w-4 text-slate-500" />
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-sm text-slate-600">
                        <div className="flex flex-col min-w-0 items-start text-left">
                          <p className="text-xs font-bold text-slate-500 uppercase">Category</p>
                          <p className="mt-1 text-slate-700">{article.category}</p>
                        </div>
                        <div className="flex flex-col min-w-0 items-center">
                          <p className="text-xs font-bold text-slate-500 uppercase">Author</p>
                          <p className="mt-1 text-slate-700">{article.author}</p>
                        </div>
                        <div className="flex flex-col min-w-0 items-start text-left">
                          <p className="text-xs font-bold text-slate-500 uppercase">Views</p>
                          <p className="mt-1 text-slate-700 whitespace-nowrap">{article.views.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col min-w-0 items-center">
                          <p className="text-xs font-bold text-slate-500 uppercase">Published</p>
                          <p className="mt-1 text-slate-700 whitespace-nowrap">{article.publishDate}</p>
                        </div>
                        <div className="flex flex-col min-w-0 justify-self-start">
                          <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                          <div className="mt-1">{renderStatusBadge(article.status)}</div>
                        </div>
                        <div className="col-span-2 md:col-span-4 flex w-full items-center justify-between gap-3 justify-self-start">
                          <Button variant="ghost" size="sm" className="h-8 flex-1 px-3 text-sm font-semibold border">
                            Edit
                          </Button>
                          <Button variant="ghost" size="sm" className="border h-8 flex-1 px-3 text-sm font-semibold text-red-600 hover:text-red-700">
                            Delete
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No articles found. Try adjusting your search.
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
      </div>
    </div>
  );
};

export default ArticlesPage;
