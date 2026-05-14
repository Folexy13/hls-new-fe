import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Star, Shield, Truck, Heart } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useStore } from '../../store/useStore';
import { toast } from 'react-toastify';
import { apiClient } from '@/config/axios';
import { LoadingSpinner } from '@/components/ui/loading-spinner';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'vitamin' | 'mineral' | 'protein' | 'supplement';
  vendor: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  features: string[];
  benefits: string[];
};

const ProductPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useStore();
  const [adding, setAdding] = useState(false);
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      try {
        setLoading(true);
        const response = await apiClient.get(`/api/v2/supplements/${id}`);
        const data = response.data?.data?.supplement;
        if (!data) {
          setError('Product not found.');
          return;
        }
        const mapped: Product = {
          id: String(data.id),
          name: data.name,
          price: data.price,
          image: data.image || data.imageUrl || '/placeholder.svg',
          description: data.description,
          category: 'supplement',
          vendor: 'HLS',
          rating: 4.8,
          reviews: 120,
          inStock: data.stock > 0,
          features: [
            'Quality tested for purity',
            'Carefully sourced ingredients',
            'Stored under optimal conditions',
            'Backed by HLS quality standards',
          ],
          benefits: [
            'Supports daily wellness goals',
            'Formulated for consistent results',
            'Trusted by HLS customers',
            'Easy to integrate into routine',
          ],
        };
        setProduct(mapped);
      } catch (err) {
        console.error(err);
        setError('Failed to load product.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 text-center text-gray-600 flex items-center justify-center gap-2">
        <LoadingSpinner className="text-emerald-600" />
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 px-4 text-center text-gray-600">
        {error || 'Product not found.'}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link 
          to="/marketplace" 
          className="inline-flex items-center text-emerald-600 hover:text-emerald-700 mb-4 sm:mb-6 text-sm sm:text-base"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Marketplace
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="space-y-4">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-64 sm:h-80 lg:h-96 object-cover rounded-lg shadow-lg"
            />
            <div className="grid grid-cols-4 gap-2">
              {[...Array(4)].map((_, i) => (
                <img
                  key={i}
                  src={product.image}
                  alt={`${product.name} view ${i + 1}`}
                  className="w-full h-16 sm:h-20 object-cover rounded border-2 border-transparent hover:border-emerald-500 cursor-pointer"
                />
              ))}
            </div>
          </div>

          {/* Product Details */}
          <div className="space-y-4 sm:space-y-6">
            <div>
              <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>
              <div className="flex items-center space-x-4 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`h-4 w-4 sm:h-5 sm:w-5 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400 fill-current'
                          : 'text-gray-300'
                      }`}
                    />
                  ))}
                  <span className="ml-2 text-gray-600 text-sm sm:text-base">
                    {product.rating} ({product.reviews} reviews)
                  </span>
                </div>
                <span className="text-xs sm:text-sm bg-emerald-100 text-emerald-800 px-2 py-1 rounded">
                  {product.vendor}
                </span>
              </div>
              <p className="text-gray-700 text-sm sm:text-base lg:text-lg">{product.description}</p>
            </div>

            <div className="border-t border-b py-4 sm:py-6">
              <div className="flex items-center justify-between">
                <span className="text-2xl sm:text-3xl lg:text-4xl font-bold text-emerald-600">₦{product.price.toLocaleString()}</span>
                <span className={`px-3 py-1 rounded-full text-xs sm:text-sm ${
                  product.inStock 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-red-100 text-red-800'
                }`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
            </div>

            <div className="space-y-3 sm:space-y-4">
              <button 
                className="w-full bg-emerald-600 text-white py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold hover:bg-emerald-700 transition-colors disabled:opacity-50"
                disabled={!product.inStock || adding}
                onClick={async () => {
                  setAdding(true);
                  try {
                    await addToCart(product);
                    toast.success('Added to cart!');
                  } catch (err) {
                    toast.error('Failed to add to cart');
                  } finally {
                    setAdding(false);
                  }
                }}
              >
                {adding ? (
                  <span className="inline-flex items-center justify-center gap-2">
                    <LoadingSpinner />
                    Adding...
                  </span>
                ) : 'Add to Cart'}
              </button>
              <button className="w-full border border-gray-300 text-gray-700 py-3 sm:py-4 rounded-lg text-sm sm:text-base lg:text-lg font-semibold hover:bg-gray-50 transition-colors flex items-center justify-center">
                <Heart className="h-4 w-4 sm:h-5 sm:w-5 mr-2" />
                Add to Wishlist
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 text-center py-4 sm:py-6">
              <div className="flex flex-col items-center">
                <Shield className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mb-2" />
                <span className="text-xs sm:text-sm text-gray-600">Quality Assured</span>
              </div>
              <div className="flex flex-col items-center">
                <Truck className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mb-2" />
                <span className="text-xs sm:text-sm text-gray-600">Free Shipping</span>
              </div>
              <div className="flex flex-col items-center">
                <Star className="h-6 w-6 sm:h-8 sm:w-8 text-emerald-600 mb-2" />
                <span className="text-xs sm:text-sm text-gray-600">Top Rated</span>
              </div>
            </div>
          </div>
        </div>

        {/* Product Information Tabs */}
        <div className="mt-8 sm:mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl">Key Features</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 sm:space-y-3">
                {product.features.map((feature, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">{feature}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base sm:text-lg lg:text-xl">Health Benefits</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 sm:space-y-3">
                {product.benefits.map((benefit, index) => (
                  <li key={index} className="flex items-start">
                    <span className="h-2 w-2 bg-emerald-500 rounded-full mt-2 mr-3 flex-shrink-0"></span>
                    <span className="text-gray-700 text-sm sm:text-base">{benefit}</span>
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
