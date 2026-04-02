import React, { useEffect, useMemo, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Bell, Menu, Search, Newspaper, Tv, ShoppingCart, Pill, Layers, ArrowRight } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import logo from '../../images/logo.jpg';
import { NavLink } from 'react-router-dom';

const Dashboard = () => {
  const [messageOpen, setMessageOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const [bannerIndex, setBannerIndex] = useState(0);
  const [activeTab, setActiveTab] = useState<'pharmacy' | 'nutrient'>('pharmacy');
  const [pharmacySearch, setPharmacySearch] = useState('');
  const [selectedPharmacy, setSelectedPharmacy] = useState<string | null>(null);
  const [showPharmacyModal, setShowPharmacyModal] = useState(false);
  const [pharmacyModalDismissed, setPharmacyModalDismissed] = useState(false);

  const adminMessages = [
    { id: 'msg-1', title: 'Welcome to HLS', body: 'Your assessment is complete. Start exploring your personalized recommendations.' },
    { id: 'msg-2', title: 'New Supplement Drop', body: 'Check out the new immunity stack curated for your profile.' },
    { id: 'msg-3', title: 'Reminder', body: 'Set your account password to unlock your reward points.' },
  ];

  const bannerImages = useMemo(() => ([
    'https://images.unsplash.com/photo-1542838132-92c53300491e?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1532009877282-3340270e0529?q=80&w=1600&auto=format&fit=crop',
    'https://images.unsplash.com/photo-1514996937319-344454492b37?q=80&w=1600&auto=format&fit=crop',
  ]), []);
  const pharmacyItems = useMemo(
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
    if (!query) return [];
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
    if (!selectedPharmacy && !pharmacyModalDismissed) {
      setShowPharmacyModal(true);
    }
  }, [selectedPharmacy, pharmacyModalDismissed]);
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
    const timer = window.setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [bannerImages.length]);

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
          <div className="sticky top-0 z-50 bg-white/80 backdrop-blur-md py-3">
            <div className="flex flex-col items-center px-4">
              <div className="w-full max-w-3xl rounded-full border border-emerald-100 bg-white/70 backdrop-blur-md shadow-lg shadow-emerald-100/50 flex overflow-hidden">
              <button
                type="button"
                onClick={() => setActiveTab('pharmacy')}
                className={`flex-1 rounded-l-full rounded-r-none px-4 py-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === 'pharmacy'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-transparent text-emerald-800'
                }`}
              >
                <Pill className="h-4 w-4 text-white" />
                My Pharmacy
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('nutrient')}
                className={`flex-1 rounded-r-full rounded-l-none px-4 py-2 text-sm font-semibold transition flex items-center justify-center gap-2 ${
                  activeTab === 'nutrient'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-transparent text-emerald-800'
                }`}
              >
                <Layers className="h-4 w-4 text-white" />
                My Nutrient Pack
              </button>
            </div>
            </div>
          </div>

          <div className="mt-6">
            {activeTab === 'pharmacy' ? (
              <div className="space-y-4">
                <div className="w-full max-w-xl px-4">
                  <div className="relative">
                    <Search className="h-4 w-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <Input
                      value={searchValue}
                      onChange={(e) => setSearchValue(e.target.value)}
                      placeholder="Search any medication"
                      className="pl-9 bg-white"
                    />
                  </div>
                </div>
                {!selectedPharmacy ? (
                  <div className="w-full rounded-2xl border border-dashed border-emerald-200 bg-emerald-50/60 p-8 text-center text-sm font-medium text-emerald-700">
                    Select a pharmacy to view available drugs.
                  </div>
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
                          <div className="mt-5 flex flex-col gap-2">
                            <div className="flex items-center justify-center">
                              <p className="text-sm font-semibold text-slate-900 leading-tigh">{item.title}</p>
                              <p className="text-sm font-medium text-black absolute top-1 right-4">{item.price}</p>
                            </div>
                            <div className="flex justify-around w-full gap-2">
                              <p className="text-xs h-fit p-1 text-emerald-600 bg-gray-200 hover:text-emerald-700">
                                Buy
                              </p>
                              <p className="text-xs h-fit p-1 text-orange-500 bg-gray-200 hover:text-orange-600">
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
                {filteredPharmacyItems.length > 0 && (
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
                {promoCards.map((card) => (
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
                          type="button"
                          className="h-10 w-10 rounded-full bg-white text-slate-900 shadow-md flex items-center justify-center"
                          aria-label={`Open ${card.title}`}
                        >
                          <ArrowRight className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {showPharmacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black backdrop-blur-sm px-4">
          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">
            <h2 className="text-lg font-semibold text-slate-900">Select your pharmacy</h2>
            <p className="mt-1 text-sm text-slate-500">
              Start typing to find and select one or more pharmacies.
            </p>
            <div className="mt-4">
              <Input
                value={pharmacySearch}
                onChange={(e) => setPharmacySearch(e.target.value)}
                placeholder="Enter pharmacy name"
                className="bg-white"
              />
            </div>
            <div className="mt-4 max-h-56 overflow-y-auto space-y-2">
              {filteredPharmacyDirectory.length === 0 ? (
               <></>
              ) : (
                filteredPharmacyDirectory.map((name) => {
                  const selected = selectedPharmacy === name;
                  return (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        setSelectedPharmacy((prev) => (prev === name ? null : name));
                      }}
                      className={`w-full rounded-lg border px-3 py-2 text-left text-sm font-medium transition ${
                        selected
                          ? 'border-emerald-500 bg-emerald-50 text-emerald-700'
                          : 'border-slate-200 bg-white text-slate-700 hover:bg-slate-50'
                      }`}
                    >
                      {name}
                    </button>
                  );
                })
              )}
            </div>
            <div className="mt-4 flex items-center justify-between gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setShowPharmacyModal(false);
                  setPharmacyModalDismissed(true);
                }}
              >
                Cancel
              </Button>
              <Button
                onClick={() => setShowPharmacyModal(false)}
                disabled={!selectedPharmacy}
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}

      <nav className="fixed bottom-0 left-0 right-0 z-30 border-t bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900">
        <div className="max-w-6xl mx-auto px-4 py-3">
          <div className="grid grid-cols-3 text-center">
            <NavLink
              to="/benfek/dashboard"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`
              }
            >
              <ShoppingCart className="h-5 w-5" color='white' />
              Store
            </NavLink>
            <NavLink
              to="/blog/1"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`
              }
            >
              <Newspaper className="h-5 w-5" color='white' />
              Read Articles
            </NavLink>
            <NavLink
              to="/podcast"
              className={({ isActive }) =>
                `flex flex-col items-center gap-1 text-xs font-medium ${isActive ? 'text-white' : 'text-gray-500'}`
              }
            >
              <Tv className="h-5 w-5" color='white' />
              Podcast
            </NavLink>
          </div>
        </div>
      </nav>
    </div>
  );
};

export default Dashboard;
