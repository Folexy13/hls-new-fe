import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { X, ChevronDown, Check, Plus } from 'lucide-react';

export type MultiSelectCreatableProps = {
  label: string;
  placeholder: string;
  description?: string;
  value: string[];
  options: readonly string[];
  onChange: (nextValue: string[]) => void;
  useFormComponents?: boolean; // If true, use FormLabel/FormDescription
};

export const MultiSelectCreatableField: React.FC<MultiSelectCreatableProps> = ({
  label,
  placeholder,
  description,
  value,
  options,
  onChange,
  useFormComponents = false,
}) => {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');

  const normalizedSelected = value ?? [];
  const normalizedOptions = Array.from(new Set([...options, ...normalizedSelected])).sort((a, b) => a.localeCompare(b));
  const trimmedQuery = query.trim();
  const canCreate = trimmedQuery.length > 0 && !normalizedOptions.some((option) => option.toLowerCase() === trimmedQuery.toLowerCase());

  const toggleValue = (item: string) => {
    if (normalizedSelected.includes(item)) {
      onChange(normalizedSelected.filter((selectedItem) => selectedItem !== item));
      return;
    }

    onChange([...normalizedSelected, item]);
  };

  const createOption = () => {
    if (!canCreate) return;
    onChange([...normalizedSelected, trimmedQuery]);
    setQuery('');
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-gray-700">{label}</label>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            className="min-h-10 w-full justify-between bg-gray-100 px-3 py-2 text-left font-normal text-slate-700 hover:bg-gray-100"
            aria-label={open ? `Close ${label} options` : `Open ${label} options`}
          >
            <span className="truncate">
              {normalizedSelected.length > 0 ? `${normalizedSelected.length} selected` : placeholder}
            </span>
            {open ? (
              <X className="h-4 w-4 shrink-0 opacity-70" />
            ) : (
              <ChevronDown className="h-4 w-4 shrink-0 opacity-60" />
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent align="start" className="w-[var(--radix-popover-trigger-width)] p-0">
          <Command shouldFilter={false}>
            <CommandInput
              placeholder={`Search or add ${label.toLowerCase()}`}
              value={query}
              onValueChange={setQuery}
            />
            <CommandList>
              <CommandEmpty>
                {canCreate ? 'Press the create row below to add this option.' : 'No matching options.'}
              </CommandEmpty>
              <CommandGroup>
                {normalizedOptions
                  .filter((option) => option.toLowerCase().includes(trimmedQuery.toLowerCase()))
                  .map((option) => {
                    const isSelected = normalizedSelected.includes(option);

                    return (
                      <CommandItem
                        key={option}
                        value={option}
                        onSelect={() => toggleValue(option)}
                        className="flex items-center justify-between"
                      >
                        <span>{option}</span>
                        <Check className={`h-4 w-4 ${isSelected ? 'opacity-100' : 'opacity-0'}`} />
                      </CommandItem>
                    );
                  })}
                {canCreate && (
                  <CommandItem onSelect={createOption} className="gap-2 text-emerald-700">
                    <Plus className="h-4 w-4" />
                    <span>Create "{trimmedQuery}"</span>
                  </CommandItem>
                )}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
      {normalizedSelected.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {normalizedSelected.map((item) => (
            <Badge key={item} variant="secondary" className="gap-1 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
              <span>{item}</span>
              <button
                type="button"
                className="rounded-full text-emerald-700/80 hover:text-emerald-900"
                onClick={() => toggleValue(item)}
                aria-label={`Remove ${item}`}
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </Badge>
          ))}
        </div>
      )}
      {description && <p className="text-xs text-gray-500">{description}</p>}
    </div>
  );
};
