
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon, Package, ShoppingCart, Plus, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
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

const WholesalerHomepage: React.FC = () => {
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

  // Wholesaler-specific dashboard stats
  const dashboardStats = [
    {
      title: "Total Orders",
      value: "342",
      icon: ShoppingCart,
      change: "+8%",
      color: "bg-blue-500"
    },
    {
      title: "Inventory Items",
      value: "128",
      icon: Package,
      change: "+12%",
      color: "bg-green-500"
    },
    {
      title: "Revenue",
      value: "₦8.2M",
      icon: Banknote,
      change: "+15%",
      color: "bg-purple-500"
    },
    {
      title: "Benfeks Served",
      value: "876",
      icon: Users,
      change: "+22%",
      color: "bg-orange-500"
    }
  ];

  // Sample inventory data
  const inventoryItems = [
    { id: 1, name: "Vitamin D3 Complex", stock: 124, price: 14999, status: "In Stock" },
    { id: 2, name: "Omega-3 Fish Oil", stock: 86, price: 17499, status: "In Stock" },
    { id: 3, name: "Magnesium Glycinate", stock: 12, price: 12499, status: "Low Stock" },
    { id: 4, name: "Whey Protein Isolate", stock: 0, price: 24999, status: "Out of Stock" },
    { id: 5, name: "Zinc + Vitamin C", stock: 45, price: 9999, status: "In Stock" }
  ];

  return (
    <div className="min-h-screen">
      {/* Wholesaler Dashboard Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Wholesaler Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage your inventory and track your sales.</p>
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
          
          <div className="mb-8">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Inventory Management</CardTitle>
                  <CardDescription>Monitor stock levels and product availability</CardDescription>
                </div>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Button>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Product</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Stock</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Price</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                        <th className="text-right py-3 px-4 font-medium text-gray-500">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {inventoryItems.map((item) => (
                        <tr key={item.id} className="border-b">
                          <td className="py-3 px-4">{item.name}</td>
                          <td className="py-3 px-4">{item.stock}</td>
                          <td className="py-3 px-4">₦{item.price.toLocaleString()}</td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                              item.status === "In Stock" ? "bg-green-100 text-green-800" :
                              item.status === "Low Stock" ? "bg-yellow-100 text-yellow-800" :
                              "bg-red-100 text-red-800"
                            }`}>
                              {item.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <Button variant="outline" size="sm">Previous</Button>
                <Button variant="outline" size="sm">Next</Button>
              </CardFooter>
            </Card>
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Orders</CardTitle>
                <CardDescription>Latest orders from beneficiaries</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[1, 2, 3, 4, 5].map((_, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">Order #{1000 + i}</p>
                        <p className="text-sm text-gray-500">3 items • ₦{(12500 + i * 1000).toLocaleString()}</p>
                      </div>
                      <Button variant="outline" size="sm">Process</Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Top Customers</CardTitle>
                <CardDescription>Beneficiaries with highest order value</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "John Doe", orders: 12, value: 145000 },
                    { name: "Jane Smith", orders: 8, value: 120000 },
                    { name: "Robert Johnson", orders: 6, value: 98000 },
                    { name: "Emily Davis", orders: 5, value: 85000 },
                    { name: "Michael Brown", orders: 4, value: 72000 }
                  ].map((customer, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{customer.name}</p>
                        <p className="text-sm text-gray-500">{customer.orders} orders</p>
                      </div>
                      <div className="text-right">
                        <p className="font-medium">₦{customer.value.toLocaleString()}</p>
                        <p className="text-xs text-gray-500">Lifetime value</p>
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

export default WholesalerHomepage;
