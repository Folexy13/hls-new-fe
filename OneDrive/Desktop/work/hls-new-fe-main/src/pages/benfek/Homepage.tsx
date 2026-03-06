import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, 
  Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon, Package 
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { 
  Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle 
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue 
} from '@/components/ui/select';
import { 
  Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter 
} from '@/components/ui/card';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { toast } from 'react-toastify';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel";

// Image Imports
import doctor from '../../images/bannerdoctor.png';
import leftPill from '../../images/leftPill.png';
import rightPill from '../../images/rightPill.png';
import vitamins from '../../images/vitamins.png';
import vitamins2 from '../../images/vitamins2.png';
import vitamins3 from '../../images/vitamins3.png';
import vitamins4 from '../../images/vitamins4.png';
import patient from '../../images/patient.jpg';
import bose from '../../images/avwenagha-bose.jpg';
import joy from '../../images/joy.jpeg';
import walter from '../../images/walker-okolie.jpg';
import samson from '../../images/samson-ojo.jpeg';
import nick from '../../images/nick-ozonuma.jpg';
import eriscyl from '../../images/ericsyl-john.jpg';
import mimi from '../../images/mimi-gloria.jpg';

const BenfekHomepage: React.FC = () => {
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [code, setCode] = useState('');
  const [showNutrientForm, setShowNutrientForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nutrientStep, setNutrientStep] = useState(0); 
  const [basic, setBasic] = useState({ gender: '', nickname: '', age: '', weight: '', height: '' });
  const [lifestyle, setLifestyle] = useState({ habit: [] as string[], fun: [] as string[], routine: [] as string[], career: '' });
  const [preference, setPreference] = useState({ drugForm: [] as string[], minBudget: '', maxBudget: '' });
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

  const handleNutrientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const output = {
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
    console.log('Nutrient Assessment Output:', output);
    setShowNutrientForm(false);
    setShowSuccessModal(true);
  };

  const handleQuizStart = () => {
    setShowQuizModal(true);
    setShowCodeDialog(true);
  };

  const testimonials = [
    { name: "Avwenagha Bose", content: "The services I received from HLS are excellent.", rating: 5, image: bose },
    { name: "Joy Anieofon David II", content: "Professional services with top-notch customer care!", rating: 5, image: joy },
    { name: "Walker Okolie", content: "They prioritize your wellbeing over profits.", rating: 5, image: walter },
    { name: "Samson Ojo", content: "Extremely competitive prices with first-class service.", rating: 5, image: samson },
    { name: "Nick Okunzuwa", content: "Great insight to healthy living!", rating: 5, image: nick },
    { name: "Ericsyl John", content: "Their prompt response is impressive!", rating: 5, image: eriscyl },
    { name: "Mimi Gloria", content: "For getting the best supplements and nutrition, you can never go wrong with HLS.", rating: 5, image: mimi },
    { name: "Olivia Njoku", content: "HLS provides a new level of understanding.", rating: 5, image: "/placeholder.svg" },
    { name: "Kenny Ajayi", content: "Very reliable company!", rating: 5, image: "/placeholder.svg" },
  ];

  const products = [
    { id: '1', name: 'Vitamin D3 Complex', price: 14999, image: vitamins, description: 'High-potency vitamin D3', category: 'vitamin' as const },
    { id: '2', name: 'Omega-3 Fish Oil', price: 17499, image: vitamins2, description: 'Pure omega-3 fatty acids', category: 'supplement' as const },
    { id: '3', name: 'Magnesium Glycinate', price: 12499, image: vitamins3, description: 'Highly absorbable magnesium', category: 'mineral' as const },
    { id: '4', name: 'Whey Protein Isolate', price: 24999, image: vitamins4, description: 'Premium protein', category: 'protein' as const }
  ];

  const faqs = [
    { question: "How does the HLS quiz work?", answer: "Our quiz assesses your lifestyle to provide recommendations." },
    { question: "Are your supplements third-party tested?", answer: "Yes, all our supplements undergo rigorous third-party testing." },
    { question: "Can I change my subscription?", answer: "Absolutely! You can modify or cancel at any time." },
    { question: "How long does shipping take?", answer: "Standard shipping takes 3-5 business days." }
  ];

  const blogs = [
    { id: 1, title: "The Science Behind Personalized Nutrition", excerpt: "Discover your genetic makeup.", date: "March 15, 2024", image: "/placeholder.svg" },
    { id: 2, title: "5 Signs You Might Need Vitamin D", excerpt: "Learn about the subtle signs.", date: "March 10, 2024", image: "/placeholder.svg" },
    { id: 3, title: "Optimizing Recovery with Magnesium", excerpt: "Understand magnesium's role.", date: "March 5, 2024", image: "/placeholder.svg" }
  ];

  const whyTakeQuiz = [
    { icon: Dna, text: "Know your nutrient type for Free" },
    { icon: Banknote, text: "Get paid for using your Nutrients" },
    { icon: Truck, text: "Free monthly Delivery for Beneficiaries" },
    { icon: Stethoscope, text: "Get news on medical breakthroughs" },
    { icon: Gift, text: "Occasional freebies on holidays" }
  ];

  const dashboardStats = [
    { title: "Health Score", value: "85/100", icon: CheckCircle, change: "+5%", color: "bg-green-500" },
    { title: "Supplements", value: "4", icon: Package, change: "Active", color: "bg-blue-500" },
    { title: "Next Delivery", value: "3 days", icon: Truck, change: "On time", color: "bg-purple-500" },
    { title: "Rewards", value: "₦12,500", icon: Gift, change: "Available", color: "bg-orange-500" }
  ];

  return (
    <div className="min-h-screen">
      {/* Dashboard Section */}
      <section className="bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-8">
            <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Your Health Dashboard</h1>
            <p className="text-gray-600 mt-2">Welcome back! Here's your personalized health overview.</p>
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

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            <Card>
              <CardHeader>
                <CardTitle>Your Supplement Plan</CardTitle>
                <CardDescription>Current supplements in your plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Vitamin D3 Complex", dosage: "1 tablet daily", time: "Morning", status: "Active" },
                    { name: "Omega-3 Fish Oil", dosage: "2 capsules daily", time: "With meals", status: "Active" }
                  ].map((supplement, i) => (
                    <div key={i} className="flex items-center justify-between border-b pb-3">
                      <div>
                        <p className="font-medium">{supplement.name}</p>
                        <p className="text-sm text-gray-500">{supplement.dosage} • {supplement.time}</p>
                      </div>
                      <span className="px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                        {supplement.status}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View Full Plan</Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>Personalized recommendations</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="border-b pb-3">
                    <p className="font-medium">Increase Vitamin D intake</p>
                    <p className="text-sm text-gray-500">Your recent assessment shows slightly low levels.</p>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">View All Insights</Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-[#e0f2fe] pt-4 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-20 text-center">
          <div className="pt-8 sm:pt-16 lg:pt-20 pb-4 sm:pb-8">
            <p className="text-xs sm:text-sm lg:text-lg text-blue-900 font-semibold mb-2 sm:mb-4">Food Extracts • Nutrients • Supplements</p>
            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-blue-900 mb-6 sm:mb-8">Personalized Just For YOU.</h1>
            <div className="flex justify-center mb-8 sm:mb-12">
              <Button onClick={handleQuizStart} className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-3 rounded-lg font-semibold">
                Take Quiz
              </Button>
            </div>
          </div>
          <div className="relative z-30 flex justify-center">
            <img src={doctor} alt="Doctor" className="w-32 sm:w-48 lg:w-64 h-auto object-contain" />
          </div>
        </div>
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-16 sm:h-24 lg:h-32 z-10">
          <svg viewBox="0 0 900 200" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,200 C100,0 800,0 900,200 L900,200 L0,200 Z" fill="#00657e" />
          </svg>
        </div>
        <img src={leftPill} alt="Pill" className="absolute bottom-4 left-4 sm:left-16 w-6 sm:w-20 h-auto z-20" />
        <img src={rightPill} alt="Pill" className="absolute bottom-4 right-4 sm:right-16 w-6 sm:w-20 h-auto z-20" />
      </section>

      {/* Why Take Quiz Section */}
      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-lg sm:text-3xl font-bold mb-12">Why take the quiz?</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {whyTakeQuiz.map((item, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/5">
                  <div className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center h-full border">
                    <item.icon className="h-10 w-10 text-[#005073] mb-4" />
                    <p className="text-sm sm:text-base text-gray-900">{item.text}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-lg sm:text-3xl font-bold mb-4">Featured Products</h2>
            <Link to="/marketplace" className="inline-flex px-6 py-2 bg-emerald-600 text-white rounded-lg">View All Products →</Link>
          </div>
          <Carousel className="w-full">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
                  <Card className="overflow-hidden h-full">
                    <img src={product.image} alt={product.name} className="w-full h-48 object-cover" />
                    <CardContent className="p-4">
                      <h3 className="font-semibold mb-2">{product.name}</h3>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-emerald-600">₦{product.price.toLocaleString()}</span>
                        <Button variant="secondary" size="sm">View</Button>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-3xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold mb-12">Frequently Asked Questions</h2>
          <Accordion type="single" collapsible className="bg-white rounded-lg shadow-md border">
            {faqs.map((faq, index) => (
              <AccordionItem key={index} value={`faq-${index}`} className="px-6">
                <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                <AccordionContent className="text-gray-700">{faq.answer}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-center text-2xl font-bold mb-12">Latest from Our Blog</h2>
          <Carousel className="w-full">
            <CarouselContent>
              {blogs.map((blog) => (
                <CarouselItem key={blog.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="bg-white rounded-lg overflow-hidden border h-full flex flex-col">
                    <img src={blog.image} alt={blog.title} className="w-full h-40 object-cover" />
                    <div className="p-6 flex-1 flex flex-col">
                      <span className="text-xs text-gray-500 mb-2">{blog.date}</span>
                      <h3 className="font-semibold mb-3">{blog.title}</h3>
                      <p className="text-xs text-gray-700 mb-4 flex-1">{blog.excerpt}</p>
                      <Link to={`/blog/${blog.id}`} className="text-emerald-600 font-medium">Read More →</Link>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
          </Carousel>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div><h3 className="font-bold mb-4">HLS</h3><p className="text-xs text-gray-400">Trusted wellness partner.</p></div>
          <div><h4 className="font-semibold mb-4 text-sm">Links</h4><ul className="text-xs space-y-2 text-gray-400"><li>About</li><li>Quiz</li></ul></div>
          <div><h4 className="font-semibold mb-4 text-sm">Support</h4><ul className="text-xs space-y-2 text-gray-400"><li>Help</li><li>Privacy</li></ul></div>
          <div><h4 className="font-semibold mb-4 text-sm">Connect</h4><ul className="text-xs space-y-2 text-gray-400"><li>Newsletter</li><li>Social</li></ul></div>
        </div>
      </footer>

      {/* Modals */}
      <Dialog open={showCodeDialog} onOpenChange={setShowCodeDialog}>
        <DialogContent>
          <DialogHeader><DialogTitle>Enter Quiz Code</DialogTitle></DialogHeader>
          <div className="space-y-4">
            <Input placeholder="Enter code" value={code} onChange={(e) => setCode(e.target.value)} />
            <Button onClick={handleCodeSubmit} className="w-full">Verify Code</Button>
          </div>
        </DialogContent>
      </Dialog>

      <Dialog open={showNutrientForm} onOpenChange={setShowNutrientForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader><DialogTitle>Assessment Form</DialogTitle></DialogHeader>
          <form onSubmit={handleNutrientSubmit} className="space-y-4">
            {nutrientStep === 0 && (
              <div className="space-y-4">
                <Label>Gender</Label>
                <Select value={basic.gender} onValueChange={v => setBasic({...basic, gender: v})}>
                  <SelectTrigger><SelectValue placeholder="Select" /></SelectTrigger>
                  <SelectContent><SelectItem value="male">Male</SelectItem><SelectItem value="female">Female</SelectItem></SelectContent>
                </Select>
                <Button type="button" onClick={handleNutrientNext} className="w-full">Next</Button>
              </div>
            )}
            {nutrientStep === 2 && (
               <div className="flex justify-between"><Button type="button" variant="outline" onClick={handleNutrientBack}>Back</Button><Button type="submit">Submit</Button></div>
            )}
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={showSuccessModal} onOpenChange={setShowSuccessModal}>
        <DialogContent>
          <DialogHeader><DialogTitle>Success!</DialogTitle></DialogHeader>
          <Button onClick={() => navigate("/auth/signup")} className="w-full">Continue to Sign Up</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default BenfekHomepage;