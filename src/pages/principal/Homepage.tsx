import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import doctor from '../../images/bannerdoctor.png'
import leftPill from '../../images/leftPill.png';
import rightPill from '../../images/rightPill.png';
import vitamins from '../../images/vitamins.png'
import vitamins2 from '../../images/vitamins2.png'
import vitamins3 from '../../images/vitamins3.png'
import vitamins4 from '../../images/vitamins4.png'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"
import { quizService } from '@/services/quizService';

const PrincipalHomepage: React.FC = () => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [code, setCode] = useState('');
  const [showNutrientForm, setShowNutrientForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nutrientStep, setNutrientStep] = useState(0); // 0: Basic, 1: Lifestyle, 2: Preference
  const [basic, setBasic] = useState({ gender: '', nickname: '', age: '', weight: '', height: '' });
  const [lifestyle, setLifestyle] = useState({ habit: [], fun: [], routine: [], career: '' });
  const [preference, setPreference] = useState({ drugForm: [], minBudget: '', maxBudget: '' });
  const navigate = useNavigate();
  
  const handleCodeSubmit = () => {
    if (code === '12345') {
      setShowCodeDialog(false);
      setShowNutrientForm(true);
      setNutrientStep(0);
      toast.success('Code verified! Please fill out the nutrient form.');
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  const handleNutrientNext = () => {
    // Validate current step
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
    // Map data to API structure
    const payload = {
      code: '12345',
      basic,
      lifestyle: {
        ...lifestyle,
        habit: lifestyle.habit.join(','),
        fun: lifestyle.fun.join(','),
        routine: lifestyle.routine.join(','),
      },
      preference: {
        ...preference,
        drugForm: preference.drugForm.join(','),
      },
    };
    
    try {
      await quizService.submitQuizData(payload);
      toast.success('Quiz completed and data submitted successfully!');
      setShowNutrientForm(false);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      toast.error('Failed to submit quiz data. Please try again.');
      console.error(error);
    }
  };

  const handleQuizStart = () => {
    setShowQuizModal(true);
    setShowCodeDialog(true);
  };

  // Principal-specific dashboard stats
  const dashboardStats = [
    {
      title: "Total Benfeks",
      value: "1,245",
      icon: Users,
      change: "+12%",
      color: "bg-blue-500"
    },
    {
      title: "Active Wholesalers",
      value: "48",
      icon: TrendingUp,
      change: "+5%",
      color: "bg-green-500"
    },
    {
      title: "Revenue",
      value: "₦24.5M",
      icon: Banknote,
      change: "+18%",
      color: "bg-purple-500"
    },
    {
      title: "Supplements Sold",
      value: "8,392",
      icon: Package,
      change: "+22%",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Principal Dashboard Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Principal Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's an overview of your business.</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {dashboardStats.map((stat, index) => (
              <Card key={index}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-2 rounded-lg ${stat.color}`}>
                      <stat.icon className="h-6 w-6 text-white" />
                    </div>
                    <span className="text-sm font-medium text-green-600">{stat.change}</span>
                  </div>
                  <div className="space-y-1">
                    <h3 className="text-sm font-medium text-gray-500">{stat.title}</h3>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Benfek Signups</CardTitle>
                <CardDescription>New beneficiaries in the last 30 days</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 rounded-full bg-gray-200"></div>
                        <div>
                          <p className="font-medium">User {i + 1}</p>
                          <p className="text-sm text-gray-500">user{i + 1}@example.com</p>
                        </div>
                      </div>
                      <Button variant="outline" size="sm">View</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Selling Products</CardTitle>
                <CardDescription>Most popular supplements this month</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Vitamin D3 Complex", sales: 342 },
                    { name: "Omega-3 Fish Oil", sales: 289 },
                    { name: "Magnesium Glycinate", sales: 245 },
                    { name: "Whey Protein Isolate", sales: 198 },
                    { name: "Zinc + Vitamin C", sales: 176 }
                  ].map((product, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{product.name}</p>
                        <p className="text-sm text-gray-500">{product.sales} units sold</p>
                      </div>
                      <div className="text-lg font-bold text-green-600">
                        #{(i + 1)}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quiz Modal */}
      <Dialog open={showQuizModal} onOpenChange={setShowQuizModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Health Assessment Quiz</DialogTitle>
            <DialogDescription>Enter your quiz code to begin the assessment</DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>

      {/* Code Dialog */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Enter Quiz Code</DialogTitle>
            <DialogDescription>Please enter your unique quiz code to proceed</DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <Input
              placeholder="Enter quiz code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
            <Button onClick={handleCodeSubmit} className="w-full">
              Verify Code
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* Nutrient Form Modal - Multi-step */}
      <Dialog open={showNutrientForm} onOpenChange={setShowNutrientForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nutrient Assessment Form</DialogTitle>
            <DialogDescription>Fill out each section. Click Next to continue.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNutrientSubmit} className="space-y-4">
            {/* Step 1: Basic */}
            {nutrientStep === 0 && (
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label>Gender</Label>
                    <Select value={basic.gender} onValueChange={v => setBasic(b => ({ ...b, gender: v }))}>
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
            {/* Step 2: Lifestyle */}
            {nutrientStep === 1 && (
              <div className="space-y-4">
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
            {/* Step 3: Preference */}
            {nutrientStep === 2 && (
              <div className="space-y-4">
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
                  <Button type="submit">Submit</Button>
                </div>
              </div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      {/* Success Modal */}
      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assessment Complete!</DialogTitle>
            <DialogDescription>
              Your health assessment has been completed successfully. You can now proceed to create your account.
            </DialogDescription>
          </DialogHeader>
          <Button onClick={() => navigate("/auth/signup")} className="w-full">
            Continue to Sign Up
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PrincipalHomepage;
