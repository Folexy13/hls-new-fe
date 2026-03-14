import React, { useState, useEffect } from 'react';
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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Search, UserPlus, Filter, Download,
  ChevronDown, Eye, ArrowUpDown,
  Copy, CheckCircle, Package, Plus, Save, Loader2, X
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedBenfek, setSelectedBenfek] = useState<BenfekRecord | null>(null);
  
  const [newBenfek, setNewBenfek] = useState({
    benfekName: '',
    benfekPhone: '',
    allergies: '',
    scares: '',
    familyCondition: '',
    medications: '',
    hasCurrentCondition: false,
  });

  const itemsPerPage = 10;

  // Fetch benfeks from API
  useEffect(() => {
    const fetchBenfeks = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/api/v2/quiz-code/benfeks');
        const data = response.data?.data?.benfeks || [];
        setBenfeks(data);
      } catch (error) {
        console.error('Failed to fetch benfeks:', error);
        toast.error('Failed to load benfeks');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBenfeks();
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

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    const val = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setNewBenfek(prev => ({ ...prev, [name]: val }));
  };

  const handleSubmit = async () => {
    if (!newBenfek.benfekName || !newBenfek.benfekPhone) {
      toast.error('Please fill in required fields');
      return;
    }

    try {
      setIsSubmitting(true);
      const response = await apiClient.post('/api/v2/quiz-code/create', newBenfek);
      
      if (response.data?.success) {
        const created = response.data.data;
        const transformed = {
          ...created,
          registrationStatus: created.isUsed ? 'registered' : 'not_registered'
        };
        setBenfeks(prev => [transformed, ...prev]);
        toast.success('Benfek record created and code generated!');
        setIsModalOpen(false);
        setNewBenfek({
          benfekName: '',
          benfekPhone: '',
          allergies: '',
          scares: '',
          familyCondition: '',
          medications: '',
          hasCurrentCondition: false,
        });
      }
    } catch (error) {
      console.error('Failed to create benfek:', error);
      toast.error('Failed to create benfek record');
    } finally {
      setIsSubmitting(false);
    }
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
    <div className="flex-1 bg-gray-50 pb-20 sm:pb-8">
      {/* Page Header */}
      <div className="bg-white border-b sticky top-0 z-20 sm:relative sm:top-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <div className="flex flex-row items-center justify-between">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Benfeks</h1>
              <p className="hidden sm:block mt-1 text-sm text-gray-500">
                Manage your Benfeks and quiz codes
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex items-center gap-2 h-9 rounded-full px-4 shadow-sm bg-blue-600 hover:bg-blue-700"
                onClick={() => {
                  setSelectedBenfek(null);
                  setIsModalOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4" />
                <span className="hidden sm:inline">Add New Benfek</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8">
        <Card className="overflow-hidden border-0 sm:border shadow-none sm:shadow-sm bg-transparent sm:bg-white">
          {/* Table Controls */}
          <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search benfeks..."
                className="pl-10 h-11 sm:h-10 bg-gray-50 border-gray-200 focus:bg-white transition-colors rounded-xl sm:rounded-lg"
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

          {/* Desktop Table View - Hidden on mobile */}
          <div className="hidden md:block overflow-x-auto bg-white">
            {isLoading ? (
              <TableSkeleton />
            ) : benfeks.length === 0 ? (
              <EmptyState onAddClick={() => setIsModalOpen(true)} />
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
                      <TableCell className="font-medium">{benfek.id}</TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <code className="bg-gray-100 px-2 py-1 rounded text-blue-600 font-bold">{benfek.code}</code>
                          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => copyCode(benfek.code)}>
                            {copiedCode === benfek.code ? <CheckCircle className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4 text-gray-400" />}
                          </Button>
                        </div>
                      </TableCell>
                      <TableCell className="font-bold">{benfek.benfekName}</TableCell>
                      <TableCell>{benfek.benfekPhone}</TableCell>
                      <TableCell>{renderStatusBadge(benfek.registrationStatus)}</TableCell>
                      <TableCell>{new Date(benfek.createdAt).toLocaleDateString()}</TableCell>
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
                <EmptyState onAddClick={() => setIsModalOpen(true)} />
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
        title={selectedBenfek ? "Benfek Details" : "Create New Benfek"}
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
        ) : (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="benfekName">Benfek Name <span className="text-red-500">*</span></Label>
                <Input id="benfekName" name="benfekName" value={newBenfek.benfekName} onChange={handleInputChange} placeholder="Full Name" className="rounded-xl h-11" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="benfekPhone">Phone Number <span className="text-red-500">*</span></Label>
                <Input id="benfekPhone" name="benfekPhone" value={newBenfek.benfekPhone} onChange={handleInputChange} placeholder="+234..." className="rounded-xl h-11" />
              </div>
            </div>

            <div className="flex items-center gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100">
              <input type="checkbox" id="hasCurrentCondition" name="hasCurrentCondition" checked={newBenfek.hasCurrentCondition} onChange={(e) => setNewBenfek(prev => ({ ...prev, hasCurrentCondition: e.target.checked }))} className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
              <Label htmlFor="hasCurrentCondition" className="font-bold text-gray-700 cursor-pointer">Benfek has a chronic/current health condition</Label>
            </div>

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="allergies">Known Allergies</Label>
                <Textarea id="allergies" name="allergies" value={newBenfek.allergies} onChange={handleInputChange} placeholder="e.g. Peanuts, Penicillin..." className="min-h-24 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="scares">Health Scares/Concerns</Label>
                <Textarea id="scares" name="scares" value={newBenfek.scares} onChange={handleInputChange} placeholder="What issues scare them?" className="min-h-24 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="familyCondition">Family's notable health condition</Label>
                <Textarea id="familyCondition" name="familyCondition" value={newBenfek.familyCondition} onChange={handleInputChange} placeholder="e.g. Diabetes, Hypertension..." className="min-h-24 rounded-xl" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="medications">Current Medications</Label>
                <Textarea id="medications" name="medications" value={newBenfek.medications} onChange={handleInputChange} placeholder="What are they currently taking?" className="min-h-24 rounded-xl" />
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t flex justify-end gap-2 z-10">
              <Button variant="outline" className="flex-1 sm:flex-none rounded-full" onClick={() => setIsModalOpen(false)}>
                Cancel
              </Button>
              <Button onClick={handleSubmit} className="flex-[2] sm:flex-none items-center gap-2 rounded-full font-bold shadow-lg shadow-blue-100 bg-blue-600 hover:bg-blue-700 text-white" disabled={isSubmitting}>
                {isSubmitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                {isSubmitting ? "Generating Code..." : "Create & Generate Code"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default BenfeksPage;