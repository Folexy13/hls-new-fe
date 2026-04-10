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
  ChevronDown, Plus, Edit, Trash2, Play, Mic, 
  Pause, Clock
} from 'lucide-react';

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
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(mockPodcasts.length / itemsPerPage);

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
  const filteredData = podcasts.filter(podcast => 
    podcast.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.host.toLowerCase().includes(searchTerm.toLowerCase()) ||
    podcast.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

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
    <div className="min-h-screen bg-gray-50 pb-16">
      <BackToDashboardButton className="fixed left-3 top-16 z-50 text-black/90 hover:text-black/80" />
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Podcasts</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your health podcasts and episodes
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                Create Podcast
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
                placeholder="Search podcasts..."
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
                    <AccordionTrigger className="rounded-lg bg-white py-4 hover:no-underline hover:bg-slate-50/70">
                      <div className="flex w-full flex-row items-start gap-2 text-left sm:items-center">
                        <div className="flex w-1/3 items-center gap-2 justify-start">
                          <Button
                            variant="ghost"
                            size="icon"
                            className={`h-8 w-8 rounded-full ${playingId === podcast.id ? 'bg-emerald-100 text-emerald-600' : 'bg-gray-100'}`}
                            onClick={(e) => {
                              e.stopPropagation();
                              togglePlay(podcast.id);
                            }}
                          >
                            {playingId === podcast.id ? (
                              <Pause className="h-4 w-4" />
                            ) : (
                              <Play className="h-4 w-4" />
                            )}
                          </Button>
                          <span className="text-sm font-semibold text-slate-900 truncate">{podcast.title}</span>
                        </div>
                        <div className="w-1/3 text-center">{renderStatusBadge(podcast.status)}</div>
                        <div className="w-1/3 text-right">
                          <div className="inline-flex items-center justify-end gap-2">
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500">
                              <Trash2 className="h-4 w-4" />
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

export default PodcastsPage;
