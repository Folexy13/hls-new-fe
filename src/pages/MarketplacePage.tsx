
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import vitamins from '../images/vitamins.png';
import vitamins2 from '../images/vitamins2.png';
import vitamins3 from '../images/vitamins3.png';
import vitamins4 from '../images/vitamins4.png';

const MarketplacePage: React.FC = () => {
  const allProducts = [
    {
      id: '1',
      name: 'Vitamin D3 Complex',
      price: 29.99,
      image: vitamins,
      description: 'High-potency vitamin D3 for bone health and immune support',
      category: 'vitamin' as const,
      vendor: 'HLS'
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      price: 34.99,
      image: vitamins2,
      description: 'Pure omega-3 fatty acids for heart and brain health',
      category: 'supplement' as const,
      vendor: 'HLS'
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      price: 24.99,
      image: vitamins3,
      description: 'Highly absorbable magnesium for muscle and nerve function',
      category: 'mineral' as const,
      vendor: 'VendorCorp'
    },
    {
      id: '4',
      name: 'Whey Protein Isolate',
      price: 49.99,
      image: vitamins4,
      description: 'Premium protein for muscle building and recovery',
      category: 'protein' as const,
      vendor: 'VendorCorp'
    },
    {
      id: '5',
      name: 'Multivitamin Complete',
      price: 39.99,
      image: vitamins,
      description: 'Comprehensive daily multivitamin formula',
      category: 'vitamin' as const,
      vendor: 'HLS'
    },
    {
      id: '6',
      name: 'Probiotics Advanced',
      price: 44.99,
      image: vitamins2,
      description: 'Advanced probiotic blend for digestive health',
      category: 'supplement' as const,
      vendor: 'VendorCorp'
    }
  ];

  const vendorProducts = allProducts.filter(product => product.vendor === 'VendorCorp');
  const hlsProducts = allProducts.filter(product => product.vendor === 'HLS');

  const ProductGrid = ({ products }: { products: typeof allProducts }) => (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`} className="block">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <CardHeader className="p-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-6">
              <CardTitle className="text-lg mb-2">{product.name}</CardTitle>
              <p className="text-gray-600 text-sm mb-4">{product.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-emerald-600">${product.price}</span>
                <span className="text-xs bg-gray-100 px-2 py-1 rounded">{product.vendor}</span>
              </div>
              <button 
                className="w-full mt-4 bg-emerald-600 text-white py-2 rounded-md hover:bg-emerald-700 transition-colors"
                onClick={(e) => {
                  e.preventDefault();
                  // Add to cart functionality
                }}
              >
                Add to Cart
              </button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Marketplace</h1>
          <p className="text-xl text-gray-600">Discover premium health products from trusted vendors</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-8">
            <TabsTrigger value="all">All Products</TabsTrigger>
            <TabsTrigger value="vendor">My Vendor Products</TabsTrigger>
            <TabsTrigger value="hls">HLS Products</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">All Products</h2>
              <span className="text-gray-600">{allProducts.length} products</span>
            </div>
            <ProductGrid products={allProducts} />
          </TabsContent>
          
          <TabsContent value="vendor" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">Vendor Products</h2>
              <span className="text-gray-600">{vendorProducts.length} products</span>
            </div>
            <ProductGrid products={vendorProducts} />
          </TabsContent>
          
          <TabsContent value="hls" className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-semibold text-gray-900">HLS Products</h2>
              <span className="text-gray-600">{hlsProducts.length} products</span>
            </div>
            <ProductGrid products={hlsProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePage;
