import React, { useEffect, useMemo, useState } from 'react';
import { Check, ChevronsUpDown, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';

const defaultCategories = [
  'Nutrition',
  'Wellness',
  'Medical',
  'Fitness',
  'Mental Health',
  'Medication',
  'Lifestyle',
  'Supplement Education',
];
const CUSTOM_CATEGORY_STORAGE_KEY = 'principal.content.customCategories';

type CreatableCategorySelectProps = {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const CreatableCategorySelect: React.FC<CreatableCategorySelectProps> = ({
  value,
  onChange,
  placeholder = 'Search or select category',
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [customCategories, setCustomCategories] = useState<string[]>(() => {
    try {
      const raw = localStorage.getItem(CUSTOM_CATEGORY_STORAGE_KEY);
      const parsed = raw ? (JSON.parse(raw) as unknown) : null;
      return Array.isArray(parsed) ? parsed.filter((item): item is string => typeof item === 'string') : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem(CUSTOM_CATEGORY_STORAGE_KEY, JSON.stringify(customCategories));
    } catch {
      // ignore storage failures
    }
  }, [customCategories]);

  const categories = useMemo(() => {
    const all = [...defaultCategories, ...customCategories, value].filter(Boolean);
    return Array.from(new Set(all)).sort((a, b) => a.localeCompare(b));
  }, [customCategories, value]);

  const trimmedQuery = query.trim();
  const canCreate =
    trimmedQuery.length > 0 &&
    !categories.some((category) => category.toLowerCase() === trimmedQuery.toLowerCase());

  const selectCategory = (category: string) => {
    onChange(category);
    setQuery('');
    setOpen(false);
  };

  const createCategory = () => {
    if (!canCreate) return;
    setCustomCategories((prev) => [...prev, trimmedQuery]);
    selectCategory(trimmedQuery);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="h-10 w-full justify-between border-slate-300 bg-white px-3 py-2 text-sm font-normal text-slate-950 shadow-sm hover:bg-white"
        >
          <span className={cn('truncate', !value && 'text-slate-500')}>
            {value || placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 text-slate-500" />
        </Button>
      </PopoverTrigger>
      <PopoverContent align="start" className="z-[120] w-[--radix-popover-trigger-width] p-0">
        <Command shouldFilter={false}>
          <CommandInput placeholder="Search or add category..." value={query} onValueChange={setQuery} />
          <CommandList className="max-h-72 overflow-y-auto">
            <CommandEmpty>
              {canCreate ? 'Use the row below to add this category.' : 'No category found.'}
            </CommandEmpty>
            <CommandGroup>
              {categories
                .filter((category) => category.toLowerCase().includes(trimmedQuery.toLowerCase()))
                .map((category) => (
                  <CommandItem key={category} value={category} onSelect={() => selectCategory(category)}>
                    <Check className={cn('mr-2 h-4 w-4', value === category ? 'opacity-100' : 'opacity-0')} />
                    <span>{category}</span>
                  </CommandItem>
                ))}
              {canCreate && (
                <CommandItem value={trimmedQuery} onSelect={createCategory} className="text-emerald-700">
                  <Plus className="mr-2 h-4 w-4" />
                  <span>Add "{trimmedQuery}"</span>
                </CommandItem>
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

export default CreatableCategorySelect;
