
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowDown, Star, CheckCircle, TrendingUp, Users, Award } from 'lucide-react';

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
      image: '/placeholder.svg',
      description: 'High-potency vitamin D3 for bone health and immune support',
      category: 'vitamin' as const
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      price: 34.99,
      image: '/placeholder.svg',
      description: 'Pure omega-3 fatty acids for heart and brain health',
      category: 'supplement' as const
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      price: 24.99,
      image: '/placeholder.svg',
      description: 'Highly absorbable magnesium for muscle and nerve function',
      category: 'mineral' as const
    },
    {
      id: '4',
      name: 'Whey Protein Isolate',
      price: 49.99,
      image: '/placeholder.svg',
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

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-50 to-blue-50 pt-8 pb-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Your Personalized
              <span className="text-emerald-600 block">Health Journey</span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Discover the supplements your body actually needs with our science-based assessment. 
              Get personalized recommendations tailored to your unique lifestyle and health goals.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/quiz"
                className="bg-emerald-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors"
              >
                Take Free Quiz
              </Link>
              <Link
                to="/about"
                className="border-2 border-emerald-600 text-emerald-600 px-8 py-4 rounded-lg text-lg font-semibold hover:bg-emerald-50 transition-colors"
              >
                Learn More
              </Link>
            </div>
          </div>
          
          <div className="mt-16 flex justify-center">
            <ArrowDown className="h-6 w-6 text-gray-400 animate-bounce" />
          </div>
        </div>
      </section>

      {/* Analytics Section */}
      <section className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Users className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">50K+</div>
              <div className="text-gray-600">Happy Customers</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <Award className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">98%</div>
              <div className="text-gray-600">Satisfaction Rate</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <TrendingUp className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">25%</div>
              <div className="text-gray-600">Health Improvement</div>
            </div>
            <div className="text-center">
              <div className="flex justify-center mb-4">
                <CheckCircle className="h-12 w-12 text-emerald-600" />
              </div>
              <div className="text-3xl font-bold text-gray-900">100+</div>
              <div className="text-gray-600">Premium Products</div>
            </div>
          </div>
        </div>
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="text-2xl font-bold mb-4">HLS</h3>
              <p className="text-gray-400">
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
