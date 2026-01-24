import React, { useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { toast } from 'react-toastify';
import { quizService, QuizCodeValidationResponse } from '@/services/quizService';
import { 
  User, 
  Heart, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft,
  Sparkles,
  Activity,
  Pill,
  ClipboardCheck,
  Loader2
} from 'lucide-react';

// Types
interface BasicInfo {
  gender: string;
  nickname: string;
  age: string;
  weight: string;
  height: string;
}

interface LifestyleInfo {
  habit: string[];
  fun: string[];
  routine: string[];
  career: string;
}

interface PreferenceInfo {
  drugForm: string[];
  minBudget: string;
  maxBudget: string;
}

// Predefined options
const habitOptions = [
  'Exercise regularly', 'Meditation', 'Reading', 'Healthy eating', 
  'Smoking', 'Drinking alcohol', 'Late night snacking', 'Skipping meals'
];

const funOptions = [
  'Sports', 'Music', 'Movies', 'Gaming', 'Traveling', 
  'Cooking', 'Art', 'Dancing', 'Photography', 'Gardening'
];

const routineOptions = [
  'Morning person', 'Night owl', 'Regular sleep schedule', 
  'Irregular sleep', 'Work from home', 'Office work', 'Shift work'
];

const drugFormOptions = [
  'Tablets', 'Capsules', 'Powder', 'Liquid', 'Gummies', 'Softgels'
];

const AssessmentPage: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const initialCode = searchParams.get('code') || '';
  
  const [currentStep, setCurrentStep] = useState(0); // 0: Code, 1: Basic, 2: Lifestyle, 3: Preference, 4: Complete
  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState(initialCode);
  const [quizCodeData, setQuizCodeData] = useState<QuizCodeValidationResponse['quizCode']>(null);
  
  const [basic, setBasic] = useState<BasicInfo>({
    gender: '',
    nickname: '',
    age: '',
    weight: '',
    height: ''
  });
  
  const [lifestyle, setLifestyle] = useState<LifestyleInfo>({
    habit: [],
    fun: [],
    routine: [],
    career: ''
  });
  
  const [preference, setPreference] = useState<PreferenceInfo>({
    drugForm: [],
    minBudget: '',
    maxBudget: ''
  });

  const steps = [
    { id: 0, title: 'Verification', icon: ClipboardCheck, description: 'Enter your quiz code' },
    { id: 1, title: 'Basic Info', icon: User, description: 'Tell us about yourself' },
    { id: 2, title: 'Lifestyle', icon: Activity, description: 'Your daily habits' },
    { id: 3, title: 'Preferences', icon: Pill, description: 'Supplement preferences' },
    { id: 4, title: 'Complete', icon: CheckCircle2, description: 'All done!' }
  ];

  const handleCodeVerify = async () => {
    if (!code.trim()) {
      toast.error('Please enter a quiz code');
      return;
    }

    setIsLoading(true);
    
    try {
      const result = await quizService.validateQuizCode(code.trim().toUpperCase());
      
      if (result.valid && result.quizCode) {
        setQuizCodeData(result.quizCode);
        setCurrentStep(1);
        toast.success(`Welcome, ${result.quizCode.benfekName}! Let's begin your assessment.`);
      } else {
        toast.error('Invalid quiz code');
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Failed to validate quiz code');
    } finally {
      setIsLoading(false);
    }
  };

  const validateBasic = (): boolean => {
    if (!basic.gender) {
      toast.error('Please select your gender');
      return false;
    }
    if (!basic.age || parseInt(basic.age) < 1 || parseInt(basic.age) > 120) {
      toast.error('Please enter a valid age');
      return false;
    }
    if (!basic.weight || parseFloat(basic.weight) < 1) {
      toast.error('Please enter your weight');
      return false;
    }
    if (!basic.height || parseFloat(basic.height) < 1) {
      toast.error('Please enter your height');
      return false;
    }
    return true;
  };

  const validateLifestyle = (): boolean => {
    if (!lifestyle.career) {
      toast.error('Please enter your career/occupation');
      return false;
    }
    return true;
  };

  const validatePreference = (): boolean => {
    if (!preference.minBudget || !preference.maxBudget) {
      toast.error('Please enter your budget range');
      return false;
    }
    if (parseFloat(preference.minBudget) > parseFloat(preference.maxBudget)) {
      toast.error('Minimum budget cannot be greater than maximum budget');
      return false;
    }
    return true;
  };

  const handleNext = () => {
    if (currentStep === 1 && !validateBasic()) return;
    if (currentStep === 2 && !validateLifestyle()) return;
    if (currentStep === 3) {
      if (!validatePreference()) return;
      handleSubmit();
      return;
    }
    setCurrentStep(currentStep + 1);
  };

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = async () => {
    setIsLoading(true);
    
    try {
      await quizService.submitQuizData({
        code,
        basic: {
          gender: basic.gender,
          nickname: basic.nickname || undefined,
          age: basic.age,
          weight: basic.weight,
          height: basic.height,
        },
        lifestyle: {
          habit: lifestyle.habit.join(','),
          fun: lifestyle.fun.join(','),
          routine: lifestyle.routine.join(','),
          career: lifestyle.career,
        },
        preference: {
          drugForm: preference.drugForm.join(','),
          minBudget: preference.minBudget,
          maxBudget: preference.maxBudget,
        },
      });
      
      toast.success('Assessment completed successfully!');
      setCurrentStep(4);
    } catch (error) {
      toast.error('Failed to submit assessment. Please try again.');
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleArrayItem = <T extends LifestyleInfo | PreferenceInfo>(
    array: string[], 
    item: string, 
    setter: React.Dispatch<React.SetStateAction<T>>,
    field: keyof T
  ) => {
    setter((prev) => ({
      ...prev,
      [field]: array.includes(item) 
        ? array.filter(i => i !== item)
        : [...array, item]
    }));
  };

  const renderStepIndicator = () => (
    <div className="mb-8">
      <div className="flex justify-between items-center mb-4">
        {steps.slice(0, -1).map((step, index) => (
          <div key={step.id} className="flex items-center">
            <div 
              className={`
                flex items-center justify-center w-10 h-10 rounded-full border-2 transition-all duration-300
                ${currentStep > step.id 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : currentStep === step.id 
                    ? 'bg-blue-600 border-blue-600 text-white' 
                    : 'bg-gray-100 border-gray-300 text-gray-400'
                }
              `}
            >
              {currentStep > step.id ? (
                <CheckCircle2 className="w-5 h-5" />
              ) : (
                <step.icon className="w-5 h-5" />
              )}
            </div>
            {index < steps.length - 2 && (
              <div 
                className={`
                  hidden sm:block w-16 md:w-24 lg:w-32 h-1 mx-2 rounded transition-all duration-300
                  ${currentStep > step.id ? 'bg-green-500' : 'bg-gray-200'}
                `}
              />
            )}
          </div>
        ))}
      </div>
      <div className="hidden sm:flex justify-between px-2">
        {steps.slice(0, -1).map((step) => (
          <span 
            key={step.id}
            className={`text-xs font-medium ${
              currentStep >= step.id ? 'text-blue-600' : 'text-gray-400'
            }`}
          >
            {step.title}
          </span>
        ))}
      </div>
    </div>
  );

  const renderCodeStep = () => (
    <Card className="max-w-md mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <ClipboardCheck className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Enter Your Quiz Code</CardTitle>
        <CardDescription>
          Please enter the unique code provided by your principal to begin your health assessment
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="code">Quiz Code</Label>
          <Input
            id="code"
            placeholder="Enter your code (e.g., ABC12345)"
            value={code}
            onChange={(e) => setCode(e.target.value.toUpperCase())}
            className="text-center text-lg tracking-widest font-mono"
            onKeyDown={(e) => e.key === 'Enter' && handleCodeVerify()}
            maxLength={8}
          />
        </div>
        <Button 
          onClick={handleCodeVerify} 
          className="w-full" 
          size="lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 w-4 h-4 animate-spin" />
              Verifying...
            </>
          ) : (
            <>
              Verify & Continue
              <ArrowRight className="ml-2 w-4 h-4" />
            </>
          )}
        </Button>
        <p className="text-xs text-center text-gray-500">
          Don't have a code? Contact your principal to get one.
        </p>
      </CardContent>
    </Card>
  );

  const renderBasicStep = () => (
    <Card className="max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-8 h-8 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Basic Information</CardTitle>
        <CardDescription>
          Help us understand you better, {quizCodeData?.benfekName}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="gender">Gender *</Label>
            <Select value={basic.gender} onValueChange={(v) => setBasic(b => ({ ...b, gender: v }))}>
              <SelectTrigger id="gender">
                <SelectValue placeholder="Select your gender" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="other">Other</SelectItem>
                <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="nickname">Nickname (Optional)</Label>
            <Input
              id="nickname"
              placeholder="What should we call you?"
              value={basic.nickname}
              onChange={(e) => setBasic(b => ({ ...b, nickname: e.target.value }))}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="age">Age *</Label>
            <Input
              id="age"
              type="number"
              placeholder="Enter your age"
              value={basic.age}
              onChange={(e) => setBasic(b => ({ ...b, age: e.target.value }))}
              min="1"
              max="120"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="weight">Weight (kg) *</Label>
            <Input
              id="weight"
              type="number"
              placeholder="Enter your weight"
              value={basic.weight}
              onChange={(e) => setBasic(b => ({ ...b, weight: e.target.value }))}
              min="1"
            />
          </div>
          
          <div className="space-y-2 md:col-span-2">
            <Label htmlFor="height">Height (cm) *</Label>
            <Input
              id="height"
              type="number"
              placeholder="Enter your height"
              value={basic.height}
              onChange={(e) => setBasic(b => ({ ...b, height: e.target.value }))}
              min="1"
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack} disabled>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderLifestyleStep = () => (
    <Card className="max-w-3xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Activity className="w-8 h-8 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Lifestyle & Habits</CardTitle>
        <CardDescription>
          Tell us about your daily routines and activities
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold mb-3 block">Your Habits</Label>
            <p className="text-sm text-gray-500 mb-3">Select all that apply to you</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {habitOptions.map((habit) => (
                <div
                  key={habit}
                  onClick={() => toggleArrayItem(lifestyle.habit, habit, setLifestyle, 'habit')}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all text-sm text-center
                    ${lifestyle.habit.includes(habit) 
                      ? 'border-green-500 bg-green-50 text-green-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {habit}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-base font-semibold mb-3 block">Fun Activities</Label>
            <p className="text-sm text-gray-500 mb-3">What do you enjoy doing?</p>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              {funOptions.map((fun) => (
                <div
                  key={fun}
                  onClick={() => toggleArrayItem(lifestyle.fun, fun, setLifestyle, 'fun')}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all text-sm text-center
                    ${lifestyle.fun.includes(fun) 
                      ? 'border-blue-500 bg-blue-50 text-blue-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {fun}
                </div>
              ))}
            </div>
          </div>
          
          <div>
            <Label className="text-base font-semibold mb-3 block">Daily Routine</Label>
            <p className="text-sm text-gray-500 mb-3">Describe your typical day</p>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {routineOptions.map((routine) => (
                <div
                  key={routine}
                  onClick={() => toggleArrayItem(lifestyle.routine, routine, setLifestyle, 'routine')}
                  className={`
                    p-3 rounded-lg border-2 cursor-pointer transition-all text-sm text-center
                    ${lifestyle.routine.includes(routine) 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  {routine}
                </div>
              ))}
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="career">Career / Occupation *</Label>
            <Input
              id="career"
              placeholder="e.g., Software Developer, Teacher, Nurse"
              value={lifestyle.career}
              onChange={(e) => setLifestyle(l => ({ ...l, career: e.target.value }))}
            />
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNext}>
            Continue
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderPreferenceStep = () => (
    <Card className="max-w-2xl mx-auto shadow-lg border-0">
      <CardHeader className="text-center pb-2">
        <div className="mx-auto w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mb-4">
          <Pill className="w-8 h-8 text-purple-600" />
        </div>
        <CardTitle className="text-2xl">Supplement Preferences</CardTitle>
        <CardDescription>
          Help us recommend the best supplements for you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <div>
            <Label className="text-base font-semibold mb-3 block">Preferred Drug Forms</Label>
            <p className="text-sm text-gray-500 mb-3">Select the forms you prefer</p>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {drugFormOptions.map((form) => (
                <div
                  key={form}
                  onClick={() => toggleArrayItem(preference.drugForm, form, setPreference, 'drugForm')}
                  className={`
                    p-4 rounded-lg border-2 cursor-pointer transition-all text-center
                    ${preference.drugForm.includes(form) 
                      ? 'border-purple-500 bg-purple-50 text-purple-700' 
                      : 'border-gray-200 hover:border-gray-300'
                    }
                  `}
                >
                  <Pill className="w-6 h-6 mx-auto mb-2" />
                  {form}
                </div>
              ))}
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="minBudget">Minimum Budget (₦) *</Label>
              <Input
                id="minBudget"
                type="number"
                placeholder="e.g., 5000"
                value={preference.minBudget}
                onChange={(e) => setPreference(p => ({ ...p, minBudget: e.target.value }))}
                min="0"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="maxBudget">Maximum Budget (₦) *</Label>
              <Input
                id="maxBudget"
                type="number"
                placeholder="e.g., 50000"
                value={preference.maxBudget}
                onChange={(e) => setPreference(p => ({ ...p, maxBudget: e.target.value }))}
                min="0"
              />
            </div>
          </div>
        </div>
        
        <div className="flex justify-between pt-4">
          <Button variant="outline" onClick={handleBack}>
            <ArrowLeft className="mr-2 w-4 h-4" />
            Back
          </Button>
          <Button onClick={handleNext} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 w-4 h-4 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                Complete Assessment
                <CheckCircle2 className="ml-2 w-4 h-4" />
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCompleteStep = () => (
    <Card className="max-w-md mx-auto shadow-lg border-0 text-center">
      <CardHeader className="pb-2">
        <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Sparkles className="w-10 h-10 text-green-600" />
        </div>
        <CardTitle className="text-2xl text-green-600">Assessment Complete!</CardTitle>
        <CardDescription className="text-base">
          Thank you for completing your health assessment, {quizCodeData?.benfekName}. We now have everything we need to provide personalized supplement recommendations.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="bg-gray-50 rounded-lg p-4 text-left">
          <h4 className="font-semibold mb-2">What's Next?</h4>
          <ul className="text-sm text-gray-600 space-y-2">
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Create your account to save your assessment</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>View personalized supplement recommendations</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle2 className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>Start your wellness journey with HLS</span>
            </li>
          </ul>
        </div>
        
        <div className="space-y-3">
          <Button 
            onClick={() => navigate(`/auth/signup/benfek?code=${code}`)} 
            className="w-full" 
            size="lg"
          >
            Create Your Account
            <ArrowRight className="ml-2 w-4 h-4" />
          </Button>
          <Button 
            variant="outline" 
            onClick={() => navigate('/')} 
            className="w-full"
          >
            Return to Homepage
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 0:
        return renderCodeStep();
      case 1:
        return renderBasicStep();
      case 2:
        return renderLifestyleStep();
      case 3:
        return renderPreferenceStep();
      case 4:
        return renderCompleteStep();
      default:
        return renderCodeStep();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-6 h-6 text-blue-600" />
              <span className="font-bold text-xl">HLS</span>
            </div>
            <span className="text-sm text-gray-500">Health Assessment</span>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Title */}
        <div className="text-center mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            Health Assessment Quiz
          </h1>
          <p className="text-gray-600">
            Complete this assessment to get personalized supplement recommendations
          </p>
        </div>

        {/* Progress Bar */}
        {currentStep > 0 && currentStep < 4 && (
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>Step {currentStep} of 3</span>
              <span>{Math.round((currentStep / 3) * 100)}% Complete</span>
            </div>
            <Progress value={(currentStep / 3) * 100} className="h-2" />
          </div>
        )}

        {/* Step Indicator */}
        {currentStep > 0 && currentStep < 4 && renderStepIndicator()}

        {/* Current Step Content */}
        {renderCurrentStep()}
      </div>
    </div>
  );
};

export default AssessmentPage;
