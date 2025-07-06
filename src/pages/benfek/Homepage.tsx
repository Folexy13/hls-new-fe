
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { Activity, Heart, Shield, Star } from 'lucide-react';
import bannerdoctor from '../../images/bannerdoctor.png';
import vitamins from '../../images/vitamins.png';
import vitamins2 from '../../images/vitamins2.png';
import vitamins3 from '../../images/vitamins3.png';
import vitamins4 from '../../images/vitamins4.png';

const Homepage = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-emerald-50 to-white">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-emerald-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-20"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight">
                Your Health, Our Priority
              </h1>
              <p className="text-xl lg:text-2xl text-emerald-100">
                Personalized nutrition and wellness solutions powered by AI and expert care.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link to="/quiz">
                  <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-3">
                    Take Health Quiz
                  </Button>
                </Link>
                <Link to="/about">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white hover:text-emerald-600 text-lg px-8 py-3">
                    Learn More
                  </Button>
                </Link>
              </div>
            </div>
            <div className="relative">
              <img 
                src={bannerdoctor} 
                alt="Healthcare Professional" 
                className="w-full h-auto rounded-lg shadow-2xl"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Why Choose HLS?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We combine cutting-edge technology with personalized care to deliver the best health solutions for you.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Activity className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-2">Personalized Plans</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  AI-powered recommendations tailored to your unique health profile and goals.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Heart className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-2">Expert Care</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Access to qualified healthcare professionals and nutritionists.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Shield className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-2">Quality Assured</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Premium supplements and products tested for purity and effectiveness.
                </CardDescription>
              </CardContent>
            </Card>

            <Card className="text-center p-6 hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="mx-auto w-12 h-12 bg-emerald-100 rounded-full flex items-center justify-center mb-4">
                  <Star className="h-6 w-6 text-emerald-600" />
                </div>
                <CardTitle className="text-xl mb-2">Proven Results</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-600">
                  Thousands of satisfied customers achieving their health goals.
                </CardDescription>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Products Showcase */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Premium Health Products
            </h2>
            <p className="text-xl text-gray-600">
              Discover our range of carefully selected supplements and wellness products.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <img src={vitamins} alt="Vitamins" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg mb-2">Essential Vitamins</h3>
              <p className="text-gray-600 text-sm">Daily essential vitamins for optimal health</p>
            </div>
            <div className="text-center">
              <img src={vitamins2} alt="Minerals" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg mb-2">Minerals</h3>
              <p className="text-gray-600 text-sm">Important minerals for body functions</p>
            </div>
            <div className="text-center">
              <img src={vitamins3} alt="Protein" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg mb-2">Protein Supplements</h3>
              <p className="text-gray-600 text-sm">High-quality protein for muscle health</p>
            </div>
            <div className="text-center">
              <img src={vitamins4} alt="Specialized" className="w-full h-48 object-cover rounded-lg mb-4" />
              <h3 className="font-semibold text-lg mb-2">Specialized</h3>
              <p className="text-gray-600 text-sm">Targeted solutions for specific needs</p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link to="/marketplace">
              <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3">
                Explore All Products
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-emerald-600 text-white">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Ready to Transform Your Health?
          </h2>
          <p className="text-xl mb-8 text-emerald-100">
            Take our comprehensive health quiz and get personalized recommendations today.
          </p>
          <Link to="/quiz">
            <Button size="lg" className="bg-white text-emerald-600 hover:bg-gray-100 text-lg px-8 py-4">
              Start Your Health Journey
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Homepage;
