import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import vitamins from '../../images/vitamins.png';
import vitamins2 from '../../images/vitamins2.png';
import vitamins3 from '../../images/vitamins3.png';
import vitamins4 from '../../images/vitamins4.png';
import { useStore } from '../../store/useStore';
import { toast } from 'react-toastify';

const MarketplacePage: React.FC = () => {
  const allProducts = [
    {
      id: '1',
      name: 'Vitamin D3 Complex',
      price: 14999,
      image: vitamins,
      description: 'High-potency vitamin D3 for bone health and immune support',
      category: 'vitamin' as const,
      vendor: 'HLS'
    },
    {
      id: '2',
      name: 'Omega-3 Fish Oil',
      price: 17499,
      image: vitamins2,
      description: 'Pure omega-3 fatty acids for heart and brain health',
      category: 'supplement' as const,
      vendor: 'HLS'
    },
    {
      id: '3',
      name: 'Magnesium Glycinate',
      price: 12499,
      image: vitamins3,
      description: 'Highly absorbable magnesium for muscle and nerve function',
      category: 'mineral' as const,
      vendor: 'VendorCorp'
    },
    {
      id: '4',
      name: 'Whey Protein Isolate',
      price: 24999,
      image: vitamins4,
      description: 'Premium protein for muscle building and recovery',
      category: 'protein' as const,
      vendor: 'VendorCorp'
    },
    {
      id: '5',
      name: 'Multivitamin Complete',
      price: 19999,
      image: vitamins,
      description: 'Comprehensive daily multivitamin formula',
      category: 'vitamin' as const,
      vendor: 'HLS'
    },
    {
      id: '6',
      name: 'Probiotics Advanced',
      price: 22499,
      image: vitamins2,
      description: 'Advanced probiotic blend for digestive health',
      category: 'supplement' as const,
      vendor: 'VendorCorp'
    }
  ];

  const vendorProducts = allProducts.filter(product => product.vendor === 'VendorCorp');
  const hlsProducts = allProducts.filter(product => product.vendor === 'HLS');

  const { addToCart } = useStore();
  const [addingId, setAddingId] = useState<string | null>(null);

  const ProductGrid = ({ products }: { products: typeof allProducts }) => (
    <div className="grid grid-cols-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-2 sm:gap-4 lg:gap-6">
      {products.map((product) => (
        <Link key={product.id} to={`/product/${product.id}`} className="block">
          <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full">
            <CardHeader className="p-0">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-20 sm:h-32 lg:h-48 object-cover"
              />
            </CardHeader>
            <CardContent className="p-2 sm:p-4 lg:p-6">
              <CardTitle className="text-xs sm:text-sm lg:text-lg mb-1 sm:mb-2 line-clamp-2">{product.name}</CardTitle>
              <p className="text-gray-600 text-xs mb-2 sm:mb-4 hidden sm:block">{product.description}</p>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm sm:text-lg lg:text-2xl font-bold text-emerald-600">₦{product.price.toLocaleString()}</span>
                <span className="text-xs bg-gray-100 px-1 sm:px-2 py-1 rounded hidden sm:block">{product.vendor}</span>
              </div>
              <button 
                className="w-full text-xs sm:text-sm bg-emerald-600 text-white py-1 sm:py-2 rounded-md hover:bg-emerald-700 transition-colors disabled:opacity-50"
                disabled={addingId === product.id}
                onClick={async (e) => {
                  e.preventDefault();
                  setAddingId(product.id);
                  try {
                    await addToCart(product);
                    toast.success('Added to cart!');
                  } catch (err) {
                    toast.error('Failed to add to cart');
                  } finally {
                    setAddingId(null);
                  }
                }}
              >
                {addingId === product.id ? 'Adding...' : 'Add to Cart'}
              </button>
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 py-4 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2 sm:mb-4">Marketplace</h1>
          <p className="text-sm sm:text-lg lg:text-xl text-gray-600">Discover premium health products from trusted vendors</p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-4 sm:mb-8 h-auto">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">All Products</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>
            <TabsTrigger value="vendor" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">My Vendor</span>
              <span className="sm:hidden">Vendor</span>
            </TabsTrigger>
            <TabsTrigger value="hls" className="text-xs sm:text-sm px-2 py-2">
              <span className="hidden sm:inline">HLS Products</span>
              <span className="sm:hidden">HLS</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">All Products</h2>
              <span className="text-gray-600 text-sm sm:text-base">{allProducts.length} products</span>
            </div>
            <ProductGrid products={allProducts} />
          </TabsContent>
          
          <TabsContent value="vendor" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">Vendor Products</h2>
              <span className="text-gray-600 text-sm sm:text-base">{vendorProducts.length} products</span>
            </div>
            <ProductGrid products={vendorProducts} />
          </TabsContent>
          
          <TabsContent value="hls" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">HLS Products</h2>
              <span className="text-gray-600 text-sm sm:text-base">{hlsProducts.length} products</span>
            </div>
            <ProductGrid products={hlsProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePage;
