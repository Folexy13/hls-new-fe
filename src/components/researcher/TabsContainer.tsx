import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/researcher/UserProfile";
import { SupplementsSelector } from "@/components/researcher/SupplementsSelector";
import { SupplementGallery } from "@/components/researcher/SupplementGallery";
import { MyNutrientPacks } from "@/components/researcher/MyNutrientPacks";
import { PackCatalogue } from "@/components/researcher/PackCatalogue";
import { researcherService } from "@/services/researcherService";
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
  const location = useLocation();
  const defaultTab =
    (location.state as { defaultTab?: string } | null | undefined)?.defaultTab || "profile";

  const [verifiedCode, setVerifiedCode] = useState<string>(() => {
    return sessionStorage.getItem("researcherVerifiedBenfekCode") || "";
  });
  const [userVerified, setUserVerified] = useState<boolean>(() => {
    return !!sessionStorage.getItem("researcherVerifiedBenfekCode");
  });

  const packStorageKey = useMemo(() => {
    return verifiedCode ? `researcher.pack.supplements.${verifiedCode}` : "researcher.pack.supplements";
  }, [verifiedCode]);

  const dispatchedStorageKey = useMemo(() => {
    return verifiedCode ? `researcher.dispatched.packs.${verifiedCode}` : "researcher.dispatched.packs";
  }, [verifiedCode]);

  const [activeTab, setActiveTab] = useState(() => {
    if (!sessionStorage.getItem("researcherVerifiedBenfekCode") && defaultTab === "supplements") {
      return "profile";
    }
    return defaultTab;
  });
  const emptySelected = useMemo(
    () => Object.fromEntries(packCategories.map((p) => [p.id, [] as Supplement[]])),
    []
  );
  const [selectedSupplements, setSelectedSupplements] =
    useState<Record<string, Supplement[]>>(emptySelected);
  const [packsHydrated, setPacksHydrated] = useState(false);
  const [galleryAddRequest, setGalleryAddRequest] = useState(0);
  const [budgetExceeded, setBudgetExceeded] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(packCategories.map((p) => [p.id, false]))
  );
  const [userBudget, setUserBudget] = useState<{ min: number; max: number } | null>(null);
  const [dispatchedPacks, setDispatchedPacks] = useState<Record<string, boolean>>({});
  const [activeCataloguePack, setActiveCataloguePack] = useState<string | null>(null);

  const { toast } = useToast();

  const packBudgets = userBudget ? calculatePackBudget(userBudget) : null;

  useEffect(() => {
    if (!userVerified && defaultTab === "supplements") {
      setActiveTab("profile");
      return;
    }
    setActiveTab(defaultTab);
  }, [defaultTab, userVerified]);

  useEffect(() => {
    if (!userVerified && activeTab === "supplements") {
      setActiveTab("profile");
    }
  }, [activeTab, userVerified]);

  useEffect(() => {
    if (!userVerified && defaultTab === "supplements") {
      toast({
        title: "Verify code first",
        description: "Please verify a benefek code before selecting supplements.",
        variant: "destructive",
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [defaultTab, userVerified]);

  useEffect(() => {
    const syncVerified = () => {
      const code = sessionStorage.getItem("researcherVerifiedBenfekCode") || "";
      setVerifiedCode(code);
      setUserVerified(!!code);
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
    if (!userVerified) return;
    if (!packsHydrated) return;
    try {
      localStorage.setItem(packStorageKey, JSON.stringify(selectedSupplements));
      localStorage.setItem(dispatchedStorageKey, JSON.stringify(dispatchedPacks));
    } catch {
      // ignore
    }
  }, [packStorageKey, dispatchedStorageKey, packsHydrated, selectedSupplements, dispatchedPacks, userVerified]);

  useEffect(() => {
    const loadPackSupplements = () => {
      if (!userVerified) return;
      try {
        const raw = localStorage.getItem(packStorageKey);
        const parsed = raw ? (JSON.parse(raw) as unknown) : null;
        if (!parsed || typeof parsed !== "object") {
          setSelectedSupplements(emptySelected);
          setPacksHydrated(true);
          return;
        }

        setSelectedSupplements({
          ...emptySelected,
          ...(parsed as Record<string, Supplement[]>),
        });

        try {
          const rawDispatched = localStorage.getItem(dispatchedStorageKey);
          setDispatchedPacks(rawDispatched ? JSON.parse(rawDispatched) : {});
        } catch {
          setDispatchedPacks({});
        }
      } catch {
        setSelectedSupplements(emptySelected);
      }
      setPacksHydrated(true);
    };

    window.addEventListener("researcher-pack-updated", loadPackSupplements);
    window.addEventListener("storage", loadPackSupplements);
    setPacksHydrated(false);
    loadPackSupplements();
    return () => {
      window.removeEventListener("researcher-pack-updated", loadPackSupplements);
      window.removeEventListener("storage", loadPackSupplements);
    };
  }, [emptySelected, packStorageKey, dispatchedStorageKey, userVerified]);

  useEffect(() => {
    if (userVerified) return;

    // Ensure packs are not accessible/persisted across logout or unverified state.
    try {
      Object.keys(localStorage).forEach((key) => {
        if (key.startsWith("researcher.pack.supplements.")) localStorage.removeItem(key);
      });
      localStorage.removeItem("researcher.pack.supplements");
    } catch {
      // ignore
    }
    setSelectedSupplements(emptySelected);
    setBudgetExceeded(Object.fromEntries(packCategories.map((p) => [p.id, false])));
    setUserBudget(null);
    setPacksHydrated(false);
    if (activeTab === "supplements") setActiveTab("profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userVerified]);

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

  const handleDispatchPack = async (packId: string) => {
    const packName = packCategories.find((p) => p.id === packId)?.name || packId;

    if (verifiedCode) {
      const items = (selectedSupplements[packId] || []).map(i => ({
        id: i.id, // Keep as string, as Supplement.id is string
        quantity: (i as any).qty || 1
      })); // Removed filter as id is now string and !isNaN(string) is incorrect

      try {
        await researcherService.dispatchPack({
          code: verifiedCode,
          packId,
          packName,
          items,
          status: "dispatched"
        });

        setDispatchedPacks((prev) => ({ ...prev, [packId]: true }));
        toast({
          title: "Pack Dispatched",
          description: `The ${packName} is now live in the beneficiary's catalogue.`,
        });
        setActiveTab("catalogue");
      } catch (e) {
        toast({
          title: "Dispatch failed",
          description: "Could not sync with the server.",
          variant: "destructive"
        });
      }
    }
  };

  const navigateToGallery = (packId: string) => {
    localStorage.setItem("researcher.gallery.target_pack", packId);
    setActiveTab("gallery");
  };

  const handleTabChange = (value: string) => {
    if (value === "gallery") {
      localStorage.removeItem("researcher.gallery.target_pack");
    }
    if (value === "supplements" && !userVerified) {
      toast({
        title: "Verify code first",
        description: "Please verify a benefek code before selecting supplements.",
        variant: "destructive",
      });
      setActiveTab("profile");
      return;
    }
    setActiveTab(value);
  };

  const handleAddNewFromGallery = (packId: string) => {
    if (!userVerified) {
      toast({
        title: "Verify code first",
        description: "Please verify a benefek code before selecting supplements.",
        variant: "destructive",
      });
      setActiveTab("profile");
      return;
    }
    sessionStorage.setItem("researcher.gallery.add_origin", "supplements");
    sessionStorage.setItem("researcher.gallery.return_tab", "supplements");
    localStorage.setItem("researcher.gallery.target_pack", packId);
    setActiveTab("gallery");
    setGalleryAddRequest((value) => value + 1);
  };

  const handleUserVerified = (verified: boolean, budget: { min: number; max: number } | null) => {
    setUserVerified(verified);
    setUserBudget(budget || dummyUser.budget || null);
  };

  return (
    <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
      <div className="fixed left-0 right-0 top-[72px] z-40 bg-white border-b border-researcher-border/70">
        <div className="container h-[60px] flex items-center px-2 sm:px-4">
          <TabsList className="flex w-full">
            <TabsTrigger className="w-full" value="profile">User Profile</TabsTrigger>
            <TabsTrigger className="w-full" value="supplements" disabled={!userVerified} aria-disabled={!userVerified}>
              Select Supplements
            </TabsTrigger>
            <TabsTrigger className="w-full" value="gallery">Gallery</TabsTrigger>
            {/* <TabsTrigger className="w-full" value="catalogue">My Nutrient Packs</TabsTrigger> */}
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

      <TabsContent value="catalogue" className="animate-fade-in p-1 sm:p-3">
        {activeCataloguePack ? (
          <PackCatalogue 
            packName={packCategories.find(p => p.id === activeCataloguePack)?.name || ""}
            items={selectedSupplements[activeCataloguePack] || []}
            onBack={() => setActiveCataloguePack(null)}
          />
        ) : (
          <MyNutrientPacks 
            dispatchedPacks={dispatchedPacks}
            selectedSupplements={selectedSupplements}
            onViewCatalogue={setActiveCataloguePack}
          />
        )}
      </TabsContent>
    </Tabs>
  );
}
