import React, { useEffect, useMemo, useState } from "react";
import { toast } from "react-toastify";
import { ImageIcon, PackagePlus, Search, Save, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useStore } from "@/store/useStore";
import { getApiErrorMessage } from "@/utils/apiError";
import {
  wholesalerService,
  type WholesalerProductPayload,
  type WholesalerSupplement,
} from "@/services/wholesalerService";

const PRODUCTS_PER_PAGE = 100;

const emptyForm = {
  name: "",
  description: "",
  price: "",
  stock: "",
  imageUrl: "",
  category: "",
  manufacturer: "",
  strength: "",
  dosageForm: "",
  budgetRange: "",
  expiryDate: "",
  tags: "",
};

const WholesalerGalleryPage: React.FC = () => {
  const { user } = useStore();
  const [products, setProducts] = useState<WholesalerSupplement[]>([]);
  const [meta, setMeta] = useState({
    total: 0,
    page: 1,
    limit: PRODUCTS_PER_PAGE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<number | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<WholesalerSupplement | null>(null);
  const [prices, setPrices] = useState<Record<number, string>>({});
  const [contacts, setContacts] = useState<Record<number, string>>({});
  const [addresses, setAddresses] = useState<Record<number, string>>({});
  const [formData, setFormData] = useState(emptyForm);
  const [creating, setCreating] = useState(false);

  const currentUserId = Number(user?.id || 0);

  const loadGallery = async (nextPage = page) => {
    setLoading(true);
    try {
      const result = await wholesalerService.getGallery(nextPage, PRODUCTS_PER_PAGE);
      const supplements = result?.supplements ?? [];
      setProducts(supplements);
      setMeta(result?.meta ?? meta);

      const nextPrices: Record<number, string> = {};
      const nextContacts: Record<number, string> = {};
      const nextAddresses: Record<number, string> = {};

      supplements.forEach((product) => {
        const myOffer = product.wholesalers?.find((item) => Number(item.wholesalerUserId) === currentUserId);
        if (myOffer?.price) nextPrices[product.id] = String(myOffer.price);
        if (myOffer?.contact) nextContacts[product.id] = myOffer.contact;
        if (myOffer?.address) nextAddresses[product.id] = myOffer.address;
      });

      setPrices(nextPrices);
      setContacts(nextContacts);
      setAddresses(nextAddresses);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to load wholesaler gallery"));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadGallery(page);
  }, [page]);

  const visibleProducts = useMemo(() => {
    const search = query.trim().toLowerCase();
    if (!search) return products;
    return products.filter((product) => {
      return [product.name, product.description, product.category, product.manufacturer]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(search));
    });
  }, [products, query]);

  const updateFormField = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

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
        contact: contacts[product.id],
        address: addresses[product.id],
      });
      toast.success("Wholesale price saved");
      await loadGallery(page);
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to save price"));
    } finally {
      setSavingId(null);
    }
  };

  const createProduct = async (event: React.FormEvent) => {
    event.preventDefault();

    const price = Number(formData.price);
    const stock = Number(formData.stock);
    if (!formData.name.trim() || !formData.description.trim() || !Number.isFinite(price) || price <= 0 || !Number.isFinite(stock) || stock < 0) {
      toast.error("Enter product name, description, price, and stock");
      return;
    }

    const tags = formData.tags
      ? {
          hls_factors: formData.tags
            .split(",")
            .map((tag) => tag.trim())
            .filter(Boolean),
        }
      : undefined;

    const payload: WholesalerProductPayload = {
      name: formData.name.trim(),
      description: formData.description.trim(),
      price,
      stock,
      imageUrl: formData.imageUrl.trim() || null,
      category: formData.category.trim() || null,
      manufacturer: formData.manufacturer.trim() || null,
      strength: formData.strength.trim() || null,
      dosageForm: formData.dosageForm.trim() || null,
      budgetRange: formData.budgetRange.trim() || null,
      expiryDate: formData.expiryDate || null,
      tags,
      status: stock > 0 ? "in_stock" : "out_of_stock",
    };

    setCreating(true);
    try {
      await wholesalerService.createProduct(payload);
      setFormData(emptyForm);
      toast.success("Product added to your wholesaler products");
    } catch (error) {
      toast.error(getApiErrorMessage(error, "Failed to create product"));
    } finally {
      setCreating(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 pb-16">
      <div className="border-b bg-white">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-6 sm:px-6 lg:px-8">
          <div>
            <h1 className="text-2xl font-bold text-slate-950">HLS Product Gallery</h1>
            <p className="mt-1 text-sm text-slate-500">
              Add your wholesale prices to HLS products, or create a product when it is not listed.
            </p>
          </div>
          <div className="relative max-w-xl">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <Input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search current page by product, category, or brand"
              className="pl-9"
            />
          </div>
        </div>
      </div>

      <main className="mx-auto grid max-w-7xl gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[1fr_360px] lg:px-8">
        <section className="space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-slate-600">
            <span>
              Showing {visibleProducts.length} of {meta.total} products. Page {meta.page} of {meta.totalPages || 1}.
            </span>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" disabled={!meta.hasPrevPage || loading} onClick={() => setPage((prev) => Math.max(1, prev - 1))}>
                Previous
              </Button>
              <Button variant="outline" size="sm" disabled={!meta.hasNextPage || loading} onClick={() => setPage((prev) => prev + 1)}>
                Next
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="flex min-h-[300px] items-center justify-center rounded-xl border bg-white">
              <LoadingSpinner className="text-emerald-600" />
            </div>
          ) : visibleProducts.length ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
              {visibleProducts.map((product) => (
                <Card key={product.id} className="flex min-h-[360px] flex-col overflow-hidden rounded-lg border-slate-200 bg-white">
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(product)}
                    className="flex h-36 w-full items-center justify-center border-b bg-emerald-50/40 p-3"
                  >
                    {product.imageUrl ? (
                      <img src={product.imageUrl} alt={product.name} className="max-h-full max-w-full object-contain" />
                    ) : (
                      <ImageIcon className="h-9 w-9 text-slate-300" />
                    )}
                  </button>
                  <div className="flex flex-1 flex-col gap-3 p-3">
                    <div>
                      <button
                        type="button"
                        onClick={() => setSelectedProduct(product)}
                        className="line-clamp-2 text-left text-sm font-semibold text-slate-950 hover:text-emerald-700"
                      >
                        {product.name}
                      </button>
                      <p className="mt-1 line-clamp-2 text-xs text-slate-500">{product.description}</p>
                    </div>

                    <div className="mt-auto space-y-2">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={prices[product.id] ?? ""}
                        onChange={(event) => setPrices((prev) => ({ ...prev, [product.id]: event.target.value }))}
                        placeholder="Wholesale price"
                      />
                      <Input
                        value={contacts[product.id] ?? ""}
                        onChange={(event) => setContacts((prev) => ({ ...prev, [product.id]: event.target.value }))}
                        placeholder="Contact"
                      />
                      <Button
                        type="button"
                        className="w-full bg-emerald-600 hover:bg-emerald-700"
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
            <div className="rounded-xl border bg-white p-8 text-center text-sm text-slate-500">
              No products found on this page.
            </div>
          )}
        </section>

        <aside>
          <form onSubmit={createProduct} className="sticky top-4 space-y-4 rounded-xl border bg-white p-4 shadow-sm">
            <div className="flex items-center gap-2">
              <PackagePlus className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-semibold text-slate-950">Add Missing Product</h2>
            </div>
            <div className="space-y-3">
              <div>
                <Label htmlFor="name">Product Name</Label>
                <Input id="name" value={formData.name} onChange={(event) => updateFormField("name", event.target.value)} />
              </div>
              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea id="description" value={formData.description} onChange={(event) => updateFormField("description", event.target.value)} rows={4} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="price">Price</Label>
                  <Input id="price" type="number" min="0" step="0.01" value={formData.price} onChange={(event) => updateFormField("price", event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="stock">Stock</Label>
                  <Input id="stock" type="number" min="0" value={formData.stock} onChange={(event) => updateFormField("stock", event.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input id="imageUrl" value={formData.imageUrl} onChange={(event) => updateFormField("imageUrl", event.target.value)} />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="category">Category</Label>
                  <Input id="category" value={formData.category} onChange={(event) => updateFormField("category", event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="manufacturer">Manufacturer</Label>
                  <Input id="manufacturer" value={formData.manufacturer} onChange={(event) => updateFormField("manufacturer", event.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="strength">Strength</Label>
                  <Input id="strength" value={formData.strength} onChange={(event) => updateFormField("strength", event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="dosageForm">Dosage Form</Label>
                  <Input id="dosageForm" value={formData.dosageForm} onChange={(event) => updateFormField("dosageForm", event.target.value)} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label htmlFor="budgetRange">Budget Range</Label>
                  <Input id="budgetRange" value={formData.budgetRange} onChange={(event) => updateFormField("budgetRange", event.target.value)} />
                </div>
                <div>
                  <Label htmlFor="expiryDate">Expiry Date</Label>
                  <Input id="expiryDate" type="date" value={formData.expiryDate} onChange={(event) => updateFormField("expiryDate", event.target.value)} />
                </div>
              </div>
              <div>
                <Label htmlFor="tags">HLS Factors / Tags</Label>
                <Input id="tags" value={formData.tags} onChange={(event) => updateFormField("tags", event.target.value)} placeholder="Immunity, Vitality" />
              </div>
            </div>
            <Button type="submit" className="w-full bg-emerald-600 hover:bg-emerald-700" disabled={creating}>
              {creating && <LoadingSpinner className="mr-2" />}
              Add Product
            </Button>
          </form>
        </aside>
      </main>

      <Dialog open={Boolean(selectedProduct)} onOpenChange={(open) => !open && setSelectedProduct(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <div className="flex items-start justify-between gap-3">
              <div>
                <DialogTitle>{selectedProduct?.name}</DialogTitle>
                <DialogDescription>{selectedProduct?.manufacturer || selectedProduct?.category || "HLS product"}</DialogDescription>
              </div>
              <Button variant="ghost" size="icon" onClick={() => setSelectedProduct(null)}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="grid gap-4 sm:grid-cols-[220px_1fr]">
            <div className="flex h-52 items-center justify-center rounded-lg border bg-emerald-50/40 p-4">
              {selectedProduct?.imageUrl ? (
                <img src={selectedProduct.imageUrl} alt={selectedProduct.name} className="max-h-full max-w-full object-contain" />
              ) : (
                <ImageIcon className="h-12 w-12 text-slate-300" />
              )}
            </div>
            <div className="space-y-3 text-sm text-slate-700">
              <p>{selectedProduct?.description}</p>
              <div className="grid grid-cols-2 gap-3 rounded-lg bg-slate-50 p-3">
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Category</p>
                  <p>{selectedProduct?.category || "Not set"}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">HLS Price</p>
                  <p>NGN {Number(selectedProduct?.price || 0).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Stock</p>
                  <p>{selectedProduct?.stock ?? 0}</p>
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase text-slate-500">Strength</p>
                  <p>{selectedProduct?.strength || "Not set"}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default WholesalerGalleryPage;
