import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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
  Plus, Edit, Trash2, FileText, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';
import { contentService } from '@/services/contentService';
import { toast } from 'sonner';

// Define the Article type
type Article = {
  id: number;
  title: string;
  category: string;
  author: string;
  status: string;
  publishDate: string;
  createdAt?: string;
  tags?: Record<string, string[]>;
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
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [articles, setArticles] = useState<Article[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [openArticleId, setOpenArticleId] = useState<number | null>(null);
  const [deletingArticleId, setDeletingArticleId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft' | 'Under Review' | 'Archived'>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  const itemsPerPage = 10;

  useEffect(() => {
    const loadArticles = async () => {
      setIsLoading(true);
      try {
        const rows = await contentService.getPrincipalArticles();
        setArticles(rows.map((article: any) => ({
          id: article.id,
          title: article.title,
          category: article.category,
          author: article.author || 'Principal',
          status: article.status === 'published' ? 'Published' : article.status === 'archived' ? 'Archived' : 'Draft',
          publishDate: article.createdAt ? new Date(article.createdAt).toLocaleDateString() : 'Recently',
          createdAt: article.createdAt,
          tags: article.tags || {},
          views: Number(article.views || 0),
          likes: Number(article.likes || 0),
        })));
      } catch (error) {
        console.error('Failed to load articles:', error);
        setArticles([]);
      } finally {
        setIsLoading(false);
      }
    };

    loadArticles();
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
  const filteredData = articles.filter((article) => {
    const matchesSearch =
      article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      article.author.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : article.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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

  const getVisiblePages = () => {
    if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
    const start = Math.max(1, Math.min(currentPage - 1, totalPages - 2));
    return [start, start + 1, start + 2];
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

  const handleDeleteArticle = async (article: Article) => {
    const shouldDelete = window.confirm(`Delete "${article.title}"? This cannot be undone.`);
    if (!shouldDelete) return;

    setDeletingArticleId(article.id);
    try {
      await contentService.deletePrincipalArticle(article.id);
      setArticles((prev) => prev.filter((item) => item.id !== article.id));
      if (openArticleId === article.id) setOpenArticleId(null);
      toast.success('Article deleted');
    } catch (error) {
      console.error(error);
      toast.error('Failed to delete article');
    } finally {
      setDeletingArticleId(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16 pt-[100px]">
      {/* Fixed Header (Back + Title) */}
      <div className="fixed left-0 right-0 top-[64px] z-30 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3 space-y-3">
          <BackToDashboardButton className="text-black/90 hover:text-black/80" />
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Articles</h1>
            <Button className="flex items-center gap-2 h-9 px-4" onClick={() => navigate('/principal/articles/create')}>
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Article</span>
              <span className="sm:hidden">Create</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-1 pb-3">
        <Card className="overflow-hidden">
          {/* Table Controls */}
          <div className="p-4 bg-white border-b flex flex-row items-center justify-between gap-3">
            <div className="relative flex-1 min-w-0 sm:max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search articles..."
                className="pl-10 h-11 sm:h-10 bg-gray-100 border-gray-200 focus:bg-white transition-colors rounded-xl sm:rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <div className="relative">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Filter"
                  onClick={() => setShowStatusFilter((v) => !v)}
                  className="h-11 w-11 sm:h-10 sm:w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
                >
                  <Filter className="h-4 w-4" />
                </Button>

                {showStatusFilter && (
                  <div className="absolute right-0 top-12 z-20 w-48 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                    {[
                      { label: 'All', value: 'all' as const },
                      { label: 'Published', value: 'Published' as const },
                      { label: 'Draft', value: 'Draft' as const },
                      { label: 'Under Review', value: 'Under Review' as const },
                      { label: 'Archived', value: 'Archived' as const },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        type="button"
                        onClick={() => {
                          setStatusFilter(opt.value);
                          setCurrentPage(1);
                          setShowStatusFilter(false);
                        }}
                        className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                          statusFilter === opt.value
                            ? 'bg-emerald-50 text-emerald-700'
                            : 'text-slate-700 hover:bg-slate-50'
                        }`}
                      >
                        {opt.label}
                      </button>
                    ))}
                  </div>
                )}
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Export"
                className="h-11 w-11 sm:h-10 sm:w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
              >
                <Download className="h-4 w-4" />
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Articles count"
                className="h-11 w-11 sm:h-10 sm:w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
              >
                <FileText className="h-4 w-4" />
                <p className="text-xs -mt-1 -ml-1 font-semibold">{isLoading ? '...' : articles.length}</p>
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
                {paginatedData.map((article) => (
                  <AccordionItem
                    key={article.id}
                    value={`article-${article.id}`}
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
                        <div className="col-span-2 md:col-span-4 flex w-full items-center justify-end gap-3 justify-self-start">
                          {Object.values(article.tags || {}).flat().length > 0 ? (
                            <div className="min-w-0 flex-1 text-xs text-slate-500">
                              Tags: {Object.values(article.tags || {}).flat().join(', ')}
                            </div>
                          ) : null}
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => navigate(`/principal/articles/${article.id}/edit`)}
                            className="h-8 flex-1 px-3 text-sm font-semibold border"
                          >
                            Edit
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteArticle(article)}
                            disabled={deletingArticleId === article.id}
                            className="border h-8 flex-1 px-3 text-sm font-semibold text-red-600 hover:text-red-700"
                          >
                            {deletingArticleId === article.id ? 'Deleting...' : 'Delete'}
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
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="min-w-0 flex-1 text-xs sm:text-sm text-gray-500 truncate">
                Showing {isLoading ? '...' : `${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)}`} of {isLoading ? '...' : filteredData.length} entries
              </div>
              <Pagination className="shrink-0 w-auto">
                <PaginationContent className="flex-nowrap justify-end overflow-x-auto no-scrollbar max-w-[55vw] sm:max-w-none">
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label="First page"
                      onClick={(e) => { e.preventDefault(); setCurrentPage(1); }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50 h-9 w-9' : 'h-9 w-9'}
                    >
                      <ChevronsLeft className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label="Previous page"
                      onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.max(1, prev - 1)); }}
                      className={currentPage === 1 ? 'pointer-events-none opacity-50 h-9 w-9' : 'h-9 w-9'}
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>

                  {getVisiblePages().map((page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => { e.preventDefault(); setCurrentPage(page); }}
                        isActive={currentPage === page}
                        className="h-9 w-9"
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}

                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label="Next page"
                      onClick={(e) => { e.preventDefault(); setCurrentPage(prev => Math.min(totalPages, prev + 1)); }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50 h-9 w-9' : 'h-9 w-9'}
                    >
                      <ChevronRight className="h-4 w-4" />
                    </PaginationLink>
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationLink
                      href="#"
                      aria-label="Last page"
                      onClick={(e) => { e.preventDefault(); setCurrentPage(totalPages); }}
                      className={currentPage === totalPages ? 'pointer-events-none opacity-50 h-9 w-9' : 'h-9 w-9'}
                    >
                      <ChevronsRight className="h-4 w-4" />
                    </PaginationLink>
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
