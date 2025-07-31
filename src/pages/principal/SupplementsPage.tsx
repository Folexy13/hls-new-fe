import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Pill } from 'lucide-react';
import { Medication, MedicationForm, ModalState } from '@/types';
import { ResponsiveTable } from '@/components/shared/ResponsiveTable';
import { Pagination } from '@/components/shared/Pagination';
import { SearchInput } from '@/components/shared/SearchInput';
import { usePagination } from '@/hooks/usePagination';
import { useModal } from '@/hooks/useModal';

const INITIAL_MEDICATIONS: Medication[] = [
  { id: '1', image: '/src/images/vitamins.png', name: 'Vitamin C', brand: 'HealthPlus', price: 2500, expiry: '2025-01-01', category: 'Vitamin', stock: 150 },
  { id: '2', image: '/src/images/vitamins2.png', name: 'Paracetamol', brand: 'Emzor', price: 1500, expiry: '2024-12-15', category: 'Pain Relief', stock: 200 },
  { id: '3', image: '/src/images/vitamins3.png', name: 'Ibuprofen', brand: 'Nurofen', price: 1800, expiry: '2025-03-10', category: 'Pain Relief', stock: 120 },
  { id: '4', image: '/src/images/vitamins4.png', name: 'Amoxicillin', brand: 'GSK', price: 3200, expiry: '2024-11-20', category: 'Antibiotic', stock: 80 },
  { id: '5', image: '/src/images/vitamins.png', name: 'Cough Syrup', brand: 'Benylin', price: 2100, expiry: '2025-06-30', category: 'Cough/Cold', stock: 95 },
  { id: '6', image: '/src/images/vitamins2.png', name: 'Antacid', brand: 'Gaviscon', price: 1700, expiry: '2025-02-14', category: 'Digestive', stock: 180 },
  { id: '7', image: '/src/images/vitamins3.png', name: 'Multivitamin', brand: 'Wellman', price: 4000, expiry: '2025-08-01', category: 'Vitamin', stock: 75 },
  { id: '8', image: '/src/images/vitamins4.png', name: 'Zinc Tablet', brand: 'NatureMade', price: 1200, expiry: '2024-10-05', category: 'Supplement', stock: 110 },
  { id: '9', image: '/src/images/vitamins.png', name: 'Calcium', brand: 'Caltrate', price: 3500, expiry: '2025-04-18', category: 'Supplement', stock: 60 },
  { id: '10', image: '/src/images/vitamins2.png', name: 'Magnesium', brand: 'NatureMade', price: 2800, expiry: '2025-07-22', category: 'Supplement', stock: 85 },
];

const CATEGORIES = ['Vitamin', 'Pain Relief', 'Antibiotic', 'Cough/Cold', 'Digestive', 'Supplement'];

const PAGE_SIZE = 5;

const EMPTY_FORM: MedicationForm = { name: '', brand: '', price: '', expiry: '', category: '', image: '', stock: '' };

