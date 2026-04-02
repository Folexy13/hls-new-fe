import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import doctor from '../../images/bannerdoctor.png'
import leftPill from '../../images/leftPill.png';
import rightPill from '../../images/rightPill.png';
import vitamins from '../../images/vitamins.png'
import vitamins2 from '../../images/vitamins2.png'
import vitamins3 from '../../images/vitamins3.png'
import vitamins4 from '../../images/vitamins4.png'
import patient from '../../images/patient.jpg'
import bose from '../../images/avwenagha-bose.jpg'
import joy from '../../images/joy.jpeg'
import walter from '../../images/walker-okolie.jpg'
import samson from '../../images/samson-ojo.jpeg'
import nick from '../../images/nick-ozonuma.jpg'
import eriscyl from '../../images/ericsyl-john.jpg'
import mimi from '../../images/mimi-gloria.jpg'
import { Package } from "lucide-react";

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

  const handleQuizStart = () => {
    navigate('/assessment');
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

          <Carousel className="w-full">
            <CarouselContent>
              {products.map((product) => (
                <CarouselItem key={product.id} className="basis-full sm:basis-1/2 lg:basis-1/4">
                  <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow h-full">
                    <Link to={`/product/${product.id}`}>
                      <img
                        src={product.image}
                        alt={product.name}
                        className="w-full h-24 sm:h-40 lg:h-48 object-cover"
                      />
                    </Link>
                    <div className="p-3 sm:p-6">
                      <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                      <p className="text-gray-600 text-xs sm:text-sm mb-3 sm:mb-4 hidden sm:block">{product.description}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-sm sm:text-xl lg:text-2xl font-bold text-emerald-600">₦{product.price.toLocaleString()}</span>
                        <button className="bg-orange-500 hover:bg-orange-600 text-white px-2 sm:px-4 py-1 sm:py-2 rounded-md transition-colors text-xs sm:text-sm">
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
              {blogs.map((blog) => (
                <CarouselItem key={blog.id} className="basis-full sm:basis-1/2 lg:basis-1/3">
                  <article className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow h-full flex flex-col">
                    <Link to={`/blog/${blog.id}`}>
                      <img
                        src={blog.image}
                        alt={blog.title}
                        className="w-full h-24 sm:h-40 lg:h-48 object-cover"
                      />
                    </Link>
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
