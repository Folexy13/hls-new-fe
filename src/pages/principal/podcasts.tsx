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
  Plus, Edit, Trash2, Play, Mic, 
  Pause, Clock, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight
} from 'lucide-react';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@radix-ui/react-accordion';

// Define the Podcast type
type Podcast = {
  id: number;
  title: string;
  host: string;
  category: string;
  duration: string;
  publishDate: string;
  status: string;
  listens: number;
};

// Mock data for podcasts
const mockPodcasts: Podcast[] = Array(50).fill(0).map((_, i) => ({
  id: i + 1,
  title: [
    'Health Talk: Managing Diabetes',
    'The Wellness Hour',
    'Medical Breakthroughs',
    'Fitness & Nutrition',
    'Mental Health Matters',
    "The Doctor's Corner",
    'Living Well Today',
    'Health Myths Debunked',
    'The Healing Journey',
    'Medical Science Explained'
  ][Math.floor(Math.random() * 10)],
  host: ['Dr. John Smith', 'Dr. Sarah Johnson', 'Dr. Michael Brown', 'Dr. Emily Davis', 'Dr. Robert Wilson'][Math.floor(Math.random() * 5)],
  category: ['Health', 'Nutrition', 'Fitness', 'Mental Health', 'Medical', 'Wellness'][Math.floor(Math.random() * 6)],
  duration: `${Math.floor(Math.random() * 60) + 10}:${Math.floor(Math.random() * 60).toString().padStart(2, '0')}`,
  publishDate: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
  status: ['Published', 'Draft', 'Scheduled', 'Archived'][Math.floor(Math.random() * 4)],
  listens: Math.floor(Math.random() * 5000),
}));

const PodcastsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [playingId, setPlayingId] = useState<number | null>(null);
  const [openPodcastId, setOpenPodcastId] = useState<number | null>(null);
  const [statusFilter, setStatusFilter] = useState<'all' | 'Published' | 'Draft' | 'Scheduled' | 'Archived'>('all');
  const [showStatusFilter, setShowStatusFilter] = useState(false);
  
  const itemsPerPage = 10;

  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setPodcasts(mockPodcasts);
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

  // Toggle play/pause
  const togglePlay = (id: number) => {
    if (playingId === id) {
      setPlayingId(null);
    } else {
      setPlayingId(id);
    }
  };

  // Filter and sort data
  const filteredData = podcasts.filter((podcast) => {
    const matchesSearch =
      podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
      podcast.category.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' ? true : podcast.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField as keyof Podcast] < b[sortField as keyof Podcast]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField as keyof Podcast] > b[sortField as keyof Podcast]) return sortDirection === 'asc' ? 1 : -1;
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
      case 'Scheduled':
        bgColor = 'bg-blue-100 text-blue-800';
        break;
      case 'Archived':
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
    <div className="min-h-screen bg-gray-50 pb-16 pt-[100px]">
      {/* Fixed Header (Back + Title) */}
      <div className="fixed left-0 right-0 top-[64px] z-30 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-3 pb-3 space-y-3">
          <BackToDashboardButton className="text-black/90 hover:text-black/80" />
          <div className="flex items-center justify-between gap-3">
            <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Podcasts</h1>
            <Button className="flex items-center gap-2 h-9 px-4">
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">Create Podcast</span>
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
                placeholder="Search podcasts..."
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
                      { label: 'Scheduled', value: 'Scheduled' as const },
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
                aria-label="Podcasts count"
                className="h-11 w-11 sm:h-10 sm:w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
              >
                <Mic className="h-4 w-4" />
                <p className="text-xs -mt-1 -ml-1 font-semibold">{isLoading ? '...' : podcasts.length}</p>
              </Button>
            </div>
          </div>

          {/* Podcasts List (Accordion) */}
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
                value={openPodcastId ? `podcast-${openPodcastId}` : undefined}
                onValueChange={(value) =>
                  setOpenPodcastId(value ? Number(value.replace('podcast-', '')) : null)
                }
                className="space-y-2"
              >
                {paginatedData.map((podcast) => (
                  <AccordionItem
                    key={podcast.id}
                    value={`podcast-${podcast.id}`}
                    className="rounded-xl border border-slate-200 bg-white px-4 shadow-sm"
                  >
                    <AccordionTrigger className="w-full rounded-lg bg-white py-4 hover:no-underline hover:bg-slate-50/70">
                      <div className="flex w-full justify-between flex-row items-center gap-2 text-left sm:items-center">
                        <div className="flex w-full items-center gap-2 justify-start min-w-0">
                          <Mic className="h-5 w-5 text-slate-400" />
                          <span className="text-sm font-semibold text-slate-900 truncate w-[90%]">
                            {podcast.title}
                          </span>
                        </div>
                        <div className="ml-auto flex w-1/3 justify-end text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            {/* <Eye className="h-4 w-4 text-slate-500" /> */}
                            <Button
                              variant="ghost"
                              size="icon"
                              className={`h-8 w-8 rounded-full ${
                                playingId === podcast.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100 text-slate-700'
                              }`}
                              onClick={(e) => {
                                e.stopPropagation();
                                togglePlay(podcast.id);
                              }}
                              aria-label={playingId === podcast.id ? 'Pause podcast' : 'Play podcast'}
                            >
                              {playingId === podcast.id ? (
                                <Pause className="h-4 w-4" />
                              ) : (
                                <Play className="h-4 w-4" />
                              )}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pb-4 pt-2">
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-sm text-slate-600">
                        <div className="flex flex-col min-w-0">
                          <p className="text-xs font-bold text-slate-500 uppercase">Podcast ID</p>
                          <p className="mt-1 text-slate-900">{podcast.id}</p>
                        </div>
                        <div className="flex flex-col min-w-0 md:items-center items-end">
                          <p className="text-xs font-bold text-slate-500 uppercase">Host</p>
                          <p className="mt-1 text-slate-700">{podcast.host}</p>
                        </div>
                        <div className="flex flex-col min-w-0 md:items-center">
                          <p className="text-xs font-bold text-slate-500 uppercase">Category</p>
                          <p className="mt-1 text-slate-700">{podcast.category}</p>
                        </div>
                        <div className="flex flex-col min-w-0 items-end">
                          <p className="text-xs font-bold text-slate-500 uppercase">Duration</p>
                          <p className="mt-1 text-slate-700 whitespace-nowrap">{podcast.duration}</p>
                        </div>
                        <div className="flex flex-col min-w-0">
                          <p className="text-xs font-bold text-slate-500 uppercase">Listens</p>
                          <p className="mt-1 text-slate-700 whitespace-nowrap">{podcast.listens.toLocaleString()}</p>
                        </div>
                        <div className="flex flex-col min-w-0 items-end md:items-center">
                          <p className="text-xs font-bold text-slate-500 uppercase">Status</p>
                          <div className="mt-1">{renderStatusBadge(podcast.status)}</div>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="rounded-xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
                No podcasts found. Try adjusting your search.
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

export default PodcastsPage;
