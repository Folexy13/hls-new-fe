import { Card, CardContent } from "@/components/ui/card";
import { packCategories, type Supplement } from "@/lib/researcher/dummyData";
import { ChevronRight, PackageCheck } from "lucide-react";

interface MyNutrientPacksProps {
  dispatchedPacks: Record<string, boolean>;
  selectedSupplements: Record<string, Supplement[]>;
  onViewCatalogue: (packId: string) => void;
}

export function MyNutrientPacks({ dispatchedPacks, selectedSupplements, onViewCatalogue }: MyNutrientPacksProps) {
  const getBannerStyle = (id: string) => {
    switch(id) {
      case 'economic': return "bg-rose-400/45 backdrop-blur-lg border-white/20";
      case 'doctors_choice': return "bg-teal-500/40 backdrop-blur-lg border-white/20";
      case 'premium_offer': return "bg-fuchsia-500/35 backdrop-blur-lg border-white/20";
      default: return "bg-emerald-600/40 backdrop-blur-lg border-white/20";
    }
  };

  const getPackDescription = (id: string) => {
    switch(id) {
      case 'economic': return "what you can buy conveniently";
      case 'doctors_choice': return "What your doctors recommend";
      case 'premium_offer': return "based on reviews all around the world";
      default: return "Custom nutrition pack";
    }
  };

  return (
    <div className="flex flex-col items-center gap-5 w-full">
      {packCategories.map((pack) => {
        const isDispatched = !!dispatchedPacks[pack.id];
        const bannerColor = getBannerStyle(pack.id);
            
        return (
          <div 
            key={pack.id}
            className={`relative w-[90vw] max-w-2xl overflow-hidden rounded-bl-[28px] rounded-tr-[28px] shadow-lg transition-transform active:scale-[0.98] ${!isDispatched ? 'grayscale-[0.5] opacity-80' : 'cursor-pointer'}`}
            style={{ height: 'calc(45vw)', maxHeight: '240px' }}
            onClick={() => isDispatched && onViewCatalogue(pack.id)}
          >
            {/* Background Layer (Matches provided HTML structure) */}
            <div className={`absolute inset-0 z-0 ${bannerColor}`}></div>
            <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-white/10 blur-2xl z-10"></div>
            
            <div className="relative z-20 h-full w-full p-5 flex flex-col justify-between">
              <div>
                <h3 className="text-lg font-bold text-white">{pack.name}</h3>
                <p className="mt-1 text-xs text-white/90">{getPackDescription(pack.id)}</p>
              </div>

              <div className="flex items-end justify-between">
                <span className="text-[11px] text-white/80">Explore packs</span>
                <button 
                  className="h-10 w-10 rounded-full bg-white text-slate-900 shadow-md flex items-center justify-center"
                  aria-label={`Open ${pack.name}`}
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}