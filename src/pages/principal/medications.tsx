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
import { Skeleton } from '@/components/ui/skeleton';
import { Input } from '@/components/ui/input';
import {
  Search, Filter, Download, Eye, ArrowUpDown,
  ChevronDown, Plus, Edit, Trash2, Image, X, Save
} from 'lucide-react';
import Modal from '@/components/ui/modal';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';

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

// Generate random placeholder image URLs
const getRandomImageUrl = (index: number) => {
  const colors = ['4299E1', '48BB78', 'ED8936', 'ECC94B', '9F7AEA', 'F56565'];
  const color = colors[index % colors.length];
  return `https://via.placeholder.com/100/${color}/FFFFFF?text=Med+${index + 1}`;
};

// Mock data for medications
const mockMedications: Medication[] = Array(50).fill(0).map((_, i) => {
  const name = [
    'Paracetamol', 'Ibuprofen', 'Amoxicillin', 'Metformin',
    'Atorvastatin', 'Lisinopril', 'Albuterol', 'Omeprazole',
    'Levothyroxine', 'Amlodipine', 'Metoprolol', 'Gabapentin'
  ][Math.floor(Math.random() * 12)] + ` ${Math.floor(Math.random() * 500) + 100}mg`;

  const category = ['Pain Relief', 'Antibiotics', 'Diabetes', 'Cardiovascular', 'Respiratory', 'Gastrointestinal'][Math.floor(Math.random() * 6)];

  return {
    id: i + 1,
    name,
    category,
    price: `₦${(Math.random() * 5000 + 500).toFixed(2)}`,
    stock: Math.floor(Math.random() * 1000),
    manufacturer: ['Pfizer', 'Novartis', 'Roche', 'Merck', 'GSK', 'Johnson & Johnson', 'AstraZeneca'][Math.floor(Math.random() * 7)],
    status: ['In Stock', 'Low Stock', 'Out of Stock'][Math.floor(Math.random() * 3)],
    dateAdded: new Date(Date.now() - Math.floor(Math.random() * 10000000000)).toLocaleDateString(),
    image: getRandomImageUrl(i),
    description: `${name} is used for treating ${category.toLowerCase()} conditions. It is manufactured by a reputable pharmaceutical company and is available in various dosages.`
  };
});

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

  const itemsPerPage = 10;


  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMedications(mockMedications);
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
  const filteredData = medications.filter(medication =>
    medication.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    medication.manufacturer.toLowerCase().includes(searchTerm.toLowerCase())
  );
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  // Simulate loading data
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => {
      setMedications(mockMedications);
      setIsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);


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
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target && typeof event.target.result === 'string') {
          setPreviewImage(event.target.result);
          setNewMedication(prev => ({ ...prev, image: event.target?.result as string }));
        }
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  // Handle form submission
  const handleSubmit = () => {
    if (editingMedicationId !== null) {
      setMedications(prev =>
        prev.map(medication =>
          medication.id === editingMedicationId
            ? {
              ...medication,
              name: newMedication.name || medication.name,
              category: newMedication.category || medication.category,
              price: newMedication.price || medication.price,
              stock: Number(newMedication.stock ?? medication.stock),
              manufacturer: newMedication.manufacturer || medication.manufacturer,
              status: (newMedication.status as string) || medication.status,
              description: newMedication.description || medication.description,
              image: newMedication.image || medication.image,
            }
            : medication
        )
      );
    } else {
      const newId = Math.max(...medications.map(m => m.id), 0) + 1;

      const medicationToAdd: Medication = {
        id: newId,
        name: newMedication.name || 'New Medication',
        category: newMedication.category || 'Other',
        price: newMedication.price || '₦0.00',
        stock: Number(newMedication.stock) || 0,
        manufacturer: newMedication.manufacturer || 'Unknown',
        status: (newMedication.status as string) || 'In Stock',
        dateAdded: new Date().toLocaleDateString(),
        image: newMedication.image || 'https://via.placeholder.com/100/4299E1/FFFFFF?text=New+Med',
        description: newMedication.description,
      };

      setMedications(prev => [medicationToAdd, ...prev]);
    }

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
  };

  // View medication details
  const viewMedication = (medication: Medication) => {
    setSelectedMedication(medication);
    setIsModalOpen(true);
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
  };
  const deleteMedication = (id: number) => {
    const confirmed = window.confirm("Are you sure you want to delete this medication?");
    if (!confirmed) return;

    setMedications(prev => prev.filter(medication => medication.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Medications</h1>
              <p className="mt-1 text-sm text-gray-500">
                Manage your medication inventory
              </p>
            </div>
            <div className="mt-4 md:mt-0">
              <Button
                className="flex items-center gap-2"
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
                  setIsModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add Medication
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
                placeholder="Search medications..."
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
                  <TableHead className="hidden md:table-cell">
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
                  <TableHead className="hidden lg:table-cell">
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
                  <TableHead className="hidden md:table-cell">
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
                {isLoading ? (
                  // Skeleton loading state
                  Array(itemsPerPage).fill(0).map((_, index) => (
                    <TableRow key={index}>
                      <TableCell><Skeleton className="h-5 w-8" /></TableCell>
                      <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-32" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="hidden lg:table-cell"><Skeleton className="h-5 w-12" /></TableCell>
                      <TableCell className="hidden md:table-cell"><Skeleton className="h-5 w-24" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell className="text-right"><Skeleton className="h-8 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : paginatedData.length > 0 ? (
                  // Actual data
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
                      <TableCell className="hidden md:table-cell">{medication.category}</TableCell>
                      <TableCell className="font-medium">{medication.price}</TableCell>
                      <TableCell className="hidden lg:table-cell">{medication.stock}</TableCell>
                      <TableCell className="hidden md:table-cell">{medication.manufacturer}</TableCell>
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
                  // No results
                  <TableRow>
                    <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                      No medications found. Try adjusting your search.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
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

      {/* Add/View Medication Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
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

            <div className="flex justify-end">
              <Button
                variant="outline"
                onClick={() => setIsModalOpen(false)}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          // Add New Medication Form
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="flex-shrink-0">
                <div className="relative">
                  <div className="w-32 h-32 rounded-md border overflow-hidden bg-gray-100 flex items-center justify-center">
                    {previewImage ? (
                      <img
                        src={previewImage}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <Image className="h-8 w-8 text-gray-400" />
                    )}
                  </div>
                  <label htmlFor="medication-image" className="absolute -bottom-2 -right-2 bg-emerald-500 text-white p-1.5 rounded-full cursor-pointer">
                    <Plus className="h-4 w-4" />
                  </label>
                  <input
                    id="medication-image"
                    type="file"
                    accept="image/*"
                    className="hidden"
                    onChange={handleImageUpload}
                    title = "Upload medication image"
                  />
                </div>
                <p className="text-xs text-gray-500 mt-2 text-center">Upload image</p>
              </div>

              <div className="flex-1 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="name">Medication Name</Label>
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
                    <Label htmlFor="price">Price</Label>
                    <Input
                      id="price"
                      name="price"
                      value={newMedication.price}
                      onChange={handleInputChange}
                      placeholder="e.g., ₦1500.00"
                    />
                  </div>
                  <div>
                    <Label htmlFor="stock">Stock</Label>
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
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="In Stock">In Stock</option>
                      <option value="Low Stock">Low Stock</option>
                      <option value="Out of Stock">Out of Stock</option>
                    </select>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                value={newMedication.description}
                onChange={handleInputChange}
                placeholder="Enter medication description..."
                className="min-h-32"
              />
            </div>

            <div className="flex justify-end gap-2">
              <Button
                variant="outline"
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
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmit}
                className="flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                {editingMedicationId !== null ? "Update Medication" : "Save Medication"}
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default MedicationsPage;