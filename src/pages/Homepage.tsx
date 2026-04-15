import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useStore } from '../store/useStore';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'react-toastify';
import { quizService } from '@/services/quizService';
import { apiClient } from '@/config/axios';
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
  const { user, isAuthenticated } = useStore();
  const [showQuizModal, setShowQuizModal] = useState(false);
  const [showCodeDialog, setShowCodeDialog] = useState(false);
  const [showReferralDialog, setShowReferralDialog] = useState(false);
  const [code, setCode] = useState('');
  const [showNutrientForm, setShowNutrientForm] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [nutrientStep, setNutrientStep] = useState(0); // 0: Basic, 1: Lifestyle, 2: Preference
  const [basic, setBasic] = useState({ gender: '', nickname: '', age: '', weight: '', height: '' });
  const [lifestyle, setLifestyle] = useState({ habit: [], fun: [], routine: [], career: '' });
  const [preference, setPreference] = useState({ drugForm: [], minBudget: '', maxBudget: '' });
  const [validatedCode, setValidatedCode] = useState('');
  const [expandedTestimonials, setExpandedTestimonials] = useState<Record<number, boolean>>({});
  const navigate = useNavigate();
  const handleQuizStart = () => {
    setShowReferralDialog(true);
  };

  // Check if user is logged in and redirect to their role-specific homepage
  useEffect(() => {
    if (isAuthenticated && user?.role) {
      if (user.role === 'principal') {
        navigate('/principal');
      } else if (user.role === 'wholesaler') {
        navigate('/wholesaler');
      } else if (user.role === 'benfek') {
        navigate('/benfek');
      }
    }

    // Check if we should show the quiz modal (set by QuizPage)
    const showQuizModal = window.sessionStorage.getItem('showQuizModal');
    if (showQuizModal === 'true') {
      setShowQuizModal(true);
      setShowCodeDialog(true);
      window.sessionStorage.removeItem('showQuizModal');
    }
  }, [isAuthenticated, user, navigate]);

  const handleCodeSubmit = async () => {
    if (!code.trim()) {
      toast.error('Please enter a quiz code.');
      return;
    }

    try {
      const response = await apiClient.post('/api/v2/quiz-code/validate', {
        code: code.trim(),
      });
      const quizCodeData = response.data?.data?.quizCode;

      setValidatedCode(quizCodeData?.code || code.trim());
      setShowCodeDialog(false);
      setShowNutrientForm(true);
      setNutrientStep(0);
      toast.success('Code verified! Please fill out the nutrient form.');
    } catch (error: unknown) {
      toast.error('Invalid code. Please try again.');
      console.error(error);
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
    if (!validatedCode && !code.trim()) {
      toast.error('Please validate your quiz code first.');
      return;
    }
    // Map data to API structure
    const payload = {
      code: validatedCode || code.trim(),
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
      await quizService.submitQuizData(payload);
      toast.success('Quiz completed and data submitted successfully!');
      setShowNutrientForm(false);
      setShowSuccessModal(true);
    } catch (error: unknown) {
      toast.error('Failed to submit quiz data. Please try again.');
      console.error(error);
    }
  };

  // const handleQuizStart = () => {
  //   setShowQuizModal(true);
  //   setShowCodeDialog(true);
  // };


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

  const toggleTestimonial = (index: number) => {
    setExpandedTestimonials((prev) => ({ ...prev, [index]: !prev[index] }));
  };

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
      image: patient
    },
    {
      id: 2,
      title: "5 Signs You Might Need Vitamin D",
      excerpt: "Learn about the subtle signs of vitamin D deficiency and how proper supplementation can boost your energy and immune system.",
      date: "March 10, 2024",
      image: vitamins2
    },
    {
      id: 3,
      title: "Optimizing Recovery with Magnesium",
      excerpt: "Understand how magnesium plays a crucial role in muscle recovery and why it's essential for active individuals.",
      date: "March 5, 2024",
      image: vitamins3
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
    <div className="min-h-screen flex flex-col">
      {/* Hero Section */}
      <section className="relative bg-[#e0f2fe] pt-4 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
        <div className="max-w-7xl mx-auto relative z-20 text-center">
          <div className="pt-8 sm:pt-16 lg:pt-20 pb-4 sm:pb-8">
            <p className="text-xs sm:text-sm lg:text-lg text-blue-900 font-semibold mb-2 sm:mb-4">
              Food Extracts &bull; Nutrients &bull; Supplements
            </p>

            <h1 className="text-2xl sm:text-4xl lg:text-6xl font-bold text-blue-900 mb-6 sm:mb-8">
              Personalized Just For YOU.
            </h1>

            <div className="flex justify-center mb-8 sm:mb-12">
              <button
                onClick={handleQuizStart}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-2 sm:px-8 sm:py-3 rounded-lg text-sm sm:text-base font-semibold transition-colors"
              >
                Take Quiz
              </button>
            </div>
          </div>

          <div className="relative z-30 flex justify-center">
            <img
              src={doctor}
              alt="Health and wellness background"
              className="w-32 sm:w-48 lg:w-64 h-auto object-contain"
            />
          </div>
        </div>

        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-16 sm:h-24 lg:h-32 z-10">
          <svg viewBox="0 0 900 200" preserveAspectRatio="none" className="w-full h-full">
            <path d="M0,200 A606.25,606.25 0 0 1 900,200 L900,200 L0,200 Z" fill="#00657e" />
          </svg>
        </div>

        <img
          src={leftPill}
          alt="Green pill"
          className="absolute bottom-4 right-10 sm:right-8 lg:right-16 w-12 sm:w-14 lg:w-20 h-auto z-20"
        />
        <img
          src={rightPill}
          alt="Green pill"
          className="absolute bottom-4 left-10 sm:left-8 lg:left-16 w-12 sm:w-14 lg:w-20 h-auto z-20"
        />
      </section>

      {/* Why Take Quiz Section */}
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900">
              Why take the quiz?
            </h2>
            <p className="mx-auto mt-2 max-w-2xl text-sm sm:text-base text-gray-600">
              A quick assessment that helps us personalize your wellness experience.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-5">
            {whyTakeQuiz.map((item, index) => (
              <div
                key={index}
                className="group h-full rounded-3xl border border-emerald-100 bg-gradient-to-br from-white to-emerald-50/40 p-5 text-center transition-all hover:-translate-y-1 hover:border-emerald-200"
              >
                <div className="mx-auto mb-1 flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#005073] ">
                  <item.icon className="h-7 w-7" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-gray-900 leading-snug">
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products Section */}
      <section className="py-10 sm:py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8 sm:mb-10">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">Featured Products</h2>
            <p className="text-sm sm:text-base lg:text-lg text-gray-700">Premium supplements backed by science</p>
            <div className="mt-4 sm:mt-5">
              <Link
                to="/marketplace"
                className="inline-flex items-center px-5 py-2.5 border border-orange-500 text-orange-500 font-medium rounded-full hover:bg-orange-50 transition-all text-sm"
              >
                View All Products →
              </Link>
            </div>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-3 sm:-ml-4">
              {products.map((product) => (
                <CarouselItem key={product.id} className="pl-3 sm:pl-4 basis-[66%] sm:basis-1/2 lg:basis-1/4">
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <Link to={`/product/${product.id}`}>
                      <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-white p-5 border-b border-gray-100">
                        <img
                          src={product.image}
                          alt={product.name}
                          className="max-h-full max-w-full object-contain"
                        />
                      </div>
                    </Link>
                    <div className="p-4 sm:p-5 flex flex-1 flex-col">
                      <div className='flex flex-row justify-between'>
                        <h3 className="text-sm sm:text-lg font-medium text-gray-900 mb-2 leading-snug">{product.name}</h3>
                        {/* <p className="text-gray-700 text-sm leading-6 mb-5 hidden sm:block flex-1">{product.description}</p> */}
                        <span className="text-sm sm:text-xl font-semibold text-emerald-600">₦{product.price.toLocaleString()}</span>
                      </div>
                      <div className="mt-auto flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                        {/* <span className="text-lg sm:text-xl font-bold text-emerald-600">₦{product.price.toLocaleString()}</span> */}
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg transition-colors text-sm font-semibold">
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
      <section className="py-8 sm:py-12 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              What Our Customers Say
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Real stories from real people
            </p>
          </div>

          <div className="relative px-4 sm:px-7">
            <Carousel className="w-full overflow-hidden">
              <CarouselContent className="ml-0">
                {testimonials.map((testimonial, index) => (
                  <CarouselItem
                    key={index}
                    className="pl-0 basis-[100%] sm:basis-1/2 lg:basis-1/3 p-2"
                  >
                    <article
                      className={`min-h-[200px] rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_18px_40px_-28px_rgba(15,23,42,0.35)] transition-shadow hover:shadow-[0_24px_48px_-28px_rgba(15,23,42,0.45)] flex flex-col ${
                        expandedTestimonials[index] ? '' : 'h-[230px]'
                      }`}
                    >
                      <div className="mb-4 flex items-start justify-between gap-3">
                        <div className="flex items-center">
                          <img
                            src={testimonial.image}
                            alt={testimonial.name}
                            className="h-12 w-12 rounded-full border border-slate-200 object-cover"
                          />
                          <div className="ml-3">
                            <h4 className="text-sm font-semibold text-slate-900 sm:text-base">
                              {testimonial.name}
                            </h4>
                            <p className="text-xs font-medium uppercase tracking-[0.14em] text-slate-400">
                              Verified review
                            </p>
                          </div>
                        </div>
                        <span className="text-4xl leading-none text-emerald-100">"</span>
                      </div>

                      <div className="mb-3 flex gap-1">
                        {[...Array(testimonial.rating)].map((_, i) => (
                          <Star
                            key={i}
                            className="h-4 w-4 fill-amber-400 text-amber-400"
                          />
                        ))}
                      </div>

                      {(() => {
                        const isExpanded = !!expandedTestimonials[index];
                        const showToggle = (testimonial.content?.length ?? 0) > 140;

                        return (
                          <div className="mt-1 flex-1 flex flex-col">
                            <div className="relative">
                              <p
                                className="text-[13px] leading-6 text-slate-600 sm:text-sm sm:leading-7"
                                style={
                                  isExpanded
                                    ? undefined
                                    : ({
                                        display: '-webkit-box',
                                        WebkitLineClamp: 4,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden',
                                      } as React.CSSProperties)
                                }
                              >
                                {testimonial.content}
                              </p>

                              {!isExpanded && showToggle && (
                                <div className="pointer-events-none absolute bottom-0 left-0 right-0 h-10 bg-gradient-to-t from-white to-transparent" />
                              )}
                            </div>

                            {showToggle && (
                              <button
                                type="button"
                                onClick={() => toggleTestimonial(index)}
                                className="mt-2 inline-flex w-fit items-center text-xs font-semibold text-emerald-700 underline decoration-emerald-300 underline-offset-4 hover:text-emerald-800"
                                aria-expanded={isExpanded}
                              >
                                {isExpanded ? 'Show less' : 'Read more'}
                              </button>
                            )}
                          </div>
                        );
                      })()}
                    </article>
                  </CarouselItem>
                ))}
              </CarouselContent>
            </Carousel>

            <p className="text-center text-xs sm:text-sm text-gray-500 mt-3">
              
            </p>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-8 sm:py-12 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
              Frequently Asked Questions
            </h2>
            <p className="text-sm sm:text-base text-gray-700">
              Everything you need to know
            </p>
          </div>

          <div className="mx-auto max-w-3xl">
            <Accordion
              type="single"
              collapsible
              defaultValue="faq-0"
              className="rounded-2xl border border-gray-200 bg-white px-4 sm:px-6"
            >
              {faqs.map((faq, index) => (
                <AccordionItem
                  key={faq.question}
                  value={`faq-${index}`}
                  className="border-gray-200"
                >
                  <AccordionTrigger className="text-left text-base sm:text-lg font-semibold text-gray-900 hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-sm sm:text-base leading-relaxed text-gray-700">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Latest from Our Blog</h2>
            <p className="text-sm sm:text-base text-gray-700">
              Health insights and tips from our experts
            </p>
          </div>

          <div className="overflow-hidden pl-2">
            <Carousel className="w-full">
              <CarouselContent className='space-2'>
                {blogs.map((blog) => (
                  <CarouselItem key={blog.id} className="basis-[75%] sm:basis-1/2 lg:basis-1/3">
                    <article className="bg-gray-50 border border-gray-100 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                      <div className='w-full'>
                        <img
                          src={blog.image}
                          alt={blog.title}
                          className="w-full h-24 sm:h-40 lg:h-48 object-contain p-1"
                        />
                      </div>
                      <div className="p-3 sm:p-6 flex-1 flex flex-col">
                        <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">{blog.date}</div>
                        <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{blog.title}</h3>
                        <p className="text-gray-700 mb-2 sm:mb-4 flex-1 text-xs sm:text-sm lg:text-base">{blog.excerpt}</p>
                        <Link
                          to={`/blog/${blog.id}`}
                          className="text-emerald-600 font-medium hover:opacity-80 inline-block text-xs sm:text-base"
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
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-6 sm:py-8 lg:py-12">
        <div className="sm:max-w-7xl sm:mx-auto px-2 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">HLS</h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Your trusted partner in personalized health and wellness.
              </p>
            </div>
            <div className="flex justify-between w-[calc(100vw-12px)]">
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3">Quick Links</h4>
                <ul className="space-y-1 sm:space-y-2">
                  <li><Link to="/about" className="text-gray-400 hover:text-white text-xs sm:text-sm">About Us</Link></li>
                  <li><button onClick={handleQuizStart} className="text-gray-400 hover:text-white text-xs sm:text-sm">Take Quiz</button></li>
                  <li><Link to="/support" className="text-gray-400 hover:text-white text-xs sm:text-sm">Support</Link></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3">Support</h4>
                <ul className="space-y-1 sm:space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Help Center</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Contact Us</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Privacy Policy</a></li>
                </ul>
              </div>
              <div>
                <h4 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3">Connect</h4>
                <ul className="space-y-1 sm:space-y-2">
                  <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Newsletter</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Social Media</a></li>
                  <li><a href="#" className="text-gray-400 hover:text-white text-xs sm:text-sm">Community</a></li>
                </ul>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-4 sm:pt-6 text-center">
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

      <Dialog open={showReferralDialog} onOpenChange={setShowReferralDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Were you referred by a medical personnel?</DialogTitle>
            <DialogDescription>
              If you have a quiz code from a doctor, choose Yes to continue.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 flex items-center justify-center gap-5">
            <Button
              onClick={() => {
                setShowReferralDialog(false);
                navigate('/benfek/Quiz-form', { state: { includeGenderAge: true } });
              }}
            >
              No
            </Button>
            <Button
              variant="outline"
              onClick={() => {
                setShowReferralDialog(false);
                navigate('/assessment');
              }}
            >
              Yes
            </Button>
          </div>
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

export default Homepage;
