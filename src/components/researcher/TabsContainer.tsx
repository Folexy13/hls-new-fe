import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/researcher/UserProfile";
import { SupplementsSelector } from "@/components/researcher/SupplementsSelector";
import { SupplementGallery } from "@/components/researcher/SupplementGallery";
import {
  calculatePackBudget,
  calculateTotalPrice,
  dummyUser,
  packCategories,
  type Supplement,
} from "@/lib/researcher/dummyData";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";

export function TabsContainer() {
  const PACK_STORAGE_KEY = "researcher.pack.supplements";
  const location = useLocation();
  const defaultTab =
    (location.state as { defaultTab?: string } | null | undefined)?.defaultTab || "profile";

  const [activeTab, setActiveTab] = useState(defaultTab);
  const [, setUserVerified] = useState(false);
  const initialSelected = useMemo(() => {
    const fallback = Object.fromEntries(packCategories.map((p) => [p.id, [] as Supplement[]]));
    try {
      const raw = localStorage.getItem(PACK_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      if (!parsed || typeof parsed !== "object") return fallback;

      return {
        ...fallback,
        ...(parsed as Record<string, Supplement[]>),
      };
    } catch {
      return fallback;
    }
  }, []);
  const [selectedSupplements, setSelectedSupplements] =
    useState<Record<string, Supplement[]>>(initialSelected);
  const [galleryAddRequest, setGalleryAddRequest] = useState(0);
  const [budgetExceeded, setBudgetExceeded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(packCategories.map((p) => [p.id, false]))
  );
  const [userBudget, setUserBudget] = useState<{ min: number; max: number } | null>(null);
  const { toast } = useToast();

  const packBudgets = userBudget ? calculatePackBudget(userBudget) : null;

  useEffect(() => {
    try {
      localStorage.setItem(PACK_STORAGE_KEY, JSON.stringify(selectedSupplements));
    } catch {
      // ignore
    }
  }, [selectedSupplements]);

  useEffect(() => {
    const loadPackSupplements = () => {
      try {
        const raw = localStorage.getItem(PACK_STORAGE_KEY);
        const parsed = raw ? (JSON.parse(raw) as unknown) : null;
        if (!parsed || typeof parsed !== "object") return;

        setSelectedSupplements({
          ...initialSelected,
          ...(parsed as Record<string, Supplement[]>),
        });
      } catch {
        // ignore
      }
    };

    window.addEventListener("researcher-pack-updated", loadPackSupplements);
    window.addEventListener("storage", loadPackSupplements);
    return () => {
      window.removeEventListener("researcher-pack-updated", loadPackSupplements);
      window.removeEventListener("storage", loadPackSupplements);
    };
  }, [initialSelected]);

  const handleAddSupplement = (packId: string, supplement: Supplement) => {
    const updated = {
      ...selectedSupplements,
      [packId]: [...(selectedSupplements[packId] || []), supplement],
    };
    setSelectedSupplements(updated);

    if (packBudgets) {
      const totalPackPrice = calculateTotalPrice(updated[packId]);
      const isExceeded = totalPackPrice > packBudgets[packId].max;

      if (isExceeded && !budgetExceeded[packId]) {
        setBudgetExceeded((prev) => ({ ...prev, [packId]: true }));
        toast({
          title: "Budget Exceeded",
          description: `The total cost of this pack (₦${totalPackPrice.toLocaleString()}) exceeds the budget limit of ₦${packBudgets[
            packId
          ].max.toLocaleString()}.`,
          variant: "destructive",
        });
      }
    }

    const packName = packCategories.find((p) => p.id === packId)?.name || packId;
    toast({
      title: "Supplement added",
      description: `Added ${supplement.name} to ${packName}`,
    });
  };

  const handleRemoveSupplement = (packId: string, supplementId: string) => {
    const updated = {
      ...selectedSupplements,
      [packId]: (selectedSupplements[packId] || []).filter((sup) => sup.id !== supplementId),
    };

    setSelectedSupplements(updated);

    if (packBudgets) {
      const totalPackPrice = calculateTotalPrice(updated[packId]);
      const isExceeded = totalPackPrice > packBudgets[packId].max;

      if (!isExceeded && budgetExceeded[packId]) {
        setBudgetExceeded((prev) => ({ ...prev, [packId]: false }));
      }
    }

    toast({
      title: "Supplement removed",
      description: "Removed supplement from pack",
    });
  };

  const handleDispatchPack = (packId: string) => {
    const packName = packCategories.find((p) => p.id === packId)?.name || packId;
    toast({
      title: "Pack Dispatched",
      description: `The ${packName} has been dispatched successfully.`,
    });
  };

  const navigateToGallery = () => {
    setActiveTab("gallery");
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value);
  };

  const handleAddNewFromGallery = () => {
    setActiveTab("gallery");
    setGalleryAddRequest((value) => value + 1);
  };

  const handleUserVerified = (verified: boolean, budget: { min: number; max: number } | null) => {
    setUserVerified(verified);
    setUserBudget(budget || dummyUser.budget || null);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="fixed left-0 right-0 top-[72px] z-40 bg-researcher-background border-b border-researcher-border/70">
        <div className="container h-[60px] flex items-center px-2 sm:px-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="profile">User Profile</TabsTrigger>
            <TabsTrigger value="supplements">Select Supplements</TabsTrigger>
            <TabsTrigger value="gallery">Gallery</TabsTrigger>
          </TabsList>
        </div>
      </div>
      <div className="h-[60px]" aria-hidden="true" />

      <TabsContent value="profile" className="animate-fade-in">
        <UserProfile onUserVerified={handleUserVerified} />
      </TabsContent>

      <TabsContent value="supplements" className="animate-fade-in">
        <SupplementsSelector
          onNavigateToGallery={navigateToGallery}
          onAddNewFromGallery={handleAddNewFromGallery}
          selectedSupplements={selectedSupplements}
          onRemoveSupplement={handleRemoveSupplement}
          budgetExceeded={budgetExceeded}
          packBudgets={packBudgets as any}
          onDispatchPack={handleDispatchPack}
        />
      </TabsContent>

      <TabsContent value="gallery" className="animate-fade-in">
        <SupplementGallery openAddRequest={galleryAddRequest} />
      </TabsContent>
    </Tabs>
  );
}
