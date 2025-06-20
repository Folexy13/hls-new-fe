
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import doctor from '../images/bannerdoctor.png'
import leftPill from '../images/leftPill.png';
import rightPill from '../images/rightPill.png';
import vitamins from '../images/vitamins.png'
import vitamins2 from '../images/vitamins2.png'
import vitamins3 from '../images/vitamins3.png'
import vitamins4 from '../images/vitamins4.png'
import patient from '../images/patient.jpg'
import bose from '../images/avwenagha-bose.jpg'
import joy from '../images/joy.jpeg'
import walter from '../images/walker-okolie.jpg'
import samson from '../images/samson-ojo.jpeg'
import nick from '../images/nick-ozonuma.jpg'
import eriscyl from '../images/ericsyl-john.jpg'
import mimi from '../images/mimi-gloria.jpg'

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../components/ui/carousel"

const Homepage: React.FC = () => {
  const [theme, setTheme] = useState('light-blue');
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [code, setCode] = useState('');
  const [showNutrientForm, setShowNutrientForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  const themes = {
    'light-blue': {
      hero: 'bg-[#e0f2fe]',
      text: 'text-blue-900',
      button: 'bg-orange-500 hover:bg-orange-600',
      accent: 'text-emerald-600'
    },
    'light-green': {
      hero: 'bg-gradient-to-br from-green-50 to-emerald-100',
      text: 'text-green-900',
      button: 'bg-blue-500 hover:bg-blue-600',
      accent: 'text-green-600'
    },
    'dark-purple': {
      hero: 'bg-gradient-to-br from-purple-900 to-indigo-900',
      text: 'text-purple-100',
      button: 'bg-purple-500 hover:bg-purple-600',
      accent: 'text-purple-300'
    },
    'dark-slate': {
      hero: 'bg-gradient-to-br from-slate-800 to-gray-900',
      text: 'text-slate-100',
      button: 'bg-slate-500 hover:bg-slate-600',
      accent: 'text-slate-300'
    }
  };

  const currentTheme = themes[theme as keyof typeof themes];

  const handleCodeSubmit = () => {
    if (code === 'HLS2024') {
      setShowCodeDialog(false);
      setShowNutrientForm(true);
      toast.success('Code verified! Please fill out the nutrient form.');
    } else {
      toast.error('Invalid code. Please try again.');
    }
  };

  const handleNutrientSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setShowNutrientForm(false);
    setShowSuccessModal(true);
  };

  const handleQuizStart = () => {
    setShowQuizModal(true);
    setShowCodeDialog(true);
  };

  const testimonials = [
    {
      name: "Avwenagha Bose",
      content: "The services I received from HLS are excellent. Great experience with professional staff",
      rating: 5,
      image: bose
    },
    {
      name: "Joy Anieofon David II",
      content: "Professional services with top-notch customer care! Learned so much about supplements and healthy living. Prices are very affordable.",
      rating: 5,
      image: joy
    },
    {
      name: "Walker Okolie",
      content: "They prioritize your wellbeing over profits. They don't just deliver, but follow up to ensure you're doing well.",
      rating: 5,
      image: walter
    },
    {
      name: "Samson Ojo",
      content: "Extremely competitive prices with first-class service. HLS adds tremendous value with nutritional education.",
      rating: 5,
      image: samson
    },
    {
      name: "Nick Okunzuwa",
      content: "Great insight to healthy living! The education about proper supplementation has been life-changing.",
      rating: 5,
      image: nick
    },
    {
      name: "Ericsyl John",
      content: "Their prompt response is impressive! They take time to educate me on the right supplements for my needs",
      rating: 5,
      image: eriscyl
    },
    {
      name: "Mimi Gloria",
      content: "For getting the best supplements and nutrition, you can never go wrong with HLS.",
      rating: 5,
      image: mimi
    },
    {
      name: "Olivia Njoku",
      content: "HLS provides a new level of understanding about how the lifestyle choices you make impact the biological processes in your body. I've seen great improvements in my health over 2 years.",
      rating: 5,
      image: "/placeholder.svg"
    },
    {
      name: "Kenny Ajayi",
      content: "Very reliable company! They deliver to your doorstep without any worries.",
      rating: 5,
      image: "/placeholder.svg"
    },
  ];

  const products = [
    {
      id: '1',
      name: 'Vitamin D3 Complex',
      price: 14999,
      image: vitamins,
      description: 'High-potency vitamin D3 for bone health and immune support',
      category: 'vitamin' as const
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      price: 17499,
      image: vitamins2,
      description: 'Pure omega-3 fatty acids for heart and brain health',
      category: 'supplement' as const
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      price: 12499,
      image: vitamins3,
      description: 'Highly absorbable magnesium for muscle and nerve function',
      category: 'mineral' as const
    },
    {
      id: '4',
      name: 'Whey Protein Isolate',
      price: 24999,
      image: vitamins4,
      description: 'Premium protein for muscle building and recovery',
      category: 'protein' as const
    }
  ];

  const faqs = [
    {
      question: "How does the HLS quiz work?",
      answer: "Our scientifically-designed quiz assesses your lifestyle, health goals, and dietary needs to provide personalized supplement recommendations."
    },
    {
      question: "Are your supplements third-party tested?",
      answer: "Yes, all our supplements undergo rigorous third-party testing for purity, potency, and safety."
    },
    {
      question: "Can I change my subscription?",
      answer: "Absolutely! You can modify, pause, or cancel your subscription at any time through your dashboard."
    },
    {
      question: "How long does shipping take?",
      answer: "Standard shipping takes 3-5 business days. Express shipping options are available at checkout."
    }
  ];

  const blogs = [
    {
      id: 1,
      title: "The Science Behind Personalized Nutrition",
      excerpt: "Discover how your unique genetic makeup influences your nutritional needs and how personalized supplementation can optimize your health.",
      date: "March 15, 2024",
      image: "/placeholder.svg"
    },
    {
      id: 2,
      title: "5 Signs You Might Need Vitamin D",
      excerpt: "Learn about the subtle signs of vitamin D deficiency and how proper supplementation can boost your energy and immune system.",
      date: "March 10, 2024",
      image: "/placeholder.svg"
    },
    {
      id: 3,
      title: "Optimizing Recovery with Magnesium",
      excerpt: "Understand how magnesium plays a crucial role in muscle recovery and why it's essential for active individuals.",
      date: "March 5, 2024",
      image: "/placeholder.svg"
    }
  ];

  const whyTakeQuiz = [
    {
      icon: Dna,
      text: "Know your nutrient type for Free"
    },
    {
      icon: Banknote,
      text: "Get paid for using your Nutrients"
    },
    {
      icon: Truck,
      text: "Free monthly Delivery for Beneficiaries"
    },
    {
      icon: Stethoscope,
      text: "Get news on medical breakthroughs"
    },
    {
      icon: Gift,
      text: "Occasional freebies on holidays"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Theme Toggle */}
      <div className="fixed top-4 right-4 z-50">
        <select 
          value={theme} 
          onChange={(e) => setTheme(e.target.value)}
          className="px-2 py-1 rounded border text-xs"
        >
          <option value="light-blue">Light Blue</option>
          <option value="light-green">Light Green</option>
          <option value="dark-purple">Dark Purple</option>
          <option value="dark-slate">Dark Slate</option>
        </select>
      </div>

      {/* Hero Section */}
      <section className={`relative ${currentTheme.hero} pt-6 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden h-[400px] sm:h-[500px] lg:h-[650px] flex flex-col justify-center`}>
        {/* Content */}
        <div className="max-w-7xl mx-auto relative z-10 text-center w-full pt-2 sm:pt-5 lg:bottom-40">
          <p className={`text-xs sm:text-sm lg:text-lg ${currentTheme.text} font-semibold mb-2 sm:mb-4`}>Food Extracts • Nutrients • Supplements</p>
          <h1 className={`text-lg sm:text-3xl lg:text-6xl font-bold ${currentTheme.text} mb-4 sm:mb-6`}>
            Personalized Just For YOU.
          </h1>
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 justify-center">
            <button
              onClick={handleQuizStart}
              className={`${currentTheme.button} text-white px-3 sm:px-6 lg:px-8 py-1.5 sm:py-2 rounded-lg text-sm sm:text-base lg:text-lg font-semibold transition-colors w-full sm:w-auto text-center`}
            >
              Take Quiz
            </button>
          </div>
        </div>

        {/* Curved bottom background */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-[40%] w-[900px] h-[100px] z-0 overflow-hidden">
          <svg
            viewBox="0 0 900 200"
            preserveAspectRatio="none"
            className="w-full h-full"
          >
            <path
              d="M0,200 C100,0 800,0 900,200 L900,200 L0,200 Z"
              fill="#00657e"
            />
          </svg>
        </div>

        {/* Doctor Image */}
        <div className="absolute bottom-[-1px] left-1/2 -translate-x-1/2 z-10 flex justify-center">
          <img
            src={doctor}
            alt="Health and wellness background"
            className="w-[120px] sm:w-[160px] lg:w-[200px] h-auto object-contain"
          />
        </div>

        {/* Pills Images */}
        <img
          src={leftPill}
          alt="Green pill"
          className="absolute bottom-0 left-2 sm:left-4 lg:left-10 w-8 sm:w-12 lg:w-24 h-auto z-10"
        />
        <img
          src={rightPill}
          alt="Green pill"
          className="absolute bottom-0 right-2 sm:right-4 lg:right-10 w-8 sm:w-12 lg:w-24 h-auto z-10"
        />
      </section>

      {/* Why Take Quiz Section */}
      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">Why take the quiz?</h2>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {whyTakeQuiz.map((item, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/5">
                  <div className="bg-white rounded-lg shadow-sm p-4 sm:p-6 flex flex-col items-center text-center h-full">
                    <item.icon className="h-8 sm:h-10 lg:h-12 w-8 sm:w-10 lg:w-12 text-[#005073] mb-3 sm:mb-4" />
                    <p className="text-sm sm:text-base text-gray-900">{item.text}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Featured Products</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">Premium supplements backed by science</p>
            <div className="mt-4 sm:mt-6">
              <Link 
                to="/marketplace"
                className={`inline-flex items-center px-4 sm:px-6 py-2 sm:py-3 ${currentTheme.accent} bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm sm:text-base`}
              >
                View All Products →
              </Link>
            </div>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4 sm:p-6">
                      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className={`text-lg sm:text-xl lg:text-2xl font-bold ${currentTheme.accent}`}>₦{product.price.toLocaleString()}</span>
                        <button className={`${currentTheme.button} text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors text-xs sm:text-sm`}>
                          Add to Cart
                        </button>
                      </div>
                    </div>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">What Our Customers Say</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">Real stories from real people</p>
          </div>
          
          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="bg-gray-50 rounded-lg p-4 sm:p-6 h-full">
                    <div className="flex items-center mb-3 sm:mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-8 sm:w-10 lg:w-12 h-8 sm:h-10 lg:h-12 rounded-full mr-3 sm:mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-sm sm:text-base">{testimonial.name}</h4>
                      </div>
                    </div>
                    <div className="flex mb-2 sm:mb-3">
                      {[...Array(testimonial.rating)].map((_, i) => (
                        <Star key={i} className="h-3 sm:h-4 w-3 sm:w-4 text-yellow-400 fill-current" />
                      ))}
                    </div>
                    <p className="text-gray-700 text-xs sm:text-sm lg:text-base">{testimonial.content}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">Everything you need to know</p>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {faqs.map((faq, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2">
                  <div className="bg-white rounded-lg p-4 sm:p-6 shadow-md h-full">
                    <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{faq.question}</h3>
                    <p className="text-gray-700 text-sm sm:text-base">{faq.answer}</p>
                  </div>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-12">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Latest from Our Blog</h2>
            <p className="text-base sm:text-lg lg:text-xl text-gray-600">Health insights and tips from our experts</p>
          </div>
          
          <Carousel className="w-full">
            <CarouselContent>
              {blogs.map((blog) => (
                <CarouselItem key={blog.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <Link to={`/blog/${blog.id}`}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-32 sm:h-40 lg:h-48 object-cover"
                      />
                    </Link>
                    <div className="p-4 sm:p-6 flex-1 flex flex-col">
                      <div className="text-xs sm:text-sm text-gray-500 mb-2">{blog.date}</div>
                      <h3 className="text-base sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{blog.title}</h3>
                      <p className="text-gray-700 mb-3 sm:mb-4 flex-1 text-xs sm:text-sm lg:text-base">{blog.excerpt}</p>
                      <Link 
                        to={`/blog/${blog.id}`}
                        className={`${currentTheme.accent} font-medium hover:opacity-80 inline-block text-sm sm:text-base`}
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                </CarouselItem>
              ))}
            </CarouselContent>
            <div className="hidden sm:block">
              <CarouselPrevious />
              <CarouselNext />
            </div>
          </Carousel>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 lg:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-4">HLS</h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Your trusted partner in personalized health and wellness.
              </p>
            </div>
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Quick Links</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white text-xs sm:text-sm">About Us</Link></li>
                <li><button onClick={handleQuizStart} className="text-gray-400 hover:text-white text-xs sm:text-sm">Take Quiz</button></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white text-xs sm:text-sm">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Support</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-4">Connect</h4>
              <ul className="space-y-1 sm:space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Newsletter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Social Media</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 sm:mt-6 lg:mt-8 pt-4 sm:pt-6 lg:pt-8 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} HLS Health & Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

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

      {/* Nutrient Form Modal */}
      <Dialog open={showNutrientForm} onOpenChange={setShowNutrientForm}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nutrient Assessment Form</DialogTitle>
            <DialogDescription>Please fill out your health and nutrient information</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleNutrientSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="age">Age</Label>
                <Input id="age" type="number" placeholder="Enter your age" />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select>
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
                <Label htmlFor="height">Height (cm)</Label>
                <Input id="height" type="number" placeholder="Enter height" />
              </div>
              <div>
                <Label htmlFor="weight">Weight (kg)</Label>
                <Input id="weight" type="number" placeholder="Enter weight" />
              </div>
              <div>
                <Label htmlFor="activity">Activity Level</Label>
                <Select>
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
              <div>
                <Label htmlFor="goal">Health Goal</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Select health goal" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="weight-loss">Weight Loss</SelectItem>
                    <SelectItem value="muscle-gain">Muscle Gain</SelectItem>
                    <SelectItem value="maintenance">Maintenance</SelectItem>
                    <SelectItem value="general-health">General Health</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <Button type="submit" className="w-full">
              Complete Assessment
            </Button>
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
          <Button onClick={() => setShowSuccessModal(false)} className="w-full">
            Continue to Sign Up
          </Button>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Homepage;
