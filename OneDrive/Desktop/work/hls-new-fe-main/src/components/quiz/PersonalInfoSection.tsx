
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';

interface PersonalInfoData {
  name: string;
  age: number;
  gender: 'male' | 'female' | 'other';
  height: number;
  weight: number;
  activityLevel: string;
  healthGoals: string[];
  medicalConditions: string[];
}

interface PersonalInfoSectionProps {
  data: PersonalInfoData;
  onComplete: (data: PersonalInfoData) => void;
  onPrevious?: () => void;
  isLastSection: boolean;
}

const PersonalInfoSection: React.FC<PersonalInfoSectionProps> = ({
  data,
  onComplete,
  onPrevious,
  isLastSection
}) => {
  const [formData, setFormData] = useState<PersonalInfoData>(data);

  const healthGoalOptions = [
    'Weight Loss',
    'Muscle Gain',
    'General Health',
    'Energy Boost',
    'Immune Support',
    'Better Sleep',
    'Stress Management'
  ];

  const medicalConditionOptions = [
    'Diabetes',
    'Hypertension',
    'Heart Disease',
    'Arthritis',
    'Depression/Anxiety',
    'Thyroid Issues',
    'None'
  ];

  const handleInputChange = (field: keyof PersonalInfoData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleArrayChange = (field: 'healthGoals' | 'medicalConditions', value: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      [field]: checked
        ? [...prev[field], value]
        : prev[field].filter(item => item !== value)
    }));
  };

  const validateForm = () => {
    if (!formData.name || !formData.age || !formData.height || !formData.weight || !formData.activityLevel) {
      return false;
    }
    return true;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onComplete(formData);
    } else {
      alert('Please fill in all required fields');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <Label htmlFor="name">Full Name *</Label>
          <Input
            id="name"
            value={formData.name}
            onChange={(e) => handleInputChange('name', e.target.value)}
            placeholder="Enter your full name"
            required
          />
        </div>
        <div>
          <Label htmlFor="age">Age *</Label>
          <Input
            id="age"
            type="number"
            value={formData.age || ''}
            onChange={(e) => handleInputChange('age', parseInt(e.target.value) || 0)}
            placeholder="Enter your age"
            required
          />
        </div>
        <div>
          <Label htmlFor="gender">Gender *</Label>
          <Select value={formData.gender} onValueChange={(value) => handleInputChange('gender', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select gender" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="other">Other</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="height">Height (cm) *</Label>
          <Input
            id="height"
            type="number"
            value={formData.height || ''}
            onChange={(e) => handleInputChange('height', parseInt(e.target.value) || 0)}
            placeholder="Enter height in cm"
            required
          />
        </div>
        <div>
          <Label htmlFor="weight">Weight (kg) *</Label>
          <Input
            id="weight"
            type="number"
            value={formData.weight || ''}
            onChange={(e) => handleInputChange('weight', parseInt(e.target.value) || 0)}
            placeholder="Enter weight in kg"
            required
          />
        </div>
        <div>
          <Label htmlFor="activity">Activity Level *</Label>
          <Select value={formData.activityLevel} onValueChange={(value) => handleInputChange('activityLevel', value)}>
            <SelectTrigger>
              <SelectValue placeholder="Select activity level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sedentary">Sedentary</SelectItem>
              <SelectItem value="light">Light</SelectItem>
              <SelectItem value="moderate">Moderate</SelectItem>
              <SelectItem value="active">Active</SelectItem>
              <SelectItem value="very-active">Very Active</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Label>Health Goals</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {healthGoalOptions.map((goal) => (
            <div key={goal} className="flex items-center space-x-2">
              <Checkbox
                id={goal}
                checked={formData.healthGoals.includes(goal)}
                onCheckedChange={(checked) => handleArrayChange('healthGoals', goal, checked as boolean)}
              />
              <Label htmlFor={goal} className="text-sm">{goal}</Label>
            </div>
          ))}
        </div>
      </div>

      <div>
        <Label>Medical Conditions</Label>
        <div className="grid grid-cols-2 gap-2 mt-2">
          {medicalConditionOptions.map((condition) => (
            <div key={condition} className="flex items-center space-x-2">
              <Checkbox
                id={condition}
                checked={formData.medicalConditions.includes(condition)}
                onCheckedChange={(checked) => handleArrayChange('medicalConditions', condition, checked as boolean)}
              />
              <Label htmlFor={condition} className="text-sm">{condition}</Label>
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
          Next
        </Button>
      </div>
    </form>
  );
};

export default PersonalInfoSection;
