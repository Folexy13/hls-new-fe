import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useStore } from '../../store/useStore';
import { toast } from 'react-toastify';
import { apiClient } from '@/config/axios';

type Product = {
  id: string;
  name: string;
  price: number;
  image: string;
  description: string;
  category: 'vitamin' | 'supplement' | 'mineral' | 'protein';
  vendor: string;
  expiryDate?: string;
};

const MarketplacePage: React.FC = () => {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const { addToCart } = useStore();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/v2/supplements/all');
        console.log(response)
        const supplements = response.data?.data?.supplements || [];
        const mapped: Product[] = supplements.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          price: Number(s.price),
          image: s.image || s.imageUrl || '/placeholder.svg',
          description: s.description,
          category: 'supplement',
          vendor: 'HLS',
        }));
        setRawProducts(mapped);
      } catch (error) {
        console.error(error);
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplements();
  }, []);

  // Remove duplicate products by name
  const allProducts = useMemo(() => {
    const seen = new Set<string>();
    return rawProducts.filter((product) => {
      const key = product.name.toLowerCase().trim();
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  }, [rawProducts]);

  const vendorProducts = allProducts;
  const hlsProducts = allProducts;

  const filterProducts = (products: Product[]) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString();
  };

  const ProductGrid = ({ products }: { products: Product[] }) => {
    const filteredProducts = filterProducts(products);

    return (
      <>
        <div className="mb-4 sm:mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 h-11 rounded-xl"
            />
          </div>
        </div>

        {loading ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500">
            Loading products...
          </div>
        ) : filteredProducts.length === 0 ? (
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500">
            No products found.
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block">
                <Card className="overflow-hidden hover:shadow-lg transition-shadow h-full rounded-2xl border border-gray-200">
                  <CardHeader className="p-0">
                    <div className="w-full h-44 bg-white flex items-center justify-center p-4">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain"
                      />
                    </div>
                  </CardHeader>

                  <CardContent className="p-4">
                    <CardTitle className="text-base font-semibold mb-2 line-clamp-2 text-gray-900">
                      {product.name}
                    </CardTitle>

                    <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>

                    <div className="space-y-1 mb-4">
                      <p className="text-lg font-bold text-emerald-600">
                        ₦{product.price.toLocaleString()}
                      </p>
                      {product.expiryDate && (
                        <p className="text-sm text-gray-500">
                          Expiry: {formatDate(product.expiryDate)}
                        </p>
                      )}
                    </div>

                    <button
                     className="w-full text-xs sm:text-sm bg-black text-white py-1 sm:py-2 rounded-full transition-all duration-300 shadow-[0_4px_14px_rgba(16,185,129,0.25)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.4)] active:scale-95 disabled:opacity-50"
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
        )}
      </>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50 py-6 sm:py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-900 mb-2">
            Marketplace
          </h1>
          <p className="text-sm sm:text-base text-gray-700">
            Discover premium health products from trusted vendors
          </p>
        </div>

        <Tabs defaultValue="all" className="w-full">
          <TabsList className="grid w-full grid-cols-3 mb-5 sm:mb-8 h-auto rounded-xl">
            <TabsTrigger value="all" className="text-xs sm:text-sm px-2 py-2.5">
              <span className="hidden sm:inline">All Products</span>
              <span className="sm:hidden">All</span>
            </TabsTrigger>

            <TabsTrigger value="vendor" className="text-xs sm:text-sm px-2 py-2.5">
              <span className="hidden sm:inline">Vendor Products</span>
              <span className="sm:hidden">Vendor</span>
            </TabsTrigger>

            <TabsTrigger value="hls" className="text-xs sm:text-sm px-2 py-2.5">
              <span className="hidden sm:inline">HLS Products</span>
              <span className="sm:hidden">HLS</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                All Products
              </h2>
              <span className="text-gray-600 text-sm">
                {filterProducts(allProducts).length} products
              </span>
            </div>
            <ProductGrid products={allProducts} />
          </TabsContent>

          <TabsContent value="vendor" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Vendor Products
              </h2>
              <span className="text-gray-600 text-sm">
                {filterProducts(vendorProducts).length} products
              </span>
            </div>
            <ProductGrid products={vendorProducts} />
          </TabsContent>

          <TabsContent value="hls" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                HLS Products
              </h2>
              <span className="text-gray-600 text-sm">
                {filterProducts(hlsProducts).length} products
              </span>
            </div>
            <ProductGrid products={hlsProducts} />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePage;
