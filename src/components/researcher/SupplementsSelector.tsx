import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, GalleryHorizontal, AlertTriangle, Package, Trash2 } from "lucide-react";
import { packCategories, type Supplement } from "@/lib/researcher/dummyData";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface SupplementsSelectorProps {
  onNavigateToGallery: (packId: string) => void;
  onAddNewFromGallery: (packId: string) => void;
  selectedSupplements: Record<string, Supplement[]>;
  onRemoveSupplement: (packId: string, supplementId: string) => void;
  budgetExceeded: Record<string, boolean>;
  packBudgets: Record<string, { min: number; max: number }> | null;
  onDispatchPack: (packId: string) => void;
  onDispatchAllPacks: () => void;
  dispatchedPacks: Record<string, boolean>;
  dispatchingPackId?: string | null;
  dispatchingAll?: boolean;
}

export function SupplementsSelector({
  onNavigateToGallery,
  onAddNewFromGallery,
  selectedSupplements,
  onRemoveSupplement,
  budgetExceeded,
  packBudgets,
  onDispatchPack,
  onDispatchAllPacks,
  dispatchedPacks,
  dispatchingPackId,
  dispatchingAll = false,
}: SupplementsSelectorProps) {
  return (
    <div className="animate-fade-in space-y-6 p-1 sm:p-3">
      <div className="flex flex-col items-center justify-between gap-3 text-center mb-6 sm:flex-row sm:text-left">
        <div>
          <h2 className="text-3xl font-bold text-researcher-primary">Select Supplements</h2>
          <p className="text-muted-foreground">Choose supplements for your packs</p>
        </div>
        <Button
          onClick={onDispatchAllPacks}
          disabled={dispatchingAll || Object.values(selectedSupplements).every((items) => items.length === 0)}
          className="bg-researcher-primary hover:bg-researcher-secondary text-xs h-9 px-4"
        >
          {dispatchingAll && <LoadingSpinner className="mr-2" />}
          {dispatchingAll ? "Dispatching..." : "Dispatch All Packs"}
        </Button>
      </div>

      <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
        {packCategories.map((pack) => {
          const packItems = selectedSupplements[pack.id] || [];
          const hasSupplements = packItems.length > 0;
          const totalPackPrice = packItems.reduce((sum, item) => sum + ((Number(item.price) || 0) * ((item as any).qty || 1)), 0);
          const maxBudget = Number(packBudgets?.[pack.id]?.max) || 0;
          const minBudget = Number(packBudgets?.[pack.id]?.min) || 0;
          const displayName = pack.name === "Economic pack" ? "Economy pack" : pack.name;

          return (
            <AccordionItem
              key={pack.id}
              value={pack.id}
              className={`
                group relative rounded-lg border border-slate-200 shadow-sm mb-4 overflow-hidden
                ${budgetExceeded[pack.id] ? "border-red-500" : ""}
                data-[state=open]:border-researcher-primary data-[state=open]:shadow-md
                data-[state=closed]:bg-slate-200/60 data-[state=closed]:text-slate-500 data-[state=closed]:grayscale-[0.3]
              `}
            >
              <AccordionTrigger className="text-lg font-medium">
                {displayName}
                {hasSupplements && (
                  <span className="ml-2 text-sm font-normal text-muted-foreground">
                    ({packItems.length} items)
                  </span>
                )}
              </AccordionTrigger>
              <AccordionContent>
                <div className="space-y-4 p-2">
                  {packBudgets && (
                    <div className="text-sm">
                      <p>
                        Budget range: ₦{minBudget.toLocaleString()} - ₦{maxBudget.toLocaleString()}
                      </p>
                      {budgetExceeded[pack.id] && (
                        <Alert variant="destructive" className="mt-2">
                          <AlertTriangle className="h-4 w-4" />
                          <AlertDescription>
                            Budget exceeded: ₦{totalPackPrice.toLocaleString()} / ₦{maxBudget.toLocaleString()}
                          </AlertDescription>
                        </Alert>
                      )}
                    </div>
                  )}

                  <div className="flex flex-row justify-between items-center w-full gap-2">
                    <Button
                      onClick={() => onAddNewFromGallery(pack.id)}
                      className="bg-researcher-primary hover:bg-researcher-secondary flex items-center h-8 py-0 px-3 text-xs w-auto"
                    >
                      <Plus className="mr-1.5 h-3.5 w-3.5" /> Add New
                    </Button>

                    <Button
                      variant="outline"
                      onClick={() => onNavigateToGallery(pack.id)}
                      className="border-researcher-primary text-researcher-primary hover:bg-researcher-muted flex items-center h-8 py-0 px-3 text-xs w-auto"
                    >
                      <GalleryHorizontal className="mr-1.5 h-3.5 w-3.5" /> Add from Gallery
                    </Button>
                  </div>

                  <div className="mt-4 space-y-2">
                    {hasSupplements ? (
                      <>
                        {packItems.map((supplement) => (
                          <div
                            key={supplement.id}
                            className="p-3 border rounded-md flex items-center justify-between bg-white shadow-sm hover:shadow transition-shadow"
                          >
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-md overflow-hidden flex items-center justify-center mr-2 bg-researcher-muted border border-researcher-border">
                                {supplement.imageUrl ? (
                                  <img
                                    src={supplement.imageUrl}
                                    alt={supplement.name}
                                    className="h-full w-full object-cover"
                                    loading="lazy"
                                  />
                                ) : (
                                  <span className="text-researcher-primary text-xs font-bold">
                                    {supplement.name.substring(0, 2).toUpperCase()}
                                  </span>
                                )}
                              </div>
                              <div>
                                <p className="font-medium">
                                  {(supplement as any).qty > 1 && <span className="text-researcher-primary font-bold mr-1">{(supplement as any).qty}x</span>}
                                  {supplement.name}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="flex flex-col items-end mr-3">
                                <span className="text-sm font-medium">
                              ₦{((supplement.price || 0) * ((supplement as any).qty || 1)).toLocaleString()}
                                </span>
                              </div>
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onRemoveSupplement(pack.id, supplement.id);
                                }}
                                className="text-gray-500 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        ))}

                        <div className="flex justify-between items-center mt-4 pt-2 border-t">
                          <div>
                            <p className="text-sm font-medium">
                              Total:{" "}
                              <span className="font-bold">₦{totalPackPrice.toLocaleString()}</span>
                            </p>
                          </div>

                          <Button
                            onClick={() => onDispatchPack(pack.id)}
                            className="bg-researcher-primary/80 hover:bg-researcher-secondary w-fit h-fit"
                            disabled={!hasSupplements || dispatchingPackId === pack.id || dispatchingAll}
                          >
                            {dispatchingPackId === pack.id && <LoadingSpinner className="mr-2" />}
                            {dispatchingPackId === pack.id ? "Dispatching..." : "Dispatch"}
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="text-center py-4 text-muted-foreground">
                        No supplements selected for this pack
                      </div>
                    )}
                  </div>
                </div>
              </AccordionContent>
            </AccordionItem>
          );
        })}
      </Accordion>
    </div>
  );
}
