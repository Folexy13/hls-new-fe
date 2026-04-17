import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { ArrowLeft, PackagePlus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
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

type SelectedSupplement = {
  id: string;
  name: string;
  description: string;
  category: string;
  manufacturer?: string;
  dosageForm?: string;
  budgetRange?: string;
  tags?: Record<string, string[]>;
  imageUrl: string;
  price: number;
};

type LocationState = {
  selectedSupplements?: SelectedSupplement[];
};

export default function ResearcherSelectedSupplementsPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const state = (location.state || {}) as LocationState;
  const SHEET_STORAGE_KEY = "researcher.sheet.supplements";
  const PACK_STORAGE_KEY = "researcher.pack.supplements";
  const { toast } = useToast();

  const [selected, setSelected] = useState<SelectedSupplement[]>(() => {
    const fromState = state.selectedSupplements || [];
    if (fromState.length) return fromState;

    try {
      const raw = localStorage.getItem(SHEET_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      return Array.isArray(parsed) ? (parsed as SelectedSupplement[]) : [];
    } catch {
      return [];
    }
  });

  const [selectedPackId, setSelectedPackId] = useState<string>("");
  const [selectedSheetIds, setSelectedSheetIds] = useState<Record<string, boolean>>({});
  const [appliedClassFilters, setAppliedClassFilters] = useState<AppliedClassFilters>({});
  const [viewingSupplement, setViewingSupplement] = useState<SelectedSupplement | null>(null);

  // --- Budget Extraction ---
  const maxBudget = useMemo(() => {
    const pack = packCategories.find((p) => p.id === selectedPackId);
    if (!pack || !pack.budgetRange) return 0;
    const prices = pack.budgetRange.replace(/,/g, "").match(/\d+/g);
    return prices ? Math.max(...prices.map(Number)) : 0;
  }, [selectedPackId]);

  const selectedPackName = useMemo(() => {
    return packCategories.find((p) => p.id === selectedPackId)?.name || "";
  }, [selectedPackId]);

  useEffect(() => {
    try {
      localStorage.setItem(SHEET_STORAGE_KEY, JSON.stringify(selected));
    } catch {
      // ignore
    }
  }, [selected]);

  const filteredSelected = useMemo(() => {
    return applyClassFilters(selected, appliedClassFilters) as SelectedSupplement[];
  }, [appliedClassFilters, selected]);

  // --- Dynamic Calculation for Checked Items ---
  const selectedForDispatch = useMemo(() => {
    return selected.filter((item) => selectedSheetIds[item.id]);
  }, [selected, selectedSheetIds]);

  const selectedDispatchTotal = useMemo(
    () => selectedForDispatch.reduce((sum, item) => sum + (item.price || 0), 0),
    [selectedForDispatch]
  );

  const isOverBudget = maxBudget > 0 && selectedDispatchTotal > maxBudget;

  const toggleSheetSelection = (id: string) => {
    setSelectedSheetIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
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

    const numericSupplementIds = selectedForDispatch
      .map((item) => Number(item.id))
      .filter((id) => Number.isFinite(id) && id > 0);

    const code = sessionStorage.getItem("researcherVerifiedBenfekCode") || "";
    if (code && numericSupplementIds.length) {
      try {
        await researcherService.dispatchPack({
          code,
          packId: selectedPackId,
          packName: selectedPackName,
          supplementIds: numericSupplementIds,
          status: "dispatched",
        });
        
        toast({
          title: "Added to pack",
          description: `${selectedForDispatch.length} supplements added to ${selectedPackName}.`,
        });
        setSelectedSheetIds({}); // Clear selection after dispatch
      } catch {
        toast({ title: "Error", description: "Failed to dispatch", variant: "destructive" });
      }
    }
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
              onClick={() => navigate("/researcher", { state: { defaultTab: "gallery" } })}
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
              className="w-full max-w-[50vw] px-3 py-2 border rounded-md bg-white text-sm"
              value={selectedPackId}
              onChange={(e) => setSelectedPackId(e.target.value)}
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
                disabled={!selectedPackId || selectedForDispatch.length === 0}
                onClick={handleDispatchSelected}
              >
                <PackagePlus className="h-4 w-4" />
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
                    Max: ₦{maxBudget.toLocaleString()}
                  </span>
                {/* )} */}
              {/* </div> */}
            </div>
          </div>
        </div>
      </div>

      <main className="container py-6 pt-[160px]">
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
                <CardContent className="p-2 flex flex-col items-center">
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

                  {/* Supplement Image */}
                  <div className="aspect-square w-full mb-1 overflow-hidden rounded-md bg-white border flex items-center justify-center">
                    <img
                      src={item.imageUrl}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain p-1"
                    />
                  </div>

                  {/* Manufacturer Name */}
                  <p className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter truncate w-full text-center">
                    {item.manufacturer || "Manufacturer"}
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
          <DialogContent className="max-w-md w-[95vw] rounded-xl">
            <DialogHeader>
              <DialogTitle className="text-xl">{viewingSupplement.name}</DialogTitle>
              <DialogDescription className="text-researcher-primary font-medium">
                {viewingSupplement.manufacturer}
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
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
                  <span className="text-xs font-semibold">{viewingSupplement.dosageForm || "Not Specified"}</span>
                </div>
                <div className="bg-slate-50 p-2 rounded-md border border-slate-100 text-right">
                  <span className="text-[10px] text-slate-400 block uppercase font-bold">Category</span>
                  <span className="text-xs font-semibold truncate block">{viewingSupplement.category}</span>
                </div>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}