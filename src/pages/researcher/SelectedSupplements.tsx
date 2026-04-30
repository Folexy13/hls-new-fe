import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, Minus, PackagePlus, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { packCategories, type Supplement } from "@/lib/researcher/dummyData";
import { useToast } from "@/components/ui/use-toast";
import { researcherService } from "@/services/researcherService";
import {
  applyClassFilters,
  ClassFilterPopover,
  type AppliedClassFilters,
} from "@/components/researcher/ClassFilterPopover";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { canViewWholesaleDetails } from "@/utils/authClaims";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

type SelectedSupplement = {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer?: string;
  strength?: string;
  dosageForm?: string;
  budgetRange?: string;
  expiryDate?: string;
  stock?: number;
  status?: string;
  wholesalers?: Array<{ name: string; price: number; contact: string; address: string }> | null;
  selectedWholesalerName?: string | null;
  selectedWholesalerPrice?: number | null;
  selectedWholesalerContact?: string | null;
  selectedWholesalerAddress?: string | null;
  forceDispatchWithoutWholesaler?: boolean;
  tags?: Record<string, string[]>;
  qty?: number;
  imageUrl: string;
  price: number;
};

type LocationState = {
  selectedSupplements?: SelectedSupplement[];
  returnTab?: string;
  targetPackId?: string;
};

export default function ResearcherSelectedSupplementsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as LocationState;
  const SHEET_RETURN_TAB_KEY = "researcher.sheet.return_tab";
  const { toast } = useToast();

  const verifiedCode = useMemo(() => sessionStorage.getItem("researcherVerifiedBenfekCode") || "", []);
  const sheetStorageKey = useMemo(
    () => (verifiedCode ? `researcher.sheet.supplements.${verifiedCode}` : "researcher.sheet.supplements"),
    [verifiedCode]
  );
  const packStorageKey = useMemo(
    () => (verifiedCode ? `researcher.pack.supplements.${verifiedCode}` : "researcher.pack.supplements"),
    [verifiedCode]
  );

  const canViewWholesale = canViewWholesaleDetails();

  const [selected, setSelected] = useState<SelectedSupplement[]>(() => {
    const fromState = state.selectedSupplements || [];
    if (fromState.length) return fromState;

    try {
      const raw = localStorage.getItem(sheetStorageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      return Array.isArray(parsed) ? (parsed as SelectedSupplement[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedPackId, setSelectedPackId] = useState<string>(state.targetPackId || localStorage.getItem("researcher.gallery.target_pack") || "");
  const [selectedSheetIds, setSelectedSheetIds] = useState<Record<string, boolean>>({});
  const [appliedClassFilters, setAppliedClassFilters] = useState<AppliedClassFilters>({});
  const [viewingSupplement, setViewingSupplement] = useState<SelectedSupplement | null>(null);
  const [isAddingToPack, setIsAddingToPack] = useState(false);

  useEffect(() => {
    if (verifiedCode) return;
    toast({
      title: "Verify code first",
      description: "Verify a benefek code before using the worksheet.",
      variant: "destructive",
    });
    navigate("/researcher", { state: { defaultTab: "gallery" }, replace: true });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // --- Budget Extraction ---
  const benfekMaxBudget = useMemo(() => {
    try {
      const raw = sessionStorage.getItem("researcherVerifiedBenfek");
      const parsed = raw ? (JSON.parse(raw) as any) : null;
      const quizBudget = Number(parsed?.quiz?.preferences?.budget);
      if (Number.isFinite(quizBudget) && quizBudget > 0) return quizBudget;
      const max = Number(parsed?.budget?.max);
      if (Number.isFinite(max) && max > 0) return max;
      return 0;
    } catch {
      return 0;
    }
  }, [verifiedCode]);

  const selectedPackName = useMemo(() => {
    return packCategories.find((p) => p.id === selectedPackId)?.name || "";
  }, [selectedPackId]);

  useEffect(() => {
    try {
      localStorage.setItem(sheetStorageKey, JSON.stringify(selected));
    } catch {
      // ignore
    }
  }, [selected, sheetStorageKey]);

  const filteredSelected = useMemo(() => {
    return applyClassFilters(selected, appliedClassFilters) as SelectedSupplement[];
  }, [appliedClassFilters, selected]);

  // --- Dynamic Calculation for Checked Items ---
  const selectedForDispatch = useMemo(() => {
    return selected.filter((item) => selectedSheetIds[item.id]);
  }, [selected, selectedSheetIds]);

  const selectedDispatchTotal = useMemo(
    () => selectedForDispatch.reduce((sum, item) => sum + (item.price * (item.qty || 1)), 0),
    [selectedForDispatch]
  );

  const isOverBudget = benfekMaxBudget > 0 && selectedDispatchTotal > benfekMaxBudget;

  const toggleSheetSelection = (id: string) => {
    setSelectedSheetIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleUpdateQty = (id: string, delta: number) => {
    setSelected((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const nextQty = Math.max(1, (item.qty || 1) + delta);
          return { ...item, qty: nextQty };
        }
        return item;
      })
    );
  };

  const updateSupplementWholesale = (
    id: string,
    updates: Partial<
      Pick<
        SelectedSupplement,
        | "selectedWholesalerName"
        | "selectedWholesalerPrice"
        | "selectedWholesalerContact"
        | "selectedWholesalerAddress"
        | "forceDispatchWithoutWholesaler"
      >
    >
  ) => {
    setSelected((prev) =>
      prev.map((item) => (item.id === id ? { ...item, ...updates } : item))
    );
    setViewingSupplement((prev) => (prev && prev.id === id ? { ...prev, ...updates } : prev));
  };

  const handleRemoveFromSheet = (id: string) => {
    setSelected((prev) => prev.filter((s) => s.id !== id));
    setSelectedSheetIds((prev) => {
      const next = { ...prev };
      delete next[id];
      return next;
    });
  };

  const handleDispatchSelected = async () => {
    if (!selectedPackId || selectedForDispatch.length === 0) return;
    setIsAddingToPack(true);

    try {
      // Always update the local pack store so the Select Supplements tab reflects changes instantly,
      // even if some items don't exist in the backend yet (e.g. local-only ids like `sup-...`).
      const raw = localStorage.getItem(packStorageKey);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      const store: Record<string, any[]> = parsed && typeof parsed === "object" ? (parsed as any) : {};
      const existing = Array.isArray(store[selectedPackId]) ? store[selectedPackId] : [];
      const existingIds = new Set(existing.map((s: any) => String(s?.id)));
      const nextForPack = [
        ...existing,
        ...selectedForDispatch.filter((s) => !existingIds.has(String(s.id))),
      ];
      store[selectedPackId] = nextForPack;
      localStorage.setItem(packStorageKey, JSON.stringify(store));
      window.dispatchEvent(new Event("researcher-pack-updated"));
      window.dispatchEvent(new Event("researcher-sheet-updated"));
    } catch {
      // ignore local storage failures
    }

    // Extract supplement IDs for backend sync (handling potential string-to-number conversion)
    const items = selectedForDispatch
      .map((item) => ({
        id: Number(item.id),
        quantity: item.qty || 1,
        selectedWholesalerName: item.selectedWholesalerName || null,
        selectedWholesalerPrice: item.selectedWholesalerPrice ?? null,
        selectedWholesalerContact: item.selectedWholesalerContact || null,
        selectedWholesalerAddress: item.selectedWholesalerAddress || null,
        forceDispatchWithoutWholesaler: Boolean(item.forceDispatchWithoutWholesaler),
        originalId: item.id,
      }))
      .filter((item) => Number.isFinite(item.id) && item.id > 0);

    const code = sessionStorage.getItem("researcherVerifiedBenfekCode") || "";

    // Best-effort backend sync
    if (code && items.length) {
      try {
        await researcherService.dispatchPack({
          code,
          packId: selectedPackId,
          packName: selectedPackName,
          items: items.map(({ id, quantity, selectedWholesalerName, selectedWholesalerPrice, selectedWholesalerContact, selectedWholesalerAddress, forceDispatchWithoutWholesaler }) => ({
            id,
            quantity,
            selectedWholesalerName,
            selectedWholesalerPrice,
            selectedWholesalerContact,
            selectedWholesalerAddress,
            forceDispatchWithoutWholesaler,
          })),
          status: "draft",
        });
      } catch {
        // Ignore backend sync failures so the local UX stays reliable.
      }
    }

    const invalidCount = selectedForDispatch.filter((item) => !Number.isFinite(Number(item.id)) || Number(item.id) <= 0).length;
    const localOnlyCount = selectedForDispatch.filter((s) => String(s.id).startsWith('sup-')).length;
    toast({
      title: "Added to pack",
      description: invalidCount
        ? `${selectedForDispatch.length} supplements added to ${selectedPackName}. ${invalidCount} local-only item${invalidCount > 1 ? 's' : ''} will remain in the worksheet but cannot be synced until they have a valid server ID.`
        : localOnlyCount
        ? `${selectedForDispatch.length} supplements added to ${selectedPackName}. (${localOnlyCount} are local-only and won't sync to server yet)`
        : `${selectedForDispatch.length} supplements added to ${selectedPackName}.`,
    });
    
    // Remove successfully dispatched items from the sheet view
    setSelected((prev) => prev.filter((item) => !selectedSheetIds[item.id]));
    setSelectedSheetIds({}); 
    setIsAddingToPack(false);
  };

  return (
    <div className="min-h-screen bg-researcher-background">
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b">
        <div className="container py-4 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3 min-w-0">
              <Button
                type="button"
                variant="outline"
                size="icon"
                className="shrink-0"
                onClick={() => {
                  sessionStorage.removeItem(SHEET_RETURN_TAB_KEY);
                  navigate("/researcher", { state: { defaultTab: "gallery" }, replace: true });
                }}
              >
                <ArrowLeft className="h-4 w-4" />
              </Button>
            <div className="min-w-0">
              <h1 className="text-lg font-semibold text-researcher-primary truncate">
                Selected Supplements
              </h1>
              <p className="text-sm text-muted-foreground">
                {selectedForDispatch.length} checked • ₦{selectedDispatchTotal.toLocaleString()}
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Sticky Bar */}
      <div className="fixed top-[72px] left-0 right-0 z-40 bg-researcher-background/80 backdrop-blur-sm border-b border-slate-200/50 shadow-sm">
        <div className="mx-auto w-[90vw] py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2">
            <select
              className="w-full max-w-[50vw] px-3 py-2 border rounded-md bg-white text-sm disabled:opacity-50 disabled:bg-slate-50"
              value={selectedPackId}
              onChange={(e) => setSelectedPackId(e.target.value)}
              disabled={!!state.targetPackId || !!localStorage.getItem("researcher.gallery.target_pack") || selectedForDispatch.length > 0}
            >
              <option value="">Select a pack...</option>
              {packCategories.map((pack) => (
                <option key={pack.id} value={pack.id}>
                  {pack.name}
                </option>
              ))}
            </select>
            
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant={selectedPackId && selectedForDispatch.length > 0 ? "default" : "outline"}
                className={`${
                  selectedPackId && selectedForDispatch.length > 0
                    ? "bg-researcher-primary hover:bg-researcher-secondary"
                    : "border-researcher-border text-researcher-primary"
                } h-9 w-9 p-0 flex justify-center items-center shrink-0`}
                disabled={!selectedPackId || selectedForDispatch.length === 0 || isAddingToPack}
                onClick={handleDispatchSelected}
              >
                {isAddingToPack ? <LoadingSpinner /> : <PackagePlus className="h-4 w-4" />}
              </Button>

              {/* <div className="flex items-center gap-2 bg-white border rounded-md px-2 h-9 shadow-sm"> */}
                <ClassFilterPopover
                  items={selected}
                  appliedFilters={appliedClassFilters}
                  onChangeAppliedFilters={setAppliedClassFilters}
                  includeDosageBudget
                />
                {/* {maxBudget > 0 && ( */}
                  <span 
                    className={`text-xs font-bold border-l pl-2 transition-colors duration-300 ${
                      isOverBudget ? "text-red-600" : "text-green-600"
                    }`}
                  >
                    Max: ₦{benfekMaxBudget.toLocaleString()}
                  </span>
                {/* )} */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      <main className="container px-1 py-6 pt-[160px]">
        {filteredSelected.length === 0 ? (
          <div className="text-center text-muted-foreground py-16">
            No supplements match your filters.
          </div>
        ) : (
          /* Grid: 3 columns by 5 rows logic (implied by grid spacing) */
          <div className="grid grid-cols-3 gap-3 md:gap-4">
            {filteredSelected.map((item) => (
              <Card
                key={item.id}
                className={`overflow-hidden cursor-pointer transition-all relative group ${
                  selectedSheetIds[item.id] ? "ring-2 ring-researcher-primary" : "hover:shadow-md"
                }`}
                onClick={() => setViewingSupplement(item)}
              >
                <CardContent className="p-2 flex flex-col items-start">
                  {/* Selection Checkbox (Restored) */}
                  <div className="absolute top-1 left-1 z-20">
                    <Checkbox
                      checked={!!selectedSheetIds[item.id]}
                      onCheckedChange={() => toggleSheetSelection(item.id)}
                      onClick={(e) => e.stopPropagation()}
                      className="bg-white/80 data-[state=checked]:bg-researcher-primary"
                    />
                  </div>

                  {/* Delete Icon Overlay */}
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="absolute top-0 right-0 h-7 w-7 text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity z-20"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRemoveFromSheet(item.id);
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>

                  {/* Quantity Badge (Top Center of Image) */}
                  <div className="absolute top-2 left-1/2 -translate-x-1/2 z-20 bg-white/95 text-researcher-primary border border-researcher-primary/20 text-[11px] font-bold px-2 rounded-full shadow-sm pointer-events-none">
                    {item.qty || 1}
                  </div>

                  {/* Control Buttons (Bottom Right) */}
                  <div 
                    className="absolute bottom-1 right-1 z-20 flex items-center bg-white/90 rounded-md border border-slate-200 shadow-sm overflow-hidden" 
                    onClick={(e) => e.stopPropagation()}
                  >
                    <button
                      type="button"
                      className="p-1.5 hover:bg-slate-100 text-rose-600 transition-colors border-r border-slate-100"
                      onClick={() => handleUpdateQty(item.id, -1)}
                      aria-label="Decrease quantity"
                    >
                      <Minus className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      className="p-1.5 hover:bg-slate-100 text-emerald-600 transition-colors"
                      onClick={() => handleUpdateQty(item.id, 1)}
                      aria-label="Increase quantity"
                    >
                      <Plus className="h-3 w-3" />
                    </button>
                  </div>

                  <div className="aspect-square w-full mb-1 overflow-hidden rounded-md bg-white border flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  </div>

                  {/* Manufacturer Name */}
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full text-left">
                    {item.manufacturer || "Manufacturer"}
                  </p>

                  <p className="mt-0.5 text-xs font-semibold text-slate-900 truncate w-full text-left">
                    {item.name}
                  </p>

                  <p className="mt-0.5 text-[11px] font-bold text-researcher-primary tabular-nums">
                    ₦{(item.price * (item.qty || 1)).toLocaleString()}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>

      {/* Details Dialog (Mimics Gallery Page Details) */}
      <Dialog open={!!viewingSupplement} onOpenChange={() => setViewingSupplement(null)}>
        {viewingSupplement && (
          <DialogContent className="max-w-md w-[95vw] rounded-xl max-h-[92vh] flex flex-col p-0 overflow-hidden">
            <DialogHeader className="p-6 pb-2 shrink-0">
              <DialogTitle className="text-xl">{viewingSupplement.name}</DialogTitle>
              <DialogDescription className="text-researcher-primary font-medium">
                {viewingSupplement.manufacturer}
              </DialogDescription>
            </DialogHeader>
            <div className="flex-1 overflow-y-auto p-6 pt-0 space-y-4">
              <div className="aspect-video w-full rounded-lg border bg-white flex items-center justify-center p-4">
                <img 
                  src={viewingSupplement.imageUrl} 
                  alt={viewingSupplement.name} 
                  className="max-h-full object-contain" 
                />
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <Badge variant="outline" className="bg-researcher-muted uppercase text-[10px]">
                  {viewingSupplement.category}
                </Badge>
                <span className="font-bold text-lg text-researcher-primary">
                  ₦{viewingSupplement.price.toLocaleString()}
                </span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed">
                {viewingSupplement.description}
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Dosage</span>
                  <span className="text-xs font-semibold">
                    {viewingSupplement.tags?.dosage_form?.[0] || viewingSupplement.dosageForm || "Not Specified"}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Strength</span>
                  <span className="text-xs font-semibold truncate block">
                    {viewingSupplement.strength || "Not Specified"}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Budget range</span>
                  <span className="text-xs font-semibold">
                    {viewingSupplement.tags?.budget_range?.[0] || viewingSupplement.budgetRange || "Not Specified"}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Expiry Date</span>
                  <span className="text-xs font-semibold truncate block">
                    {viewingSupplement.expiryDate || "Not Specified"}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Pack Qty</span>
                  <span className="text-xs font-semibold">
                    {viewingSupplement.tags?.pack_quantity?.[0] || "Not Specified"}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Status</span>
                  <span className="text-xs font-semibold truncate block">
                    {viewingSupplement.status ? String(viewingSupplement.status).replace(/_/g, " ") : "Not Specified"}
                  </span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100 col-span-2">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Stock</span>
                  <span className="text-xs font-semibold">
                    {typeof viewingSupplement.stock === "number" ? viewingSupplement.stock.toLocaleString() : "Not Specified"}
                  </span>
                </div>
              </div>

              <div className="space-y-2 pt-1">
                <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">Tags</p>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(viewingSupplement.tags || {}).flatMap(([tagKey, values]) =>
                    (values || []).map((value) => (
                      <Badge
                        key={`${tagKey}:${value}`}
                        variant="outline"
                        title={`${tagKey}: ${value}`}
                        className="bg-researcher-muted max-w-full whitespace-normal break-words"
                      >
                        {value}
                      </Badge>
                    ))
                  )}
                  {Object.keys(viewingSupplement.tags || {}).length === 0 ? (
                    <p className="text-xs text-muted-foreground">No tags.</p>
                  ) : null}
                </div>
              </div>

              {canViewWholesale ? (
                <div className="space-y-2 pt-1">
                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                    Dispatch Source
                  </p>
                  {Array.isArray(viewingSupplement.wholesalers) && viewingSupplement.wholesalers.length ? (
                    <div className="space-y-2 rounded-md border bg-slate-50 px-3 py-3">
                      <Select
                        value={viewingSupplement.selectedWholesalerName || ""}
                        onValueChange={(value) => {
                          const nextWholesaler = viewingSupplement.wholesalers?.find((item) => item.name === value);
                          updateSupplementWholesale(viewingSupplement.id, {
                            selectedWholesalerName: nextWholesaler?.name || null,
                            selectedWholesalerPrice: nextWholesaler?.price ?? null,
                            selectedWholesalerContact: nextWholesaler?.contact || null,
                            selectedWholesalerAddress: nextWholesaler?.address || null,
                            forceDispatchWithoutWholesaler: false,
                          });
                        }}
                      >
                        <SelectTrigger className="bg-white">
                          <SelectValue placeholder="Select wholesaler for this item" />
                        </SelectTrigger>
                        <SelectContent>
                          {viewingSupplement.wholesalers.map((w, idx) => (
                            <SelectItem key={`${w.name}-${idx}`} value={w.name}>
                              {w.name} - ₦{Number(w.price || 0).toLocaleString()}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {viewingSupplement.selectedWholesalerName ? (
                        <p className="text-xs text-slate-600">
                          Selected: {viewingSupplement.selectedWholesalerName} at ₦
                          {Number(viewingSupplement.selectedWholesalerPrice || 0).toLocaleString()}
                        </p>
                      ) : null}
                    </div>
                  ) : (
                    <div className="space-y-2 rounded-md border border-amber-200 bg-amber-50 px-3 py-3">
                      <p className="text-xs font-medium text-amber-800">
                        No wholesaler is currently available for this item. Dispatching it anyway will use the fallback 1.3 markup rule.
                      </p>
                      <div className="flex items-center gap-2">
                        <Checkbox
                          checked={Boolean(viewingSupplement.forceDispatchWithoutWholesaler)}
                          onCheckedChange={(checked) =>
                            updateSupplementWholesale(viewingSupplement.id, {
                              forceDispatchWithoutWholesaler: Boolean(checked),
                            })
                          }
                        />
                        <span className="text-xs text-slate-700">Allow dispatch without wholesaler selection</span>
                      </div>
                    </div>
                  )}

                  <p className="text-[10px] text-slate-400 uppercase font-bold tracking-wide">
                    Wholesalers
                  </p>
                  {Array.isArray(viewingSupplement.wholesalers) && viewingSupplement.wholesalers.length ? (
                    <div className="space-y-2">
                      {viewingSupplement.wholesalers.map((w, idx) => (
                        <div key={`${w.name}-${idx}`} className="rounded-md border bg-slate-50 px-3 py-2">
                          <div className="flex items-start justify-between gap-3">
                            <div className="min-w-0">
                              <p className="text-sm font-semibold text-slate-900 truncate">{w.name}</p>
                              <p className="text-xs text-slate-600 truncate">{w.contact}</p>
                              <p className="text-xs text-slate-600 truncate">{w.address}</p>
                            </div>
                            <p className="shrink-0 text-sm font-bold text-slate-900 tabular-nums">
                              ₦{Number(w.price || 0).toLocaleString()}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-xs text-muted-foreground">No wholesalers added.</p>
                  )}
                </div>
              ) : null}
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
