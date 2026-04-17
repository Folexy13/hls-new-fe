
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'react-toastify';

interface LifestyleData {
  sleepHours: number;
  stressLevel: string;
  dietType: string;
  habits: string;
  fun: string;
  routine: string;
}

interface LifestyleSectionProps {
  data: LifestyleData;
  onComplete: (data: LifestyleData) => void;
  onPrevious?: () => void;
  isLastSection: boolean;
}

const LifestyleSection: React.FC<LifestyleSectionProps> = ({
  data,
  onComplete,
  onPrevious,
  isLastSection
}) => {
  const [formData, setFormData] = useState<LifestyleData>(data);

  const handleInputChange = (field: keyof LifestyleData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateForm = () => {
    if (!formData.sleepHours || !formData.stressLevel || !formData.dietType) {
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="sleepHours">Average Sleep Hours *</Label>
          <Input
            id="sleepHours"
            type="number"
            value={formData.sleepHours || ''}
            onChange={(e) => handleInputChange('sleepHours', parseInt(e.target.value) || 0)}
            placeholder="Hours per night"
            min="1"
            max="12"
            required
          />
        </div>
        <div>
          <Label htmlFor="stressLevel">Stress Level *</Label>
          <Select value={formData.stressLevel} onValueChange={(value) => handleInputChange('stressLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select stress level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Low</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="high">High</SelectItem>
              <SelectItem value="very-high">Very High</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="md:col-span-2">
          <Label htmlFor="dietType">Diet Type *</Label>
          <Select value={formData.dietType} onValueChange={(value) => handleInputChange('dietType', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select your diet type" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="omnivore">Omnivore</SelectItem>
              <SelectItem value="vegetarian">Vegetarian</SelectItem>
              <SelectItem value="vegan">Vegan</SelectItem>
              <SelectItem value="keto">Keto</SelectItem>
              <SelectItem value="paleo">Paleo</SelectItem>
              <SelectItem value="mediterranean">Mediterranean</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label htmlFor="habits">Habits (comma-separated)</Label>
        <Textarea
          id="habits"
          value={formData.habits}
          onChange={(e) => handleInputChange('habits', e.target.value)}
          placeholder="e.g., smoking, drinking coffee, exercising"
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple habits with commas</p>
      </div>

      <div>
        <Label htmlFor="fun">Fun Activities (comma-separated)</Label>
        <Textarea
          id="fun"
          value={formData.fun}
          onChange={(e) => handleInputChange('fun', e.target.value)}
          placeholder="e.g., reading, hiking, gaming, cooking"
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">Separate multiple activities with commas</p>
      </div>

      <div>
        <Label htmlFor="routine">Daily Routine (comma-separated)</Label>
        <Textarea
          id="routine"
          value={formData.routine}
          onChange={(e) => handleInputChange('routine', e.target.value)}
          placeholder="e.g., morning workout, meditation, work from home"
          className="mt-1"
        />
        <p className="text-sm text-gray-500 mt-1">Describe your typical daily routine, separate with commas</p>
      </div>

      <div className="flex justify-between pt-4">
        {onPrevious && (
          <Button type="button" variant="outline" onClick={onPrevious}>
            Previous
          </Button>
        )}
        <Button type="submit" className={!onPrevious ? 'ml-auto' : ''}>
          Next
        </Button>
      </div>
    </form>
  );
};

export default LifestyleSection;
