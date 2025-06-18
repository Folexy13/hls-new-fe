import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award, Dna, Banknote, Truck, Stethoscope, Gift, ShoppingCart, ArrowRight } from 'lucide-react';
import doctor from '../images/bannerdoctor.png'
import leftPill from '../images/leftPill.png';
import rightPill from '../images/rightPill.png';
import vitamins from '../images/vitamins.png'
import vitamins2 from '../images/vitamins2.png'
import vitamins3 from '../images/vitamins3.png'
import vitamins4 from '../images/vitamins4.png'
import patient from '../images/patient.jpg'

const Homepage: React.FC = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      content: "HLS helped me understand my nutritional needs better. The personalized recommendations are spot-on!",
      rating: 5,
      image: "/placeholder.svg"
    },
    {
      name: "Mike Chen",
      role: "Busy Professional",
      content: "The quiz was eye-opening. Now I know exactly what supplements I need for my lifestyle.",
      rating: 5,
      image: "/placeholder.svg"
    },
    {
      name: "Emma Davis",
      role: "Health Coach",
      content: "I recommend HLS to all my clients. The science-based approach is what sets it apart.",
      rating: 5,
      image: "/placeholder.svg"
    }
  ];

  const products = [
    {
      id: '1',
      name: 'Vitamin D3 Complex',
      price: 29.99,
      image: vitamins,
      description: 'High-potency vitamin D3 for bone health and immune support',
      category: 'vitamin' as const
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      price: 34.99,
      image: vitamins2,
      description: 'Pure omega-3 fatty acids for heart and brain health',
      category: 'supplement' as const
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      price: 24.99,
      image: vitamins3,
      description: 'Highly absorbable magnesium for muscle and nerve function',
      category: 'mineral' as const
    },
    {
      id: '4',
      name: 'Whey Protein Isolate',
      price: 49.99,
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
      title: "The Science Behind Personalized Nutrition",
      excerpt: "Discover how your unique genetic makeup influences your nutritional needs and how personalized supplementation can optimize your health.",
      date: "March 15, 2024",
      image: "/placeholder.svg"
    },
    {
      title: "5 Signs You Might Need Vitamin D",
      excerpt: "Learn about the subtle signs of vitamin D deficiency and how proper supplementation can boost your energy and immune system.",
      date: "March 10, 2024",
      image: "/placeholder.svg"
    },
    {
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
      text: "Get news on medical breakthroughs and innovations"
    },
    {
      icon: Gift,
      text: "Occasional freebies on national holidays and special days"
    },
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-[#e0f2fe] pt-8 pb-0 px-4 sm:px-6 lg:px-8 overflow-hidden h-[650px] flex flex-col justify-center">
        {/* Content */}
        <div className="max-w-7xl mx-auto relative z-10 text-center w-full pt-5 bottom-40">
          <p className="text-lg text-blue-900 font-semibold mb-4">Food Extracts • Nutrients • Supplements</p>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-blue-900 mb-6">
            Personalized Just For YOU.
          </h1>
          <p className="text-xl text-blue-800 mb-8 max-w-3xl mx-auto">
              Discover the supplements your body actually needs with our science-based assessment. 
              Get personalized recommendations tailored to your unique lifestyle and health goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quiz"
                className="bg-orange-500 text-white px-4 sm:px-8 py-2 sm:py-2 rounded-lg text-base sm:text-lg font-semibold hover:bg-orange-600 transition-colors w-full sm:w-auto text-center"
              >
                Take Quiz
              </Link>
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
            className="w-[200px] h-auto object-contain"
          />
        </div>

          {/* Pills Images */}
          <img
            src={leftPill}
            alt="Green pill"
            className="absolute bottom-0 left-4 sm:left-10 w-16 sm:w-24 h-auto z-10"
          />
          <img
            src={rightPill}
            alt="Green pill"
            className="absolute bottom-0 right-4 sm:right-10 w-16 sm:w-24 h-auto z-10"
          />
        </section>

      {/* Why Take Quiz Section */}
      <section className="py-16 ">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900">Why take the quiz?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {whyTakeQuiz.map((item, index) => (
              <div key={index} className="bg-white rounded-lg shadow-sm p-6 flex flex-col items-center text-center">
                <item.icon className="h-12 w-12 text-[#005073] mb-4" />
                <p className="text-gray-900">{item.text}</p>
              </div>
            ))}
          </div>
        </div>

          {/* Analytics Section */}
      {/* <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-[#005073]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-[#005073]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-[#005073]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">25%</div>
              <div className="text-gray-600">Health Improvement</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-[#005073]" />
              </div>
              <div className="text-3xl font-bold text-gray-900">100+</div>
              <div className="text-gray-600">Premium Products</div>
            </div>
          </div>
        </div>
      </section> */}
      </section>

      {/* Products Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Featured Products</h2>
            <p className="text-xl text-gray-600">Premium supplements backed by science</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <div key={product.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{product.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-emerald-600">${product.price}</span>
                    <button className="bg-emerald-600 text-white px-4 py-2 rounded-md hover:bg-emerald-700 transition-colors">
                      Add to Cart
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

            {/* Doctor's Note Section */}
            <section className="bg-[#00657e] py-16 px-4 sm:px-6 lg:px-8 text-white">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between">
          {/* Left Column: Trending Image */}
          <div className="md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left mb-8 md:mb-0">
            <h3 className="text-xl font-serif mb-4 text-gray-200">Trending...</h3>
            <img
              src={patient}
              alt="Trending health news"
              className="w-full max-w-sm rounded-lg shadow-lg"
            />
          </div>

          {/* Right Column: Doctor's Note Content */}
          <div className="md:w-1/2 flex flex-col items-center md:items-end text-center md:text-right">
            <h2 className="text-2xl font-serif mb-4 text-gray-200">Doctor's Note</h2>
            <h1 className="text-4xl sm:text-5xl font-serif font-bold mb-6">
              Taking Aspirin Helps Prevent Cancer?
            </h1>
            <p className="text-lg text-gray-200 mb-8 max-w-lg">
              Taking low-dose aspirin may reduce the risk of colorectal cancer and researchers are studying whether it reduces the risk of other cancers.
            </p>
            <Link
              to="#" // Placeholder link
              className="bg-orange-500 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-orange-600 transition-colors"
            >
              Read more
            </Link>
          </div>
        </div>
      </section>

      {/* Analytics Section - New */}
      <section className="bg-blue-100 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 bg-white shadow-lg rounded-lg  relative z-10 flex flex-col md:flex-row justify-around items-center py-8">
            <div className="text-center mb-8 md:mb-0">
                <TrendingUp className="h-12 w-12 text-[#005073] mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">83</div>
                <p className="text-gray-600">Visits per month</p>
            </div>
            <div className="text-center mb-8 md:mb-0">
                <ShoppingCart className="h-12 w-12 text-[#005073] mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">56</div>
                <p className="text-gray-600">Purchases per month</p>
            </div>
            <div className="text-center">
                <Users className="h-12 w-12 text-[#005073] mx-auto mb-2" />
                <div className="text-3xl font-bold text-gray-900">10</div>
                <p className="text-gray-600">Registered principals</p>
            </div>
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
                <ArrowRight className="h-6 w-6 text-gray-400" />
            </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">What Our Customers Say</h2>
            <p className="text-xl text-gray-600">Real stories from real people</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-gray-50 rounded-lg p-6">
                <div className="flex items-center mb-4">
                  <img
                    src={testimonial.image}
                    alt={testimonial.name}
                    className="w-12 h-12 rounded-full mr-4"
                  />
                  <div>
                    <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                    <p className="text-gray-600 text-sm">{testimonial.role}</p>
                  </div>
                </div>
                <div className="flex mb-3">
                  {[...Array(testimonial.rating)].map((_, i) => (
                    <Star key={i} className="h-4 w-4 text-yellow-400 fill-current" />
                  ))}
                </div>
                <p className="text-gray-700">{testimonial.content}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Frequently Asked Questions</h2>
            <p className="text-xl text-gray-600">Everything you need to know</p>
          </div>
          
          <div className="space-y-6">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white rounded-lg p-6 shadow-md">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">{faq.question}</h3>
                <p className="text-gray-700">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Latest from Our Blog</h2>
            <p className="text-xl text-gray-600">Health insights and tips from our experts</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {blogs.map((blog, index) => (
              <article key={index} className="bg-gray-50 rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                <img
                  src={blog.image}
                  alt={blog.title}
                  className="w-full h-48 object-cover"
                />
                <div className="p-6">
                  <div className="text-sm text-gray-500 mb-2">{blog.date}</div>
                  <h3 className="text-xl font-semibold text-gray-900 mb-3">{blog.title}</h3>
                  <p className="text-gray-700 mb-4">{blog.excerpt}</p>
                  <button className="text-emerald-600 font-medium hover:text-emerald-700">
                    Read More →
                  </button>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 text-center md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HLS</h3>
              <p className="text-left pl-6 md: text-gray-400">
                Your trusted partner in personalized health and wellness.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2">
                <li><Link to="/about" className="text-gray-400 hover:text-white">About Us</Link></li>
                <li><Link to="/quiz" className="text-gray-400 hover:text-white">Take Quiz</Link></li>
                <li><Link to="/support" className="text-gray-400 hover:text-white">Support</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Support</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Help Center</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Contact Us</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Privacy Policy</a></li>
              </ul>
            </div>
            <div>
              <h4 className="text-lg font-semibold mb-4">Connect</h4>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Newsletter</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Social Media</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Community</a></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center">
            <p className="text-gray-400">
              © 2024 HLS Health & Wellness. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Homepage;
