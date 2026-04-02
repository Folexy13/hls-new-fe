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
import {
  Accordion, AccordionContent, AccordionItem, AccordionTrigger
} from '@/components/ui/accordion';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Search, UserPlus, Filter, Download,
  ChevronDown, Eye, ArrowUpDown,
  Copy, CheckCircle, Plus
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import { apiClient } from '@/config/axios';
import { toast } from 'sonner';

// Define the Benfek type (based on QuizCode)
type BenfekRecord = {
  id: number;
  code: string;
  benfekName: string;
  benfekPhone: string;
  registrationStatus: 'registered' | 'not_registered';
  isUsed: boolean;
  createdAt: string;
  allergies?: string;
  scares?: string;
  familyCondition?: string;
  medications?: string;
  hasCurrentCondition: boolean;
};

// Empty State Component
const EmptyState: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="bg-blue-50 rounded-full p-8 mb-6 ring-8 ring-blue-50/50">
      <UserPlus className="h-16 w-16 text-blue-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No benfeks yet</h3>
    <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
      You haven't generated any quiz codes for Benfeks yet. Start by creating your first Benfek record.
    </p>
    <Button onClick={onAddClick} className="h-12 px-8 rounded-full font-bold text-base shadow-lg shadow-blue-200 hover:shadow-blue-300 transition-all active:scale-95 bg-blue-600 hover:bg-blue-700 text-white">
      <Plus className="h-5 w-5 mr-2" />
      Create First Benfek
    </Button>
  </div>
);

// Loading Skeleton Component
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
        <Skeleton className="h-10 w-10 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-3 w-1/4" />
        </div>
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    ))}
  </div>
);

