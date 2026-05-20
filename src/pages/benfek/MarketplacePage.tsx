import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, ShoppingCart } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
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
          <div className="bg-white rounded-2xl border border-gray-200 p-6 text-center text-gray-500 flex items-center justify-center gap-2">
            <LoadingSpinner className="text-emerald-600" />
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
                <div className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <div className="relative">
                    <div className="w-full h-44 sm:h-48 flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 p-5 border-b border-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
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
                      className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-lg bg-orange-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
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
                      {addingId === product.id ? (
                        <span className="inline-flex items-center justify-center gap-2">
                          <LoadingSpinner />
                          Adding...
                        </span>
                      ) : (
                        <>
                          <ShoppingCart className="h-4 w-4" />
                          Add to Cart
                        </>
                      )}
                    </button>
                  </div>
                </div>
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
