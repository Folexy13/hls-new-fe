import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Filter, X } from "lucide-react";
import {
  ageBandOptions,
  bmiBandOptions,
  budgetRangeOptions,
  dosageFormOptions,
  genderOptions,
  hlsFactorOptions,
  lifestyleFactorOptions,
  currentMedicationOptions,
  medicalConditionOptions,
  organOptions,
} from "@/lib/researcher/taxonomy";

export type FilterClassId =
  | "principal_shop"
  | "age"
  | "gender"
  | "health_condition"
  | "organs"
  | "medical_conditions"
  | "current_medications"
  | "lifestyle_factors"
  | "hls_factors"
  | "recent_tags"
  | "dosage_form"
  | "budget_range";

export type AppliedClassFilters = Partial<Record<FilterClassId, string[]>>;

type ItemLike = {
  source?: string;
  dosageForm?: string;
  budgetRange?: string;
  tags?: Record<string, string[]>;
};

const RECENT_TAGS_KEY = "researcher.filter.recent_tags";

const uniq = (values: string[]) => Array.from(new Set(values.filter(Boolean)));

const normalize = (value: string) => value.trim();

const collectTagValues = (items: ItemLike[], tagKey: string) => {
  const out: string[] = [];
  for (const item of items) {
    const values = item.tags?.[tagKey] || [];
    for (const value of values) out.push(normalize(String(value)));
  }
  return uniq(out);
};

const matchesAny = (values: string[], selected: string[]) =>
  selected.length === 0 ? true : values.some((v) => selected.includes(v));

const matchesClass = (item: ItemLike, classId: FilterClassId, selected: string[]) => {
  if (!selected.length) return true;

  if (classId === "principal_shop") return String(item.source || "").toLowerCase() === "principal";

  const tags = item.tags || {};

  if (classId === "age") return matchesAny(tags["demographics.age_band"] || [], selected);
  if (classId === "gender") return matchesAny(tags["demographics.gender"] || [], selected);
  if (classId === "health_condition") return matchesAny(tags["anthropometrics.bmi_band"] || [], selected);
  if (classId === "organs") return matchesAny(tags["medical.organs"] || [], selected);
  if (classId === "medical_conditions") return matchesAny(tags["medical.conditions"] || [], selected);
  if (classId === "current_medications") return matchesAny(tags["medical.current_medications"] || [], selected);
  if (classId === "lifestyle_factors") return matchesAny(tags["lifestyle.factors"] || [], selected);
  if (classId === "hls_factors") return matchesAny(tags["hls_factors"] || [], selected);

  if (classId === "recent_tags") {
    const allValues = Object.values(tags).flatMap((v) => v || []);
    return matchesAny(allValues, selected);
  }

  if (classId === "dosage_form") return selected.includes(item.dosageForm || "");
  if (classId === "budget_range") return selected.includes(item.budgetRange || "");

  return true;
};

