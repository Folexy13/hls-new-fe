import { useEffect, useState } from "react";
import { Check, ImageIcon, Loader2, X } from "lucide-react";
import { apiClient } from "@/config/axios";
import { Button } from "@/components/ui/button";

export type SupplementImageSuggestion = {
  id: number;
  name: string;
  manufacturer?: string | null;
  strength?: string | null;
  category?: string | null;
  imageUrl: string;
};

type Props = {
  query: string;
  selectedId?: number | null;
  disabled?: boolean;
  onSelect: (suggestion: SupplementImageSuggestion) => void;
  onClear: () => void;
};

export function SupplementImageSuggestions({ query, selectedId, disabled, onSelect, onClear }: Props) {
  const [suggestions, setSuggestions] = useState<SupplementImageSuggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    const normalized = query.trim();
    if (disabled || normalized.length < 2) {
      setSuggestions([]);
      setLoading(false);
      setLoadError(false);
      return;
    }

    const controller = new AbortController();
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      setLoadError(false);
      try {
        const response = await apiClient.get("/api/v2/supplements/image-suggestions", {
          params: { q: normalized },
          signal: controller.signal,
        });
        setSuggestions(response.data?.data?.suggestions || []);
      } catch (error: any) {
        if (error?.code === "ERR_CANCELED") return;
        try {
          const fallback = await apiClient.get("/api/v2/supplements/search", {
            params: { q: normalized },
            signal: controller.signal,
          });
          const products = fallback.data?.data?.supplements || [];
          const seen = new Set<string>();
          const matches = products.filter((product: SupplementImageSuggestion) => {
            if (!product.imageUrl) return false;
            if (!product.name.toLowerCase().includes(normalized.toLowerCase())) return false;
            const key = `${product.name.trim().toLowerCase()}::${product.imageUrl}`;
            if (seen.has(key)) return false;
            seen.add(key);
            return true;
          }).slice(0, 8);
          setSuggestions(matches);
        } catch (fallbackError: any) {
          if (fallbackError?.code !== "ERR_CANCELED") {
            setSuggestions([]);
            setLoadError(true);
          }
        }
      } finally {
        if (!controller.signal.aborted) setLoading(false);
      }
    }, 300);

    return () => {
      window.clearTimeout(timeout);
      controller.abort();
    };
  }, [disabled, query]);

  if (disabled || query.trim().length < 2) return null;

  return (
    <div className="mt-2 rounded-md border bg-white">
      <div className="flex min-h-9 items-center justify-between border-b px-3 py-2">
        <span className="text-xs font-medium text-slate-600">Images already in HLS</span>
        {loading ? <Loader2 className="h-4 w-4 animate-spin text-slate-400" /> : null}
      </div>
      {!loading && loadError ? (
        <p className="px-3 py-3 text-xs text-red-600">Unable to load matching images. Please try again.</p>
      ) : !loading && suggestions.length === 0 ? (
        <p className="px-3 py-3 text-xs text-slate-500">No matching product images found.</p>
      ) : (
        <div className="max-h-56 overflow-y-auto p-1">
          {suggestions.map((suggestion) => {
            const selected = selectedId === suggestion.id;
            return (
              <button
                key={suggestion.id}
                type="button"
                onClick={() => selected ? onClear() : onSelect(suggestion)}
                className="flex w-full items-center gap-3 rounded-sm px-2 py-2 text-left hover:bg-slate-50"
              >
                <img src={suggestion.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded border object-contain" />
                <span className="min-w-0 flex-1">
                  <span className="block truncate text-sm font-medium text-slate-900">{suggestion.name}</span>
                  <span className="block truncate text-xs text-slate-500">
                    {[suggestion.manufacturer, suggestion.strength].filter(Boolean).join(" | ") || suggestion.category || "Existing HLS product"}
                  </span>
                </span>
                {selected ? <Check className="h-5 w-5 shrink-0 text-emerald-600" /> : <ImageIcon className="h-5 w-5 shrink-0 text-slate-400" />}
              </button>
            );
          })}
        </div>
      )}
      {selectedId ? (
        <div className="border-t px-2 py-1.5 text-right">
          <Button type="button" variant="ghost" size="sm" onClick={onClear} className="h-7 gap-1 text-xs">
            <X className="h-3.5 w-3.5" /> Clear selection
          </Button>
        </div>
      ) : null}
    </div>
  );
}
