import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { quizService } from '@/services/quizService';

const QuizFormPage: React.FC = () => {
  const navigate = useNavigate();
  const [nutrientStep, setNutrientStep] = useState(0);
  const [basic, setBasic] = useState({ gender: '', nickname: '', age: '', weight: '', height: '' });
  const [lifestyle, setLifestyle] = useState({ habit: [], fun: [], routine: [], career: '' });
  const [preference, setPreference] = useState({ drugForm: [], minBudget: '', maxBudget: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatedQuizCode = sessionStorage.getItem('validatedQuizCode') || '';
  const validatedBenfekName = sessionStorage.getItem('validatedBenfekName') || '';
  const validatedBenfekPhone = sessionStorage.getItem('validatedBenfekPhone') || '';

  const handleNutrientNext = () => {
    if (nutrientStep === 0) {
      if (!basic.gender || !basic.age || !basic.weight || !basic.height) {
        toast.error('Please fill all required basic fields.');
        return;
      }
    }
    if (nutrientStep === 1) {
      if (!lifestyle.career) {
        toast.error('Please fill all required lifestyle fields.');
        return;
      }
    }
    if (nutrientStep === 2) {
      if (!preference.minBudget || !preference.maxBudget) {
        toast.error('Please fill all required preference fields.');
        return;
      }
    }
    if (nutrientStep < 2) setNutrientStep(nutrientStep + 1);
  };

  const handleNutrientBack = () => {
    if (nutrientStep > 0) setNutrientStep(nutrientStep - 1);
  };

  const handleNutrientSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validatedQuizCode) {
      toast.error('Missing quiz code. Please validate your code again.');
      navigate('/assessment');
      return;
    }

    const payload = {
      code: validatedQuizCode,
      basics: {
        nickname: basic.nickname || undefined,
        weight: String(basic.weight),
        height: String(basic.height),
      },
      lifestyle: {
        habits: [...lifestyle.habit, ...lifestyle.routine].join(','),
        funActivities: lifestyle.fun.join(','),
        priority: lifestyle.career || 'general',
      },
      preferences: {
        drugForm: preference.drugForm.join(','),
        budget: Number(preference.maxBudget || preference.minBudget || 0),
      },
    };

    if (!payload.preferences.budget || payload.preferences.budget <= 0) {
      toast.error('Please enter a valid budget.');
      return;
    }

    try {
      setIsSubmitting(true);
      await quizService.submitQuizData(payload);
      toast.success('Assessment completed successfully. Please sign in.');
      navigate('/auth/signin');
    } catch (error) {
      console.error(error);
      toast.error('Failed to submit quiz data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 py-8 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Benfek Health Assessment</h1>
          <p className="text-sm text-gray-600 mt-2">
            Complete this assessment to personalize your recommendations.
          </p>
        </div>

        <Card className="p-5 sm:p-6 mb-6 border border-slate-200">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-xs uppercase text-gray-400">Quiz Code</p>
              <p className="font-semibold text-gray-900">{validatedQuizCode || 'Not set'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400">Name</p>
              <p className="font-semibold text-gray-900">{validatedBenfekName || 'Not provided'}</p>
            </div>
            <div>
              <p className="text-xs uppercase text-gray-400">Phone</p>
              <p className="font-semibold text-gray-900">{validatedBenfekPhone || 'Not provided'}</p>
            </div>
          </div>
        </Card>

        <Card className="p-5 sm:p-6 border border-slate-200">
          <form onSubmit={handleNutrientSubmit} className="space-y-6">
            {nutrientStep === 0 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select value={basic.gender} onValueChange={(v) => setBasic(b => ({ ...b, gender: v }))}>
                      <SelectTrigger><SelectValue placeholder="Select gender" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="male">Male</SelectItem>
                        <SelectItem value="female">Female</SelectItem>
                        <SelectItem value="other">Other</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>Nickname (optional)</Label>
                    <Input value={basic.nickname} onChange={e => setBasic(b => ({ ...b, nickname: e.target.value }))} placeholder="Nickname" />
                  </div>
                  <div>
                    <Label>Age</Label>
                    <Input type="number" value={basic.age} onChange={e => setBasic(b => ({ ...b, age: e.target.value }))} placeholder="Enter your age" />
                  </div>
                  <div>
                    <Label>Weight (kg)</Label>
                    <Input type="number" value={basic.weight} onChange={e => setBasic(b => ({ ...b, weight: e.target.value }))} placeholder="Enter weight" />
                  </div>
                  <div>
                    <Label>Height (cm)</Label>
                    <Input type="number" value={basic.height} onChange={e => setBasic(b => ({ ...b, height: e.target.value }))} placeholder="Enter height" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button type="button" onClick={handleNutrientNext}>Next</Button>
                </div>
              </div>
            )}

            {nutrientStep === 1 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Lifestyle</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Habit (comma separated)</Label>
                    <Input value={lifestyle.habit.join(',')} onChange={e => setLifestyle(l => ({ ...l, habit: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="e.g. running, yoga" />
                  </div>
                  <div>
                    <Label>Fun (comma separated)</Label>
                    <Input value={lifestyle.fun.join(',')} onChange={e => setLifestyle(l => ({ ...l, fun: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="e.g. reading, music" />
                  </div>
                  <div>
                    <Label>Routine (comma separated)</Label>
                    <Input value={lifestyle.routine.join(',')} onChange={e => setLifestyle(l => ({ ...l, routine: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="e.g. morning, night" />
                  </div>
                  <div>
                    <Label>Career</Label>
                    <Input value={lifestyle.career} onChange={e => setLifestyle(l => ({ ...l, career: e.target.value }))} placeholder="e.g. developer" />
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={handleNutrientBack}>Back</Button>
                  <Button type="button" onClick={handleNutrientNext}>Next</Button>
                </div>
              </div>
            )}

            {nutrientStep === 2 && (
              <div className="space-y-4">
                <h2 className="text-lg font-semibold text-gray-900">Preferences</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Drug Form (comma separated)</Label>
                    <Input value={preference.drugForm.join(',')} onChange={e => setPreference(p => ({ ...p, drugForm: e.target.value.split(',').map(s => s.trim()).filter(Boolean) }))} placeholder="e.g. tablet, capsule" />
                  </div>
                  <div>
                    <Label>Min Budget</Label>
                    <Input type="number" value={preference.minBudget} onChange={e => setPreference(p => ({ ...p, minBudget: e.target.value }))} placeholder="e.g. 1000" />
                  </div>
                  <div>
                    <Label>Max Budget</Label>
                    <Input type="number" value={preference.maxBudget} onChange={e => setPreference(p => ({ ...p, maxBudget: e.target.value }))} placeholder="e.g. 5000" />
                  </div>
                </div>
                <div className="flex justify-between gap-2">
                  <Button type="button" variant="outline" onClick={handleNutrientBack}>Back</Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? 'Submitting...' : 'Submit'}
                  </Button>
                </div>
              </div>
            )}
          </form>
        </Card>
      </div>
    </div>
  );
};

export default QuizFormPage;
