import { useEffect, useMemo, useState } from "react";
import {
  ChevronLeft,
  ChevronRight,
  CreditCard,
  FileText,
  Info,
  Share2,
  Loader2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { type Supplement } from "@/lib/researcher/dummyData";

interface PackCatalogueProps {
  packName: string;
  items: Supplement[];
  onBack: () => void;
  deliveryAddress?: string;
  savedDeliveryAddress?: string;
  onDeliveryAddressChange?: (value: string) => void;
  onPay?: (deliveryAddress: string, options: { saveAddress: boolean }) => void;
  onReorder?: () => void;
  isPaying?: boolean;
  paymentState?: {
    isPaid: boolean;
    status: string | null;
    paidAt: string | null;
    paystackReference: string | null;
    orderId: number | null;
    orderStatus: string | null;
  };
}

const PLACEHOLDER_IMAGE =
  "https://images.unsplash.com/photo-1584362917165-526a968579e8?q=80&w=800&auto=format&fit=crop";

export function PackCatalogue({
  packName,
  items,
  onBack,
  deliveryAddress = "",
  savedDeliveryAddress = "",
  onDeliveryAddressChange,
  onPay,
  onReorder,
  isPaying = false,
  paymentState,
}: PackCatalogueProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const [itemImageIndexes, setItemImageIndexes] = useState<Record<string, number>>({});
  const [isShareDialogOpen, setIsShareDialogOpen] = useState(false);
  const [isSendingInvoice, setIsSendingInvoice] = useState(false);
  const [addressMode, setAddressMode] = useState<"saved" | "new">(
    savedDeliveryAddress.trim() ? "saved" : "new"
  );
  const [shouldSaveAddress, setShouldSaveAddress] = useState(Boolean(savedDeliveryAddress.trim()));
  const supplementsPerCard = 2;
  const totalPages = Math.max(1, Math.ceil(items.length / supplementsPerCard));
  const trimmedSavedDeliveryAddress = savedDeliveryAddress.trim();
  const trimmedDeliveryAddress = deliveryAddress.trim();
  const effectiveDeliveryAddress =
    addressMode === "saved" ? trimmedSavedDeliveryAddress : trimmedDeliveryAddress;
  const canProceedToPayment =
    Boolean(onPay) &&
    !isPaying &&
    items.length > 0 &&
    !paymentState?.isPaid &&
    effectiveDeliveryAddress.length > 0;
  const paymentButtonLabel = isPaying
    ? "Redirecting to secure checkout..."
    : !effectiveDeliveryAddress
      ? "Proceed to Payment"
      : "Proceed to Payment";

  useEffect(() => {
    if (trimmedSavedDeliveryAddress) {
      setAddressMode("saved");
      setShouldSaveAddress(true);
      return;
    }

    setAddressMode("new");
    setShouldSaveAddress(false);
  }, [trimmedSavedDeliveryAddress]);

  const currentItems = items.slice(
    currentPage * supplementsPerCard,
    (currentPage + 1) * supplementsPerCard
  );

  const nextPage = () => setCurrentPage((page) => (page + 1) % totalPages);
  const prevPage = () => setCurrentPage((page) => (page - 1 + totalPages) % totalPages);

  const getItemImages = (item: Supplement) => {
    const imageCandidates = [
      ...((((item as any).images as string[] | undefined) ?? [])),
      ...((((item as any).imageUrls as string[] | undefined) ?? [])),
      item.imageUrl,
    ].filter((image): image is string => Boolean(image));

    return imageCandidates.length > 0 ? Array.from(new Set(imageCandidates)) : [PLACEHOLDER_IMAGE];
  };

  const visibleItemImages = useMemo(
    () => Object.fromEntries(items.map((item) => [String(item.id), getItemImages(item)])),
    [items]
  );

  const changeItemImage = (itemId: number, direction: "prev" | "next") => {
    const key = String(itemId);
    const images = visibleItemImages[key] ?? [];
    if (images.length <= 1) return;

    setItemImageIndexes((prev) => {
      const currentIndex = prev[key] ?? 0;
      const nextIndex =
        direction === "next"
          ? (currentIndex + 1) % images.length
          : (currentIndex - 1 + images.length) % images.length;

      return { ...prev, [key]: nextIndex };
    });
  };

  return (
    <div className="mx-auto w-full max-w-4xl animate-in space-y-6 px-4 pb-10 fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex items-center gap-4">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="h-10 w-10 shrink-0 rounded-full bg-white text-slate-900 shadow-md"
        >
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="truncate text-2xl font-bold text-slate-900">{packName}</h2>
      </div>

      <div className="relative rounded-[32px] border border-white/20 bg-white/40 p-4">
        <div className="flex justify-center">
          <Card className="block h-auto w-full max-w-[720px] overflow-hidden rounded-b-3xl rounded-t-none border-none bg-white shadow-none">
            <div className="flex flex-row gap-2 overflow-hidden">
          {currentItems.map((item) => {
            const imageKey = String(item.id);
            const images = visibleItemImages[imageKey] ?? [PLACEHOLDER_IMAGE];
            const currentImageIndex = itemImageIndexes[imageKey] ?? 0;
            const totalPrice = item.price * (((item as any).qty as number | undefined) || 1);

            return (
              <div
                key={item.id}
                className="flex min-h-[320px] min-w-0 basis-1/2 flex-col overflow-hidden bg-emerald-50/70"
              >
                <div className="relative flex h-[230px] w-full items-center justify-center overflow-hidden bg-slate-300">
                  <div
                    className="flex h-full w-full transition-transform duration-500 ease-out"
                    style={{ transform: `translateX(-${currentImageIndex * 100}%)` }}
                  >
                    {images.map((image, index) => (
                      <div
                        key={`${item.id}-slide-${index}`}
                        className="flex h-full min-w-full items-center justify-center bg-slate-300"
                      >
                        <img
                          src={image}
                          alt={`${item.name} ${index + 1}`}
                          className="h-[70%] w-auto max-w-[82%]"
                        />
                      </div>
                    ))}
                  </div>

                  {images.length > 1 && (
                    <>
                      <div className="absolute inset-x-0 top-1/2 flex -translate-y-1/2 justify-between px-3">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => changeItemImage(item.id, "prev")}
                          className="h-7 w-7 rounded-full bg-white/85 text-slate-700 shadow-sm hover:bg-white"
                        >
                          <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => changeItemImage(item.id, "next")}
                          className="h-7 w-7 rounded-full bg-white/85 text-slate-700 shadow-sm hover:bg-white"
                        >
                          <ChevronRight className="h-4 w-4" />
                        </Button>
                      </div>
                      <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full bg-black/20 px-2 py-1 backdrop-blur-sm">
                        {images.map((_, index) => (
                          <button
                            key={`${item.id}-image-${index}`}
                            type="button"
                            onClick={() =>
                              setItemImageIndexes((prev) => ({
                                ...prev,
                                [imageKey]: index,
                              }))
                            }
                            className={`h-1.5 rounded-full transition-all ${
                              index === currentImageIndex ? "w-4 bg-white" : "w-1.5 bg-white/60"
                            }`}
                            aria-label={`Show image ${index + 1} for ${item.name}`}
                          />
                        ))}
                      </div>
                    </>
                  )}
                </div>

                <CardContent className="flex h-[90px] min-w-0 flex-col justify-start p-2.5">
                  <div className="min-h-[28px]">
                    <h3 className="line-clamp-2 text-sm font-bold leading-tight text-slate-800">
                      {(item as any).qty > 1 && (
                        <span className="mr-1 text-emerald-600">{(item as any).qty}x</span>
                      )}
                      {item.name}
                    </h3>
                  </div>

                  <p className="mt-px text-sm font-black text-emerald-600">
                    NGN {totalPrice.toLocaleString()}
                  </p>
                </CardContent>
              </div>
            );
          })}
            </div>
          </Card>
        </div>

        {totalPages > 1 && (
          <div className="mt-6 flex flex-col items-center gap-3">
            <div className="flex items-center gap-6">
              <Button
                variant="ghost"
                size="icon"
                onClick={prevPage}
                className="h-10 w-10 rounded-full bg-white text-slate-400 shadow-sm hover:bg-white hover:text-emerald-600"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <div
                    key={idx}
                    className={`h-1.5 rounded-full transition-all duration-300 ${
                      idx === currentPage ? "w-5 bg-emerald-500" : "w-1.5 bg-slate-200"
                    }`}
                  />
                ))}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={nextPage}
                className="h-10 w-10 rounded-full bg-white text-slate-400 shadow-sm hover:bg-white hover:text-emerald-600"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      <Accordion
        type="single"
        collapsible
        className="w-full overflow-hidden rounded-[24px] border border-slate-50 bg-white shadow-sm"
      >
        <AccordionItem value="rationale" className="border-b border-slate-50 last:border-0">
          <AccordionTrigger className="px-5 py-4 font-semibold text-slate-700 hover:no-underline">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-emerald-500" />
              <span>Rationale</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 text-sm leading-relaxed text-slate-600">
            This selection is curated specifically for your profile. These supplements work
            synergistically to address your identified HLS factors and support your long-term
            health goals effectively within your convenience budget.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="invoice" className="border-b border-slate-50 last:border-0">
          <AccordionTrigger className="px-5 py-4 font-semibold text-slate-700 hover:no-underline">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              <span>View Invoice</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="mb-4 flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-slate-700">Invoice summary</p>
                <p className="text-xs text-slate-500">Share this invoice to your WhatsApp</p>
              </div>
              <Button
                variant="outline"
                size="sm"
                className="rounded-full"
                onClick={() => setIsShareDialogOpen(true)}
              >
                <Share2 className="h-4 w-4" />
                Share
              </Button>
            </div>
            <div className="space-y-3 pt-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-slate-600">
                  <span className="flex-1">
                    {item.name}
                    <span className="ml-1 text-slate-400">x{(item as any).qty || 1}</span>
                  </span>
                  <span className="font-medium">
                    NGN {(item.price * ((item as any).qty || 1)).toLocaleString()}
                  </span>
                </div>
              ))}
              <div className="mt-1 flex justify-between border-t border-dashed pt-3 text-base font-bold text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-600">
                  NGN {items
                    .reduce((sum, item) => sum + item.price * ((item as any).qty || 1), 0)
                    .toLocaleString()}
                </span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment" className="border-none">
          <AccordionTrigger className="px-5 py-4 font-semibold text-slate-700 hover:no-underline">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              <span>Payment & Delivery</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-5 rounded-[24px] border border-slate-300 bg-slate-200 p-6 shadow-[0_18px_45px_-24px_rgba(15,23,42,0.18)]">
              {paymentState?.isPaid ? (
                <div className="rounded-2xl border border-emerald-200 bg-white px-4 py-4 text-sm text-slate-700">
                  <p className="font-semibold text-emerald-700">Payment successful</p>
                  <p className="mt-1">This nutrient pack has already been paid for.</p>
                  <Button
                    type="button"
                    onClick={onReorder}
                    className="mt-3 rounded-full bg-emerald-600 px-5 text-white hover:bg-emerald-700"
                  >
                    Reorder Pack
                  </Button>
                </div>
              ) : null}

              {!paymentState?.isPaid ? (
                <>
              <div className="space-y-3 rounded-[22px] border border-emerald-200 bg-white p-4 shadow-[0_12px_30px_-20px_rgba(15,23,42,0.35)]">
                <div className="space-y-1 text-left">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-emerald-600">
                    Delivery
                  </p>
                </div>

                {trimmedSavedDeliveryAddress ? (
                  <div className="space-y-3">
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() => {
                          setAddressMode("saved");
                          setShouldSaveAddress(true);
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          addressMode === "saved"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Use saved address
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setAddressMode("new");
                          setShouldSaveAddress(false);
                        }}
                        className={`rounded-xl border px-3 py-2 text-sm font-semibold transition ${
                          addressMode === "new"
                            ? "border-emerald-600 bg-emerald-50 text-emerald-700"
                            : "border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                        }`}
                      >
                        Enter new address
                      </button>
                    </div>

                    {addressMode === "saved" ? (
                      <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700">
                        {trimmedSavedDeliveryAddress}
                      </div>
                    ) : (
                      <Input
                        value={deliveryAddress}
                        onChange={(event) => onDeliveryAddressChange?.(event.target.value)}
                        placeholder="Enter your delivery address"
                        className="h-12 border-2 border-slate-200 bg-slate-100/90 shadow-inner focus-visible:border-emerald-500 focus-visible:bg-white"
                      />
                    )}
                  </div>
                ) : (
                  <Input
                    value={deliveryAddress}
                    onChange={(event) => onDeliveryAddressChange?.(event.target.value)}
                    placeholder="Enter your delivery address"
                    className="h-12 border-2 border-slate-200 bg-slate-100/90 shadow-inner focus-visible:border-emerald-500 focus-visible:bg-white"
                  />
                )}

                <label className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700">
                  <input
                    type="checkbox"
                    checked={shouldSaveAddress}
                    onChange={(event) => setShouldSaveAddress(event.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span>Save this address to my profile</span>
                </label>
              </div>
                <Button
                  onClick={() =>
                    onPay?.(effectiveDeliveryAddress, { saveAddress: shouldSaveAddress })
                  }
                  disabled={!canProceedToPayment}
                  className="w-full rounded-full bg-emerald-600 py-6 text-white hover:bg-emerald-700 disabled:bg-emerald-300 disabled:text-white"
                >
                  {paymentButtonLabel}
                </Button>
                </>
              ) : null}
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>

      <Dialog open={isShareDialogOpen} onOpenChange={setIsShareDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Share Invoice</DialogTitle>
            <DialogDescription>
              {isSendingInvoice
                ? "Sending to your WhatsApp number..."
                : "Share to your WhatsApp number"}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 pt-4 text-center">
            {isSendingInvoice ? (
              <div className="flex flex-col items-center gap-3">
                <Loader2 className="h-8 w-8 animate-spin text-emerald-600" />
                <p className="text-sm text-slate-600">Sending to your WhatsApp number</p>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-sm text-slate-700">
                  Share this invoice as a PDF to your WhatsApp number.
                </p>
                <div className="flex items-center justify-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setIsShareDialogOpen(false)}
                  >
                    No
                  </Button>
                  <Button
                    onClick={async () => {
                      setIsSendingInvoice(true);
                      try {
                        await new Promise((resolve) => setTimeout(resolve, 1500));
                      } finally {
                        setIsSendingInvoice(false);
                        setIsShareDialogOpen(false);
                      }
                    }}
                  >
                    Yes
                  </Button>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
