import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  ChevronLeft, Upload, X, AlertCircle, CheckCircle, Info
} from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('details');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    category: '',
    price: '',
    stock: '',
    description: '',
    dosage: '',
    sideEffects: '',
    ingredients: '',
    manufacturer: '',
    expiryDate: '',
    batchNumber: '',
    nafdacNumber: '',
  });
  
  // Image upload state
  const [productImages, setProductImages] = useState<string[]>([]);
  const [certificateFile, setCertificateFile] = useState<string | null>(null);
  
  // Form validation state
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  // Categories for dropdown
  const categories = [
    'Pain Relief',
    'Vitamins & Supplements',
    'Antibiotics',
    'Allergy Relief',
    'Digestive Health',
    'Diabetes',
    'Cardiovascular',
    'Respiratory',
    'Skincare',
    'Eye Care',
    'First Aid',
    'Other'
  ];
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle select changes
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors({
        ...errors,
        [name]: ''
      });
    }
  };
  
  // Handle product image upload
  const handleProductImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const newImages = Array.from(e.target.files).map(file => URL.createObjectURL(file));
      setProductImages([...productImages, ...newImages]);
    }
  };
  
  // Handle certificate upload
  const handleCertificateUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      setCertificateFile(URL.createObjectURL(e.target.files[0]));
    }
  };
  
  // Remove product image
  const removeProductImage = (index: number) => {
    const updatedImages = [...productImages];
    updatedImages.splice(index, 1);
    setProductImages(updatedImages);
  };
  
  // Remove certificate file
  const removeCertificateFile = () => {
    setCertificateFile(null);
  };
  
  // Validate form
  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    // Required fields for the current tab
    if (activeTab === 'details') {
      if (!formData.name.trim()) newErrors.name = 'Product name is required';
      if (!formData.category) newErrors.category = 'Category is required';
      if (!formData.price.trim()) newErrors.price = 'Price is required';
      if (!formData.stock.trim()) newErrors.stock = 'Stock quantity is required';
      if (!formData.description.trim()) newErrors.description = 'Description is required';
    } else if (activeTab === 'medical') {
      if (!formData.dosage.trim()) newErrors.dosage = 'Dosage information is required';
      if (!formData.ingredients.trim()) newErrors.ingredients = 'Ingredients are required';
    } else if (activeTab === 'regulatory') {
      if (!formData.manufacturer.trim()) newErrors.manufacturer = 'Manufacturer is required';
      if (!formData.nafdacNumber.trim()) newErrors.nafdacNumber = 'NAFDAC number is required';
      if (!certificateFile) newErrors.certificate = 'Certificate file is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Handle tab change
  const handleTabChange = (value: string) => {
    // Validate current tab before changing
    if (validateForm()) {
      setActiveTab(value);
    }
  };
  
  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      setIsSubmitting(true);
      
      // Simulate API call
      setTimeout(() => {
        setIsSubmitting(false);
        setShowSuccess(true);
        
        // Redirect after success message
        setTimeout(() => {
          navigate('/wholesaler/products');
        }, 2000);
      }, 1500);
    }
  };
  
  // Handle next button
  const handleNext = () => {
    if (validateForm()) {
      if (activeTab === 'details') setActiveTab('medical');
      else if (activeTab === 'medical') setActiveTab('regulatory');
      else if (activeTab === 'regulatory') setActiveTab('images');
    }
  };
  
  // Handle back button
  const handleBack = () => {
    if (activeTab === 'medical') setActiveTab('details');
    else if (activeTab === 'regulatory') setActiveTab('medical');
    else if (activeTab === 'images') setActiveTab('regulatory');
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Page Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between">
            <div className="flex items-center">
              <Button 
                variant="ghost" 
                size="icon" 
                className="mr-2"
                onClick={() => navigate('/wholesaler/products')}
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
                <p className="mt-1 text-sm text-gray-500">Create a new medication product</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {showSuccess ? (
          <Alert className="mb-6 bg-emerald-50 border-emerald-200">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Product Added Successfully!</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Your product has been submitted for review. You will be redirected to the products page.
            </AlertDescription>
          </Alert>
        ) : (
          <Alert className="mb-6 bg-blue-50 border-blue-200">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Important Information</AlertTitle>
            <AlertDescription className="text-blue-700">
              All products will undergo a review process before being listed on the platform. 
              Please ensure all information is accurate and regulatory documents are valid.
            </AlertDescription>
          </Alert>
        )}
        
        <Card className="overflow-hidden">
          <form onSubmit={handleSubmit}>
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <div className="px-6 py-4 bg-white border-b">
                <TabsList className="grid grid-cols-4 w-full">
                  <TabsTrigger value="details" disabled={isSubmitting}>
                    Basic Details
                  </TabsTrigger>
                  <TabsTrigger value="medical" disabled={isSubmitting}>
                    Medical Info
                  </TabsTrigger>
                  <TabsTrigger value="regulatory" disabled={isSubmitting}>
                    Regulatory
                  </TabsTrigger>
                  <TabsTrigger value="images" disabled={isSubmitting}>
                    Images
                  </TabsTrigger>
                </TabsList>
              </div>
              
              <div className="p-6">
                <TabsContent value="details">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="name">Product Name <span className="text-red-500">*</span></Label>
                        <Input
                          id="name"
                          name="name"
                          placeholder="e.g., Paracetamol 500mg"
                          value={formData.name}
                          onChange={handleInputChange}
                          className={errors.name ? "border-red-500" : ""}
                        />
                        {errors.name && (
                          <p className="text-sm text-red-500">{errors.name}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="category">Category <span className="text-red-500">*</span></Label>
                        <Select
                          value={formData.category}
                          onValueChange={(value) => handleSelectChange('category', value)}
                        >
                          <SelectTrigger className={errors.category ? "border-red-500" : ""}>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        {errors.category && (
                          <p className="text-sm text-red-500">{errors.category}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="price">Price (₦) <span className="text-red-500">*</span></Label>
                        <Input
                          id="price"
                          name="price"
                          placeholder="e.g., 500"
                          value={formData.price}
                          onChange={handleInputChange}
                          className={errors.price ? "border-red-500" : ""}
                        />
                        {errors.price && (
                          <p className="text-sm text-red-500">{errors.price}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="stock">Stock Quantity <span className="text-red-500">*</span></Label>
                        <Input
                          id="stock"
                          name="stock"
                          type="number"
                          placeholder="e.g., 100"
                          value={formData.stock}
                          onChange={handleInputChange}
                          className={errors.stock ? "border-red-500" : ""}
                        />
                        {errors.stock && (
                          <p className="text-sm text-red-500">{errors.stock}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="description">Product Description <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="description"
                        name="description"
                        placeholder="Provide a detailed description of the product..."
                        rows={4}
                        value={formData.description}
                        onChange={handleInputChange}
                        className={errors.description ? "border-red-500" : ""}
                      />
                      {errors.description && (
                        <p className="text-sm text-red-500">{errors.description}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="medical">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="dosage">Dosage Information <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="dosage"
                        name="dosage"
                        placeholder="Provide detailed dosage instructions..."
                        rows={3}
                        value={formData.dosage}
                        onChange={handleInputChange}
                        className={errors.dosage ? "border-red-500" : ""}
                      />
                      {errors.dosage && (
                        <p className="text-sm text-red-500">{errors.dosage}</p>
                      )}
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="sideEffects">Side Effects</Label>
                      <Textarea
                        id="sideEffects"
                        name="sideEffects"
                        placeholder="List potential side effects..."
                        rows={3}
                        value={formData.sideEffects}
                        onChange={handleInputChange}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="ingredients">Ingredients <span className="text-red-500">*</span></Label>
                      <Textarea
                        id="ingredients"
                        name="ingredients"
                        placeholder="List all active and inactive ingredients..."
                        rows={3}
                        value={formData.ingredients}
                        onChange={handleInputChange}
                        className={errors.ingredients ? "border-red-500" : ""}
                      />
                      {errors.ingredients && (
                        <p className="text-sm text-red-500">{errors.ingredients}</p>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="regulatory">
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="manufacturer">Manufacturer <span className="text-red-500">*</span></Label>
                        <Input
                          id="manufacturer"
                          name="manufacturer"
                          placeholder="e.g., Pharma Inc."
                          value={formData.manufacturer}
                          onChange={handleInputChange}
                          className={errors.manufacturer ? "border-red-500" : ""}
                        />
                        {errors.manufacturer && (
                          <p className="text-sm text-red-500">{errors.manufacturer}</p>
                        )}
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="expiryDate">Expiry Date</Label>
                        <Input
                          id="expiryDate"
                          name="expiryDate"
                          type="date"
                          value={formData.expiryDate}
                          onChange={handleInputChange}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <Label htmlFor="batchNumber">Batch Number</Label>
                        <Input
                          id="batchNumber"
                          name="batchNumber"
                          placeholder="e.g., BN12345"
                          value={formData.batchNumber}
                          onChange={handleInputChange}
                        />
                      </div>
                      
                      <div className="space-y-2">
                        <Label htmlFor="nafdacNumber">NAFDAC Number <span className="text-red-500">*</span></Label>
                        <Input
                          id="nafdacNumber"
                          name="nafdacNumber"
                          placeholder="e.g., A1-1234"
                          value={formData.nafdacNumber}
                          onChange={handleInputChange}
                          className={errors.nafdacNumber ? "border-red-500" : ""}
                        />
                        {errors.nafdacNumber && (
                          <p className="text-sm text-red-500">{errors.nafdacNumber}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label>Regulatory Certificate <span className="text-red-500">*</span></Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        {certificateFile ? (
                          <div className="flex items-center justify-between bg-gray-50 p-3 rounded">
                            <div className="flex items-center">
                              <div className="bg-blue-100 p-2 rounded">
                                <svg className="h-5 w-5 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                              </div>
                              <span className="ml-2 text-sm font-medium text-gray-900">Certificate File</span>
                            </div>
                            <Button 
                              variant="ghost" 
                              size="icon"
                              type="button"
                              onClick={removeCertificateFile}
                            >
                              <X className="h-4 w-4" />
                            </Button>
                          </div>
                        ) : (
                          <>
                            <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                            <p className="text-sm text-gray-500 mb-2">
                              Upload your regulatory certificate (PDF, JPG, PNG)
                            </p>
                            <Button 
                              variant="outline" 
                              size="sm"
                              type="button"
                              onClick={() => document.getElementById('certificateUpload')?.click()}
                            >
                              Select File
                            </Button>
                            <input
                              id="certificateUpload"
                              type="file"
                              accept=".pdf,.jpg,.jpeg,.png"
                              className="hidden"
                              onChange={handleCertificateUpload}
                            />
                            {errors.certificate && (
                              <p className="text-sm text-red-500 mt-2">{errors.certificate}</p>
                            )}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="images">
                  <div className="space-y-6">
                    <div className="space-y-2">
                      <Label>Product Images</Label>
                      <div className="border-2 border-dashed rounded-lg p-6 text-center">
                        <Upload className="h-10 w-10 text-gray-400 mx-auto mb-2" />
                        <p className="text-sm text-gray-500 mb-2">
                          Upload product images (JPG, PNG)
                        </p>
                        <Button 
                          variant="outline" 
                          size="sm"
                          type="button"
                          onClick={() => document.getElementById('imageUpload')?.click()}
                        >
                          Select Images
                        </Button>
                        <input
                          id="imageUpload"
                          type="file"
                          accept=".jpg,.jpeg,.png"
                          multiple
                          className="hidden"
                          onChange={handleProductImageUpload}
                        />
                      </div>
                    </div>
                    
                    {productImages.length > 0 && (
                      <div>
                        <Label className="mb-2 block">Uploaded Images</Label>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                          {productImages.map((image, index) => (
                            <div key={index} className="relative group">
                              <img 
                                src={image} 
                                alt={`Product ${index + 1}`} 
                                className="h-32 w-full object-cover rounded-md border"
                              />
                              <Button
                                variant="destructive"
                                size="icon"
                                className="absolute top-2 right-2 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                                onClick={() => removeProductImage(index)}
                                type="button"
                              >
                                <X className="h-3 w-3" />
                              </Button>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    <div className="bg-blue-50 p-4 rounded-md">
                      <div className="flex">
                        <Info className="h-5 w-5 text-blue-600 mr-2 flex-shrink-0" />
                        <p className="text-sm text-blue-700">
                          High-quality images help your products stand out. We recommend uploading multiple images showing different angles and packaging details.
                        </p>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </div>
              
              <div className="px-6 py-4 bg-gray-50 border-t flex justify-between">
                {activeTab !== 'details' ? (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleBack}
                    disabled={isSubmitting}
                  >
                    Back
                  </Button>
                ) : (
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={() => navigate('/wholesaler/products')}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                )}
                
                {activeTab !== 'images' ? (
                  <Button 
                    type="button"
                    onClick={handleNext}
                    disabled={isSubmitting}
                  >
                    Next
                  </Button>
                ) : (
                  <Button 
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2"
                  >
                    {isSubmitting ? (
                      <>
                        <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Submitting...
                      </>
                    ) : (
                      'Submit Product'
                    )}
                  </Button>
                )}
              </div>
            </Tabs>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AddProductPage;