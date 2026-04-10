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
import BackToDashboardButton from '@/components/BackToDashboardButton';
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Search, Filter, Download, Eye, ArrowUpDown,
  ChevronDown, Plus, Edit, Trash2, Image, X, Save, Package, Loader2, Camera, Images
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { apiClient } from '@/config/axios';
import { toast } from 'sonner';
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from '@/config/env';

// Define the Medication type
type Medication = {
  id: number;
  name: string;
  category: string;
  price: string;
  stock: number;
  manufacturer: string;
  status: string;
  dateAdded: string;
  image: string;
  description?: string;
};

// Empty State Component
const EmptyState: React.FC<{ onAddClick: () => void }> = ({ onAddClick }) => (
  <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
    <div className="bg-emerald-50 rounded-full p-8 mb-6 ring-8 ring-emerald-50/50">
      <Package className="h-16 w-16 text-emerald-500" />
    </div>
    <h3 className="text-2xl font-bold text-gray-900 mb-3">No medications yet</h3>
    <p className="text-gray-500 mb-8 max-w-sm leading-relaxed">
      Your inventory is currently empty. Start building your digital pharmacy by adding your first medication.
    </p>
    <Button onClick={onAddClick} className="h-12 px-8 rounded-full font-bold text-base shadow-lg shadow-emerald-200 hover:shadow-emerald-300 transition-all active:scale-95">
      <Plus className="h-5 w-5 mr-2" />
      Add Your First Medication
    </Button>
  </div>
);

// Loading Skeleton Component
const TableSkeleton: React.FC = () => (
  <div className="bg-white rounded-lg">
    {Array(5).fill(0).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border-b last:border-0">
        <Skeleton className="h-12 w-12 rounded-lg flex-shrink-0" />
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
        <Skeleton className="h-14 w-14 rounded-lg flex-shrink-0" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-5 w-1/2" />
          <Skeleton className="h-4 w-1/3" />
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>
      </div>
    ))}
  </div>
);

const MedicationsPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [medications, setMedications] = useState<Medication[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortField, setSortField] = useState('id');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('asc');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMedication, setSelectedMedication] = useState<Medication | null>(null);
  const [editingMedicationId, setEditingMedicationId] = useState<number | null>(null);
  const [isDirty, setIsDirty] = useState(false);
  const [newMedication, setNewMedication] = useState<Partial<Medication>>({
    name: '',
    category: '',
    price: '',
    stock: 0,
    manufacturer: '',
    status: 'In Stock',
    description: '',
    image: 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med'
  });
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const itemsPerPage = 10;

  // Fetch medications from API
  useEffect(() => {
    const fetchMedications = async () => {
      setIsLoading(true);
      try {
        const response = await apiClient.get('/api/v2/supplements');
        const data = response.data?.data?.supplements || [];
        // Map API response to Medication type
        const mappedMedications: Medication[] = data.map((item: Record<string, unknown>) => ({
          id: item.id as number,
          name: item.name as string,
          category: (item.category as string) || 'Supplement',
          price: `₦${(item.price as number)?.toLocaleString() || '0'}`,
          stock: (item.stock as number) || 0,
          manufacturer: (item.manufacturer as string) || 'Unknown',
          status: (item.stock as number) > 10 ? 'In Stock' : (item.stock as number) > 0 ? 'Low Stock' : 'Out of Stock',
          dateAdded: item.createdAt ? new Date(item.createdAt as string).toLocaleDateString() : 'N/A',
          image: (item.image as string) || 'https://via.placeholder.com/100/4299E1/FFFFFF?text=Med',
          description: item.description as string,
        }));
        setMedications(mappedMedications);
      } catch (error) {
        console.error('Failed to fetch medications:', error);
        setMedications([]);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMedications();
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
  const filteredData = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const sortedData = [...filteredData].sort((a, b) => {
    if (a[sortField as keyof Medication] < b[sortField as keyof Medication]) return sortDirection === 'asc' ? -1 : 1;
    if (a[sortField as keyof Medication] > b[sortField as keyof Medication]) return sortDirection === 'asc' ? 1 : -1;
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
      case 'In Stock':
        bgColor = 'bg-emerald-100 text-emerald-800';
        break;
      case 'Low Stock':
        bgColor = 'bg-amber-100 text-amber-800';
        break;
      case 'Out of Stock':
        bgColor = 'bg-red-100 text-red-800';
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

  // Handle modal form input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewMedication(prev => ({ ...prev, [name]: value }));
    setIsDirty(true);
  };

  // Handle image selection (preview only, upload happens on submit)
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setSelectedFile(file);
      setIsDirty(true);
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewImage(event.target.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Upload image to Cloudinary (Direct from frontend)
  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    try {
      setIsUploading(true);
      const formData = new FormData();
      formData.append('file', file);
      formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
      formData.append('folder', 'supplements');
      
      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData,
      });
      
      const data = await response.json();
      
      if (data.secure_url) {
        return data.secure_url;
      } else {
        throw new Error(data.error?.message || 'Upload failed');
      }
    } catch (error) {
      console.error('Failed to upload image to Cloudinary:', error);
      toast.error('Failed to upload image. Please try again.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async () => {
    // Basic validation
    if (!newMedication.name || !newMedication.price || newMedication.stock === undefined || !newMedication.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (!selectedFile && !newMedication.image) {
      toast.error('Please upload an image for the medication');
      return;
    }

    try {
      setIsSubmitting(true);
      
      // Upload image if a new file was selected
      let imageUrl = newMedication.image;
      if (selectedFile) {
        const uploadedUrl = await uploadImageToCloudinary(selectedFile);
        if (uploadedUrl) {
          imageUrl = uploadedUrl;
        } else if (!editingMedicationId) {
          // For new medications, image upload is required
          toast.error('Image upload failed. Please try again.');
          setIsSubmitting(false);
          return;
        }
      }

      // Parse price - remove currency symbol and convert to number
      const priceValue = typeof newMedication.price === 'string' 
        ? parseFloat(newMedication.price.replace(/[₦,]/g, '')) || 0
        : newMedication.price || 0;

      if (editingMedicationId !== null) {
        // Update existing supplement
        const response = await apiClient.put(`/api/v2/supplements/${editingMedicationId}`, {
          name: newMedication.name,
          description: newMedication.description || '',
          price: priceValue,
          stock: Number(newMedication.stock) || 0,
          imageUrl: imageUrl,
          category: newMedication.category,
        });

        if (response.data?.data?.supplement) {
          const updated = response.data.data.supplement;
          setMedications(prev =>
            prev.map(medication =>
              medication.id === editingMedicationId
                ? {
                    ...medication,
                    name: updated.name,
                    category: updated.category || medication.category,
                    price: `₦${updated.price?.toLocaleString() || '0'}`,
                    stock: updated.stock,
                    manufacturer: newMedication.manufacturer || medication.manufacturer,
                    status: updated.stock > 10 ? 'In Stock' : updated.stock > 0 ? 'Low Stock' : 'Out of Stock',
                    description: updated.description,
                    image: updated.imageUrl || medication.image,
                  }
                : medication
            )
          );
          toast.success('Medication updated successfully');
        }
      } else {
        // Create new supplement
        const response = await apiClient.post('/api/v2/supplements', {
          name: newMedication.name || 'New Medication',
          description: newMedication.description || 'No description provided',
          price: priceValue,
          stock: Number(newMedication.stock) || 0,
          imageUrl: imageUrl,
          category: newMedication.category || 'Supplement',
        });

        if (response.data?.data?.supplement) {
          const created = response.data.data.supplement;
          const medicationToAdd: Medication = {
            id: created.id,
            name: created.name,
            category: created.category || 'Supplement',
            price: `₦${created.price?.toLocaleString() || '0'}`,
            stock: created.stock || 0,
            manufacturer: newMedication.manufacturer || 'Unknown',
            status: created.stock > 10 ? 'In Stock' : created.stock > 0 ? 'Low Stock' : 'Out of Stock',
            dateAdded: new Date(created.createdAt).toLocaleDateString(),
            image: created.imageUrl || 'https://via.placeholder.com/100/4299E1/FFFFFF?text=Med',
            description: created.description,
          };
          setMedications(prev => [medicationToAdd, ...prev]);
          toast.success('Medication created successfully');
        }
      }

      // Reset form
      setIsModalOpen(false);
      setEditingMedicationId(null);
      setSelectedMedication(null);
      setSelectedFile(null);
      setNewMedication({
        name: '',
        category: '',
        price: '',
        stock: 0,
        manufacturer: '',
        status: 'In Stock',
        description: '',
        image: 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med',
      });
      setPreviewImage(null);
      setIsDirty(false);
      setIsDirty(false);
    } catch (error) {
      console.error('Failed to save medication:', error);
      toast.error('Failed to save medication. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // View medication details
  const viewMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsModalOpen(true);
    setIsDirty(false);
  };
  const editMedication = (medication: Medication) => {
    setSelectedMedication(null);
    setEditingMedicationId(medication.id);
    setNewMedication({
      name: medication.name,
      category: medication.category,
      price: medication.price,
      stock: medication.stock,
      manufacturer: medication.manufacturer,
      status: medication.status,
      description: medication.description || '',
      image: medication.image,
    });
    setPreviewImage(medication.image);
    setIsModalOpen(true);
    setIsDirty(false);
  };
  const deleteMedication = async (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this medication?");
    if (!confirmed) return;

    try {
      await apiClient.delete(`/api/v2/supplements/${id}`);
      setMedications(prev => prev.filter(medication => medication.id !== id));
      toast.success('Medication deleted successfully');
    } catch (error) {
      console.error('Failed to delete medication:', error);
      toast.error('Failed to delete medication. Please try again.');
    }
  };

  return (
    <div className="flex-1 bg-gray-50 pb-20 sm:pb-8">
      <BackToDashboardButton isDirty={isDirty} className="fixed left-3 top-[70px] z-50 text-black/90 hover:text-black/80" />
      {/* Page Header */}
      <div className="bg-white border-b top-28 z-20 sm:relative sm:top-auto fixed w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-1 sm:py-6">
          <div className="flex flex-row items-center justify-between">
            <div className='flex'>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Medications</h1>
              <p className="hidden sm:block mt-1 text-sm text-gray-500">
                Manage your medication inventory
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Button
                size="sm"
                className="flex items-center gap-2 h-6 px-4 shadow-sm"
                onClick={() => {
                  setSelectedMedication(null);
                  setEditingMedicationId(null);
                  setNewMedication({
                    name: '',
                    category: '',
                    price: '',
                    stock: 0,
                    manufacturer: '',
                    status: 'In Stock',
                    description: '',
                    image: 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med',
                  });
                  setPreviewImage(null);
                  setIsDirty(false);
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                <span className="hidden sm:inline">Add Medication</span>
                <span className="sm:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-0 sm:px-6 lg:px-8 py-0 sm:py-8 mt-20">
        <Card className="overflow-hidden border-0 sm:border shadow-none sm:shadow-sm bg-transparent sm:bg-white">
          {/* Table Controls */}
          <div className="p-4 bg-white border-b flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search medications..."
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
            ) : medications.length === 0 ? (
              <EmptyState onAddClick={() => {
                setSelectedMedication(null);
                setEditingMedicationId(null);
                setNewMedication({
                  name: '',
                  category: '',
                  price: '',
                  stock: 0,
                  manufacturer: '',
                  status: 'In Stock',
                  description: '',
                  image: 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med',
                });
                setPreviewImage(null);
                setIsDirty(false);
                setIsModalOpen(true);
              }} />
            ) : (
              <Table>
                <TableCaption>A list of all medications.</TableCaption>
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
                    <TableHead className="w-16">Image</TableHead>
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
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('category')}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        Category
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('price')}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        Price
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('stock')}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        Stock
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
                    <TableHead>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSort('manufacturer')}
                        className="flex items-center gap-1 p-0 h-auto font-medium"
                      >
                        Manufacturer
                        <ArrowUpDown className="h-3 w-3" />
                      </Button>
                    </TableHead>
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
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((medication) => (
                      <TableRow key={medication.id}>
                        <TableCell className="font-medium">{medication.id}</TableCell>
                        <TableCell>
                          <img
                            src={medication.image}
                            alt={medication.name}
                            className="h-10 w-10 rounded object-cover"
                          />
                        </TableCell>
                        <TableCell>{medication.name}</TableCell>
                        <TableCell>{medication.category}</TableCell>
                        <TableCell className="font-medium">{medication.price}</TableCell>
                        <TableCell>{medication.stock}</TableCell>
                        <TableCell>{medication.manufacturer}</TableCell>
                        <TableCell>{renderStatusBadge(medication.status)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => viewMedication(medication)}
                            >
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                              onClick={() => editMedication(medication)}
                            >
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-red-500"
                              onClick={() => deleteMedication(medication.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No medications found. Try adjusting your search.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            )}
          </div>

          {/* Mobile Accordion View - Visible only on mobile */}
          <div className="md:hidden space-y-2 p-2">
            {isLoading ? (
              <AccordionSkeleton />
            ) : medications.length === 0 ? (
              <div className="bg-white rounded-xl shadow-sm">
                <EmptyState onAddClick={() => {
                  setSelectedMedication(null);
                  setEditingMedicationId(null);
                  setNewMedication({
                    name: '',
                    category: '',
                    price: '',
                    stock: 0,
                    manufacturer: '',
                    status: 'In Stock',
                    description: '',
                    image: 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med',
                  });
                  setPreviewImage(null);
                  setIsModalOpen(true);
                }} />
              </div>
            ) : paginatedData.length > 0 ? (
              <Accordion type="single" collapsible className="w-full space-y-2">
                {paginatedData.map((medication) => (
                  <AccordionItem key={medication.id} value={`medication-${medication.id}`} className="border-0 bg-white rounded-xl shadow-sm overflow-hidden">
                    <AccordionTrigger className="px-4 py-4 hover:no-underline hover:bg-gray-50 transition-colors">
                      <div className="flex items-center justify-between gap-3 w-full">
                        <div className="flex flex-1 items-center gap-3 min-w-0">
                          <div className="relative flex-shrink-0">
                            <img
                              src={medication.image}
                              alt={medication.name}
                              className="h-14 w-14 rounded-lg object-cover shadow-sm border border-gray-100"
                            />
                            {medication.stock < 5 && (
                              <span className="absolute -top-1 -right-1 flex h-3 w-3">
                                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                                <span className="relative inline-flex rounded-full h-3 w-3 bg-red-500"></span>
                              </span>
                            )}
                          </div>

                          <div className="flex-1 min-w-0 text-center flex flex-col items-center justify-center">
                            <p className="font-bold text-gray-900 truncate text-base">
                              {medication.name}
                            </p>
                            <span className="font-semibold text-gray-500">{medication.manufacturer ? ` (${medication.manufacturer})` : ''}</span>
                          </div>
                        </div>

                        <div className="text-right flex-shrink-0">
                          {/* <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Price</p> */}
                          <p className="text-sm font-bold text-emerald-600">{medication.price}</p>
                        </div>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="px-4 pb-4 bg-white">
                      <div className="space-y-4 pt-2">
                        <div className="rounded-xl border border-slate-200 bg-gray-50/60 p-4 text-sm">
                          <div className="flex items-center justify-between gap-6">
                            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Stock Qty</p>
                            <p className={`font-bold ${medication.stock < 5 ? 'text-red-600' : 'text-gray-900'}`}>
                              {medication.stock < 5 ? 'Low' : medication.stock}
                            </p>
                          </div>
                          <div className="my-3 h-px bg-slate-200/70" />
                          <div className="flex items-center justify-between gap-6">
                            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Category</p>
                            <p className="font-bold text-gray-900 truncate max-w-[60%] text-right">{medication.category}</p>
                          </div>
                          <div className="my-3 h-px bg-slate-200/70" />
                          <div className="flex items-center justify-between gap-6">
                            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Status</p>
                            <div className="pt-0.5">{renderStatusBadge(medication.status)}</div>
                          </div>
                          <div className="my-3 h-px bg-slate-200/70" />
                          <div className="flex items-center justify-between gap-6">
                            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold">Date Added</p>
                            <p className="font-bold text-gray-900">{medication.dateAdded}</p>
                          </div>
                        </div>
                        {medication.description && (
                          <div className="text-sm border-l-2 border-emerald-500 pl-3 py-1">
                            <p className="text-gray-500 text-xs uppercase tracking-wider font-semibold mb-1">Description</p>
                            <p className="text-gray-700 leading-relaxed italic">"{medication.description}"</p>
                          </div>
                        )}
                        <div className="flex gap-2 pt-2">
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full h-10 border-gray-200"
                            onClick={() => viewMedication(medication)}
                          >
                            <Eye className="h-4 w-4 mr-2" />
                            View
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="flex-1 rounded-full h-10 border-gray-200"
                            onClick={() => editMedication(medication)}
                          >
                            <Edit className="h-4 w-4 mr-2" />
                            Edit
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-12 rounded-full h-10 text-red-500 border-red-100 hover:bg-red-50 hover:text-red-600 transition-colors"
                            onClick={() => deleteMedication(medication.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                ))}
              </Accordion>
            ) : (
              <div className="bg-white rounded-xl p-8 text-center shadow-sm">
                <div className="bg-gray-50 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Search className="h-8 w-8 text-gray-300" />
                </div>
                <p className="text-gray-500 font-medium">No medications found</p>
                <p className="text-gray-400 text-sm mt-1">Try adjusting your search filters</p>
              </div>
            )}
          </div>

          {/* Pagination - Only show when there's data */}
          {!isLoading && medications.length > 0 && (
            <div className="p-4 bg-white border-t">
              <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                {/* <div className="text-sm text-gray-500 order-2 sm:order-1">
                  Showing {`${(currentPage - 1) * itemsPerPage + 1} to ${Math.min(currentPage * itemsPerPage, filteredData.length)}`} of {filteredData.length} entries
                </div> */}
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
                        className={currentPage === totalPages || totalPages === 0 ? 'pointer-events-none opacity-50' : ''}
                      />
                    </PaginationItem>
                  </PaginationContent>
                </Pagination>
              </div>
            </div>
          )}
        </Card>
      </div>

      {/* Add/View Medication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setEditingMedicationId(null);
          setSelectedMedication(null);
          setIsDirty(false);
        }}
        title={
          selectedMedication
            ? "Medication Details"
            : editingMedicationId !== null
              ? "Edit Medication"
              : "Add New Medication"
        }
        size="lg"
      >
        {selectedMedication ? (
          // View Medication Details
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <img
                  src={selectedMedication.image}
                  alt={selectedMedication.name}
                  className="w-32 h-32 object-cover rounded-md"
                />
              </div>
              <div className="flex-1 space-y-4">
                <div>
                  <h3 className="text-xl font-bold text-gray-900">{selectedMedication.name}</h3>
                  <p className="text-sm text-gray-500">{selectedMedication.category}</p>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500">Price</p>
                    <p className="font-semibold text-gray-900">{selectedMedication.price}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Stock</p>
                    <p className="font-semibold text-gray-900">{selectedMedication.stock} units</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Manufacturer</p>
                    <p className="font-semibold text-gray-900">{selectedMedication.manufacturer}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500">Status</p>
                    <div>{renderStatusBadge(selectedMedication.status)}</div>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-medium text-gray-900 mb-2">Description</h4>
              <p className="text-gray-700">{selectedMedication.description || "No description available."}</p>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-6 flex justify-end z-10">
              <Button
                variant="outline"
                className="w-full sm:w-auto rounded-full h-11"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          // Add New Medication Form
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Medication Name <span className="text-red-500">*</span></Label>
                    <Input
                      id="name"
                      name="name"
                      value={newMedication.name}
                      onChange={handleInputChange}
                      placeholder="e.g., Paracetamol 500mg"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      name="category"
                      value={newMedication.category}
                      onChange={handleInputChange}
                      placeholder="e.g., Pain Relief"
                    />
                  </div>
                  <div>
                    <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                    <Input
                      id="price"
                      name="price"
                      value={newMedication.price}
                      onChange={handleInputChange}
                      placeholder="e.g., ₦1500.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock <span className="text-red-500">*</span></Label>
                    <Input
                      id="stock"
                      name="stock"
                      type="number"
                      value={newMedication.stock?.toString()}
                      onChange={handleInputChange}
                      placeholder="e.g., 100"
                    />
                  </div>
                  <div>
                    <Label htmlFor="manufacturer">Manufacturer</Label>
                    <Input
                      id="manufacturer"
                      name="manufacturer"
                      value={newMedication.manufacturer}
                      onChange={handleInputChange}
                      placeholder="e.g., Pfizer"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status">Status</Label>
                    <select
                      id="status"
                      name="status"
                      value={newMedication.status}
                      onChange={handleInputChange}
                      title = "Medication status"
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description <span className="text-red-500">*</span></Label>
              <Textarea
                id="description"
                name="description"
                value={newMedication.description}
                onChange={handleInputChange}
                placeholder="Enter medication description..."
                className="min-h-32"
              />
            </div>

            <div className="space-y-2">
              <Label>Medication Image <span className="text-red-500">*</span></Label>
              <div className="w-32 mx-auto">
                <div className="relative">
                  <div className="w-32 h-32 rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Medication preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-400" />
                    )}
                  </div>

                  <div className="mt-3 flex w-32 items-center justify-around">
                    <label
                      htmlFor="medication-image-camera"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
                      title="Snap with camera"
                    >
                      <Camera className="h-5 w-5" />
                    </label>
                    <label
                      htmlFor="medication-image-gallery"
                      className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-700 shadow-sm hover:bg-slate-50 cursor-pointer"
                      title="Select from gallery"
                    >
                      <Images className="h-5 w-5" />
                    </label>
                  </div>

                  <input
                    id="medication-image-camera"
                    type="file"
                    accept="image/*"
                    capture="environment"
                    className="hidden"
                    onChange={handleImageUpload}
                    title="Snap medication image"
                  />
                  <input
                    id="medication-image-gallery"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    title="Upload medication image"
                  />
                </div>
              </div>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 pb-2 border-t mt-6 flex justify-end gap-2 z-10">
              <Button
                variant="outline"
                className="flex-1 sm:flex-none rounded-full"
                onClick={() => {
                  setIsModalOpen(false);
                  setEditingMedicationId(null);
                  setSelectedMedication(null);
                  setNewMedication({
                    name: '',
                    category: '',
                    price: '',
                    stock: 0,
                    manufacturer: '',
                    status: 'In Stock',
                    description: '',
                    image: 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med',
                  });
                  setPreviewImage(null);
                  setIsDirty(false);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex-[2] sm:flex-none items-center gap-2 rounded-full font-bold shadow-lg shadow-emerald-100"
                disabled={isSubmitting || isUploading}
              >
                {isSubmitting || isUploading ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {isUploading ? "Uploading..." : "Saving..."}
                  </>
                ) : (
                  <>
                    <Save className="h-4 w-4" />
                    {editingMedicationId !== null ? "Update" : "Save"}
                  </>
                )}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicationsPage;
