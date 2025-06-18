
import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Truck, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import vitamins from '../images/vitamins.png';
import vitamins2 from '../images/vitamins2.png';
import vitamins3 from '../images/vitamins3.png';
import vitamins4 from '../images/vitamins4.png';

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const products = [
    {
      id: '1',
      name: 'Vitamin D3 Complex',
      price: 29.99,
      image: vitamins,
      description: 'High-potency vitamin D3 for bone health and immune support',
      category: 'vitamin' as const,
      vendor: 'HLS',
      rating: 4.8,
      reviews: 156,
      inStock: true,
      features: [
        '2000 IU of Vitamin D3 per serving',
        'Enhanced with Vitamin K2',
        'Third-party tested for purity',
        'Non-GMO and gluten-free'
      ],
      benefits: [
        'Supports bone health and calcium absorption',
        'Boosts immune system function',
        'Promotes muscle strength',
        'May improve mood and energy levels'
      ]
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      price: 34.99,
      image: vitamins2,
      description: 'Pure omega-3 fatty acids for heart and brain health',
      category: 'supplement' as const,
      vendor: 'HLS',
      rating: 4.9,
      reviews: 203,
      inStock: true,
      features: [
        '1200mg EPA/DHA per serving',
        'Molecularly distilled for purity',
        'Sustainably sourced fish oil',
        'Enteric coated to reduce fishy aftertaste'
      ],
      benefits: [
        'Supports cardiovascular health',
        'Promotes brain function and memory',
        'Reduces inflammation',
        'Supports eye health'
      ]
    }
  ];

  const product = products.find(p => p.id === id) || products[0];

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-6"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <img
                  key={i}
                  src={product.image}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-20 object-cover rounded border-2 border-transparent hover:border-emerald-500 cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-5 w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  {product.vendor}
                </span>
              </div>
              <p className="text-gray-700 text-lg">{product.description}</p>
            </div>

            <div className="border-t border-b py-6">
              <div className="flex items-center justify-between">
                <span className="text-4xl font-bold text-emerald-600">${product.price}</span>
                <span className={`px-3 py-1 rounded-full text-sm ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="space-y-4">
              <button 
                className="w-full bg-emerald-600 text-white py-4 rounded-lg text-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                disabled={!product.inStock}
              >
                Add to Cart
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-4 rounded-lg text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Heart className="h-5 w-5 mr-2" />
                Add to Wishlist
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-6">
              <div className="flex flex-col items-center">
                <Shield className="h-8 w-8 text-emerald-600 mb-2" />
                <span className="text-sm text-gray-600">Quality Assured</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-8 w-8 text-emerald-600 mb-2" />
                <span className="text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="h-8 w-8 text-emerald-600 mb-2" />
                <span className="text-sm text-gray-600">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle>Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Health Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700">{benefit}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;
