import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';
import doctor from '../../images/hero-doctor.png'
import leftPill from '../../images/leftPill.png';
import rightPill from '../../images/rightPill.png';
import patient from '../../images/patient.jpg'
import bose from '../../images/avwenagha-bose.jpg'
import joy from '../../images/joy.jpeg'
import walter from '../../images/walker-okolie.jpg'
import samson from '../../images/samson-ojo.jpeg'
import nick from '../../images/nick-ozonuma.jpg'
import eriscyl from '../../images/ericsyl-john.jpg'
import mimi from '../../images/mimi-gloria.jpg'
import { Package } from "lucide-react";
import { useStore } from '@/store/useStore';
import { toast } from 'react-toastify';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { apiClient } from '@/config/axios';
import { contentService, type PublicArticle } from '@/services/contentService';

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "../../components/ui/carousel"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from "@/components/ui/card";

const BenfekHomepage: React.FC = () => {
  const navigate = useNavigate();
  const { addToCart } = useStore();
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const [products, setProducts] = useState<Array<{
    id: string;
    name: string;
    price: number;
    image: string;
    description: string;
    category: string;
  }>>([]);
  const [isLoadingProducts, setIsLoadingProducts] = useState(true);
  const [blogs, setBlogs] = useState<PublicArticle[]>([]);
  const [isLoadingBlogs, setIsLoadingBlogs] = useState(true);

  const handleQuizStart = () => {
    navigate('/assessment');
  };

  const handleAddToCart = async (event: React.MouseEvent, product: any) => {
    event.stopPropagation();
    setAddingProductId(product.id);
    try {
      await addToCart(product);
      toast.success('Added to cart');
    } catch {
      toast.error('Failed to add to cart');
    } finally {
      setAddingProductId(null);
    }
  };

  useEffect(() => {
    const fetchFeaturedProducts = async () => {
      try {
        setIsLoadingProducts(true);
        const response = await apiClient.get('/api/v2/supplements/all');
        const supplements = response.data?.data?.supplements || [];
        const mapped = supplements
          .map((item: any) => ({
            id: String(item.id),
            name: item.name || 'Supplement',
            price: Number(item.price || 0),
            image: item.image || item.imageUrl || '/placeholder.svg',
            description: item.description || 'Premium supplement from HLS.',
            category: item.category || item.dosageForm || 'supplement',
          }))
          .filter((item: any) => item.id && item.name)
          .slice(0, 8);
        setProducts(mapped);
      } catch (error) {
        console.error('Failed to load featured products:', error);
        setProducts([]);
      } finally {
        setIsLoadingProducts(false);
      }
    };

    fetchFeaturedProducts();
  }, []);

  useEffect(() => {
    contentService.getPublicArticles()
      .then(setBlogs)
      .catch(() => setBlogs([]))
      .finally(() => setIsLoadingBlogs(false));
  }, []);

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

  // Benfek-specific dashboard stats
  const dashboardStats = [
    {
      title: "Health Score",
      value: "85/100",
      icon: CheckCircle,
      change: "+5%",
      color: "bg-green-500"
    },
    {
      title: "Supplements",
      value: "4",
      icon: Package,
      change: "Active",
      color: "bg-blue-500"
    },
    {
      title: "Next Delivery",
      value: "3 days",
      icon: Truck,
      change: "On time",
      color: "bg-purple-500"
    },
    {
      title: "Rewards",
      value: "₦12,500",
      icon: Gift,
      change: "Available",
      color: "bg-orange-500"
    }
  ];

  return (
    <div className="min-h-screen">
      {/* Benfek Dashboard Section */}
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
                <CardDescription>Current supplements in your personalized plan</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { name: "Vitamin D3 Complex", dosage: "1 tablet daily", time: "Morning", status: "Active" },
                    { name: "Omega-3 Fish Oil", dosage: "2 capsules daily", time: "With meals", status: "Active" },
                    { name: "Magnesium Glycinate", dosage: "1 tablet", time: "Evening", status: "Active" },
                    { name: "Zinc + Vitamin C", dosage: "1 tablet", time: "Morning", status: "Active" }
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
                <Button variant="outline" className="w-full">
                  View Full Plan
                </Button>
              </CardFooter>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Health Insights</CardTitle>
                <CardDescription>Personalized recommendations based on your profile</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {[
                    { title: "Increase Vitamin D intake", description: "Your recent assessment shows slightly low Vitamin D levels." },
                    { title: "Consider adding Zinc", description: "Based on your lifestyle, Zinc may help support your immune system." },
                    { title: "Hydration reminder", description: "Remember to drink at least 2 liters of water daily." },
                    { title: "Sleep optimization", description: "Your sleep pattern indicates you could benefit from magnesium before bed." }
                  ].map((insight, i) => (
                    <div key={i} className="border-b pb-3">
                      <p className="font-medium">{insight.title}</p>
                      <p className="text-sm text-gray-500">{insight.description}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full">
                  View All Insights
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </section>

      {/* Hero Section */}
      <section className="relative bg-[#e0f2fe] pt-4 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Content Container */}
        <div className="max-w-7xl mx-auto relative z-20 text-center">
          {/* Text Content */}
          <div className="pt-8 sm:pt-16 lg:pt-20 pb-4 sm:pb-8">
            <p className="text-xs sm:text-sm lg:text-lg text-blue-900 font-semibold mb-2 sm:mb-4">Food Extracts • Nutrients • Supplements</p>
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

          {/* Doctor Image - positioned above curve */}
          <div className="relative z-30 flex justify-center">
            <img
              src={doctor}
              alt="Health and wellness background"
              className="w-32 sm:w-48 lg:w-64 h-auto object-contain"
            />
          </div>
        </div>

        {/* Curved bottom background */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-full max-w-4xl h-16 sm:h-24 lg:h-32 z-10">
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

        {/* Pills Images */}
        <img
          src={leftPill}
          alt="Green pill"
          className="absolute bottom-4 left-4 sm:left-8 lg:left-16 w-6 sm:w-12 lg:w-20 h-auto z-20"
        />
        <img
          src={rightPill}
          alt="Green pill"
          className="absolute bottom-4 right-4 sm:right-8 lg:right-16 w-6 sm:w-12 lg:w-20 h-auto z-20"
        />
      </section>

      {/* Why Take Quiz Section */}
      <section className="py-8 sm:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900">Why take the quiz?</h2>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {whyTakeQuiz.map((item, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/5">
                  <div className="bg-white rounded-lg shadow-sm p-3 sm:p-6 flex flex-col items-center text-center h-full">
                    <item.icon className="h-6 sm:h-10 lg:h-12 w-6 sm:w-10 lg:w-12 text-[#005073] mb-2 sm:mb-4" />
                    <p className="text-xs sm:text-base text-gray-900">{item.text}</p>
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
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Featured Products</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Premium supplements backed by science</p>
            <div className="mt-3 sm:mt-6">
              <Link
                to="/marketplace"
                className="inline-flex items-center px-3 sm:px-6 py-2 sm:py-3 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-xs sm:text-base"
              >
                View All Products →
              </Link>
            </div>
          </div>

          {isLoadingProducts ? (
            <div className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white p-8 text-sm text-slate-500">
              <LoadingSpinner className="text-emerald-600" />
              Loading products...
            </div>
          ) : products.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              No products are available yet.
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-3 sm:-ml-4">
                {products.map((product) => (
                <CarouselItem key={product.id} className="pl-3 sm:pl-4 basis-[66%] sm:basis-1/2 lg:basis-1/4">
                  <div
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/product/${product.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter' || event.key === ' ') navigate(`/product/${product.id}`);
                    }}
                    className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500"
                  >
                    <div className="relative">
                      <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 p-5 border-b border-slate-100">
                        <img src={product.image} alt={product.name} className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105" />
                      </div>
                      <span className="absolute left-3 top-3 rounded-full bg-white/95 px-3 py-1 text-[11px] font-semibold uppercase tracking-wide text-emerald-700 shadow-sm">
                        {product.category}
                      </span>
                    </div>
                    <div className="p-4 sm:p-5 flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 [&>span]:hidden">
                          <h3 className="text-sm sm:text-lg font-semibold text-gray-950 leading-snug line-clamp-2">{product.name}</h3>
                          <span className="text-sm sm:text-xl font-semibold text-emerald-600">₦{product.price.toLocaleString()}</span>
                        </div>
                        <div className="shrink-0 text-right">
                        <span className="block text-sm sm:text-xl font-semibold text-emerald-600">₦{product.price.toLocaleString()}</span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={(event) => handleAddToCart(event, product)}
                        disabled={addingProductId === product.id}
                        className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
                      >
                        {addingProductId === product.id ? <LoadingSpinner /> : <ShoppingCart className="h-4 w-4" />}
                        {addingProductId === product.id ? 'Adding...' : 'Add to Cart'}
                      </button>
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
          )}
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-8 sm:py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">What Our Customers Say</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Real stories from real people</p>
          </div>

          <Carousel className="w-full max-w-5xl mx-auto">
            <CarouselContent>
              {testimonials.map((testimonial, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <div className="bg-gray-50 rounded-lg p-3 sm:p-6 h-full">
                    <div className="flex items-center mb-2 sm:mb-4">
                      <img
                        src={testimonial.image}
                        alt={testimonial.name}
                        className="w-6 sm:w-10 lg:w-12 h-6 sm:h-10 lg:h-12 rounded-full mr-2 sm:mr-4"
                      />
                      <div>
                        <h4 className="font-semibold text-gray-900 text-xs sm:text-base">{testimonial.name}</h4>
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
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Frequently Asked Questions</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Everything you need to know</p>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {faqs.map((faq, index) => (
                <CarouselItem key={index} className="basis-full sm:basis-1/2">
                  <div className="bg-white rounded-lg p-3 sm:p-6 shadow-md h-full">
                    <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2 sm:mb-3">{faq.question}</h3>
                    <p className="text-gray-700 text-xs sm:text-base">{faq.answer}</p>
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
          <div className="text-center mb-6 sm:mb-12">
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2 sm:mb-4">Latest from Our Blog</h2>
            <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Health insights and tips from our experts</p>
          </div>

          <Carousel className="w-full">
            <CarouselContent>
              {isLoadingBlogs ? (
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="flex h-full min-h-64 items-center justify-center rounded-lg bg-gray-50 text-sm text-gray-500">
                    Loading articles...
                  </article>
                </CarouselItem>
              ) : blogs.length ? blogs.map((blog) => (
                <CarouselItem key={blog.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <Link to={`/blog/${blog.id}`}>
                      <img
                        src={blog.imageUrl || '/placeholder.svg'}
                        alt={blog.title}
                        className="w-full h-24 sm:h-40 lg:h-48 object-cover"
                      />
                    </Link>
                    <div className="p-3 sm:p-6 flex-1 flex flex-col">
                      <div className="text-xs sm:text-sm text-gray-500 mb-1 sm:mb-2">
                        {blog.createdAt ? new Date(blog.createdAt).toLocaleDateString() : 'Recently'}
                      </div>
                      <h3 className="text-sm sm:text-lg lg:text-xl font-semibold text-gray-900 mb-2 sm:mb-3">{blog.title}</h3>
                      <p className="text-gray-700 mb-2 sm:mb-4 flex-1 text-xs sm:text-sm lg:text-base">{blog.excerpt || blog.description}</p>
                      <Link
                        to={`/blog/${blog.id}`}
                        className="text-emerald-600 font-medium hover:opacity-80 inline-block text-xs sm:text-base"
                      >
                        Read More →
                      </Link>
                    </div>
                  </article>
                </CarouselItem>
              )) : (
                <CarouselItem className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="flex h-full min-h-64 items-center justify-center rounded-lg bg-gray-50 p-6 text-center text-sm text-gray-500">
                    No articles have been published yet.
                  </article>
                </CarouselItem>
              )}
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
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
            <div className="col-span-2 md:col-span-1">
              <h3 className="text-base sm:text-xl lg:text-2xl font-bold mb-2 sm:mb-3">HLS</h3>
              <p className="text-gray-400 text-xs sm:text-sm lg:text-base">
                Your trusted partner in personalized health and wellness.
              </p>
            </div>
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
          <div className="border-t border-gray-800 mt-4 sm:mt-6 pt-4 sm:pt-6 text-center">
            <p className="text-gray-400 text-xs sm:text-sm">
              © {new Date().getFullYear()} HLS Health & Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default BenfekHomepage;
