import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { useToast } from "@/components/ui/use-toast";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  FileSpreadsheet,
  Pencil,
  Pill,
  Plus,
  Search,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  budgetRangeOptions,
  dosageFormOptions,
  researcherTagDefinitions,
  type TagCategory,
} from "@/lib/researcher/taxonomy";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import {
  applyClassFilters,
  ClassFilterPopover,
  type AppliedClassFilters,
} from "@/components/researcher/ClassFilterPopover";
import { researcherService } from "@/services/researcherService";
import { canViewWholesaleDetails } from "@/utils/authClaims";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_UPLOAD_PRESET } from "@/config/env";

export function SupplementGallery({ openAddRequest = 0 }: { openAddRequest?: number }) {
  const SHEET_STORAGE_KEY = "researcher.sheet.supplements";
  const GALLERY_STORAGE_KEY = "researcher.gallery.supplements";
  const RECENT_TAGS_KEY = "researcher.filter.recent_tags";
  const LAST_ADD_REQUEST_KEY = "researcher.gallery.last_add_request";
  const RETURN_TAB_KEY = "researcher.gallery.return_tab";
  const SHEET_RETURN_TAB_KEY = "researcher.sheet.return_tab";
  const ADD_ORIGIN_KEY = "researcher.gallery.add_origin";
  const ITEMS_PER_PAGE = 20;

  const [gallerySupplements, setGallerySupplements] = useState<any[]>([]);
  const [selectedSupplements, setSelectedSupplements] = useState<Record<string, boolean>>({});
  const [searchQuery, setSearchQuery] = useState("");
  const [appliedClassFilters, setAppliedClassFilters] = useState<AppliedClassFilters>({});
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [newName, setNewName] = useState("");
  const [newManufacturer, setNewManufacturer] = useState("");
  const [newStrength, setNewStrength] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newPrice, setNewPrice] = useState<string>("");
  const [newTags, setNewTags] = useState<Record<string, string[]>>({});
  const [newExpiryDate, setNewExpiryDate] = useState("");
  const [newImageUrl, setNewImageUrl] = useState<string>("");
  const [newImagePreviewUrl, setNewImagePreviewUrl] = useState<string>("");
  const [isUploadingImage, setIsUploadingImage] = useState(false);
  const [newWholesalers, setNewWholesalers] = useState<
    Array<{ name: string; price: number; contact: string; address: string }>
  >([]);
  const [wholesalerName, setWholesalerName] = useState("");
  const [wholesalerPrice, setWholesalerPrice] = useState<string>("");
  const [wholesalerContact, setWholesalerContact] = useState("");
  const [wholesalerAddress, setWholesalerAddress] = useState("");
  const [tagCategory, setTagCategory] = useState<TagCategory>("hls_factors");
  const [tagValue, setTagValue] = useState<string>("");
  const [tagValueMode, setTagValueMode] = useState<"select" | "custom">("select");
  const [isSavingSupplement, setIsSavingSupplement] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();

  const canEditWholesale = canViewWholesaleDetails();

  const [sheetSupplements, setSheetSupplements] = useState<any[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [verifiedCode, setVerifiedCode] = useState<string>(() => {
    return sessionStorage.getItem("researcherVerifiedBenfekCode") || "";
  });
  const isVerified = !!verifiedCode;
  const sheetStorageKey = verifiedCode ? `${SHEET_STORAGE_KEY}.${verifiedCode}` : SHEET_STORAGE_KEY;

  const inferCategoryFromName = (name: string) => {
    const value = (name || "").toLowerCase();
    if (value.includes("vitamin")) return "Vitamins";
    if (value.includes("omega")) return "Omega / Oils";
    if (value.includes("probiotic")) return "Probiotics";
    if (value.includes("fiber")) return "Digestive Health";
    if (["zinc", "iron", "magnesium", "selenium"].some((v) => value.includes(v))) return "Minerals";
    if (value.includes("coq")) return "Antioxidants";
    return "General";
  };

  const normalizeLoadedCategory = (item: any) => {
    const raw = String(item?.category || "").trim();
    const key = raw.toLowerCase();
    const legacy = new Set([
      "economic pack",
      "doctor's choice",
      "premium offer pack",
      "economic",
      "doctors_choice",
      "premium_offer",
    ]);
    if (!raw || legacy.has(key)) return inferCategoryFromName(String(item?.name || ""));
    return raw;
  };

  const resetForm = () => {
    setEditingId(null);
    setNewName("");
    setNewManufacturer("");
    setNewStrength("");
    setNewDescription("");
    setNewPrice("");
    setNewTags({});
    setNewExpiryDate("");
    setNewImageUrl("");
    setNewImagePreviewUrl("");
    setIsUploadingImage(false);
    setNewWholesalers([]);
    setWholesalerName("");
    setWholesalerPrice("");
    setWholesalerContact("");
    setWholesalerAddress("");
    setTagCategory("hls_factors");
    setTagValue("");
    setTagValueMode("select");
  };

  const uploadImageToCloudinary = async (file: File): Promise<string | null> => {
    try {
      setIsUploadingImage(true);
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
      formData.append("folder", "researcher-supplements");

      const response = await fetch(`https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`, {
        method: "POST",
        body: formData,
      });
      const data = await response.json();

      if (!response.ok || !data.secure_url) {
        throw new Error(data?.error?.message || "Image upload failed");
      }

      return data.secure_url as string;
    } catch (error) {
      console.error("Failed to upload supplement image:", error);
      toast({
        title: "Image upload failed",
        description: "Please try another image or save without an uploaded image.",
        variant: "destructive",
      });
      return null;
    } finally {
      setIsUploadingImage(false);
    }
  };

  const addWholesaler = () => {
    const name = wholesalerName.trim();
    const contact = wholesalerContact.trim();
    const address = wholesalerAddress.trim();
    const price = Number(wholesalerPrice);

    if (!name || !contact || !address || !Number.isFinite(price) || price <= 0) {
      toast({
        title: "Missing wholesaler fields",
        description: "Enter wholesaler name, price, contact, and address.",
        variant: "destructive",
      });
      return;
    }

    setNewWholesalers((prev) => [...prev, { name, price, contact, address }]);
    setWholesalerName("");
    setWholesalerPrice("");
    setWholesalerContact("");
    setWholesalerAddress("");
  };

  const removeWholesaler = (index: number) => {
    setNewWholesalers((prev) => prev.filter((_, i) => i !== index));
  };

  useEffect(() => {
    const syncVerified = () => {
      setVerifiedCode(sessionStorage.getItem("researcherVerifiedBenfekCode") || "");
    };
    window.addEventListener("researcher-benfek-verified", syncVerified);
    window.addEventListener("researcher-benfek-cleared", syncVerified);
    window.addEventListener("storage", syncVerified);
    return () => {
      window.removeEventListener("researcher-benfek-verified", syncVerified);
      window.removeEventListener("researcher-benfek-cleared", syncVerified);
      window.removeEventListener("storage", syncVerified);
    };
  }, []);

  useEffect(() => {
    setGallerySupplements([]);

    const fetchSupplements = async () => {
      try {
        const items = await researcherService.getSupplements({ code: verifiedCode || undefined });
        const fetchedSupplements = Array.isArray(items)
          ? items.map((item: any) => ({
              ...item,
              id: String(item.id),
              category: normalizeLoadedCategory(item),
              tags: item.tags || {},
              source: item.source,
            }))
          : [];
        setGallerySupplements(fetchedSupplements as any);
      } catch (error) {
        console.error("Failed to fetch supplements from backend:", error);
        setGallerySupplements([]);
      }
    };

    fetchSupplements();

    try {
      const raw = localStorage.getItem(sheetStorageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      if (Array.isArray(parsed)) setSheetSupplements(parsed as any);
    } catch {
      setSheetSupplements([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [verifiedCode]);

  useEffect(() => {
    const syncSheet = () => {
      try {
        const raw = localStorage.getItem(sheetStorageKey);
        const parsed = raw ? (JSON.parse(raw) as unknown) : null;
        if (Array.isArray(parsed)) setSheetSupplements(parsed as any);
      } catch { /* ignore */ }
    };
    window.addEventListener("researcher-sheet-updated", syncSheet);
    window.addEventListener("storage", syncSheet);
    return () => {
      window.removeEventListener("researcher-sheet-updated", syncSheet);
      window.removeEventListener("storage", syncSheet);
    };
  }, [sheetStorageKey]);

  useEffect(() => {
    if (!openAddRequest) return;
    const lastHandled = Number(sessionStorage.getItem(LAST_ADD_REQUEST_KEY) || "0");
    if (openAddRequest <= lastHandled) return;
    sessionStorage.setItem(LAST_ADD_REQUEST_KEY, String(openAddRequest));

    // Preserve where the add-flow was triggered from (Select Supplements vs Gallery).
    if (!sessionStorage.getItem(ADD_ORIGIN_KEY)) {
      const hint = sessionStorage.getItem(RETURN_TAB_KEY) || "";
      if (hint) sessionStorage.setItem(ADD_ORIGIN_KEY, hint);
    }

    resetForm();
    setIsAddOpen(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [openAddRequest]);

  const handleCloseAdd = () => {
    setIsAddOpen(false);
    resetForm();

    const returnTab = sessionStorage.getItem(ADD_ORIGIN_KEY) || sessionStorage.getItem(RETURN_TAB_KEY) || "";
    sessionStorage.removeItem(ADD_ORIGIN_KEY);
    sessionStorage.removeItem(RETURN_TAB_KEY);

    const nextTab = returnTab === "supplements" ? "supplements" : "gallery";
    navigate("/researcher", { state: { defaultTab: nextTab }, replace: true });
  };

  useEffect(() => {
    try {
      localStorage.setItem(GALLERY_STORAGE_KEY, JSON.stringify(gallerySupplements));
    } catch {
      // ignore
    }
  }, [gallerySupplements]);

  const sheetIdSet = useMemo(() => new Set(sheetSupplements.map((s) => s.id)), [sheetSupplements]);

  const selectedCount = useMemo(
    () => Object.keys(selectedSupplements).filter((id) => selectedSupplements[id]).length,
    [selectedSupplements]
  );

  const filteredSupplements = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const classFiltered = applyClassFilters(gallerySupplements as any, appliedClassFilters);

    return classFiltered.filter((supplement: any) => {
      if (!query) return true;
      const tagValues = Object.values((supplement.tags || {}) as Record<string, string[]>).flatMap((v) => v || []);
      return (
        String(supplement.name || "").toLowerCase().includes(query) ||
        String(supplement.description || "").toLowerCase().includes(query) ||
        String(supplement.category || "").toLowerCase().includes(query) ||
        String(supplement.manufacturer || "").toLowerCase().includes(query) ||
        tagValues.some((v) => String(v).toLowerCase().includes(query))
      );
    });
  }, [appliedClassFilters, gallerySupplements, searchQuery]);

  const appliedFiltersKey = useMemo(() => JSON.stringify(appliedClassFilters), [appliedClassFilters]);

  useEffect(() => {
    setCurrentPage(1);
  }, [appliedFiltersKey, searchQuery]);

  const totalItems = filteredSupplements.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / ITEMS_PER_PAGE));

  useEffect(() => {
    setCurrentPage((prev) => Math.min(Math.max(1, prev), totalPages));
  }, [totalPages]);

  const pagedSupplements = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filteredSupplements.slice(start, start + ITEMS_PER_PAGE);
  }, [ITEMS_PER_PAGE, currentPage, filteredSupplements]);

  const selectedItems = useMemo(() => {
    return gallerySupplements.filter((supplement) => selectedSupplements[supplement.id]);
  }, [gallerySupplements, selectedSupplements]);

  const handleToggleSelect = (id: string) => {
    if (!isVerified) {
      toast({
        title: "Verify code first",
        description: "Verify a benefek code before selecting supplements for a pack.",
        variant: "destructive",
      });
      return;
    }
    setSelectedSupplements((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleAddNewSupplement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isSavingSupplement || isUploadingImage) return;

    const name = newName.trim();
    const manufacturer = newManufacturer.trim();
    const strength = newStrength.trim();
    const description = newDescription.trim();
    const price = Number(newPrice);

    if (!name || !description || !Number.isFinite(price) || price <= 0) {
      toast({
        title: "Missing fields",
        description: "Enter name, description, and a valid price.",
        variant: "destructive",
      });
      return;
    }

    setIsSavingSupplement(true);

    if (editingId) {
      const updatePayload = {
        name,
        description,
        manufacturer,
        strength,
        imageUrl: newImageUrl || undefined,
        tags: newTags,
        expiryDate: newExpiryDate || undefined,
        price,
        type: "supplement",
        code: verifiedCode,
        ...(canEditWholesale ? { wholesalers: newWholesalers } : {}),
      };
      try {
        const updated = await researcherService.updateSupplement(editingId, updatePayload);
        if (updated) {
          setGallerySupplements((prev) => prev.map((item) => (item.id === editingId ? updated : item)));
        } else {
          throw new Error("No supplement returned");
        }
      } catch {
        setGallerySupplements((prev) =>
          prev.map((item) =>
            item.id === editingId
              ? {
                  ...item,
                  ...updatePayload,
                  imageUrl: newImageUrl || item.imageUrl,
                }
              : item
          )
        );
      } finally {
        setIsSavingSupplement(false);
      }
    } else {
      const tempId = `sup-${Date.now()}`;
      const newSupplement = {
        id: tempId,
        name,
        description,
        manufacturer,
        strength,
        category: inferCategoryFromName(name),
        imageUrl: `https://placehold.co/100x100/6E59A5/FFFFFF?text=${encodeURIComponent(
          name.substring(0, 5)
        )}`,
        ...(newImageUrl ? { imageUrl: newImageUrl } : {}),
        tags: newTags,
        expiryDate: newExpiryDate || undefined,
        price,
        type: "supplement",
        code: verifiedCode,
        ...(canEditWholesale ? { wholesalers: newWholesalers } : {}),
      };

      let addedSupplement = newSupplement;
      try {
        const created = await researcherService.createSupplement({
          name,
          description,
          manufacturer,
          strength,
          imageUrl: newSupplement.imageUrl,
          category: newSupplement.category,
          tags: newTags,
          expiryDate: newExpiryDate || undefined,
          price,
          stock: 0,
          type: "supplement",
          code: verifiedCode,
          ...(canEditWholesale ? { wholesalers: newWholesalers } : {}),
        });

        if (!created) {
          throw new Error("Supplement creation did not return a saved record");
        }

        addedSupplement = {
          ...created,
          id: String((created as any).id),
          category: created.category || newSupplement.category,
          tags: created.tags || newSupplement.tags,
          imageUrl: created.imageUrl || newSupplement.imageUrl,
        };

        setGallerySupplements((prev) => [addedSupplement, ...prev]);
      } catch (error) {
        console.error("Failed to create supplement:", error);
        toast({
          title: "Supplement not saved",
          description: "Unable to save the supplement to the server. It has been removed from the gallery.",
          variant: "destructive",
        });
        setGallerySupplements((prev) => prev.filter((item) => item.id !== tempId));
        setIsSavingSupplement(false);
        return;
      }

      if (sessionStorage.getItem(ADD_ORIGIN_KEY) === "supplements") {
        const targetPackId = localStorage.getItem("researcher.gallery.target_pack");
        if (targetPackId) {
          try {
            localStorage.setItem(
              "researcher.gallery.pending_pack_add",
              JSON.stringify({
                packId: targetPackId,
                supplement: { ...addedSupplement, qty: 1 },
              })
            );
            window.dispatchEvent(new Event("researcher-gallery-pending-add"));
          } catch {
            // ignore write failures
          }
        }
      }
    }

    handleCloseAdd();
    setIsSavingSupplement(false);

    toast({
      title: editingId ? "Supplement updated" : "Supplement added",
      description: editingId
        ? `${name} has been updated.`
        : `${name} has been added to the gallery.`,
    });
  };

  const addTag = () => {
    const value = tagValue.trim();
    if (!value) return;

    const def = researcherTagDefinitions.find((d) => d.id === tagCategory);
    const isCustom = def?.values?.length ? !def.values.includes(value) : true;

    setNewTags((prev) => {
      const existing = prev[tagCategory] || [];
      if (existing.includes(value)) return prev;
      return { ...prev, [tagCategory]: [...existing, value] };
    });

    if (isCustom) {
      try {
        const raw = localStorage.getItem(RECENT_TAGS_KEY);
        const parsed = raw ? (JSON.parse(raw) as unknown) : null;
        const list = Array.isArray(parsed) ? (parsed as string[]) : [];
        const next = [value, ...list.filter((v) => v !== value)].slice(0, 60);
        localStorage.setItem(RECENT_TAGS_KEY, JSON.stringify(next));
      } catch {
        // ignore
      }
    }

    setTagValue("");
    setTagValueMode("select");
  };

  const removeTag = (category: string, value: string) => {
    setNewTags((prev) => {
      const existing = prev[category] || [];
      const next = existing.filter((v) => v !== value);
      const out = { ...prev };
      if (next.length) out[category] = next;
      else delete out[category];
      return out;
    });
  };

  const openEdit = (supplementId: string) => {
    const item = gallerySupplements.find((s) => s.id === supplementId);
    if (!item) return;

    sessionStorage.setItem(ADD_ORIGIN_KEY, "gallery");
    setEditingId(item.id);
    setNewName(item.name);
    setNewManufacturer(item.manufacturer || "");
    setNewStrength(String((item as any).strength || ""));
    setNewDescription(item.description);
    setNewPrice(String(item.price));
    
    const tags = { ...(item.tags || {}) };
    if (item.dosageForm && !tags.dosage_form) tags.dosage_form = [item.dosageForm];
    if (item.budgetRange && !tags.budget_range) tags.budget_range = [item.budgetRange];
    setNewTags(tags);
    setNewExpiryDate(item.expiryDate || "");
    setNewImageUrl(item.imageUrl || "");
    setNewImagePreviewUrl(item.imageUrl || "");
    setNewWholesalers(Array.isArray((item as any).wholesalers) ? (item as any).wholesalers : []);
    setWholesalerName("");
    setWholesalerPrice("");
    setWholesalerContact("");
    setWholesalerAddress("");
    setTagValue("");
    setTagValueMode("select");
    setIsAddOpen(true);
  };

  const handleOpenSelected = () => {
    if (!isVerified) {
      toast({
        title: "Verify code first",
        description: "Verify a benefek code before opening the worksheet.",
        variant: "destructive",
      });
      return;
    }
    if (selectedItems.length === 0 && sheetSupplements.length === 0) {
      toast({
        title: "No supplements selected",
        description: "Select at least one supplement first.",
        variant: "destructive",
      });
      return;
    }

    const merged = new Map<string, any>();
    sheetSupplements.forEach((item) => merged.set(item.id, item));
    selectedItems.forEach((item) => merged.set(item.id, item));
    const nextSheet = Array.from(merged.values());

    const targetPackId = localStorage.getItem("researcher.gallery.target_pack") || undefined;

    setSheetSupplements(nextSheet);
    try {
      localStorage.setItem(sheetStorageKey, JSON.stringify(nextSheet));
    } catch {
      // ignore
    }

    // Clear the current gallery selection now that it's in the sheet.
    if (selectedItems.length) setSelectedSupplements({});

    sessionStorage.setItem(SHEET_RETURN_TAB_KEY, "gallery");
    navigate("/researcher/gallery/selected", {
      state: {
        selectedSupplements: nextSheet,
        returnTab: "gallery",
        targetPackId,
      },
    });
  };

  return (
    <div className="animate-fade-in p-1 sm:p-3">
      {/* <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-researcher-primary">Supplement Gallery</h2>
        // <p className="text-muted-foreground">Select supplements to add to your packs</p>
      </div> */}

      <div className="sticky top-[132px] z-30 bg-white border-b border-researcher-border/70 -mx-1 sm:-mx-3 mb-4 shadow-sm">
        <div className="container px-2 sm:px-4 py-3">
          <div className="flex flex-row items-center gap-2 w-full sm:max-w-3xl mx-auto">
            <div className="relative flex-1 min-w-0">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <Input
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search supplements..."
                className="pl-10"
              />
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Open selected supplements"
                onClick={handleOpenSelected}
                disabled={!isVerified || (selectedCount === 0 && sheetSupplements.length === 0)}
                className="border-researcher-border bg-white"
              >
                <FileSpreadsheet className="h-4 w-4 text-researcher-primary" />
              </Button>

              <ClassFilterPopover
                items={gallerySupplements as any}
                appliedFilters={appliedClassFilters}
                onChangeAppliedFilters={setAppliedClassFilters}
              />

              <Button
                type="button"
                variant="outline"
                size="icon"
                aria-label="Add new supplement"
                onClick={() => {
                  sessionStorage.setItem(ADD_ORIGIN_KEY, "gallery");
                  sessionStorage.setItem(RETURN_TAB_KEY, "gallery");
                  resetForm();
                  setIsAddOpen(true);
                }}
                className="border-researcher-border bg-white"
              >
                <span className="relative">
                  <Pill className="h-4 w-4 text-researcher-primary -rotate-45" />
                  <Plus className="absolute -right-3 -top-2 h-3 w-3 text-researcher-primary" />
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className="supplement-grid mt-6">
        {pagedSupplements.map((supplement) => (
          <Card
            key={supplement.id}
            className={`${
              selectedSupplements[supplement.id] ? "ring-2 ring-researcher-primary" : ""
            } ${sheetIdSet.has(supplement.id) ? "opacity-45 grayscale" : "hover:shadow-md cursor-pointer"} transition-shadow`}
            onClick={() => {
              if (sheetIdSet.has(supplement.id)) return;
              handleToggleSelect(supplement.id);
            }}
          >
            <CardContent className="p-2 pb-1 text-center">
              <div className="relative mb-1">
                <img
                  src={supplement.imageUrl}
                  alt={supplement.name}
                  className="w-full h-24 sm:h-28 rounded object-cover"
                />
                <Checkbox
                  checked={!!selectedSupplements[supplement.id]}
                  disabled={sheetIdSet.has(supplement.id)}
                  className="absolute top-1 right-1 h-5 w-5 bg-white"
                  onCheckedChange={() => handleToggleSelect(supplement.id)}
                />
              </div>
          bbbbbb    <h3 className="font-medium mt-2 text-xs">{supplement.name}</h3>
              <div className="mt-0.5 flex items-center justify-center gap-2">
                <p className="text-xs font-medium">₦{supplement.price.toLocaleString()}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-4 w-4 text-researcher-primary hover:bg-researcher-muted"
                  onClick={(event) => {
                    event.stopPropagation();
                    openEdit(supplement.id);
                  }}
                  aria-label="Edit supplement"
                >
                  <Pencil className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
            <CardFooter className="p-1 pt-0">
              <p className="text-xs text-muted-foreground truncate w-full">
                {supplement.manufacturer || "Unknown manufacturer"}
              </p>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-sm text-slate-600">
        <p className="w-full sm:w-auto text-center sm:text-left">
          Showing{" "}
          {totalItems === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
          {Math.min(currentPage * ITEMS_PER_PAGE, totalItems)} of {totalItems}
        </p>

        {totalPages > 1 ? (
          <div className="flex items-center gap-1 flex-wrap justify-center">
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-white border-researcher-border"
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              aria-label="First page"
            >
              <ChevronsLeft className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-white border-researcher-border"
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              aria-label="Previous page"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            {([currentPage - 1, currentPage, currentPage + 1] as const)
              .filter((p) => p >= 1 && p <= totalPages)
              .map((p) => (
                <Button
                  key={p}
                  type="button"
                  variant={p === currentPage ? "default" : "outline"}
                  size="icon"
                  className={`h-9 w-9 ${p === currentPage ? "" : "bg-white border-researcher-border"}`}
                  onClick={() => setCurrentPage(p)}
                  aria-label={`Page ${p}`}
                >
                  {p}
                </Button>
              ))}

            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-white border-researcher-border"
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              aria-label="Next page"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              className="h-9 w-9 bg-white border-researcher-border"
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              aria-label="Last page"
            >
              <ChevronsRight className="h-4 w-4" />
            </Button>
          </div>
        ) : null}
      </div>

      <Dialog
        open={isAddOpen}
        onOpenChange={(nextOpen) => {
          if (!nextOpen) {
            handleCloseAdd();
            return;
          }
          setIsAddOpen(true);
        }}
      >
        <DialogContent className="sm:max-w-[520px] p-0">
          <div className="flex max-h-[min(80vh,42rem)] flex-col overflow-hidden">
            <div className="flex items-center justify-between gap-3 border-b bg-white px-4 py-3">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  handleCloseAdd();
                }}
                className="gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>
              <div className="min-w-0 text-center">
                <DialogTitle className="truncate">{editingId ? "Edit Supplement" : "Add Supplement"}</DialogTitle>
                <DialogDescription className="truncate">
                  {editingId ? "Update supplement details." : "Create a new supplement in the gallery."}
                </DialogDescription>
              </div>
              <div className="w-[64px]" aria-hidden="true" />
            </div>

            <form onSubmit={handleAddNewSupplement} className="flex min-h-0 flex-1 flex-col">
              <div className="min-h-0 flex-1 overflow-y-auto px-4 py-4 space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="new-supplement-name">Supplement name</Label>
                  <Input
                    id="new-supplement-name"
                    value={newName}
                    onChange={(e) => setNewName(e.target.value)}
                    placeholder="e.g. Vitamin K2"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-supplement-manufacturer">Brand / manufacturer</Label>
                  <Input
                    id="new-supplement-manufacturer"
                    value={newManufacturer}
                    onChange={(e) => setNewManufacturer(e.target.value)}
                    placeholder="e.g. NatureMade"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-supplement-strength">Strength</Label>
                  <Input
                    id="new-supplement-strength"
                    value={newStrength}
                    onChange={(e) => setNewStrength(e.target.value)}
                    placeholder="mg"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-supplement-expiry">Expiry Date</Label>
                  <Input
                    id="new-supplement-expiry"
                    type="date"
                    value={newExpiryDate}
                    onChange={(e) => setNewExpiryDate(e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-supplement-desc">Description</Label>
                  <Textarea
                    id="new-supplement-desc"
                    value={newDescription}
                    onChange={(e) => setNewDescription(e.target.value)}
                    placeholder="Enter a brief description"
                  />
                </div>

                <div className="space-y-2">
                  <Label>Tags</Label>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <select
                      className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-researcher-primary focus:border-researcher-primary bg-white"
                      value={tagCategory}
                      onChange={(e) => {
                        setTagCategory(e.target.value as TagCategory);
                        setTagValue("");
                        setTagValueMode("select");
                      }}
                    >
                      {researcherTagDefinitions.map((def) => (
                        <option key={def.id} value={def.id}>
                          {def.label}
                        </option>
                      ))}
                      <option value="dosage_form">Dosage Form</option>
                      <option value="budget_range">Budget Range</option>
                      <option value="pack_quantity">Pack Quantity</option>
                    </select>

                    <div className="flex gap-2">
                      {(() => {
                        const def = researcherTagDefinitions.find((d) => d.id === tagCategory);
                        let options: string[] = [];
                        if (tagCategory === ("dosage_form" as any)) options = dosageFormOptions;
                        else if (tagCategory === ("budget_range" as any)) options = budgetRangeOptions;
                        else if (def?.values) options = def.values;

                        if (options.length > 0) {
                          if (tagValueMode === "custom") {
                            return (
                              <Input
                                value={tagValue}
                                onChange={(e) => setTagValue(e.target.value)}
                                placeholder="Type tag value…"
                                className="flex-1"
                              />
                            );
                          }
                          return (
                            <select
                              className="flex-1 px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-researcher-primary focus:border-researcher-primary bg-white"
                              value={tagValue}
                              onChange={(e) => {
                                const next = e.target.value;
                                if (next === "__custom__") {
                                  setTagValue("");
                                  setTagValueMode("custom");
                                  return;
                                }
                                setTagValue(next);
                                setTagValueMode("select");
                              }}
                            >
                              <option value="">Select…</option>
                              {options.map((v) => (
                                <option key={v} value={v}>
                                  {v}
                                </option>
                              ))}
                              <option value="__custom__">Custom…</option>
                            </select>
                          );
                        }
                        return (
                          <Input
                            value={tagValue}
                            onChange={(e) => setTagValue(e.target.value)}
                            placeholder="Type tag value…"
                            className="flex-1"
                          />
                        );
                      })()}

                      <Button type="button" variant="outline" onClick={addTag} className="shrink-0">
                        Add
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-md border bg-white p-2">
                    <div className="max-h-28 overflow-y-auto flex flex-wrap gap-2">
                      {Object.entries(newTags).flatMap(([category, values]) =>
                        values.map((value) => (
                          <Badge
                            key={`${category}:${value}`}
                            variant="outline"
                            title={value}
                            className="bg-researcher-muted max-w-full whitespace-normal break-words"
                          >
                            <span className="mr-1">{value}</span>
                            <button
                              type="button"
                              className="ml-1 inline-flex"
                              onClick={() => removeTag(category, value)}
                              aria-label="Remove tag"
                            >
                              <X className="h-3 w-3" />
                            </button>
                          </Badge>
                        ))
                      )}
                      {Object.keys(newTags).length === 0 ? (
                        <p className="text-xs text-muted-foreground">No tags added yet.</p>
                      ) : null}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-supplement-image">Image</Label>
                  <Input
                    id="new-supplement-image"
                    type="file"
                    accept="image/*"
                    disabled={isUploadingImage}
                    onChange={async (e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;
                      const reader = new FileReader();
                      reader.onload = () => {
                        if (typeof reader.result === "string") setNewImagePreviewUrl(reader.result);
                      };
                      reader.readAsDataURL(file);
                      const uploadedUrl = await uploadImageToCloudinary(file);
                      if (uploadedUrl) {
                        setNewImageUrl(uploadedUrl);
                        setNewImagePreviewUrl(uploadedUrl);
                      } else {
                        setNewImageUrl("");
                      }
                    }}
                  />
                  {isUploadingImage ? (
                    <div className="mt-2 flex h-36 w-full items-center justify-center rounded-lg border bg-slate-50 text-sm text-slate-600">
                      <LoadingSpinner className="mr-2" />
                      Uploading image...
                    </div>
                  ) : null}
                  {newImagePreviewUrl ? (
                    <img
                      src={newImagePreviewUrl}
                      alt="Supplement preview"
                      className="mt-2 h-36 w-full rounded-lg border object-cover"
                    />
                  ) : null}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="new-supplement-price">Price (₦)</Label>
                  <Input
                    id="new-supplement-price"
                    value={newPrice}
                    onChange={(e) => setNewPrice(e.target.value)}
                    placeholder="e.g. 2500"
                    inputMode="numeric"
                  />
                </div>

                {(
                  <div className="space-y-2 rounded-lg border bg-white p-3">
                    <div className="flex items-center justify-between gap-2">
                      <Label>Wholesaler details</Label>
                      <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                        Checker only
                      </span>
                    </div>

                    {!canEditWholesale ? (
                      <p className="text-xs text-muted-foreground">
                        Sign in as a checker to add/view wholesaler details.
                      </p>
                    ) : null}

                    <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                      <div className="space-y-1.5">
                        <Label htmlFor="wholesaler-name" className="text-xs text-slate-600">
                          Wholesaler name
                        </Label>
                        <Input
                          id="wholesaler-name"
                          value={wholesalerName}
                          onChange={(e) => setWholesalerName(e.target.value)}
                          placeholder="e.g. ACME Pharma"
                          disabled={!canEditWholesale}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="wholesaler-price" className="text-xs text-slate-600">
                          Wholesale price (₦)
                        </Label>
                        <Input
                          id="wholesaler-price"
                          value={wholesalerPrice}
                          onChange={(e) => setWholesalerPrice(e.target.value)}
                          placeholder="e.g. 1800"
                          inputMode="numeric"
                          disabled={!canEditWholesale}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="wholesaler-contact" className="text-xs text-slate-600">
                          Contact details
                        </Label>
                        <Input
                          id="wholesaler-contact"
                          value={wholesalerContact}
                          onChange={(e) => setWholesalerContact(e.target.value)}
                          placeholder="Phone / email"
                          disabled={!canEditWholesale}
                        />
                      </div>
                      <div className="space-y-1.5">
                        <Label htmlFor="wholesaler-address" className="text-xs text-slate-600">
                          Address
                        </Label>
                        <Input
                          id="wholesaler-address"
                          value={wholesalerAddress}
                          onChange={(e) => setWholesalerAddress(e.target.value)}
                          placeholder="Wholesaler address"
                          disabled={!canEditWholesale}
                        />
                      </div>
                    </div>

                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={addWholesaler}
                        disabled={!canEditWholesale}
                      >
                        Add wholesaler
                      </Button>
                    </div>

                    {newWholesalers.length ? (
                      <div className="space-y-2 pt-1">
                        {newWholesalers.map((w, idx) => (
                          <div key={`${w.name}-${idx}`} className="rounded-md border bg-slate-50 px-3 py-2">
                            <div className="flex items-start justify-between gap-3">
                              <div className="min-w-0">
                                <p className="text-sm font-semibold text-slate-900 truncate">{w.name}</p>
                                <p className="text-xs text-slate-600 truncate">{w.contact}</p>
                                <p className="text-xs text-slate-600 truncate">{w.address}</p>
                              </div>
                              <div className="shrink-0 text-right">
                                <p className="text-sm font-bold text-slate-900 tabular-nums">
                                  ₦{Number(w.price || 0).toLocaleString()}
                                </p>
                                <Button
                                  type="button"
                                  variant="ghost"
                                  size="sm"
                                  className="mt-1 h-7 px-2 text-rose-600 hover:text-rose-700"
                                  onClick={() => removeWholesaler(idx)}
                                  disabled={!canEditWholesale}
                                >
                                  Remove
                                </Button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <p className="text-xs text-muted-foreground">No wholesalers added yet.</p>
                    )}
                  </div>
                )}
              </div>

              <div className="border-t bg-white px-4 py-3 flex justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  disabled={isSavingSupplement || isUploadingImage}
                  onClick={() => {
                    handleCloseAdd();
                  }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={isSavingSupplement || isUploadingImage}
                  className="bg-researcher-primary hover:bg-researcher-secondary"
                >
                  {(isSavingSupplement || isUploadingImage) && <LoadingSpinner className="mr-2" />}
                  {isUploadingImage
                    ? "Uploading..."
                    : isSavingSupplement
                      ? editingId
                        ? "Saving..."
                        : "Adding..."
                      : editingId
                        ? "Save"
                        : "Add"}
                </Button>
              </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
