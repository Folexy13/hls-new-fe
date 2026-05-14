import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
import { MultiSelectCreatableField } from '@/components/MultiSelectCreatableField';
import {
  Search, UserPlus, Filter, Download,
  ChevronDown, Eye, ArrowUpDown,
  Copy, CheckCircle, Plus,
  User
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import { apiClient } from '@/config/axios';
import { toast } from 'sonner';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

const HEALTH_FIELD_OPTIONS = {
  allergies: ['Peanuts', 'Dust', 'Seafood', 'Dairy', 'Eggs', 'Penicillin', 'Pollen'],
  scares: ['Hypertension episode', 'Asthma attack', 'Fainting spell', 'High blood sugar', 'Seizure episode'],
  familyCondition: ['Diabetes', 'Hypertension', 'Asthma', 'Sickle cell', 'Heart disease'],
  medications: ['Vitamin D', 'Omega-3', 'Paracetamol', 'Metformin', 'Lisinopril'],
  hasCurrentCondition: ['Asthma', 'Hypertension', 'Diabetes', 'Ulcer', 'Arthritis'],
} as const;

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
  currentConditions?: string | string[];
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

const BenfekListLoader: React.FC = () => (
  <div className="flex min-h-[45vh] items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-3 rounded-2xl border border-slate-100 bg-white px-8 py-7 text-center shadow-sm">
      <LoadingSpinner className="h-8 w-8 text-emerald-600" />
      <div>
        <p className="text-sm font-semibold text-slate-900">Preparing benfek list</p>
        <p className="mt-1 text-xs text-slate-500">Fetching the latest records...</p>
      </div>
    </div>
  </div>
);

const formatHealthValue = (value?: string | string[]) => {
  if (Array.isArray(value)) {
    return value.filter(Boolean).join(', ');
  }

  return value?.trim() || '';
};

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
  const [registrationFilter, setRegistrationFilter] = useState<'all' | 'registered' | 'not_registered'>('all');
  const [showRegistrationFilter, setShowRegistrationFilter] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSubmittingEdit, setIsSubmittingEdit] = useState(false);
  const [editFormData, setEditFormData] = useState<Partial<BenfekRecord> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const itemsPerPage = 10;

  const handleEditBenfek = async () => {
    if (!selectedBenfek || !editFormData) return;

    setIsSubmittingEdit(true);
    try {
      const payload = {
        allergies: editFormData.allergies,
        scares: editFormData.scares,
        familyCondition: editFormData.familyCondition,
        medications: editFormData.medications,
        currentConditions: editFormData.currentConditions,
        hasCurrentCondition: editFormData.hasCurrentCondition,
      };

      await apiClient.put(`/api/v2/quiz-code/${selectedBenfek.id}`, payload);

      setBenfeks(prev => prev.map(b =>
        b.id === selectedBenfek.id ? { ...b, ...editFormData } : b
      ));
      setSelectedBenfek({ ...selectedBenfek, ...editFormData });
      setIsEditMode(false);
      toast.success('Benfek details updated successfully');
    } catch (error) {
      console.error('Failed to update benfek:', error);
      const message = 'Failed to update benfek details';
      toast.error(message);
    } finally {
      setIsSubmittingEdit(false);
    }
  };

  const fetchBenfeks = useCallback(async () => {
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
  }, []);

  // Fetch benfeks from API (and refetch after returning from "Add Benfek")
  useEffect(() => {
    const needsRefresh =
      (location.state as any)?.refresh ||
      sessionStorage.getItem('benfeksNeedsRefresh') === '1';

    if (needsRefresh) {
      sessionStorage.removeItem('benfeksNeedsRefresh');
    }

    fetchBenfeks();
  }, [fetchBenfeks, location.key, location.state]);

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
  const uniqueBenfeks = useMemo(() => {
    const seen = new Set<string>();
    return benfeks.filter((benfek) => {
      const key = benfek.code ?? String(benfek.id);
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [benfeks]);

  const filteredData = uniqueBenfeks.filter((benfek) => {
    const matchesSearch =
      benfek.benfekName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      benfek.benfekPhone.includes(searchTerm) ||
      benfek.code.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesRegistration =
      registrationFilter === 'all' ? true : benfek.registrationStatus === registrationFilter;

    return matchesSearch && matchesRegistration;
  });

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
        {isRegistered ? 'Registered' : 'Pending'}
      </span>
    );
  };

  return (
    <div className="flex-1 bg-slate-50 pb-20 sm:pb-8 pt-[158px] lg:pt-[174px]">
      <div className="fixed left-0 right-0 top-16 lg:top-20 z-40 bg-white pb-1 shadow-sm border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="py-1">
            <BackToDashboardButton className="text-black/90 hover:text-black/80" />
          </div>

          <div className="border-t border-slate-200/80 py-1">
            <div className="flex flex-row items-center justify-between gap-3">
              <div className="relative flex-1 min-w-0 sm:max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search benfeks..."
                  className="pl-10 h-10 bg-slate-50 border-slate-200 focus:bg-white transition-colors rounded-xl sm:rounded-lg"
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
                    onClick={() => setShowRegistrationFilter((v) => !v)}
                    className="h-10 w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
                  >
                    <Filter className="h-4 w-4" />
                  </Button>

                  {showRegistrationFilter && (
                    <div className="absolute right-0 top-12 z-20 w-44 rounded-xl border border-slate-200 bg-white p-2 shadow-lg">
                      {[
                        { label: 'All', value: 'all' as const },
                        { label: 'Registered', value: 'registered' as const },
                        { label: 'Pending', value: 'not_registered' as const },
                      ].map((opt) => (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setRegistrationFilter(opt.value);
                            setCurrentPage(1);
                            setShowRegistrationFilter(false);
                          }}
                          className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                            registrationFilter === opt.value
                              ? 'bg-blue-50 text-blue-700'
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
                  className="h-10 w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
                >
                  <Download className="h-4 w-4" />
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  aria-label="Benfek"
                  className="h-10 w-10 rounded-xl sm:rounded-lg border-gray-200 bg-white"
                >
                  <User className="h-4 w-4" />
                  <p className="text-xs -mt-1 -ml-1 font-semibold">{isLoading ? '...' : benfeks.length}</p>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      {/* <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white sticky top-0 z-20 sm:relative">

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
      </div> */}

      {/* Main Content */}
      <div className="relative z-0 max-w-7xl mx-auto px-0 sm:px-6 lg:px-8">
        <Card className="-mt-16 overflow-hidden border-0 sm:border shadow-none sm:shadow-sm bg-transparent sm:bg-white">
          {/* Table Controls */}
          <div className="border-b" />
          {loadError && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-3 text-sm text-red-700">
              {loadError}
            </div>
          )}

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto bg-white">
            {isLoading ? (
              <BenfekListLoader />
            ) : benfeks.length === 0 ? (
              <EmptyState onAddClick={handleNavigateToAdd} />
            ) : (
              <Table>
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
              <BenfekListLoader />
            ) : benfeks.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm">
                <EmptyState onAddClick={handleNavigateToAdd} />
              </div>
            ) : (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {paginatedData.map((benfek) => (
                  <AccordionItem
                    key={benfek.id}
                    value={`benfek-${benfek.id}`}
                    className="rounded-xl border border-slate-200 bg-slate-50/40 overflow-hidden"
                  >
                    <AccordionTrigger className="rounded-xl bg-white px-4 py-4 hover:no-underline">
                      <div className="flex w-full items-center gap-3 text-left min-w-0">
                        {/* <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center text-blue-600 font-bold flex-shrink-0">
                          {benfek.benfekName.charAt(0)}
                        </div> */}
                        <div className="flex flex-1 min-w-0 items-center justify-between gap-3 pr-2">
                          <p className="flex-1 min-w-0 font-bold text-gray-900 truncate text-base text-left">
                            {benfek.benfekName}
                          </p>
                          {/* <p className="text-sm text-gray-500 mt-0.5 text-left">{benfek.benfekPhone}</p> */}
                          <div className="flex shrink-0 items-center gap-2">
                            {renderStatusBadge(benfek.registrationStatus)}
                          </div>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 pt-2">
                      <div className="flex flex-col gap-3 rounded-xl border border-slate-200 bg-slate-100/70 p-4 text-sm text-slate-700">
                        <div className="flex items-start justify-between gap-4">
                          <span className="text-xs font-semibold uppercase text-slate-500">
                            Code
                          </span>
                          <div className="flex items-center gap-2 self-start">
                            <span className="font-mono text-sm font-black tracking-widest text-blue-600 whitespace-nowrap">
                              {benfek.code}
                            </span>
                            <Button
                              type="button"
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 rounded-full border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                              onClick={() => copyCode(benfek.code)}
                              aria-label="Copy code"
                            >
                              <Copy className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <span className="text-xs font-semibold uppercase text-slate-500">
                            Created
                          </span>
                          <span className="font-semibold text-slate-900 whitespace-nowrap">
                            {new Date(benfek.createdAt).toLocaleDateString()}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <span className="text-xs font-semibold uppercase text-slate-500">
                            Phone
                          </span>
                          <span className="font-semibold text-slate-900 whitespace-nowrap">
                            {benfek.benfekPhone}
                          </span>
                        </div>

                        <div className="flex items-start justify-between gap-4">
                          <span className="text-xs font-semibold uppercase text-slate-500">
                            Condition
                          </span>
                          <span className="font-semibold text-slate-900 whitespace-nowrap">
                            {benfek.hasCurrentCondition ? 'Yes' : 'No'}
                          </span>
                        </div>

                        <div className="flex justify-start">
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full rounded-full h-10 border-gray-200"
                            onClick={() => {
                              setSelectedBenfek(benfek);
                              setIsModalOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4 mr-2" /> Health Details
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
              {/* <div className="text-sm text-gray-500">
                Showing {`${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)}`} of {filteredData.length} entries
              </div> */}
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
        onClose={() => {
          setIsModalOpen(false);
          setIsEditMode(false);
          setEditFormData(null);
        }}
        title={isEditMode ? "Edit Benfek Health Details" : "Benfek's Health Details"}
        size="lg"
      >
        {selectedBenfek ? (
          <div className="space-y-6">
            {(() => {
              const currentConditions = formatHealthValue(selectedBenfek.currentConditions);

              if (isEditMode) {
                return (
                  <>
                    <div className="space-y-4">
                      <MultiSelectCreatableField
                        label="Allergies"
                        placeholder="Select or add allergies"
                        options={HEALTH_FIELD_OPTIONS.allergies}
                        value={Array.isArray(editFormData?.allergies) ? editFormData.allergies : editFormData?.allergies ? [editFormData.allergies as string] : []}
                        onChange={(val) => setEditFormData(prev => ({ ...prev, allergies: val }))}
                      />

                      <MultiSelectCreatableField
                        label="Health Scares"
                        placeholder="Select or add health scares"
                        options={HEALTH_FIELD_OPTIONS.scares}
                        value={Array.isArray(editFormData?.scares) ? editFormData.scares : editFormData?.scares ? [editFormData.scares as string] : []}
                        onChange={(val) => setEditFormData(prev => ({ ...prev, scares: val }))}
                      />

                      <MultiSelectCreatableField
                        label="Family Condition"
                        placeholder="Select or add family conditions"
                        options={HEALTH_FIELD_OPTIONS.familyCondition}
                        value={Array.isArray(editFormData?.familyCondition) ? editFormData.familyCondition : editFormData?.familyCondition ? [editFormData.familyCondition as string] : []}
                        onChange={(val) => setEditFormData(prev => ({ ...prev, familyCondition: val }))}
                      />

                      <MultiSelectCreatableField
                        label="Current Medications"
                        placeholder="Select or add medications"
                        options={HEALTH_FIELD_OPTIONS.medications}
                        value={Array.isArray(editFormData?.medications) ? editFormData.medications : editFormData?.medications ? [editFormData.medications as string] : []}
                        onChange={(val) => setEditFormData(prev => ({ ...prev, medications: val }))}
                      />

                      <MultiSelectCreatableField
                        label="Current Health Conditions"
                        placeholder="Select or add current health conditions"
                        options={HEALTH_FIELD_OPTIONS.hasCurrentCondition}
                        value={Array.isArray(editFormData?.currentConditions) ? editFormData.currentConditions : editFormData?.currentConditions ? [editFormData.currentConditions as string] : []}
                        onChange={(val) => setEditFormData(prev => ({ ...prev, currentConditions: val }))}
                      />
                    </div>

                    <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-3 z-10">
                      <Button
                        variant="outline"
                        className="rounded-full h-11 px-8"
                        onClick={() => {
                          setIsEditMode(false);
                          setEditFormData(null);
                        }}
                        disabled={isSubmittingEdit}
                      >
                        Cancel
                      </Button>
                      <Button
                        className="rounded-full h-11 px-8 bg-blue-600 hover:bg-blue-700"
                        onClick={handleEditBenfek}
                        disabled={isSubmittingEdit}
                      >
                        {isSubmittingEdit ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  </>
                );
              }

              return (
                <>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-1">
                <p className="text-xs text-gray-400 font-bold uppercase">Benfek Name</p>
                <p className="text-lg font-bold text-gray-900">{selectedBenfek.benfekName}</p>
              </div>
            </div>

            <div className="space-y-4 pt-6">
              {currentConditions && (
                <div className="bg-gray-50 p-4 rounded-xl">
                  <p className="text-xs text-gray-400 font-bold uppercase mb-1">Current Health Condition</p>
                  <p className="text-gray-700 font-medium">{currentConditions}</p>
                </div>
              )}
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

            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-3 z-10">
              <Button variant="outline" className="rounded-full h-11 px-8" onClick={() => setIsModalOpen(false)}>
                Close
              </Button>
              <Button
                className="rounded-full h-11 px-8 bg-emerald-600 hover:bg-emerald-700"
                onClick={() => {
                  setIsEditMode(true);
                  const parseHealthField = (field: string | string[] | undefined) => {
                    if (Array.isArray(field)) return field;
                    if (typeof field === 'string' && field.trim() !== '') return field.split(',').map(s => s.trim()).filter(Boolean);
                    return [];
                  };
                  setEditFormData({
                    allergies: parseHealthField(selectedBenfek.allergies),
                    scares: parseHealthField(selectedBenfek.scares),
                    familyCondition: parseHealthField(selectedBenfek.familyCondition),
                    medications: parseHealthField(selectedBenfek.medications),
                    currentConditions: parseHealthField(selectedBenfek.currentConditions),
                  });
                }}
              >
                Edit
              </Button>
            </div>
                </>
              );
            })()}
          </div>
        ) : null}
      </Modal>
    </div>
  );
};

export default BenfeksPage;
