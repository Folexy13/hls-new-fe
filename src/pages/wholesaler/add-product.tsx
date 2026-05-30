import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import {
  CheckCircle,
  ChevronLeft,
  ImageIcon,
  Loader2,
  Upload,
} from "lucide-react";
import { apiClient } from "@/config/axios";
import { getApiErrorMessage } from "@/utils/apiError";

const productsTabPath = "/wholesaler?tab=products";

const AddProductPage: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formData, setFormData] = useState({
    brandName: "",
    expiryDate: "",
    price: "",
    stock: "",
    manufacturer: "",
    strength: "",
  });

  const updateField = (name: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const validateForm = () => {
    const nextErrors: Record<string, string> = {};
    if (!formData.brandName.trim()) nextErrors.brandName = "Brand name is required";
    if (!formData.expiryDate) nextErrors.expiryDate = "Expiry date is required";
    if (!formData.price.trim() || Number(formData.price) <= 0) nextErrors.price = "Enter a valid price";
    if (formData.stock.trim() && Number(formData.stock) < 0) nextErrors.stock = "Enter a valid stock quantity";
    if (!formData.manufacturer.trim()) nextErrors.manufacturer = "Manufacturer is required";
    if (!imageFile) nextErrors.image = "Product image is required";
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const uploadProductImage = async (file: File) => {
    const payload = new FormData();
    payload.append("image", file);
    const response = await apiClient.post("/api/v2/supplements/upload-image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data?.imageUrl as string | undefined;
  };

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setImagePreview(URL.createObjectURL(file));
    setErrors((prev) => ({ ...prev, image: "" }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!validateForm() || !imageFile) return;

    setIsSubmitting(true);
    try {
      const imageUrl = await uploadProductImage(imageFile);
      if (!imageUrl) {
        toast.error("Image upload failed. Please try again.");
        return;
      }

      await apiClient.post("/api/v2/supplements/wholesaler/products", {
        name: formData.brandName.trim(),
        description: `${formData.brandName.trim()} supplied by ${formData.manufacturer.trim()}`,
        price: Number(formData.price),
        stock: formData.stock.trim() ? Number(formData.stock) : 0,
        imageUrl,
        manufacturer: formData.manufacturer.trim(),
        strength: formData.strength.trim() || null,
        expiryDate: formData.expiryDate,
        category: "Wholesaler Product",
      });

      setShowSuccess(true);
      toast.success("Product added successfully");
      setTimeout(() => navigate(productsTabPath), 1200);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to add product"));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <div className="border-b bg-white">
        <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center">
            <Button
              variant="ghost"
              size="icon"
              className="mr-2"
              onClick={() => navigate(productsTabPath)}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Add New Product</h1>
              <p className="mt-1 text-sm text-gray-500">Create a product for your wholesaler inventory</p>
            </div>
          </div>
        </div>
      </div>

      <main className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
        {showSuccess ? (
          <Alert className="mb-6 border-emerald-200 bg-emerald-50">
            <CheckCircle className="h-5 w-5 text-emerald-600" />
            <AlertTitle className="text-emerald-800">Product Added Successfully</AlertTitle>
            <AlertDescription className="text-emerald-700">
              Your product has been saved. Redirecting to My Products.
            </AlertDescription>
          </Alert>
        ) : null /* (
          <Alert className="mb-6 border-blue-200 bg-blue-50">
            <Info className="h-5 w-5 text-blue-600" />
            <AlertTitle className="text-blue-800">Product Details</AlertTitle>
            <AlertDescription className="text-blue-700">
              Upload a clear product picture. The image will be uploaded to Cloudinary and saved with the product.
            </AlertDescription>
          </Alert>
        ) */}

        <Card className="overflow-hidden bg-white p-6 shadow-sm">
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="brandName">Brand Name <span className="text-red-500">*</span></Label>
                <Input
                  id="brandName"
                  value={formData.brandName}
                  onChange={(event) => updateField("brandName", event.target.value)}
                  placeholder="e.g. Perfectil Original"
                  className={errors.brandName ? "border-red-500" : ""}
                />
                {errors.brandName && <p className="text-sm text-red-500">{errors.brandName}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="manufacturer">Manufacturer <span className="text-red-500">*</span></Label>
                <Input
                  id="manufacturer"
                  value={formData.manufacturer}
                  onChange={(event) => updateField("manufacturer", event.target.value)}
                  placeholder="e.g. Vitabiotics"
                  className={errors.manufacturer ? "border-red-500" : ""}
                />
                {errors.manufacturer && <p className="text-sm text-red-500">{errors.manufacturer}</p>}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="expiryDate">Expiry Date <span className="text-red-500">*</span></Label>
                <Input
                  id="expiryDate"
                  type="date"
                  value={formData.expiryDate}
                  onChange={(event) => updateField("expiryDate", event.target.value)}
                  className={errors.expiryDate ? "border-red-500" : ""}
                />
                {errors.expiryDate && <p className="text-sm text-red-500">{errors.expiryDate}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price <span className="text-red-500">*</span></Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(event) => updateField("price", event.target.value)}
                  placeholder="e.g. 5000"
                  className={errors.price ? "border-red-500" : ""}
                />
                {errors.price && <p className="text-sm text-red-500">{errors.price}</p>}
              </div>
            </div>

            <div className="grid gap-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="stock">Stock</Label>
                <Input
                  id="stock"
                  type="number"
                  min="0"
                  step="1"
                  value={formData.stock}
                  onChange={(event) => updateField("stock", event.target.value)}
                  placeholder="Optional"
                  className={errors.stock ? "border-red-500" : ""}
                />
                {errors.stock && <p className="text-sm text-red-500">{errors.stock}</p>}
              </div>

              <div className="space-y-2">
                <Label htmlFor="strength">Strength</Label>
                <Input
                  id="strength"
                  value={formData.strength}
                  onChange={(event) => updateField("strength", event.target.value)}
                  placeholder="Optional"
                  className={errors.strength ? "border-red-500" : ""}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Image <span className="text-red-500">*</span></Label>
              <div className={`rounded-lg border-2 border-dashed p-5 ${errors.image ? "border-red-300" : "border-slate-300"}`}>
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product preview" className="h-28 w-28 rounded-lg border object-cover" />
                  ) : (
                    <div className="flex h-28 w-28 items-center justify-center rounded-lg bg-slate-100">
                      <ImageIcon className="h-9 w-9 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">{imageFile ? imageFile.name : "Upload product picture"}</p>
                    <p className="mt-1 text-xs text-slate-500">JPG or PNG, up to 5MB.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-2"
                      onClick={() => document.getElementById("wholesalerProductImage")?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Picture
                    </Button>
                    <input
                      id="wholesalerProductImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </div>
                </div>
              </div>
              {errors.image && <p className="text-sm text-red-500">{errors.image}</p>}
            </div>

            <div className="flex justify-between border-t pt-5">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(productsTabPath)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="gap-2">
                {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                Save Product
              </Button>
            </div>
          </form>
        </Card>
      </main>
    </div>
  );
};

export default AddProductPage;
