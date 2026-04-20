import { useState } from "react";
import { ChevronLeft, ChevronRight, FileText, CreditCard, Info } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Card, CardContent } from "@/components/ui/card";
import { type Supplement } from "@/lib/researcher/dummyData";

interface PackCatalogueProps {
  packName: string;
  items: Supplement[];
  onBack: () => void;
}

export function PackCatalogue({ packName, items, onBack }: PackCatalogueProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const itemsPerPage = 2;
  const totalPages = Math.ceil(items.length / itemsPerPage);

  const currentItems = items.slice(
    currentPage * itemsPerPage,
    (currentPage + 1) * itemsPerPage
  );

  const nextPage = () => setCurrentPage((p) => (p + 1) % totalPages);
  const prevPage = () => setCurrentPage((p) => (p - 1 + totalPages) % totalPages);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10 w-full max-w-4xl mx-auto px-4">
      <div className="flex items-center gap-4">
        <Button variant="ghost" size="icon" onClick={onBack} className="rounded-full bg-white text-slate-900 shadow-md h-10 w-10 flex items-center justify-center shrink-0">
          <ChevronLeft className="h-5 w-5" />
        </Button>
        <h2 className="text-2xl font-bold text-slate-900 truncate">{packName}</h2>
      </div>

      {/* 2-Item Carousel */}
      <div className="relative bg-white/40 backdrop-blur-md p-4 rounded-[32px] border border-white/20 shadow-xl">
        <div className="grid grid-cols-2 gap-4 min-h-[280px]">
          {currentItems.map((item) => (
            <Card key={item.id} className="overflow-hidden border-none shadow-sm rounded-3xl flex flex-col bg-white">
              <div className="aspect-square bg-slate-50/50 flex items-center justify-center p-4">
                <img src={item.imageUrl} alt={item.name} className="max-h-full object-contain" />
              </div>
              <CardContent className="p-4 pt-2 flex-1">
                <h3 className="font-bold text-sm line-clamp-2 text-slate-800 leading-tight">
                  {(item as any).qty > 1 && <span className="text-emerald-600 mr-1">{(item as any).qty}x</span>}
                  {item.name}
                </h3>
                <p className="text-emerald-600 font-black text-sm mt-1">
                  ₦{(item.price * ((item as any).qty || 1)).toLocaleString()}
                </p>
                <p className="text-[10px] text-slate-500 mt-1 line-clamp-2 leading-tight">{item.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>

        {totalPages > 1 && (
          <div className="flex flex-col items-center gap-3 mt-6">
            <div className="flex items-center gap-6">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={prevPage} 
                className="h-10 w-10 rounded-full bg-white shadow-sm text-slate-400 hover:text-emerald-600 hover:bg-white"
              >
                <ChevronLeft className="h-5 w-5" />
              </Button>
              <div className="flex gap-1.5">
                {Array.from({ length: totalPages }).map((_, idx) => (
                  <div 
                    key={idx} 
                    className={`h-1.5 rounded-full transition-all duration-300 ${idx === currentPage ? 'w-5 bg-emerald-500' : 'w-1.5 bg-slate-200'}`} 
                  />
                ))}
              </div>
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={nextPage} 
                className="h-10 w-10 rounded-full bg-white shadow-sm text-slate-400 hover:text-emerald-600 hover:bg-white"
              >
                <ChevronRight className="h-5 w-5" />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Info Accordion Section */}
      <Accordion type="single" collapsible className="w-full bg-white rounded-[24px] shadow-sm border border-slate-50 overflow-hidden">
        <AccordionItem value="rationale" className="border-b border-slate-50 last:border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline text-slate-700 font-semibold">
            <div className="flex items-center gap-2">
              <Info className="h-5 w-5 text-emerald-500" />
              <span>Rationale</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5 text-slate-600 text-sm leading-relaxed">
            This selection is curated specifically for your profile. These supplements work synergistically to address your identified HLS factors and support your long-term health goals effectively within your convenience budget.
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="invoice" className="border-b border-slate-50 last:border-0">
          <AccordionTrigger className="px-5 py-4 hover:no-underline text-slate-700 font-semibold">
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-emerald-500" />
              <span>View Invoice</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="space-y-3 pt-2">
              {items.map((item) => (
                <div key={item.id} className="flex justify-between text-xs text-slate-600">
                  <span className="flex-1">{item.name} <span className="text-slate-400 ml-1">x{(item as any).qty || 1}</span></span>
                  <span className="font-medium">₦{(item.price * ((item as any).qty || 1)).toLocaleString()}</span>
                </div>
              ))}
              <div className="flex justify-between font-bold text-base border-t border-dashed pt-3 mt-1 text-slate-900">
                <span>Grand Total</span>
                <span className="text-emerald-600">₦{items.reduce((sum, i) => sum + (i.price * ((i as any).qty || 1)), 0).toLocaleString()}</span>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>

        <AccordionItem value="payment" className="border-none">
          <AccordionTrigger className="px-5 py-4 hover:no-underline text-slate-700 font-semibold">
            <div className="flex items-center gap-2">
              <CreditCard className="h-5 w-5 text-emerald-500" />
              <span>Make Payment</span>
            </div>
          </AccordionTrigger>
          <AccordionContent className="px-5 pb-5">
            <div className="bg-emerald-50/50 p-6 rounded-[20px] text-center space-y-4">
              <p className="text-xs font-medium text-slate-500 uppercase tracking-widest">Safe & Secure Payment</p>
              <Button className="w-full bg-emerald-600 hover:bg-emerald-700 text-white rounded-full py-6 shadow-lg shadow-emerald-100">
                Pay & Finalize Pack
              </Button>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
}