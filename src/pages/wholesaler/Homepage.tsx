import React, { useEffect, useMemo, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { toast } from "react-toastify";
import {
  AlertCircle,
  CheckCircle,
  Download,
  Edit,
  Eye,
  Filter,
  ImageIcon,
  Package,
  Pill,
  Plus,
  Save,
  Search,
  Trash2,
  Upload,
} from "lucide-react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { apiClient } from "@/config/axios";
import { useStore } from "@/store/useStore";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  wholesalerService,
  type WholesalerSupplement,
} from "@/services/wholesalerService";

const PRODUCTS_PER_PAGE = 20;

type ProductRow = {
  id: number;
  name: string;
  category: string;
  price: number;
  stock: number;
  status: string;
  image: string;
  description: string;
  manufacturer: string;
  strength: string;
  expiryDate: string;
};

type ProductForm = {
  brandName: string;
  price: string;
  stock: string;
  manufacturer: string;
  strength: string;
  expiryDate: string;
  imageUrl: string;
};

const createProductForm = (product?: ProductRow | null): ProductForm => ({
  brandName: product?.name ?? "",
  price: product ? String(product.price || "") : "",
  stock: product ? String(product.stock ?? "") : "",
  manufacturer: product?.manufacturer ?? "",
  strength: product?.strength ?? "",
  expiryDate: product?.expiryDate ?? "",
  imageUrl: product?.image ?? "",
});

const formatCurrency = (value: number) => `NGN ${Number(value || 0).toLocaleString()}`;

const getStatusLabel = (stock: number, status?: string) => {
  if (status === "out_of_stock" || stock <= 0) return "Out of Stock";
  if (stock <= 10) return "Low Stock";
  return "Active";
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-emerald-100 text-emerald-800";
    case "Low Stock":
      return "bg-amber-100 text-amber-800";
    case "Out of Stock":
      return "bg-red-100 text-red-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusIcon = (status: string) => {
  if (status === "Active") return <CheckCircle className="mr-1 h-3 w-3" />;
  return <AlertCircle className="mr-1 h-3 w-3" />;
};

