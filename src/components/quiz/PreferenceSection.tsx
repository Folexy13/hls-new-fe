
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

interface PreferenceData {
  supplementPreference: string[];
  budgetRange: string;
  deliveryFrequency: string;
  drugForm: string;
  allergies: string[];
}

interface PreferenceSectionProps {
  data: PreferenceData;
  onComplete: (data: PreferenceData) => void;
  onPrevious?: () => void;
  isLastSection: boolean;
}

const PreferenceSection: React.FC<PreferenceSectionProps> = ({
  data,
  onComplete,
  onPrevious,
  isLastSection
}) => {
  const [formData, setFormData] = useState<PreferenceData>(data);

  const supplementOptions = [
    'Vitamins',
    'Minerals',
    'Proteins',
    'Probiotics',
    'Omega-3',
    'Herbal Supplements',
    'Amino Acids'
  ];

  const allergyOptions = [
    'Dairy',
    'Gluten',
    'Nuts',
    'Soy',
    'Shellfish',
    'Eggs',
    'Fish',
    'None'
  ];

  const handleInputChange = (field: keyof PreferenceData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'supplementPreference' | 'allergies', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    if (!formData.budgetRange || !formData.deliveryFrequency) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    } else {
      toast.error('Please fill in all required fields');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <Label>Supplement Preferences</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {supplementOptions.map((supplement) => (
            <div key={supplement} className="flex items-center space-x-2">
              <Checkbox
                id={supplement}
                checked={formData.supplementPreference.includes(supplement)}
                onCheckedChange={(checked) => handleArrayChange('supplementPreference', supplement, checked as boolean)}
              />
              <Label htmlFor={supplement} className="text-sm">{supplement}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="budgetRange">Monthly Budget Range *</Label>
          <Select value={formData.budgetRange} onValueChange={(value) => handleInputChange('budgetRange', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select budget range" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="under-50">Under $50</SelectItem>
              <SelectItem value="50-100">$50 - $100</SelectItem>
              <SelectItem value="100-200">$100 - $200</SelectItem>
              <SelectItem value="200-500">$200 - $500</SelectItem>
              <SelectItem value="over-500">Over $500</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="deliveryFrequency">Delivery Frequency *</Label>
          <Select value={formData.deliveryFrequency} onValueChange={(value) => handleInputChange('deliveryFrequency', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select delivery frequency" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="bi-weekly">Bi-weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="drugForm">Preferred Drug Forms (comma-separated)</Label>
        <Textarea
          id="drugForm"
          value={formData.drugForm}
          onChange={(e) => handleInputChange('drugForm', e.target.value)}
          placeholder="e.g., tablets, capsules, powders, gummies"
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple forms with commas</p>
      </div>

      <div>
        <Label>Allergies</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {allergyOptions.map((allergy) => (
            <div key={allergy} className="flex items-center space-x-2">
              <Checkbox
                id={allergy}
                checked={formData.allergies.includes(allergy)}
                onCheckedChange={(checked) => handleArrayChange('allergies', allergy, checked as boolean)}
              />
              <Label htmlFor={allergy} className="text-sm">{allergy}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-between pt-4">
        {onPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        )}
        <Button type="submit" className={!onPrevious ? 'ml-auto' : ''}>
          {isLastSection ? 'Submit Quiz' : 'Next'}
        </Button>
      </div>
    </form>
  );
};

export default PreferenceSection;
