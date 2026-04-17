import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Plus, GalleryHorizontal, AlertTriangle, Package, Trash2 } from "lucide-react";
import { packCategories, type Supplement, calculateTotalPrice } from "@/lib/researcher/dummyData";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface SupplementsSelectorProps {
  onNavigateToGallery: () => void;
  onAddNewFromGallery: () => void;
  selectedSupplements: Record<string, Supplement[]>;
  onRemoveSupplement: (packId: string, supplementId: string) => void;
  budgetExceeded: Record<string, boolean>;
  packBudgets: Record<string, { min: number; max: number }> | null;
  onDispatchPack: (packId: string) => void;
}

export function SupplementsSelector({
  onNavigateToGallery,
  onAddNewFromGallery,
  selectedSupplements,
  onRemoveSupplement,
  budgetExceeded,
  packBudgets,
  onDispatchPack,
}: SupplementsSelectorProps) {
  return (
    <div className="animate-fade-in space-y-6 p-1 sm:p-3">
      <div className="text-center mb-6">
        <h2 className="text-3xl font-bold text-researcher-primary">Select Supplements</h2>
        <p className="text-muted-foreground">Choose supplements for your packs</p>
      </div>

      <Accordion type="multiple" className="w-full max-w-3xl mx-auto">
        {packCategories.map((pack) => {
          const packItems = selectedSupplements[pack.id] || [];
          const hasSupplements = packItems.length > 0;
          const totalPackPrice = hasSupplements ? calculateTotalPrice(packItems) : 0;
          const maxBudget = packBudgets ? packBudgets[pack.id]?.max : 0;
          const minBudget = packBudgets ? packBudgets[pack.id]?.min : 0;

          return (
            <AccordionItem
              key={pack.id}
              value={pack.id}
              className={budgetExceeded[pack.id] ? "border-red-500" : ""}
            >
              <AccordionTrigger className="text-lg font-medium">
                {pack.name}
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

                  <div className="flex flex-col space-y-2 sm:space-y-0 sm:flex-row sm:space-x-2">
                    <Button
                      onClick={onAddNewFromGallery}
                      className="bg-researcher-primary hover:bg-researcher-secondary flex items-center"
                    >
                      <Plus className="mr-2 h-4 w-4" /> Add New
                    </Button>

                    <Button
                      variant="outline"
                      onClick={onNavigateToGallery}
                      className="border-researcher-primary text-researcher-primary hover:bg-researcher-muted flex items-center"
                    >
                      <GalleryHorizontal className="mr-2 h-4 w-4" /> Add from Gallery
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
                              <div className="h-8 w-8 bg-researcher-primary rounded-md flex items-center justify-center mr-2">
                                <span className="text-white text-xs font-bold">
                                  {supplement.name.substring(0, 2).toUpperCase()}
                                </span>
                              </div>
                              <div>
                                <p className="font-medium">{supplement.name}</p>
                                <p className="text-xs text-muted-foreground">
                                  {supplement.description.substring(0, 50)}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center">
                              <div className="flex flex-col items-end mr-3">
                                <Badge variant="outline" className="bg-researcher-muted mb-1">
                                  {pack.name}
                                </Badge>
                                <span className="text-sm font-medium">
                                  ₦{supplement.price.toLocaleString()}
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
                            className="bg-researcher-primary hover:bg-researcher-secondary"
                            disabled={!hasSupplements}
                          >
                            <Package className="mr-2 h-4 w-4" /> Dispatch
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