const WholesalerHomepage: React.FC = () => {
  const { user } = useStore();
  const currentUserId = Number(user?.id || 0);
  const [searchParams, setSearchParams] = useSearchParams();

  const initialTab = searchParams.get("tab") === "products" ? "products" : "gallery";
  const [activeTab, setActiveTab] = useState(initialTab);
  const [galleryProducts, setGalleryProducts] = useState<WholesalerSupplement[]>([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [galleryQuery, setGalleryQuery] = useState("");
  const [galleryMeta, setGalleryMeta] = useState({
    total: 0,
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [galleryPage, setGalleryPage] = useState(1);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [prices, setPrices] = useState<Record<number, string>>({});

  const [myProducts, setMyProducts] = useState<ProductRow[]>([]);
  const [myProductsLoading, setMyProductsLoading] = useState(true);
  const [myProductsQuery, setMyProductsQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showProductFilters, setShowProductFilters] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<ProductRow | null>(null);
  const [editingProduct, setEditingProduct] = useState<ProductRow | null>(null);
  const [productForm, setProductForm] = useState<ProductForm>(() => createProductForm());
  const [productImageFile, setProductImageFile] = useState<File | null>(null);
  const [isSavingProduct, setIsSavingProduct] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState<number | null>(null);

  const loadGallery = async (nextPage = galleryPage) => {
    setGalleryLoading(true);
    try {
      const result = await wholesalerService.getGallery(nextPage, PRODUCTS_PER_PAGE);
      const supplements = result?.supplements ?? [];
      const nextPrices: Record<number, string> = {};

      supplements.forEach((product) => {
        const myOffer = product.wholesalers?.find((item) => Number(item.wholesalerUserId) === currentUserId);
        if (myOffer?.price) nextPrices[product.id] = String(myOffer.price);
      });

      setGalleryProducts(supplements);
      setGalleryMeta(result?.meta ?? galleryMeta);
      setPrices(nextPrices);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load HLS gallery"));
    } finally {
      setGalleryLoading(false);
    }
  };

  const loadMyProducts = async () => {
    setMyProductsLoading(true);
    try {
      const response = await apiClient.get("/api/v2/supplements/user");
      const supplements = response.data?.data?.supplements ?? [];
      setMyProducts(
        supplements.map((item: any) => {
          const stock = Number(item.stock || 0);
          const status = getStatusLabel(stock, item.status);
          return {
            id: item.id,
            name: item.name,
            category: item.category || "Medication",
            price: Number(item.price || 0),
            stock,
            status,
            image: item.imageUrl || "/placeholder.svg",
            description: item.description || "",
            manufacturer: item.manufacturer || "Unknown",
            strength: item.strength || "",
            expiryDate: item.expiryDate ? String(item.expiryDate).slice(0, 10) : "",
          };
        })
      );
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load your products"));
      setMyProducts([]);
    } finally {
      setMyProductsLoading(false);
    }
  };

  useEffect(() => {
    loadGallery(galleryPage);
  }, [galleryPage]);

  useEffect(() => {
    loadMyProducts();
  }, []);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "products" || tab === "gallery") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setSearchParams(tab === "products" ? { tab: "products" } : {});
  };

  const visibleGalleryProducts = useMemo(() => {
    const search = galleryQuery.trim().toLowerCase();
    if (!search) return galleryProducts;
    return galleryProducts.filter((product) =>
      [product.name, product.description, product.category, product.manufacturer]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search))
    );
  }, [galleryProducts, galleryQuery]);

  const categories = useMemo(
    () => ["All", ...Array.from(new Set(myProducts.map((product) => product.category)))],
    [myProducts]
  );

  const filteredMyProducts = useMemo(() => {
    const search = myProductsQuery.trim().toLowerCase();
    return myProducts.filter((product) => {
      const matchesSearch =
        !search ||
        [product.name, product.description, product.category, product.manufacturer, product.strength]
          .filter(Boolean)
          .some((value) => String(value).toLowerCase().includes(search));
      const matchesCategory = categoryFilter === "All" || product.category === categoryFilter;
      const matchesStatus = statusFilter === "All" || product.status === statusFilter;
      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [categoryFilter, myProducts, myProductsQuery, statusFilter]);

  const savePrice = async (product: WholesalerSupplement) => {
    const price = Number(prices[product.id]);
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid wholesale price");
      return;
    }

    setSavingId(product.id);
    try {
      await wholesalerService.savePrice(product.id, {
        price,
      });
      toast.success("Wholesale price saved");
      await loadGallery(galleryPage);
      await loadMyProducts();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save price"));
    } finally {
      setSavingId(null);
    }
  };

  const viewProduct = (product: ProductRow) => {
    setEditingProduct(null);
    setSelectedProduct(product);
  };

  const editProduct = (product: ProductRow) => {
    setSelectedProduct(null);
    setEditingProduct(product);
    setProductForm(createProductForm(product));
    setProductImageFile(null);
  };

  const closeProductDialog = () => {
    setSelectedProduct(null);
    setEditingProduct(null);
    setProductForm(createProductForm());
    setProductImageFile(null);
  };

  const updateProductForm = (field: keyof ProductForm, value: string) => {
    setProductForm((prev) => ({ ...prev, [field]: value }));
  };

  const uploadProductImage = async (file: File) => {
    const payload = new FormData();
    payload.append("image", file);
    const response = await apiClient.post("/api/v2/supplements/upload-image", payload, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data?.data?.imageUrl as string | undefined;
  };

  const saveProductEdit = async () => {
    if (!editingProduct) return;

    const price = Number(productForm.price);
    const stock = Number(productForm.stock);
    if (!productForm.brandName.trim()) {
      toast.error("Brand name is required");
      return;
    }
    if (!Number.isFinite(price) || price <= 0) {
      toast.error("Enter a valid product price");
      return;
    }
    if (productForm.stock.trim() && (!Number.isFinite(stock) || stock < 0)) {
      toast.error("Enter a valid stock quantity");
      return;
    }

    setIsSavingProduct(true);
    try {
      let imageUrl = productForm.imageUrl;
      if (productImageFile) {
        const uploadedUrl = await uploadProductImage(productImageFile);
        if (!uploadedUrl) {
          toast.error("Image upload failed. Please try again.");
          return;
        }
        imageUrl = uploadedUrl;
      }

      const response = await apiClient.put(`/api/v2/supplements/wholesaler/products/${editingProduct.id}`, {
        name: productForm.brandName.trim(),
        description: editingProduct.description || `${productForm.brandName.trim()} supplied by ${productForm.manufacturer.trim() || "wholesaler"}`,
        price,
        stock: productForm.stock.trim() ? stock : editingProduct.stock,
        imageUrl: imageUrl || null,
        manufacturer: productForm.manufacturer.trim() || null,
        strength: productForm.strength.trim() || null,
        expiryDate: productForm.expiryDate || null,
      });

      const updated = response.data?.data?.supplement;
      if (updated) {
        const nextStock = Number(updated.stock || 0);
        const nextProduct: ProductRow = {
          id: updated.id,
          name: updated.name,
          category: updated.category || "Medication",
          price: Number(updated.price || 0),
          stock: nextStock,
          status: getStatusLabel(nextStock, updated.status),
          image: updated.imageUrl || "/placeholder.svg",
          description: updated.description || "",
          manufacturer: updated.manufacturer || "Unknown",
          strength: updated.strength || "",
          expiryDate: updated.expiryDate ? String(updated.expiryDate).slice(0, 10) : "",
        };

        setMyProducts((prev) => prev.map((product) => (product.id === nextProduct.id ? nextProduct : product)));
      } else {
        await loadMyProducts();
      }

      toast.success("Product updated successfully");
      closeProductDialog();
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to update product"));
    } finally {
      setIsSavingProduct(false);
    }
  };

  const deleteProduct = async (product: ProductRow) => {
    const confirmed = window.confirm(`Are you sure you want to delete ${product.name}?`);
    if (!confirmed) return;

    setDeletingProductId(product.id);
    try {
      await apiClient.delete(`/api/v2/supplements/wholesaler/products/${product.id}`);
      setMyProducts((prev) => prev.filter((item) => item.id !== product.id));
      if (selectedProduct?.id === product.id || editingProduct?.id === product.id) {
        closeProductDialog();
      }
      toast.success("Product deleted successfully");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to delete product"));
    } finally {
      setDeletingProductId(null);
    }
  };

  const exportMyProducts = () => {
    const csvRows = [
      ["Name", "Category", "Price", "Stock", "Status", "Manufacturer", "Strength"],
      ...filteredMyProducts.map((product) => [
        product.name,
        product.category,
        String(product.price),
        String(product.stock),
        product.status,
        product.manufacturer,
        product.strength,
      ]),
    ];
    const csv = csvRows
      .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const url = URL.createObjectURL(new Blob([csv], { type: "text/csv;charset=utf-8;" }));
    const link = document.createElement("a");
    link.href = url;
    link.download = "wholesaler-products.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      <main className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
          <TabsList className="grid h-auto w-full grid-cols-2 rounded-xl bg-slate-100 p-1 shadow-sm md:max-w-2xl">
            <TabsTrigger
              value="gallery"
              className="gap-2 rounded-lg bg-white py-2.5 text-slate-600 hover:bg-slate-50 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:shadow-none"
            >
              <Package className="h-4 w-4" />
              HLS Gallery
            </TabsTrigger>
            <TabsTrigger
              value="products"
              className="gap-2 rounded-lg bg-white py-2.5 text-slate-600 hover:bg-slate-50 data-[state=active]:bg-emerald-600 data-[state=active]:text-white data-[state=active]:shadow-sm data-[state=inactive]:shadow-none"
            >
              <Pill className="h-4 w-4" />
              My Products
            </TabsTrigger>
          </TabsList>

          <TabsContent value="gallery" className="mt-6 space-y-4">
            <Card className="rounded-lg border bg-white p-4 shadow-sm">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div className="relative w-full lg:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                  <Input
                    value={galleryQuery}
                    onChange={(event) => setGalleryQuery(event.target.value)}
                    placeholder="Search product, category, or brand"
                    className="pl-9"
                  />
                </div>
              </div>
            </Card>

            {galleryLoading ? (
              <div className="flex min-h-[320px] items-center justify-center rounded-lg border bg-white">
                <LoadingSpinner className="text-emerald-600" />
              </div>
            ) : visibleGalleryProducts.length ? (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
                {visibleGalleryProducts.map((product) => (
                  <Card key={product.id} className="flex min-h-[270px] flex-col overflow-hidden rounded-lg border-slate-200 bg-white">
                    <div className="flex h-40 w-full items-center justify-center border-b bg-emerald-50/40 p-3">
                      {product.imageUrl ? (
                        <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                      ) : (
                        <ImageIcon className="h-9 w-9 text-slate-300" />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col gap-0 p-3">
                      <div>
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger asChild>
                              <h3 className="line-clamp-1 cursor-help text-sm font-semibold text-slate-950">{product.name}</h3>
                            </TooltipTrigger>
                            <TooltipContent>{product.name}</TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
                      <div className="mt-auto space-y-2">
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={prices[product.id] ?? ""}
                          onChange={(event) => setPrices((prev) => ({ ...prev, [product.id]: event.target.value }))}
                          placeholder="Wholesale price"
                          className="h-8 px-2 py-1 text-xs"
                        />
                        <Button
                          type="button"
                          className="h-8 w-full bg-emerald-600 px-3 py-1 text-xs hover:bg-emerald-700"
                          disabled={savingId === product.id}
                          onClick={() => savePrice(product)}
                        >
                          {savingId === product.id ? <LoadingSpinner className="mr-2" /> : <Save className="mr-2 h-4 w-4" />}
                          Save Price
                        </Button>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="rounded-lg bg-white p-8 text-center text-sm text-slate-500">No products found.</Card>
            )}

            <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
              <span>
                Showing {visibleGalleryProducts.length} of {galleryMeta.total} products. Page {galleryMeta.page} of {galleryMeta.totalPages || 1}.
              </span>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!galleryMeta.hasPrevPage || galleryLoading}
                  onClick={() => setGalleryPage((prev) => Math.max(1, prev - 1))}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={!galleryMeta.hasNextPage || galleryLoading}
                  onClick={() => setGalleryPage((prev) => prev + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="products" className="mt-6">
            <Card className="overflow-hidden border-0 bg-transparent shadow-none sm:border sm:bg-white sm:shadow-sm">
              <div className="flex flex-row items-center justify-between gap-3 border-b bg-white p-4">
                <div className="relative min-w-0 flex-1 sm:max-w-md">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
                  <Input
                    placeholder="Search medications..."
                    className="h-11 rounded-xl border-gray-200 bg-gray-100 pl-10 transition-colors focus:bg-white sm:h-10 sm:rounded-lg"
                    value={myProductsQuery}
                    onChange={(event) => setMyProductsQuery(event.target.value)}
                  />
                </div>

                <div className="flex shrink-0 items-center gap-2">
                  <div className="relative">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Filter"
                      onClick={() => setShowProductFilters((value) => !value)}
                      className="h-11 w-11 rounded-xl border-gray-200 bg-white sm:h-10 sm:w-10 sm:rounded-lg"
                    >
                      <Filter className="h-4 w-4" />
                    </Button>

                    {showProductFilters && (
                      <div className="absolute right-0 top-12 z-20 w-56 space-y-3 rounded-xl border border-slate-200 bg-white p-3 shadow-lg">
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Category</p>
                          <div className="max-h-44 space-y-1 overflow-y-auto">
                            {categories.map((category) => (
                              <button
                                key={category}
                                type="button"
                                onClick={() => setCategoryFilter(category)}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                                  categoryFilter === category
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {category}
                              </button>
                            ))}
                          </div>
                        </div>
                        <div>
                          <p className="mb-2 text-xs font-semibold uppercase text-slate-500">Status</p>
                          <div className="space-y-1">
                            {["All", "Active", "Low Stock", "Out of Stock"].map((status) => (
                              <button
                                key={status}
                                type="button"
                                onClick={() => {
                                  setStatusFilter(status);
                                  setShowProductFilters(false);
                                }}
                                className={`w-full rounded-lg px-3 py-2 text-left text-sm font-medium transition ${
                                  statusFilter === status
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "text-slate-700 hover:bg-slate-50"
                                }`}
                              >
                                {status}
                              </button>
                            ))}
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    aria-label="Export"
                    onClick={exportMyProducts}
                    className="h-11 w-11 rounded-xl border-gray-200 bg-white sm:h-10 sm:w-10 sm:rounded-lg"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Link to="/wholesaler/add-product" className="shrink-0" aria-label="Add product">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      aria-label="Add product"
                      className="h-11 w-11 rounded-xl border-gray-200 bg-white sm:h-10 sm:w-10 sm:rounded-lg"
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </Link>
                </div>
              </div>

              <div className="hidden overflow-x-auto bg-white md:block">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-12">ID</TableHead>
                      <TableHead className="w-16">Image</TableHead>
                      <TableHead>Name</TableHead>
                      <TableHead>Category</TableHead>
                      <TableHead>Price</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Manufacturer</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead className="text-right">Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {myProductsLoading ? (
                      Array.from({ length: 5 }).map((_, index) => (
                        <TableRow key={index}>
                          <TableCell><Skeleton className="h-4 w-8" /></TableCell>
                          <TableCell><Skeleton className="h-10 w-10 rounded" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-36" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-20" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-12" /></TableCell>
                          <TableCell><Skeleton className="h-4 w-24" /></TableCell>
                          <TableCell><Skeleton className="h-6 w-24 rounded-full" /></TableCell>
                          <TableCell><Skeleton className="ml-auto h-8 w-24 rounded-full" /></TableCell>
                        </TableRow>
                      ))
                    ) : filteredMyProducts.length ? (
                      filteredMyProducts.map((product) => (
                        <TableRow key={product.id}>
                          <TableCell className="font-medium">{product.id}</TableCell>
                          <TableCell>
                            <img src={product.image} alt={product.name} className="h-10 w-10 rounded object-cover" />
                          </TableCell>
                          <TableCell className="font-medium text-gray-900">{product.name}</TableCell>
                          <TableCell>{product.category}</TableCell>
                          <TableCell className="font-medium">{formatCurrency(product.price)}</TableCell>
                          <TableCell>{product.stock}</TableCell>
                          <TableCell>{product.manufacturer}</TableCell>
                          <TableCell>
                            <Badge variant="outline" className={`w-fit ${getStatusColor(product.status)}`}>
                              {getStatusIcon(product.status)}
                              {product.status}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button variant="ghost" size="icon" className="h-8 w-8" type="button" onClick={() => viewProduct(product)}>
                                <Eye className="h-4 w-4" />
                              </Button>
                              <Button variant="ghost" size="icon" className="h-8 w-8" type="button" onClick={() => editProduct(product)}>
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button
                                variant="ghost"
                                size="icon"
                                className="h-8 w-8 text-red-500"
                                type="button"
                                disabled={deletingProductId === product.id}
                                onClick={() => deleteProduct(product)}
                              >
                                {deletingProductId === product.id ? <LoadingSpinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={9} className="py-8 text-center text-gray-500">
                          No products found. Try adjusting your search.
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="space-y-2 px-2 pb-2 pt-[2px] md:hidden">
                {myProductsLoading ? (
                  Array.from({ length: 4 }).map((_, index) => (
                    <div key={index} className="rounded-xl bg-white p-4 shadow-sm">
                      <div className="flex items-center gap-3">
                        <Skeleton className="h-14 w-14 rounded-lg" />
                        <div className="flex-1">
                          <Skeleton className="mx-auto mb-2 h-4 w-32" />
                          <Skeleton className="mx-auto h-3 w-24" />
                        </div>
                        <Skeleton className="h-4 w-16" />
                      </div>
                    </div>
                  ))
                ) : filteredMyProducts.length ? (
                  <Accordion type="single" collapsible className="w-full space-y-2">
                    {filteredMyProducts.map((product) => (
                      <AccordionItem key={product.id} value={`product-${product.id}`} className="overflow-hidden rounded-xl border-0 bg-white shadow-sm">
                        <AccordionTrigger className="px-4 py-4 transition-colors hover:bg-gray-50 hover:no-underline">
                          <div className="flex w-full items-center justify-between gap-3">
                            <div className="flex min-w-0 flex-1 items-center gap-3">
                              <div className="relative flex-shrink-0">
                                <img
                                  src={product.image}
                                  alt={product.name}
                                  className="h-14 w-14 rounded-lg border border-gray-100 object-cover shadow-sm"
                                />
                                {product.stock <= 10 && (
                                  <span className="absolute -right-1 -top-1 flex h-3 w-3">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75" />
                                    <span className="relative inline-flex h-3 w-3 rounded-full bg-red-500" />
                                  </span>
                                )}
                              </div>

                              <div className="flex min-w-0 flex-1 flex-col items-center justify-center text-center">
                                <p className="truncate text-base font-bold text-gray-900">{product.name}</p>
                                <span className="font-semibold text-gray-500">
                                  {product.manufacturer ? ` (${product.manufacturer})` : ""}
                                </span>
                              </div>
                            </div>

                            <div className="flex-shrink-0 text-right">
                              <p className="text-sm font-bold text-emerald-600">{formatCurrency(product.price)}</p>
                            </div>
                          </div>
                        </AccordionTrigger>
                        <AccordionContent className="bg-white px-4 pb-4">
                          <div className="space-y-4 pt-2">
                            <div className="rounded-xl border border-slate-200 bg-gray-50/60 p-4 text-sm">
                              <div className="flex items-center justify-between gap-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Manufacturer</p>
                                <p className="max-w-[60%] truncate text-right font-bold text-gray-900">{product.manufacturer}</p>
                              </div>
                              <div className="my-3 h-px bg-slate-200/70" />
                              <div className="flex items-center justify-between gap-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stock Qty</p>
                                <p className={`font-bold ${product.stock <= 10 ? "text-red-600" : "text-gray-900"}`}>
                                  {product.stock <= 10 ? product.status : product.stock}
                                </p>
                              </div>
                              <div className="my-3 h-px bg-slate-200/70" />
                              <div className="flex items-center justify-between gap-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Status</p>
                                <div className="pt-0.5">
                                  <Badge variant="outline" className={`w-fit ${getStatusColor(product.status)}`}>
                                    {getStatusIcon(product.status)}
                                    {product.status}
                                  </Badge>
                                </div>
                              </div>
                              <div className="my-3 h-px bg-slate-200/70" />
                              <div className="flex items-center justify-between gap-6">
                                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Expiry Date</p>
                                <p className="max-w-[60%] truncate text-right font-bold text-gray-900">{product.expiryDate || "N/A"}</p>
                              </div>
                              {product.strength && (
                                <>
                                  <div className="my-3 h-px bg-slate-200/70" />
                                  <div className="flex items-center justify-between gap-6">
                                    <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Strength</p>
                                    <p className="max-w-[60%] truncate text-right font-bold text-gray-900">{product.strength}</p>
                                  </div>
                                </>
                              )}
                            </div>

                            <div className="flex gap-2 pt-2">
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 flex-1 rounded-full border-gray-200"
                                type="button"
                                onClick={() => viewProduct(product)}
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                View
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 flex-1 rounded-full border-gray-200"
                                type="button"
                                onClick={() => editProduct(product)}
                              >
                                <Edit className="mr-2 h-4 w-4" />
                                Edit
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                className="h-10 w-12 rounded-full border-red-100 text-red-500 transition-colors hover:bg-red-50 hover:text-red-600"
                                type="button"
                                disabled={deletingProductId === product.id}
                                onClick={() => deleteProduct(product)}
                              >
                                {deletingProductId === product.id ? <LoadingSpinner className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                ) : (
                  <div className="rounded-xl bg-white p-8 text-center shadow-sm">
                    <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-50">
                      <Search className="h-8 w-8 text-gray-300" />
                    </div>
                    <p className="font-medium text-gray-500">No products found</p>
                    <p className="mt-1 text-sm text-gray-400">Try adjusting your search filters</p>
                    <Link to="/wholesaler/add-product" className="mt-4 inline-flex">
                      <Button size="sm" className="flex h-9 items-center gap-2 px-4 shadow-sm">
                        <Plus className="h-4 w-4" />
                        <span>Add Product</span>
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </main>

      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>{selectedProduct?.name}</DialogTitle>
            <DialogDescription>{selectedProduct?.manufacturer || selectedProduct?.category || "Product details"}</DialogDescription>
          </DialogHeader>

          {selectedProduct && (
            <div className="space-y-6">
              <div className="flex flex-col gap-5 sm:flex-row">
                <div className="flex justify-center sm:block">
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                    className="h-32 w-32 rounded-lg border border-gray-100 object-cover shadow-sm"
                  />
                </div>
                <div className="grid flex-1 grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <p className="font-medium text-gray-500">Price</p>
                    <p className="font-semibold text-gray-900">{formatCurrency(selectedProduct.price)}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Stock</p>
                    <p className="font-semibold text-gray-900">{selectedProduct.stock}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Category</p>
                    <p className="font-semibold text-gray-900">{selectedProduct.category}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Strength</p>
                    <p className="font-semibold text-gray-900">{selectedProduct.strength || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Expiry Date</p>
                    <p className="font-semibold text-gray-900">{selectedProduct.expiryDate || "N/A"}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Manufacturer</p>
                    <p className="font-semibold text-gray-900">{selectedProduct.manufacturer}</p>
                  </div>
                  <div>
                    <p className="font-medium text-gray-500">Status</p>
                    <Badge variant="outline" className={`mt-1 w-fit ${getStatusColor(selectedProduct.status)}`}>
                      {getStatusIcon(selectedProduct.status)}
                      {selectedProduct.status}
                    </Badge>
                  </div>
                </div>
              </div>

              {selectedProduct.description && (
                <div className="rounded-xl border border-slate-200 bg-gray-50/70 p-4">
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Description</p>
                  <p className="text-sm leading-6 text-gray-700">{selectedProduct.description}</p>
                </div>
              )}

              <DialogFooter className="gap-2 sm:justify-between">
                <Button variant="outline" type="button" onClick={() => setSelectedProduct(null)}>
                  Close
                </Button>
                <div className="flex gap-2">
                  <Button type="button" variant="outline" onClick={() => editProduct(selectedProduct)}>
                    <Edit className="mr-2 h-4 w-4" />
                    Edit
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-100 text-red-500 hover:bg-red-50 hover:text-red-600"
                    disabled={deletingProductId === selectedProduct.id}
                    onClick={() => deleteProduct(selectedProduct)}
                  >
                    {deletingProductId === selectedProduct.id ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <Trash2 className="mr-2 h-4 w-4" />}
                    Delete
                  </Button>
                </div>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(editingProduct)} onOpenChange={(open) => !open && closeProductDialog()}>
        <DialogContent className="max-h-[90vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle>Edit Product</DialogTitle>
            <DialogDescription>Update the details attached to your wholesaler product.</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Brand Name</label>
                <Input value={productForm.brandName} onChange={(event) => updateProductForm("brandName", event.target.value)} />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Manufacturer</label>
                <Input value={productForm.manufacturer} onChange={(event) => updateProductForm("manufacturer", event.target.value)} />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Expiry Date</label>
                <Input
                  type="date"
                  value={productForm.expiryDate}
                  onChange={(event) => updateProductForm("expiryDate", event.target.value)}
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Price</label>
                <Input
                  type="number"
                  min="0"
                  step="0.01"
                  value={productForm.price}
                  onChange={(event) => updateProductForm("price", event.target.value)}
                />
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Stock</label>
                <Input
                  type="number"
                  min="0"
                  step="1"
                  value={productForm.stock}
                  onChange={(event) => updateProductForm("stock", event.target.value)}
                  placeholder="Optional"
                />
              </div>
              <div>
                <label className="mb-2 block text-sm font-medium text-gray-700">Strength</label>
                <Input
                  value={productForm.strength}
                  onChange={(event) => updateProductForm("strength", event.target.value)}
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="mb-2 block text-sm font-medium text-gray-700">Image</label>
              <div className="rounded-lg border border-dashed border-slate-300 p-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
                  {productForm.imageUrl ? (
                    <img src={productForm.imageUrl} alt={productForm.brandName || "Product"} className="h-24 w-24 rounded-lg border object-cover" />
                  ) : (
                    <div className="flex h-24 w-24 items-center justify-center rounded-lg bg-slate-100">
                      <ImageIcon className="h-8 w-8 text-slate-400" />
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">
                      {productImageFile ? productImageFile.name : "Upload product picture"}
                    </p>
                    <p className="mt-1 text-xs text-slate-500">JPG or PNG. The uploaded Cloudinary URL will be saved to the database.</p>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-3 gap-2"
                      onClick={() => document.getElementById("wholesalerEditProductImage")?.click()}
                    >
                      <Upload className="h-4 w-4" />
                      Upload Picture
                    </Button>
                    <input
                      id="wholesalerEditProductImage"
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) return;
                        setProductImageFile(file);
                        updateProductForm("imageUrl", URL.createObjectURL(file));
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="gap-2">
            <Button variant="outline" type="button" onClick={closeProductDialog}>
              Cancel
            </Button>
            <Button type="button" disabled={isSavingProduct} onClick={saveProductEdit}>
              {isSavingProduct ? <LoadingSpinner className="mr-2 h-4 w-4" /> : <Save className="mr-2 h-4 w-4" />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WholesalerHomepage;