// Mobile Accordion Skeleton
const AccordionSkeleton: React.FC = () => (
  <div className="space-y-3">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="bg-white rounded-xl p-4 shadow-sm flex items-center gap-4">
        <Skeleton className="h-12 w-12 rounded-full flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const BenfeksPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [benfeks, setBenfeks] = useState<BenfekRecord[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('createdAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedBenfek, setSelectedBenfek] = useState<BenfekRecord | null>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const navigate = useNavigate();

  const itemsPerPage = 10;

  // Fetch benfeks from API
  useEffect(() => {
    const fetchBenfeks = async () => {
      setIsLoading(true);
      setLoadError(null);
      try {
        const response = await apiClient.get('/api/v2/quiz-code/benfeks');
        const data = response.data?.data?.benfeks || [];
        setBenfeks(data);
      } catch (error) {
        console.error('Failed to fetch benfeks:', error);
        const message = 'Failed to load benfeks';
        setLoadError(message);
        toast.error(message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenfeks();
  }, []);

  console.log(benfeks)

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
    toast.success('Code copied to clipboard');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  // Filter and sort data
  const filteredData = benfeks.filter(benfek =>
    benfek.benfekName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    benfek.benfekPhone.includes(searchTerm) ||
    benfek.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const sortedData = [...filteredData].sort((a, b) => {
    const valA = a[sortField as keyof BenfekRecord];
    const valB = b[sortField as keyof BenfekRecord];
    if (valA < valB) return sortDirection === 'asc' ? -1 : 1;
    if (valA > valB) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  // Paginate data
  const paginatedData = sortedData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleNavigateToAdd = () => {
    navigate('/principal/add-benfek');
  };

  // Render status badge
  const renderStatusBadge = (status: string) => {
    const isRegistered = status === 'registered' || status === 'Active';
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-bold ${
        isRegistered ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}>
        {isRegistered ? 'Registered' : 'Not Registered'}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-slate-50 pb-20 sm:pb-8">
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-20 sm:relative">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 sm:py-7">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <BackToDashboardButton className="mb-3 text-white/80 hover:text-white" />
              <p className="text-xs uppercase tracking-[0.3em] text-slate-300 font-semibold">Directory</p>
              <h1 className="text-2xl sm:text-3xl font-bold mt-2">Benfeks</h1>
              <p className="mt-2 text-sm text-slate-300">
                Manage your benfeks and quiz codes in one place.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-white/10 px-4 py-3 border border-white/10">
                <p className="text-xs text-slate-300">Total</p>
                <p className="text-lg font-semibold">{isLoading ? '...' : benfeks.length}</p>
              </div>
              <Button
                size="sm"
                className="flex items-center gap-2 h-10 rounded-full px-5 shadow-sm bg-emerald-500 hover:bg-emerald-600 text-slate-900"
                onClick={handleNavigateToAdd}
              >
                <UserPlus className="h-4 w-4" />
                Add Benfek
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-6 sm:py-8">
        <Card className="overflow-hidden border-0 sm:border shadow-none sm:shadow-sm bg-transparent sm:bg-white">
          {/* Table Controls */}
          <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search benfeks..."
                className="pl-10 h-11 sm:h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-xl sm:rounded-lg"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto no-scrollbar py-1">
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none items-center gap-2 h-9 rounded-full px-4 border-gray-200 bg-white">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
                <ChevronDown className="h-4 w-4" />
              </Button>
              <Button variant="outline" size="sm" className="flex-1 sm:flex-none items-center gap-2 h-9 rounded-full px-4 border-gray-200 bg-white">
                <Download className="h-4 w-4" />
                <span>Export</span>
              </Button>
            </div>
          </div>
          {loadError && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto bg-white">
            {isLoading ? (
              <TableSkeleton />
            ) : benfeks.length === 0 ? (
              <EmptyState onAddClick={handleNavigateToAdd} />
            ) : (
              <Table>
                <TableCaption>A list of your registered and pending benfeks.</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">ID</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('code')} className="flex items-center gap-1 p-0 h-auto font-medium">
                        Quiz Code <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('benfekName')} className="flex items-center gap-1 p-0 h-auto font-medium">
                        Name <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>Phone</TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('isUsed')} className="flex items-center gap-1 p-0 h-auto font-medium">
                        Status <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button variant="ghost" size="sm" onClick={() => handleSort('createdAt')} className="flex items-center gap-1 p-0 h-auto font-medium">
                        Created <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.map((benfek) => (
                    <TableRow key={benfek.id}>
                      <TableCell className="font-medium text-slate-500">{benfek.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-slate-100 px-2 py-1 rounded text-blue-600 font-bold">{benfek.code}</code>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyCode(benfek.code)}>
                            {copiedCode === benfek.code ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="h-9 w-9 rounded-full bg-blue-50 text-blue-600 font-bold flex items-center justify-center">
                            {benfek.benfekName.charAt(0)}
                          </div>
                          <div>
                            <p className="font-semibold text-gray-900">{benfek.benfekName}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell className="text-sm text-gray-500">{benfek.benfekPhone}</TableCell>
                      <TableCell>{renderStatusBadge(benfek.registrationStatus)}</TableCell>
                      <TableCell className="text-sm text-gray-500">{new Date(benfek.createdAt).toLocaleDateString()}</TableCell>
                      <TableCell className="text-right">
                        <Button variant="ghost" size="icon" onClick={() => { setSelectedBenfek(benfek); setIsModalOpen(true); }}>
                          <Eye className="h-4 w-4" />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Mobile Accordion View - Visible only on mobile */}
          <div className="md:hidden space-y-2 p-2">
            {isLoading ? (
              <AccordionSkeleton />
            ) : benfeks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm">
                <EmptyState onAddClick={handleNavigateToAdd} />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {paginatedData.map((benfek) => (
                  <AccordionItem key={benfek.id} value={`benfek-${benfek.id}`} className="border-0 bg-white rounded-xl shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 transition-colors text-left">
                      <div className="flex items-center gap-4 w-full text-left">
                        <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                          {benfek.benfekName.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-bold text-gray-900 truncate text-base text-left">{benfek.benfekName}</p>
                          <p className="text-sm text-gray-500 mt-0.5 text-left">{benfek.benfekPhone}</p>
                          <div className="mt-2 flex items-center gap-2">
                            {renderStatusBadge(benfek.registrationStatus)}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 bg-white">
                      <div className="space-y-4 pt-2">
                        <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                          <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Quiz Access Code</p>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-2xl font-black text-blue-600 tracking-widest font-mono">{benfek.code}</span>
                            <Button size="sm" className="rounded-full bg-white border-gray-200 text-gray-600 hover:bg-gray-100" onClick={() => copyCode(benfek.code)}>
                              <Copy className="h-4 w-4 mr-2" /> Copy
                            </Button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4 text-sm">
                          <div>
                            <p className="text-gray-500 text-xs font-semibold">CREATED</p>
                            <p className="font-bold text-gray-900">{new Date(benfek.createdAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <p className="text-gray-500 text-xs font-semibold">CONDITION</p>
                            <p className="font-bold text-gray-900">{benfek.hasCurrentCondition ? 'Yes' : 'No'}</p>
                          </div>
                        </div>
                        <div className="flex gap-2 pt-2">
                          <Button variant="outline" size="sm" className="flex-1 rounded-full h-10 border-gray-200" onClick={() => { setSelectedBenfek(benfek); setIsModalOpen(true); }}>
                            <Eye className="h-4 w-4 mr-2" /> Details
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </div>

          {/* Pagination */}
          {!isLoading && benfeks.length > 0 && (
            <div className="p-4 bg-white border-t flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-sm text-gray-500">
                Showing {`${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)}`} of {filteredData.length} entries
              </div>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))} className={currentPage === 1 ? 'pointer-events-none opacity-50' : ''} />
                  </PaginationItem>
                  <PaginationItem>
                    <PaginationNext onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))} className={currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </Card>
      </div>

      {/* Add/View Benfek Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title="Benfek Details"
        size="lg"
      >
        {selectedBenfek ? (
          <div className="space-y-6">
            <div className="bg-blue-50 p-6 rounded-2xl border border-blue-100 text-center">
              <p className="text-blue-600 text-xs uppercase tracking-[0.2em] font-black mb-2">Quiz Access Code</p>
              <div className="flex items-center justify-center gap-4">
                <span className="text-4xl font-black text-blue-700 tracking-widest font-mono">{selectedBenfek.code}</span>
                <Button variant="ghost" size="icon" className="h-10 w-10 rounded-full hover:bg-blue-100" onClick={() => copyCode(selectedBenfek.code)}>
                  <Copy className="h-5 w-5 text-blue-600" />
                </Button>
              </div>
              <p className="mt-4 text-sm text-blue-500 font-medium italic">Share this code with {selectedBenfek.benfekName} to complete registration.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Benfek Name</p>
                <p className="text-lg font-bold text-gray-900">{selectedBenfek.benfekName}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Phone Number</p>
                <p className="text-lg font-bold text-gray-900">{selectedBenfek.benfekPhone}</p>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Registration Status</p>
                <div className="pt-1">{renderStatusBadge(selectedBenfek.isUsed)}</div>
              </div>
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Current Condition</p>
                <p className="text-lg font-bold text-gray-900">{selectedBenfek.hasCurrentCondition ? 'Yes' : 'No'}</p>
              </div>
            </div>

            <div className="space-y-4 border-t pt-6">
              {selectedBenfek.allergies && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Allergies</p>
                  <p className="text-gray-700 font-medium">{selectedBenfek.allergies}</p>
                </div>
              )}
              {selectedBenfek.scares && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Health Scares</p>
                  <p className="text-gray-700 font-medium">{selectedBenfek.scares}</p>
                </div>
              )}
              {selectedBenfek.familyCondition && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Family Condition</p>
                  <p className="text-gray-700 font-medium">{selectedBenfek.familyCondition}</p>
                </div>
              )}
              {selectedBenfek.medications && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Current Medications</p>
                  <p className="text-gray-700 font-medium">{selectedBenfek.medications}</p>
                </div>
              )}
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end z-10">
              <Button variant="outline" className="w-full sm:w-auto rounded-full h-11 px-8" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
            </div>
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default BenfeksPage;
