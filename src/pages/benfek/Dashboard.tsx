import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Menu, Search, BookOpen, Headphones, LayoutDashboard, Pill, Layers, ArrowRight, MessageCircle, Building2, CheckCircle2, X, Dot } from 'lucide-react';
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { NavLink } from 'react-router-dom';
import { apiClient } from '@/config/axios';
import { PackCatalogue } from '@/components/researcher/PackCatalogue';
import { packCategories } from '@/lib/researcher/dummyData';

const Dashboard = () => {
  const [searchValue, setSearchValue] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'nutrient'>('pharmacy');
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [pharmacyModalDismissed, setPharmacyModalDismissed] = useState(false);
  const [hasShownPharmacyModal, setHasShownPharmacyModal] = useState(false);
  const [showNutrientNotice, setShowNutrientNotice] = useState(false);
  const [hasNutrientNotice, setHasNutrientNotice] = useState(true);
  const [nutrientReady, setNutrientReady] = useState(false);
  const [apiPharmacyItems, setApiPharmacyItems] = useState<Array<{ id: string; title: string; price: string; image: string }>>([]);
  const [activeCatalogueId, setActiveCatalogueId] = useState<string | null>(null);
  const [packItems, setPackItems] = useState<Record<string, any[]>>({});

  const bannerImages = useMemo(() => ([
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532009877282-3340270e0529?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1600&auto=format&fit=crop',
  ]), []);
  const fallbackPharmacyItems = useMemo(
    () => [
      {
        id: 'supp-1',
        title: 'Feroglobin Liquid',
        price: '₦24.99',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.34.jpeg',
      },
      {
        id: 'supp-2',
        title: 'Lung Defense',
        price: '₦31.50',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.35.jpeg',
      },
      {
        id: 'supp-3',
        title: 'Wellwoman 50+',
        price: '₦18.99',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.35 (1).jpeg',
      },
      {
        id: 'supp-4',
        title: 'Wellwoman 70+',
        price: '₦22.00',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.36.jpeg',
      },
      {
        id: 'supp-5',
        title: 'Osteocare Chewable',
        price: '₦29.75',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.36 (1).jpeg',
      },
      {
        id: 'supp-6',
        title: 'Jointace Max',
        price: '₦16.40',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.36 (2).jpeg',
      },
      {
        id: 'supp-7',
        title: 'Wellman 50+',
        price: '₦27.90',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.37.jpeg',
      },
      {
        id: 'supp-8',
        title: 'Cod Liver Oil',
        price: '₦19.60',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.37 (1).jpeg',
      },
      {
        id: 'supp-9',
        title: 'Nectamin Liquid',
        price: '₦21.20',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.37 (2).jpeg',
      },
      {
        id: 'supp-10',
        title: 'Cardioace Max',
        price: '₦26.50',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 22.32.37 (3).jpeg',
      },
      {
        id: 'supp-11',
        title: 'Prenatal Gummies',
        price: '₦23.40',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 23.16.30.jpeg',
      },
      {
        id: 'supp-12',
        title: 'Tocovid SupraBio',
        price: '₦28.15',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 23.16.30 (1).jpeg',
      },
      {
        id: 'supp-13',
        title: 'Move Free Joint',
        price: '₦19.75',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 23.16.30 (2).jpeg',
      },
      {
        id: 'supp-14',
        title: 'Vitamin E 1000IU',
        price: '₦17.90',
        image: '/src/images/card/WhatsApp Image 2026-03-31 at 23.16.30 (3).jpeg',
      },
    ],
    []
  );

  useEffect(() => {
    let mounted = true;

    const fetchSupplements = async () => {
      try {
        const response = await apiClient.get('/api/v2/supplements');
        const data = response.data?.data?.supplements || [];
        const mapped = (data as Array<Record<string, unknown>>)
          .map((item) => {
            const stock = (item.stock as number) ?? 0;
            return {
              id: String(item.id ?? ''),
              title: String(item.name ?? ''),
              price: `₦${Number(item.price ?? 0).toLocaleString()}`,
              image: (item.imageUrl as string) || (item.image as string) || '/placeholder.svg',
              stock,
            };
          })
          // Do not show out-of-stock items in benfek dashboard.
          .filter((item) => item.id && item.title && item.stock > 0)
          .map(({ stock, ...rest }) => rest);

        if (mounted) setApiPharmacyItems(mapped);
      } catch {
        // Keep fallback list if API fails.
      }
    };

    fetchSupplements();
    return () => {
      mounted = false;
    };
  }, []);

  useEffect(() => {
    const fetchPacks = async () => {
      try {
        const response = await apiClient.get('/api/v2/benfek/packs');
        const packs = response.data?.data || [];
        const mapped: Record<string, any[]> = {};
        packs.forEach((p: any) => {
          mapped[p.packId] = (p.items || []).map((i: any) => ({
            ...i.supplement,
            qty: i.quantity
          }));
        });
        setPackItems(mapped);
      } catch (error) {
        console.error('Failed to fetch packs:', error);
      }
    };

    if (activeTab === 'nutrient') fetchPacks();
  }, [activeTab]);

  const pharmacyItems = useMemo(() => {
    return apiPharmacyItems.length > 0 ? apiPharmacyItems : fallbackPharmacyItems;
  }, [apiPharmacyItems, fallbackPharmacyItems]);
  const filteredPharmacyItems = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) return pharmacyItems;
    return pharmacyItems.filter((item) => item.title.toLowerCase().includes(query));
  }, [pharmacyItems, searchValue]);
  const pharmacyDirectory = useMemo(
    () => [
      'Greenleaf Pharmacy',
      'Sunrise Health Pharmacy',
      'Harmony Pharmacy',
      'Zenith Care Pharmacy',
      'Bluecrest Pharmacy',
      'PrimeCare Pharmacy',
      'LifePlus Pharmacy',
      'WellSpring Pharmacy',
      'Metro Health Pharmacy',
      'NovaCare Pharmacy',
      'CityCare Pharmacy',
      'Unity Pharmacy',
    ],
    []
  );
  const filteredPharmacyDirectory = useMemo(() => {
    const query = pharmacySearch.trim().toLowerCase();
    if (!query) return pharmacyDirectory;
    return pharmacyDirectory.filter((name) => name.toLowerCase().includes(query));
  }, [pharmacyDirectory, pharmacySearch]);
  const itemsPerPage = 10;
  const totalPages = Math.max(1, Math.ceil(filteredPharmacyItems.length / itemsPerPage));
  const [currentPage, setCurrentPage] = useState(1);
  const pagedPharmacyItems = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredPharmacyItems.slice(start, start + itemsPerPage);
  }, [currentPage, filteredPharmacyItems]);

  useEffect(() => {
    setCurrentPage(1);
  }, [searchValue]);
  useEffect(() => {
    if (activeTab !== 'pharmacy') return;
    if (selectedPharmacy || pharmacyModalDismissed || hasShownPharmacyModal) return;
    const timer = window.setTimeout(() => {
      setShowPharmacyModal(true);
      setHasShownPharmacyModal(true);
    }, 3000);
    return () => window.clearTimeout(timer);
  }, [activeTab, selectedPharmacy, pharmacyModalDismissed, hasShownPharmacyModal]);
  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages);
    }
  }, [currentPage, totalPages]);
  const promoCards = useMemo(
    () => [
      {
        id: 'promo-1',
        title: 'Economic pack',
        subtitle: 'what you can buy conveniently',
        image:
          'https://images.pexels.com/photos/15897783/pexels-photo-15897783.jpeg?cs=srgb&dl=pexels-by-natallia-311038782-15897783.jpg&fm=jpg',
        overlay: 'bg-rose-400/45',
        glow: 'bg-rose-200/35',
      },
      {
        id: 'promo-2',
        title: "Doctor's choice",
        subtitle: 'What your doctors recommend',
        image:
          'https://images.pexels.com/photos/4173244/pexels-photo-4173244.jpeg?cs=srgb&dl=pexels-gustavo-fring-4173244.jpg&fm=jpg',
        overlay: 'bg-teal-500/40',
        glow: 'bg-cyan-200/30',
      },
      {
        id: 'promo-3',
        title: 'premium offer pack',
        subtitle: 'based on reviews all around the world',
        image:
          'https://images.pexels.com/photos/32565192/pexels-photo-32565192.jpeg?cs=srgb&dl=pexels-prolificpeople-32565192.jpg&fm=jpg',
        overlay: 'bg-fuchsia-500/35',
        glow: 'bg-amber-200/25',
      },
    ],
    []
  );

  useEffect(() => {
    if (showPharmacyModal) return;
    const timer = window.setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [bannerImages.length, showPharmacyModal]);

  return (
    <div className="min-h-screen bg-gray-50 pb-24">
      <div className="max-w-6xl mx-auto pb-8 ">
        <div className="mb-6 flex justify-center">
          <div
            className="relative overflow-hidden shadow-lg"
            style={{ width: '100vw', maxWidth: '960px', height: 'calc(100vw / 2)' }}
          >
            <div
              className="flex h-full transition-transform duration-700 ease-out"
              style={{ transform: `translateX(-${bannerIndex * 100}%)` }}
            >
              {bannerImages.map((src, index) => (
                <div key={src} className="min-w-full h-full">
                  <img src={src} alt={`Banner ${index + 1}`} className="h-full w-full object-cover" />
                </div>
              ))}
            </div>
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/40" />
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
              {bannerImages.map((_, index) => (
                <span
                  key={`dot-${index}`}
                  className={`h-2 w-2 rounded-full ${index === bannerIndex ? 'bg-white' : 'bg-white/40'}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto">
          <div className="sticky top-0 z-30 bg-white/80 backdrop-blur-md py-3">
            <div className="flex flex-col items-center px-2">
              <div className="w-full max-w-3xl rounded-full border border-emerald-100 bg-white/70 backdrop-blur-md shadow-lg shadow-emerald-100/50 flex overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveTab('pharmacy')}
                className={`flex-1 rounded-l-full rounded-r-none py-2 text-xs font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === 'pharmacy'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-transparent text-emerald-800'
                }`}
              >
                <Pill
                  className={`h-4 w-4 ${
                    activeTab === 'pharmacy' ? 'text-white' : 'text-emerald-800'
                  }`}
                />
                <span className="min-w-0 max-w-[10rem] truncate">
                  {selectedPharmacy ?? 'My Pharmacy'}
                </span>
              </button>
              <div
                className={`relative flex-1 rounded-r-full rounded-l-none ${
                  activeTab === 'nutrient' ? 'bg-emerald-600 text-white' : 'bg-transparent text-emerald-800'
                }`}
              >
                <button
                  type="button"
                  onClick={() => setActiveTab('nutrient')}
                  className="flex w-full items-center justify-start gap-2 px-1 py-2 text-xs font-semibold transition"
                >
                  <Layers
                    className={`h-4 w-4 ${
                      activeTab === 'nutrient' ? 'text-white' : 'text-emerald-800'
                    }`}
                  />
                  My Nutrient Pack
                </button>
                {hasNutrientNotice && (
                  <button
                    type="button"
                    onClick={(event) => {
                      event.stopPropagation();
                      setShowNutrientNotice(true);
                      setHasNutrientNotice(false);
                    }}
                    className="absolute right-2 top-1 h-2.5 w-2.5 rounded-full bg-red-700 text-red-700 shadow-sm flex items-center justify-center"
                    aria-label="Nutrient pack update"
                  >
                    <Dot 
                     onClick={(event) => {
                      event.stopPropagation();
                      setShowNutrientNotice(true);
                      setHasNutrientNotice(false);
                    }}
                    />
                  </button>
                )}
              </div>
            </div>
            </div>
          </div>

          <div >
            {activeTab === 'pharmacy' ? (
              <div className="space-y-4">
                <div className="w-full px-4">
                  <div className="flex items-center justify-between gap-2">
                    <div className="relative flex-1 max-w-xl">
                      <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <Input
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                        placeholder="Search any medication"
                        className="pl-9 bg-white"
                      />
                    </div>
                    <button
                      type="button"
                      className="h-10 w-12 border rounded-sm border-emerald-100 bg-gray-500/90 text-white shadow-sm flex items-center justify-center"
                      aria-label="Open menu"
                    >
                      <Menu className="h-7 w-7" />
                    </button>
                  </div>
                  {selectedPharmacy && (
                    <button
                      type="button"
                      onClick={() => setShowPharmacyModal(true)}
                      className="mt-2 text-left text-xs font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
                    >
                      Change pharmacy
                    </button>
                  )}
                </div>
                {!selectedPharmacy ? (
                  <button
                    type="button"
                    onClick={() => setShowPharmacyModal(true)}
                    className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center text-sm font-medium text-emerald-700 hover:bg-emerald-50/80 transition"
                  >
                    Select a pharmacy to view available drugs.
                  </button>
                ) : (
                  <>
                    <div className="flex flex-wrap gap-4 justify-center">
                      {pagedPharmacyItems.map((item) => (
                        <div
                          key={item.id}
                          className="w-[40vw] h-[200px] rounded-3xl border border-slate-200 bg-white p-0 shadow-sm transition hover:shadow-md relative"
                        >
                          <div className="h-24 w-24 rounded-2xl bg-emerald-500 flex items-center justify-center justify-self-center shadow-inner mt-6">
                            <img
                              src={item.image}
                              alt={item.title}
                              className="h-full w-full object-cover"
                            />
                          </div>
                          <div className="mt-4 flex flex-col gap-2">
                            <div className="flex items-center justify-center">
                              <p className="text-sm font-semibold leading-tight text-slate-900">{item.title}</p>
                              <p className="text-sm font-medium text-black absolute top-1 right-4">{item.price}</p>
                            </div>
                            <div className="flex justify-around w-full gap-2">
                              <p className="flex h-4 items-center justify-center rounded-md px-3 text-xs text-emerald-600 bg-gray-200 hover:text-emerald-700">
                                Buy
                              </p>
                              <p className="flex h-4 items-center justify-center rounded-md px-3 text-xs text-orange-500 bg-gray-200 hover:text-orange-600">
                                Later
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                      {filteredPharmacyItems.length === 0 && (
                        <div className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center text-sm font-medium text-emerald-700">
                          No supplements match your search.
                        </div>
                      )}
                    </div>
                    {/* {filteredPharmacyItems.length > 0 && totalPages > 1 && (
                      <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                        <button
                          type="button"
                          className="h-8 px-3 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-700 bg-white disabled:opacity-50"
                          onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                          disabled={currentPage === 1}
                        >
                          Prev
                        </button>
                        <span className="text-xs font-medium text-emerald-700">
                          Page {currentPage} of {totalPages}
                        </span>
                        <div className="flex items-center gap-1">
                          {Array.from({ length: totalPages }, (_, index) => {
                            const page = index + 1;
                            return (
                              <button
                                key={`page-${page}`}
                                type="button"
                                onClick={() => setCurrentPage(page)}
                                className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
                                  currentPage === page
                                    ? 'bg-emerald-600 text-white'
                                    : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                                }`}
                              >
                                {page}
                              </button>
                            );
                          })}
                        </div>
                        <button
                          type="button"
                          className="h-8 px-3 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-700 bg-white disabled:opacity-50"
                          onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                          disabled={currentPage === totalPages}
                        >
                          Next
                        </button>
                      </div>
                    )} */}
                  </>
                )}
                {selectedPharmacy && filteredPharmacyItems.length > 0 && (
                  <div className="flex items-center justify-center gap-2 pt-2">
                    <button
                      type="button"
                      className="h-8 px-3 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-700 bg-white disabled:opacity-50"
                      onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                      disabled={currentPage === 1}
                    >
                      Prev
                    </button>
                    <div className="flex items-center gap-1">
                      {Array.from({ length: totalPages }, (_, index) => {
                        const page = index + 1;
                        return (
                          <button
                            key={`page-${page}`}
                            type="button"
                            onClick={() => setCurrentPage(page)}
                            className={`h-8 w-8 rounded-full text-xs font-semibold transition ${
                              currentPage === page
                                ? 'bg-emerald-600 text-white'
                                : 'bg-white text-emerald-700 border border-emerald-200 hover:bg-emerald-50'
                            }`}
                          >
                            {page}
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      className="h-8 px-3 rounded-full border border-emerald-200 text-xs font-semibold text-emerald-700 bg-white disabled:opacity-50"
                      onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex flex-col items-center gap-5">
                {activeCatalogueId ? (
                  <PackCatalogue 
                    packName={promoCards.find(p => p.id === activeCatalogueId)?.title || ""}
                    items={packItems[activeCatalogueId === 'promo-1' ? 'economic' : activeCatalogueId === 'promo-2' ? 'doctors_choice' : 'premium_offer'] || []}
                    onBack={() => setActiveCatalogueId(null)}
                  />
                ) : !nutrientReady ? (
                  <div className="w-full max-w-md rounded-2xl border border-emerald-100 bg-emerald-50/70 p-6 text-center text-sm text-emerald-800">
                    <p>Our researchers are working. An alert with a link will be sent to your number.</p>
                    <button
                      type="button"
                      onClick={() => {
                        setHasNutrientNotice(false);
                        setNutrientReady(true);
                      }}
                      className="mt-4 inline-flex items-center justify-center rounded-full bg-emerald-600 px-5 py-2 text-xs font-semibold text-white shadow-sm transition hover:bg-emerald-700"
                    >
                      View highest demand nutrient packs
                    </button>
                  </div>
                ) : (
                  promoCards.map((card) => (
                    <div
                      key={card.id}
                      className="relative w-[90vw] mx-auto overflow-hidden rounded-bl-[28px] rounded-tr-[28px] shadow-lg"
                      style={{ height: 'calc(90vw / 2)' }}
                    >
                      <img
                        src={card.image}
                        alt={card.title}
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-tr from-black/30 via-transparent to-white/15" />
                      <div
                        className={`absolute inset-0 ${card.overlay} backdrop-blur-lg border border-white/20`}
                      />
                      <div className={`absolute -right-10 -top-10 h-32 w-32 rounded-full ${card.glow} blur-2xl`} />
                      <div className="relative h-full w-full p-5 flex flex-col justify-between">
                        <div>
                          <h3 className="text-lg font-bold text-white">{card.title}</h3>
                          <p className="mt-1 text-xs text-white/90">{card.subtitle}</p>
                        </div>
                        <div className="flex items-end justify-between">
                          <span className="text-[11px] text-white/80">Explore packs</span>
                          <button
                            onClick={() => setActiveCatalogueId(card.id)}
                            type="button"
                            className="h-10 w-10 rounded-full bg-white text-slate-900 shadow-md flex items-center justify-center"
                            aria-label={`Open ${card.title}`}
                          >
                            <ArrowRight className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      <Dialog open={showPharmacyModal} onOpenChange={setShowPharmacyModal}>
        <DialogContent className="sm:max-w-[24rem] gap-0 overflow-hidden rounded-none border border-emerald-100 bg-white p-0 shadow-[0_28px_80px_-32px_rgba(15,23,42,0.45)] [&>button]:hidden sm:w-[24rem]">
          <div className="h-1.5 w-full bg-green-800" />

          <div className="flex max-h-[min(36rem,calc(100vh-4rem))] flex-col">
            <div className="px-5 pb-4 pt-5 sm:px-6 sm:pb-5 sm:pt-6">
              <div className="flex items-start justify-between gap-4">
                <div className="space-y-3">
                  <div className="inline-flex h-10 w-10 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600 ring-1 ring-emerald-100">
                    <Building2 className="h-5 w-5" />
                  </div>
                  <DialogHeader className="space-y-1 text-left">
                    <DialogTitle className="text-xl font-semibold tracking-[-0.02em] text-slate-950">
                      Select your pharmacy
                    </DialogTitle>
                    <DialogDescription className="sm:max-w-sm text-sm leading-6 text-slate-500 w-[70vw]">
                      Start typing to find and select one pharmacy before you continue.
                    </DialogDescription>
                  </DialogHeader>
                </div>

                <DialogClose
                  className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 transition hover:border-emerald-200 hover:text-emerald-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                  aria-label="Close pharmacy modal"
                >
                  <X className="h-4 w-4" />
                </DialogClose>
              </div>
            </div>

            {selectedPharmacy && (
              <div className="px-5 sm:px-6">
                <div className="rounded-[18px] border border-emerald-100 bg-gradient-to-r from-emerald-50 to-white px-4 py-3">
                  <div className="flex items-center gap-2 text-sm font-semibold text-emerald-950">
                    <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                    <span className="truncate">{selectedPharmacy}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedPharmacy(null);
                      setPharmacySearch('');
                    }}
                    className="mt-2 text-left text-xs font-semibold text-emerald-700 underline underline-offset-4 hover:text-emerald-800"
                  >
                    Change pharmacy
                  </button>
                </div>
              </div>
            )}

            <div className="flex-1 space-y-1.5 overflow-y-auto px-5 pb-1.5 sm:px-6 sm:pb-2">
              {!selectedPharmacy && (
                <div className="space-y-2">
                  <label
                    htmlFor="pharmacy-search"
                    className="text-sm font-medium text-slate-800"
                  >
                    Pharmacy name
                  </label>
                  <div className="rounded-[18px] border border-slate-200 bg-slate-50/80 p-2 transition focus-within:border-emerald-300 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-100">
                    <div className="relative">
                      <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                      <Input
                        id="pharmacy-search"
                        value={pharmacySearch}
                        onChange={(e) => setPharmacySearch(e.target.value)}
                        placeholder="Enter pharmacy name"
                        className="h-11 border-0 bg-transparent pl-10 pr-10 text-sm text-slate-900 shadow-none placeholder:text-slate-400 focus-visible:ring-0"
                      />
                      {pharmacySearch && (
                        <button
                          type="button"
                          onClick={() => setPharmacySearch('')}
                          className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                          aria-label="Clear pharmacy search"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-4">
                    <p className="text-sm font-semibold text-slate-900"></p>
                    <p className="text-xs text-slate-500">
                      {!selectedPharmacy && pharmacySearch.trim()
                        ? `${filteredPharmacyDirectory.length} result${filteredPharmacyDirectory.length === 1 ? '' : 's'}`
                        : ''}
                    </p>
                  </div>

                {pharmacySearch.trim() && !selectedPharmacy ? (
                  <div className="space-y-2">
                    {filteredPharmacyDirectory.length === 0 ? (
                      <div className="rounded-lg border border-dashed border-slate-200 bg-white px-4 py-7 text-left">
                        <p className="text-sm font-semibold text-slate-700">No pharmacies found</p>
                        <p className="mt-1 text-sm leading-6 text-slate-500">
                          Try a different pharmacy name to see matching locations.
                        </p>
                      </div>
                    ) : (
                      filteredPharmacyDirectory.map((name) => {
                        const selected = selectedPharmacy === name;
                        return (
                          <button
                            key={name}
                            type="button"
                            onClick={() => {
                              setSelectedPharmacy(name);
                              setPharmacySearch('');
                            }}
                            className={`group flex w-full items-center justify-between rounded-lg border px-3 py-2 text-left text-sm font-medium transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:ring-offset-2 ${
                              selected
                                ? 'border-green-800 bg-green-50 text-green-900'
                                : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                            }`}
                            aria-pressed={selected}
                          >
                            <div className="min-w-0">
                              <p className="truncate">{name}</p>
                            </div>
                            <span
                              className={`ml-4 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full border transition ${
                                selected
                                  ? 'border-green-800 bg-green-800 text-white'
                                  : 'border-slate-300 bg-white text-transparent group-hover:border-emerald-300'
                              }`}
                            >
                              <CheckCircle2 className="h-3.5 w-3.5" />
                            </span>
                          </button>
                        );
                      })
                    )}
                  </div>
                ) : null}
              </div>
            </div>

            <DialogFooter className="flex-col gap-2 border-t border-slate-100 bg-white px-5 py-2 sm:flex-col sm:px-6">
              <Button
                onClick={() => setShowPharmacyModal(false)}
                disabled={!selectedPharmacy}
                className="h-11 w-full self-stretch rounded-xl bg-green-800 px-5 text-sm font-semibold text-white shadow-sm transition hover:bg-green-900 disabled:bg-green-800 disabled:opacity-60 disabled:cursor-not-allowed"
              >
                Continue
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPharmacyModal(false);
                  setPharmacyModalDismissed(true);
                }}
                className="h-11 w-full self-stretch rounded-xl border-slate-200 bg-white px-5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
              >
                Cancel
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNutrientNotice} onOpenChange={setShowNutrientNotice}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Update</DialogTitle>
            <DialogDescription>
              Our researchers are working. An alert with a link will be sent you to view your nutrient type pack
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Bottom nav is rendered in `src/components/Layout.tsx` for Benfeks */}
    </div>
  );
};

export default Dashboard;
