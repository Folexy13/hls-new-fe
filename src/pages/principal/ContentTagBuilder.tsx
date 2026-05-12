import React, { useState } from 'react';
import { X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ContentTags } from '@/services/contentService';
import { HEALTH_FIELD_OPTIONS } from './contentOptions';

const tagLabels: Record<keyof ContentTags, string> = {
  allergies: 'Allergies',
  scares: 'Scares / Health Concerns',
  familyCondition: 'Family Condition',
  medications: 'Medications',
  currentConditions: 'Current Conditions',
  lifestyle: 'Lifestyle',
  preferences: 'Preferences',
};

const tagKeys = Object.keys(HEALTH_FIELD_OPTIONS) as Array<keyof ContentTags>;

type ContentTagBuilderProps = {
  tags: ContentTags;
  onChange: (tags: ContentTags) => void;
};

const ContentTagBuilder: React.FC<ContentTagBuilderProps> = ({ tags, onChange }) => {
  const [tagCategory, setTagCategory] = useState<keyof ContentTags>('lifestyle');
  const [tagValue, setTagValue] = useState('');
  const [tagValueMode, setTagValueMode] = useState<'select' | 'custom'>('select');

  const selectedTags = tags[tagCategory] || [];
  const options = Array.from(new Set([...(HEALTH_FIELD_OPTIONS[tagCategory] || []), ...selectedTags]));

  const addTag = () => {
    const value = tagValue.trim();
    if (!value) return;

    const existing = tags[tagCategory] || [];
    if (existing.some((item) => item.toLowerCase() === value.toLowerCase())) {
      setTagValue('');
      setTagValueMode('select');
      return;
    }

    onChange({ ...tags, [tagCategory]: [...existing, value] });
    setTagValue('');
    setTagValueMode('select');
  };

  const removeTag = (category: keyof ContentTags, value: string) => {
    const nextValues = (tags[category] || []).filter((item) => item !== value);
    onChange({ ...tags, [category]: nextValues });
  };

  return (
    <div className="space-y-3">
      <Label>Tags</Label>
      <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
        <select
          className="w-full rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          value={tagCategory}
          onChange={(event) => {
            setTagCategory(event.target.value as keyof ContentTags);
            setTagValue('');
            setTagValueMode('select');
          }}
        >
          {tagKeys.map((key) => (
            <option key={key} value={key}>
              {tagLabels[key]}
            </option>
          ))}
        </select>

        <div className="flex gap-2">
          {tagValueMode === 'custom' ? (
            <Input
              value={tagValue}
              onChange={(event) => setTagValue(event.target.value)}
              placeholder="Type tag value..."
              className="flex-1"
            />
          ) : (
            <select
              className="flex-1 rounded-md border border-slate-200 bg-white px-3 py-2 text-sm focus:border-emerald-500 focus:outline-none focus:ring-2 focus:ring-emerald-500"
              value={tagValue}
              onChange={(event) => {
                const next = event.target.value;
                if (next === '__custom__') {
                  setTagValue('');
                  setTagValueMode('custom');
                  return;
                }
                setTagValue(next);
              }}
            >
              <option value="">Select...</option>
              {options.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
              <option value="__custom__">Custom...</option>
            </select>
          )}

          <Button type="button" variant="outline" onClick={addTag} className="shrink-0">
            Add
          </Button>
        </div>
      </div>

      <div className="rounded-md border bg-white p-2">
        <div className="max-h-28 overflow-y-auto flex flex-wrap gap-2">
          {tagKeys.flatMap((category) =>
            (tags[category] || []).map((value) => (
              <Badge
                key={`${category}:${value}`}
                variant="outline"
                title={`${tagLabels[category]}: ${value}`}
                className="max-w-full whitespace-normal break-words bg-emerald-50 text-emerald-700"
              >
                <span className="mr-1">{value}</span>
                <button
                  type="button"
                  className="ml-1 inline-flex"
                  onClick={() => removeTag(category, value)}
                  aria-label={`Remove ${value}`}
                >
                  <X className="h-3 w-3" />
                </button>
              </Badge>
            ))
          )}
          {tagKeys.every((category) => (tags[category] || []).length === 0) ? (
            <p className="text-xs text-slate-500">No tags added yet.</p>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default ContentTagBuilder;
