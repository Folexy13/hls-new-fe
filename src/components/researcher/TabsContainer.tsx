import { useEffect, useMemo, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UserProfile } from "@/components/researcher/UserProfile";
import { SupplementsSelector } from "@/components/researcher/SupplementsSelector";
import { SupplementGallery } from "@/components/researcher/SupplementGallery";
import { researcherService } from "@/services/researcherService";
import {
  calculatePackBudget,
  calculateTotalPrice,
  packCategories,
  type Supplement,
} from "@/lib/researcher/dummyData";
import { budgetRangeOptions } from "@/lib/researcher/taxonomy";
import { useToast } from "@/components/ui/use-toast";
import { useLocation } from "react-router-dom";
import { getApiErrorMessage } from "@/utils/apiError";

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

  const packRationalesStorageKey = useMemo(() => {
    return verifiedCode ? `researcher.pack.rationales.${verifiedCode}` : "researcher.pack.rationales";
  }, [verifiedCode]);

  const pendingPackAddStorageKey = "researcher.gallery.pending_pack_add";

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
  const [benfekData, setBenfekData] = useState<any | null>(null);
  const [dispatchedPacks, setDispatchedPacks] = useState<Record<string, boolean>>({});
  const [packRationales, setPackRationales] = useState<Record<string, string>>({});
  const [dispatchingPackId, setDispatchingPackId] = useState<string | null>(null);
  const [dispatchingAll, setDispatchingAll] = useState(false);

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
      localStorage.setItem(packRationalesStorageKey, JSON.stringify(packRationales));
    } catch {
      // ignore
    }
  }, [packStorageKey, dispatchedStorageKey, packRationalesStorageKey, packsHydrated, selectedSupplements, dispatchedPacks, packRationales, userVerified]);

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

        try {
          const rawRationales = localStorage.getItem(packRationalesStorageKey);
          const parsedRationales = rawRationales ? JSON.parse(rawRationales) : {};
          setPackRationales(parsedRationales && typeof parsedRationales === "object" ? parsedRationales : {});
        } catch {
          setPackRationales({});
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
  }, [emptySelected, packStorageKey, dispatchedStorageKey, packRationalesStorageKey, userVerified]);

  useEffect(() => {
    if (!userVerified || !packsHydrated) return;

    const processPendingPackAdd = () => {
      try {
        const raw = localStorage.getItem(pendingPackAddStorageKey);
        if (!raw) return;
        const parsed = JSON.parse(raw) as { packId?: string; supplement?: any } | null;
        if (!parsed?.packId || !parsed?.supplement) return;

        setSelectedSupplements((prev) => {
          const currentPackItems = prev[parsed.packId] || [];
          if (currentPackItems.some((item) => item.id === parsed.supplement.id)) {
            return prev;
          }
          return {
            ...prev,
            [parsed.packId]: [...currentPackItems, { ...parsed.supplement, qty: parsed.supplement.qty || 1 }],
          };
        });

        localStorage.removeItem(pendingPackAddStorageKey);
      } catch {
        // ignore parsing or storage failures
      }
    };

    processPendingPackAdd();
    window.addEventListener("researcher-gallery-pending-add", processPendingPackAdd);
    window.addEventListener("storage", processPendingPackAdd);

    return () => {
      window.removeEventListener("researcher-gallery-pending-add", processPendingPackAdd);
      window.removeEventListener("storage", processPendingPackAdd);
    };
  }, [userVerified, packsHydrated, pendingPackAddStorageKey]);

  const parseRangeString = (range?: string | null) => {
    if (!range) return null;
    const matches = range.match(/\d+/g);
    if (!matches || matches.length < 2) return null;
    const [minValue, maxValue] = matches.map(Number);
    if (!Number.isFinite(minValue) || !Number.isFinite(maxValue)) return null;
    return { min: minValue, max: maxValue };
  };

  const inferBudgetRangeFromMax = (maxBudget?: number | null) => {
    if (!Number.isFinite(Number(maxBudget)) || Number(maxBudget) <= 0) return null;
    const numericMax = Number(maxBudget);
    for (const option of budgetRangeOptions) {
      const matches = option.match(/\d+/g);
      if (!matches || matches.length < 2) continue;
      const optionMax = Number(matches[matches.length - 1]);
      if (optionMax === numericMax) {
        return {
          min: Number(matches[0]),
          max: optionMax,
        };
      }
    }
    return null;
  };

  useEffect(() => {
    const fetchBenfekDetails = async () => {
      if (userVerified && verifiedCode && !benfekData) {
        try {
          const response = await researcherService.verifyBenfekCode(verifiedCode);
          const fullData = response.benfek;
          setBenfekData(fullData);

          const parsedRange =
            parseRangeString(fullData.quiz?.preferences?.budgetRange) ||
            inferBudgetRangeFromMax(Number(fullData.quiz?.preferences?.budget));

          setUserBudget(
            parsedRange ||
              (Number.isFinite(Number(fullData.quiz?.preferences?.budget))
                ? { min: 0, max: Number(fullData.quiz?.preferences?.budget) }
                : null)
          );
        } catch (error) {
          console.error("Failed to restore benfek data", error);
        }
      }
    };
    fetchBenfekDetails();
  }, [userVerified, verifiedCode, benfekData]);

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
    setPackRationales({});
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
    setDispatchedPacks((prev) => ({ ...prev, [packId]: false }));

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

  const handlePackRationaleChange = (packId: string, rationale: string) => {
    setPackRationales((prev) => ({
      ...prev,
      [packId]: rationale,
    }));
  };

  const handleDispatchPack = async (packId: string) => {
    const packName = packCategories.find((p) => p.id === packId)?.name || packId;

    if (!verifiedCode) {
      return;
    }

    const packItems = selectedSupplements[packId] || [];
    const missingWholesaleSelection = packItems.filter((item: any) => {
      const hasWholesalerOptions = Array.isArray(item.wholesalers) && item.wholesalers.length > 0;
      if (!hasWholesalerOptions) {
        return !item.forceDispatchWithoutWholesaler;
      }

      return !item.selectedWholesalerName || !Number.isFinite(Number(item.selectedWholesalerPrice));
    });

    if (missingWholesaleSelection.length > 0) {
      const shouldForceDispatch = window.confirm(
        "Some items need wholesaler reselection before dispatch. Click OK to force dispatch the missing items with the fallback 1.3 markup rule, or Cancel to go back and reselect."
      );

      if (!shouldForceDispatch) {
        toast({
          title: "Wholesaler reselection required",
          description: "Select a wholesaler for each item in stock, or force dispatch items without an available wholesaler.",
          variant: "destructive",
        });
        return;
      }
    }

    const items = packItems.map((i: any) => ({
      id: i.id,
      quantity: (i as any).qty || 1,
      selectedWholesalerName: i.selectedWholesalerName || null,
      selectedWholesalerPrice: i.selectedWholesalerPrice ?? null,
      selectedWholesalerContact: i.selectedWholesalerContact || null,
      selectedWholesalerAddress: i.selectedWholesalerAddress || null,
      forceDispatchWithoutWholesaler:
        Boolean(i.forceDispatchWithoutWholesaler) ||
        missingWholesaleSelection.some((missing: any) => String(missing.id) === String(i.id)),
    }));

    try {
      setDispatchingPackId(packId);
      await researcherService.dispatchPack({
        code: verifiedCode,
        packId,
        packName,
        rationale: packRationales[packId] || null,
        items,
        status: "dispatched",
      });

      setDispatchedPacks((prev) => ({ ...prev, [packId]: true }));
      setSelectedSupplements((prev) => ({ ...prev, [packId]: [] }));
      toast({
        title: "Pack Dispatched",
        description: `The ${packName} is now live in the beneficiary's catalogue.`,
      });
    } catch (e) {
      toast({
        title: "Dispatch failed",
        description: getApiErrorMessage(e, "Could not sync with the server."),
        variant: "destructive",
      });
    } finally {
      setDispatchingPackId(null);
    }
  };

  const handleDispatchAllPacks = async () => {
    if (!verifiedCode) {
      return;
    }

    const packsToDispatch = packCategories.filter(
      (pack) => (selectedSupplements[pack.id] || []).length > 0
    );

    if (packsToDispatch.length === 0) {
      toast({
        title: "Nothing to dispatch",
        description: "There are no new packs with supplements ready to dispatch.",
      });
      return;
    }

    let succeeded = 0;
    const updatedDispatched = { ...dispatchedPacks };
    const updatedSelected = { ...selectedSupplements };
    const packsNeedingFallback = packsToDispatch.filter((pack) => {
      const packItems = selectedSupplements[pack.id] || [];
      return packItems.some((item: any) => {
        const hasWholesalerOptions = Array.isArray(item.wholesalers) && item.wholesalers.length > 0;
        if (!hasWholesalerOptions) return !item.forceDispatchWithoutWholesaler;
        return !item.selectedWholesalerName || !Number.isFinite(Number(item.selectedWholesalerPrice));
      });
    });

    let forceMissingWholesalers = false;
    if (packsNeedingFallback.length > 0) {
      forceMissingWholesalers = window.confirm(
        `${packsNeedingFallback.length} pack${packsNeedingFallback.length > 1 ? "s have" : " has"} items that need wholesaler reselection. Click OK to dispatch them with the fallback 1.3 markup rule, or Cancel to review the packs first.`
      );

      if (!forceMissingWholesalers) {
        toast({
          title: "Wholesaler reselection required",
          description: "Open the highlighted packs and select wholesalers, or dispatch with fallback markup.",
          variant: "destructive",
        });
        return;
      }
    }

    setDispatchingAll(true);
    try {
      for (const pack of packsToDispatch) {
        const packItems = selectedSupplements[pack.id] || [];
        const missingWholesaleSelection = packItems.filter((item: any) => {
          const hasWholesalerOptions = Array.isArray(item.wholesalers) && item.wholesalers.length > 0;
          if (!hasWholesalerOptions) {
            return !item.forceDispatchWithoutWholesaler;
          }

          return !item.selectedWholesalerName || !Number.isFinite(Number(item.selectedWholesalerPrice));
        });

        const items = packItems.map((i: any) => ({
          id: i.id,
          quantity: (i as any).qty || 1,
          selectedWholesalerName: i.selectedWholesalerName || null,
          selectedWholesalerPrice: i.selectedWholesalerPrice ?? null,
          selectedWholesalerContact: i.selectedWholesalerContact || null,
          selectedWholesalerAddress: i.selectedWholesalerAddress || null,
          forceDispatchWithoutWholesaler:
            Boolean(i.forceDispatchWithoutWholesaler) ||
            (forceMissingWholesalers &&
              missingWholesaleSelection.some((missing: any) => String(missing.id) === String(i.id))),
        }));

        try {
          await researcherService.dispatchPack({
            code: verifiedCode,
            packId: pack.id,
            packName: pack.name,
            rationale: packRationales[pack.id] || null,
            items,
            status: "dispatched",
          });

          updatedDispatched[pack.id] = true;
          updatedSelected[pack.id] = [];
          succeeded += 1;
        } catch (error) {
          toast({
            title: `Failed to dispatch ${pack.name}`,
            description: getApiErrorMessage(error, "One of the packs could not be dispatched. Please try again."),
            variant: "destructive",
          });
        }
      }

      if (succeeded > 0) {
        setDispatchedPacks(updatedDispatched);
        setSelectedSupplements(updatedSelected);
        toast({
          title: "Packs Dispatched",
          description: `${succeeded} pack${succeeded > 1 ? "s" : ""} dispatched successfully.`,
        });
      }
    } finally {
      setDispatchingAll(false);
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

  const handleUserVerified = (verified: boolean, data: any) => {
    setUserVerified(verified);
    setBenfekData(data);
    
    // Extract budget from the nested quiz preferences if available
    const parsedRange =
      parseRangeString(data?.quiz?.preferences?.budgetRange) ||
      inferBudgetRangeFromMax(Number(data?.quiz?.preferences?.budget));
    const budgetValue = Number(data?.quiz?.preferences?.budget);
    setUserBudget(parsedRange || (Number.isFinite(budgetValue) ? { min: 0, max: budgetValue } : null));

    toast({
      title: "Beneficiary Verified",
      description: `Now designing packs for ${data.firstName} ${data.lastName}`,
    });
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
          </TabsList>
        </div>
      </div>
      <div className="h-[60px]" aria-hidden="true" />

      <TabsContent value="profile" className="animate-fade-in">
        <UserProfile onUserVerified={handleUserVerified} benfekData={benfekData} />
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
          onDispatchAllPacks={handleDispatchAllPacks}
          packRationales={packRationales}
          onPackRationaleChange={handlePackRationaleChange}
          dispatchedPacks={dispatchedPacks}
          dispatchingPackId={dispatchingPackId}
          dispatchingAll={dispatchingAll}
        />
      </TabsContent>

      <TabsContent value="gallery" className="animate-fade-in">
        <SupplementGallery openAddRequest={galleryAddRequest} />
      </TabsContent>
    </Tabs>
  );
}