const SupplementsPage: React.FC = () => {
  const navigate = useNavigate();
  const [medications, setMedications] = useState<Medication[]>(INITIAL_MEDICATIONS);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [search, setSearch] = useState('');
  const [editForm, setEditForm] = useState<MedicationForm>(EMPTY_FORM);
  
  const { modalState, openEditModal, openAddModal, closeModal } = useModal();
  
  const { 
    currentPage, 
    totalPages, 
    paginatedData, 
    goToPage 
  } = usePagination({
    data: medications,
    pageSize: PAGE_SIZE,
    searchTerm: search,
    searchKey: 'name'
  });

  // Clean up object URLs to prevent memory leaks
  useEffect(() => {
    return () => {
      if (editForm.image && editForm.image.startsWith('blob:')) {
        URL.revokeObjectURL(editForm.image);
      }
    };
  }, [editForm.image]);

  // Open edit modal and populate form
  const handleEdit = (idx: number) => {
    const med = paginatedData[idx];
    setEditForm({
      name: med.name,
      brand: med.brand,
      price: med.price.toString(),
      expiry: med.expiry,
      category: med.category,
      image: med.image,
      stock: med.stock.toString(),
    });
    openEditModal(idx);
  };

  // Open add modal
  const handleAdd = () => {
    setEditForm(EMPTY_FORM);
    openAddModal();
  };

  // Handle form changes
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle price input - only allow numbers
  const handlePriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value } = e.target;
    // Only allow numbers and decimal point
    const numericValue = value.replace(/[^0-9.]/g, '');
    // Ensure only one decimal point
    const parts = numericValue.split('.');
    const formattedValue = parts.length > 2 ? parts[0] + '.' + parts.slice(1).join('') : numericValue;
    setEditForm(prev => ({ ...prev, price: formattedValue }));
  };

  // Handle image upload
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      // Clean up previous object URL if it exists
      if (editForm.image && editForm.image.startsWith('blob:')) {
        URL.revokeObjectURL(editForm.image);
      }
      
      const url = URL.createObjectURL(e.target.files[0]);
      setEditForm(prev => ({ ...prev, image: url }));
    }
  };

  // Save (edit or add)
  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    
    const newMedication: Omit<Medication, 'id'> = {
      name: editForm.name,
      brand: editForm.brand,
      price: Number(editForm.price),
      expiry: editForm.expiry,
      category: editForm.category,
      image: editForm.image,
      stock: Number(editForm.stock),
    };

    if (modalState.isAdd) {
      const id = Date.now().toString();
      setMedications(prev => [{ ...newMedication, id }, ...prev]);
    } else if (modalState.medIdx !== null) {
      const medToUpdate = paginatedData[modalState.medIdx];
      setMedications(prev => 
        prev.map(med => 
          med.id === medToUpdate.id 
            ? { ...newMedication, id: med.id }
            : med
        )
      );
    }
    
    closeModal();
    setEditForm(EMPTY_FORM);
  };

  // Close modal and clean up
  const handleCloseModal = () => {
    // Clean up object URL if it exists
    if (editForm.image && editForm.image.startsWith('blob:')) {
      URL.revokeObjectURL(editForm.image);
    }
    closeModal();
    setEditForm(EMPTY_FORM);
  };

  const tableColumns = [
    {
      key: 'image',
      label: 'Image',
      render: (med: Medication) => (
        <img src={med.image} alt={med.name} className="w-12 h-12 object-contain rounded" />
      ),
    },
    {
      key: 'name',
      label: 'Name',
      render: (med: Medication) => (
        <span className="font-semibold text-gray-900">{med.name}</span>
      ),
    },
  ];

  const expandableContent = (med: Medication, idx: number) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 py-3">
      <div className="text-sm text-gray-700">
        <div><span className="font-semibold">Brand:</span> {med.brand}</div>
        <div><span className="font-semibold">Price:</span> ₦{med.price.toLocaleString()}</div>
        <div><span className="font-semibold">Stock:</span> {med.stock}</div>
        <div><span className="font-semibold">Expiry Date:</span> {med.expiry}</div>
        <div><span className="font-semibold">Category:</span> {med.category}</div>
      </div>
      <div className="flex gap-2">
        <button 
          className="px-4 py-2 rounded bg-emerald-600 text-white font-semibold hover:bg-emerald-700 transition-colors"
          onClick={() => handleEdit(idx)}
        >
          Edit
        </button>
        <button 
          className="px-4 py-2 rounded bg-red-500 text-white font-semibold hover:bg-red-600 transition-colors"
          onClick={() => {
            setMedications(prev => prev.filter(m => m.id !== med.id));
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 pb-12 bg-gradient-to-br from-blue-50 via-white to-emerald-50">
      <div className="w-full flex justify-center mb-8">
        <button
          onClick={() => navigate('/principal')}
          className="flex items-center gap-2 px-5 py-2 border border-emerald-500 text-emerald-700 bg-white rounded-lg shadow-sm hover:bg-emerald-50 hover:border-emerald-600 transition-colors duration-150"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-semibold">Back to Dashboard</span>
        </button>
      </div>
      <Card className="w-full max-w-5xl p-8 rounded-2xl shadow-2xl border border-gray-100 bg-white">
        <div className="mb-2">
          <span className="text-3xl font-extrabold text-gray-900 tracking-tight">Medications</span>
        </div>
        <div className="mb-6">
          <SearchInput
            value={search}
            onChange={setSearch}
            placeholder="Search by name..."
            aria-label="Search medications by name"
          />
        </div>
        
        <ResponsiveTable
          data={paginatedData}
          columns={tableColumns}
          openIndex={openIndex}
          setOpenIndex={setOpenIndex}
          expandableContent={expandableContent}
          emptyMessage="No medications found"
        />
        
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={goToPage}
        />
        
        <div className="mt-2">
          <button
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded-lg shadow-sm transition-colors duration-150"
            onClick={handleAdd}
          >
            Add Medication
          </button>
        </div>
      </Card>
      
      {/* Edit Modal */}
      {modalState.open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
          <div className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md relative">
            <button 
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-2xl" 
              onClick={handleCloseModal}
              aria-label="Close modal"
            >
              &times;
            </button>
            <h2 className="text-xl font-bold mb-4">
              {modalState.isAdd ? 'Add Medication' : 'Edit Medication'}
            </h2>
            <form className="space-y-4" onSubmit={handleSave}>
              <div>
                <label className="block font-semibold mb-1">Name</label>
                <input 
                  name="name" 
                  value={editForm.name} 
                  onChange={handleFormChange} 
                  className="w-full border px-3 py-2 rounded" 
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Brand</label>
                <input 
                  name="brand" 
                  value={editForm.brand} 
                  onChange={handleFormChange} 
                  className="w-full border px-3 py-2 rounded" 
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Price (NGN)</label>
                <input 
                  name="price" 
                  type="text" 
                  value={editForm.price} 
                  onChange={handlePriceChange} 
                  className="w-full border px-3 py-2 rounded" 
                  placeholder="Enter price"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Expiry Date</label>
                <input 
                  name="expiry" 
                  type="date" 
                  value={editForm.expiry} 
                  onChange={handleFormChange} 
                  className="w-full border px-3 py-2 rounded" 
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Stock Quantity</label>
                <input 
                  name="stock" 
                  type="number" 
                  value={editForm.stock} 
                  onChange={handleFormChange} 
                  className="w-full border px-3 py-2 rounded" 
                  placeholder="Enter stock quantity"
                  min="0"
                  required
                />
              </div>
              <div>
                <label className="block font-semibold mb-1">Drug Category</label>
                <select 
                  name="category" 
                  value={editForm.category} 
                  onChange={handleFormChange} 
                  className="w-full border px-3 py-2 rounded"
                  required
                >
                  <option value="">Select category</option>
                  {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                </select>
              </div>
              <div>
                <label className="block font-semibold mb-1">Image</label>
                <div className="flex items-center gap-4 mb-2">
                  {editForm.image && (
                    <img src={editForm.image} alt="Current" className="w-16 h-16 object-contain rounded border" />
                  )}
                  <label className="px-3 py-2 bg-gray-100 rounded cursor-pointer border border-gray-300 text-sm font-medium hover:bg-gray-200">
                    Upload New
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button 
                  type="button" 
                  onClick={handleCloseModal} 
                  className="px-4 py-2 rounded border border-gray-300 text-gray-700 bg-white hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="px-4 py-2 rounded bg-emerald-600 text-white hover:bg-emerald-700"
                >
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default SupplementsPage;