export function ClassFilterPopover({
  items,
  appliedFilters,
  onChangeAppliedFilters,
  includeDosageBudget = false,
}: {
  items: ItemLike[];
  appliedFilters: AppliedClassFilters;
  onChangeAppliedFilters: (next: AppliedClassFilters) => void;
  includeDosageBudget?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [activeClass, setActiveClass] = useState<FilterClassId | null>("age");
  const [draft, setDraft] = useState<AppliedClassFilters>({});
  const [recentTags, setRecentTags] = useState<string[]>([]);
  const popoverBodyRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!open) return;
    setDraft(appliedFilters || {});
    try {
      const raw = localStorage.getItem(RECENT_TAGS_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      setRecentTags(Array.isArray(parsed) ? (parsed as string[]) : []);
    } catch {
      setRecentTags([]);
    }
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prevBody = document.body.style.overflow;
    const prevHtml = document.documentElement.style.overflow;
    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prevBody;
      document.documentElement.style.overflow = prevHtml;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return;

    // Prevent background scroll (wheel/touch) while still allowing scrolling inside the popover.
    const preventIfOutside = (event: Event) => {
      const target = event.target as Node | null;
      if (target && popoverBodyRef.current?.contains(target)) return;
      event.preventDefault();
    };

    window.addEventListener("wheel", preventIfOutside, { passive: false });
    window.addEventListener("touchmove", preventIfOutside, { passive: false });
    return () => {
      window.removeEventListener("wheel", preventIfOutside as any);
      window.removeEventListener("touchmove", preventIfOutside as any);
    };
  }, [open]);

  const classes = useMemo(() => {
    const base = [
      { id: "principal_shop" as const, label: "Principal's shop" },
      { id: "age" as const, label: "Age" },
      { id: "gender" as const, label: "Gender" },
      { id: "health_condition" as const, label: "Health condition" },
      { id: "organs" as const, label: "Organs" },
      { id: "medical_conditions" as const, label: "Medical conditions" },
      { id: "current_medications" as const, label: "Current medications" },
      { id: "lifestyle_factors" as const, label: "Lifestyle factors" },
      { id: "hls_factors" as const, label: "HLS factors" },
      { id: "recent_tags" as const, label: "Recent tags" },
    ];
    if (!includeDosageBudget) return base;
    return [
      ...base.slice(0, 2),
      { id: "dosage_form" as const, label: "Dosage form" },
      { id: "budget_range" as const, label: "Budget range" },
      ...base.slice(2),
    ];
  }, [includeDosageBudget]);

  const optionsByClass = useMemo(() => {
    const dynamic = {
      medicalConditions: collectTagValues(items, "medical.conditions"),
      currentMedications: collectTagValues(items, "medical.current_medications"),
      lifestyle: collectTagValues(items, "lifestyle.factors"),
      organs: collectTagValues(items, "medical.organs"),
    };

    return {
      principal_shop: ["Principal's shop"],
      age: uniq([...ageBandOptions]),
      gender: uniq([...genderOptions]),
      health_condition: uniq([...bmiBandOptions]),
      organs: uniq([...organOptions, ...dynamic.organs]).sort((a, b) => a.localeCompare(b)),
      medical_conditions: uniq([...medicalConditionOptions, ...dynamic.medicalConditions]).sort((a, b) => a.localeCompare(b)),
      current_medications: uniq([...currentMedicationOptions, ...dynamic.currentMedications]).sort((a, b) => a.localeCompare(b)),
      lifestyle_factors: uniq([...lifestyleFactorOptions, ...dynamic.lifestyle]).sort((a, b) => a.localeCompare(b)),
      hls_factors: uniq([...hlsFactorOptions]),
      recent_tags: uniq([...recentTags]).sort((a, b) => a.localeCompare(b)),
      dosage_form: uniq([...dosageFormOptions]),
      budget_range: uniq([...budgetRangeOptions]),
    } satisfies Record<FilterClassId, string[]>;
  }, [items, recentTags]);

  const activeOptions = activeClass ? optionsByClass[activeClass] : [];
  const activeSelected = activeClass ? draft[activeClass] || [] : [];

  const toggleDraftValue = (value: string) => {
    if (!activeClass) return;
    setDraft((prev) => {
      const existing = prev[activeClass] || [];
      const next = existing.includes(value)
        ? existing.filter((v) => v !== value)
        : [...existing, value];
      return { ...prev, [activeClass]: next };
    });
  };

  const clearAll = () => {
    setDraft({});
    onChangeAppliedFilters({});
    setOpen(false);
  };

  const clearClass = (classId: FilterClassId) => {
    setDraft((prev) => {
      const out = { ...prev };
      delete out[classId];
      return out;
    });
  };

  const applyDraft = () => {
    const cleaned: AppliedClassFilters = {};
    for (const [key, values] of Object.entries(draft)) {
      const list = uniq((values as string[]).map(normalize)).filter(Boolean);
      if (list.length) cleaned[key as FilterClassId] = list;
    }
    onChangeAppliedFilters(cleaned);
    setOpen(false);
  };

  const appliedCount = useMemo(() => {
    return Object.values(appliedFilters || {}).reduce((sum, values) => sum + (values?.length || 0), 0);
  }, [appliedFilters]);

  const countForClass = (classId: FilterClassId) => {
    const draftCount = (draft?.[classId] || []).length;
    if (open) return draftCount;
    return (appliedFilters?.[classId] || []).length;
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          size="icon"
          aria-label="Filter"
          className="border-researcher-border bg-white shrink-0 relative"
        >
          <Filter className="h-4 w-4 text-researcher-primary" />
          {appliedCount ? (
            <span className="absolute -right-1 -top-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-researcher-primary px-1 text-[10px] font-bold text-white">
              {appliedCount > 9 ? "9+" : appliedCount}
            </span>
          ) : null}
        </Button>
      </PopoverTrigger>

      <PopoverContent align="start" sideOffset={8} className="-ml-[3%] w-[min(92vw,740px)] p-0 border-researcher-border shadow-lg">
        <div ref={popoverBodyRef} className="relative flex max-h-[min(72vh,30rem)] overflow-hidden rounded-md bg-white">
          {/* Categories Sidebar */}
          <div className="w-[180px] shrink-0 border-r bg-slate-50/50 overflow-y-auto">
            <div className="p-1.5 space-y-0.5">
              {classes.map((c) => {
                const count = countForClass(c.id);
                const isActive = activeClass === c.id;
                return (
                  <button
                    key={c.id}
                    type="button"
                    onClick={() => setActiveClass(c.id)}
                    className={`w-full rounded-md px-2.5 py-1.5 text-left text-sm transition ${
                      isActive ? "bg-researcher-muted text-slate-900" : "hover:bg-slate-100 text-slate-600"
                    }`}
                  >
                    <span className="flex items-center justify-between gap-2">
                      <span className="min-w-0 truncate">
                        {c.label}
                        {count ? <span className="ml-1 text-[10px] text-researcher-primary font-bold">({count})</span> : null}
                      </span>
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Subcategories Panel - Fixed header/footer with scrollable body */}
          {activeClass && (
            <div className="flex min-w-0 flex-1 flex-col bg-slate-100/80">
              {/* Fixed Header */}
              <div className="flex h-11 shrink-0 items-center border-b border-slate-200/60 px-3">
                <div className="w-7" aria-hidden="true" />
                
                <p className="flex-1 text-center text-sm font-semibold text-slate-900 truncate">
                  {classes.find((c) => c.id === activeClass)?.label}
                  {countForClass(activeClass) ? (
                    <span className="ml-1 text-xs font-medium text-slate-500">({countForClass(activeClass)})</span>
                  ) : null}
                </p>

                {countForClass(activeClass) ? (
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-slate-400 hover:text-slate-600"
                    onClick={() => clearClass(activeClass)}
                    aria-label="Clear selected category"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                ) : (
                  <div className="w-7" aria-hidden="true" />
                )}
              </div>

              {/* Scrollable Content Body */}
              <div className="min-h-0 flex-1 overflow-y-auto p-3 scrollbar-thin scrollbar-thumb-slate-300">
                {activeOptions.length ? (
                  <div className="grid grid-cols-1 gap-1.5 sm:grid-cols-2">
                    {activeOptions.map((opt) => (
                      <label
                        key={opt}
                        className="flex cursor-pointer items-center gap-2 rounded-md bg-white px-2.5 py-2 shadow-sm border border-slate-200/50 hover:border-researcher-primary/30 transition-all"
                      >
                        <Checkbox 
                          checked={activeSelected.includes(opt)} 
                          onCheckedChange={() => toggleDraftValue(opt)} 
                          className="data-[state=checked]:bg-researcher-primary data-[state=checked]:border-researcher-primary"
                        />
                        <span className="min-w-0 truncate text-sm text-slate-700 font-medium" title={opt}>
                          {opt}
                        </span>
                      </label>
                    ))}
                    {/* Visual spacer at bottom of list */}
                    <div className="h-4 col-span-full" />
                  </div>
                ) : (
                  <div className="flex h-full items-center justify-center py-10">
                    <p className="text-sm text-slate-400 italic">No options available</p>
                  </div>
                )}
              </div>

              {/* Fixed Footer */}
              <div className="flex h-14 shrink-0 items-center justify-end gap-2 border-t border-slate-200/60 bg-white/80 backdrop-blur-sm px-4">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-slate-500 hover:text-slate-700 hover:bg-slate-100" 
                  onClick={clearAll}
                >
                  Clear All
                </Button>
                <Button
                  type="button"
                  size="sm"
                  className="h-8 bg-researcher-primary hover:bg-researcher-secondary text-white px-3 font-medium shadow-sm active:scale-95 transition-transform"
                  onClick={applyDraft}
                >
                  Apply
                </Button>
              </div>
            </div>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
}

export const applyClassFilters = (items: ItemLike[], applied: AppliedClassFilters) => {
  const entries = Object.entries(applied || {}).filter(([, v]) => (v as string[])?.length);
  if (!entries.length) return items;

  return items.filter((item) => {
    for (const [classId, selected] of entries) {
      if (!matchesClass(item, classId as FilterClassId, selected as string[])) return false;
    }
    return true;
  });
};
