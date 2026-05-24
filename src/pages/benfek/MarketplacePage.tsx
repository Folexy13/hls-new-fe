import React, { useMemo, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Search, ShoppingCart } from 'lucide-react';
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
  category: string;
  vendor: string;
  expiryDate?: string;
};

type PaginationMeta = {
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPrevPage: boolean;
};

const PAGE_SIZE = 20;

const MarketplacePage: React.FC = () => {
  const [rawProducts, setRawProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [paginationMeta, setPaginationMeta] = useState<PaginationMeta>({
    total: 0,
    page: 1,
    limit: PAGE_SIZE,
    totalPages: 1,
    hasNextPage: false,
    hasPrevPage: false,
  });

  const { addToCart } = useStore();
  const [addingId, setAddingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSupplements = async () => {
      try {
        setLoading(true);
        const response = await apiClient.get('/api/v2/supplements/all', {
          params: { page, limit: PAGE_SIZE },
        });
        const supplements = response.data?.data?.supplements || [];
        const meta = response.data?.data?.meta;
        const mapped: Product[] = supplements.map((s: any) => ({
          id: String(s.id),
          name: s.name,
          price: Number(s.price),
          image: s.image || s.imageUrl || '/placeholder.svg',
          description: s.description,
          category: s.category || 'supplement',
          vendor: s.manufacturer || 'HLS',
        }));
        setRawProducts(mapped);
        setPaginationMeta({
          total: Number(meta?.total) || mapped.length,
          page: Number(meta?.page) || page,
          limit: Number(meta?.limit) || PAGE_SIZE,
          totalPages: Math.max(1, Number(meta?.totalPages) || 1),
          hasNextPage: Boolean(meta?.hasNextPage),
          hasPrevPage: Boolean(meta?.hasPrevPage),
        });
      } catch (error) {
        console.error(error);
        toast.error('Failed to load products.');
      } finally {
        setLoading(false);
      }
    };

    fetchSupplements();
  }, [page]);

  const allProducts = useMemo(() => rawProducts, [rawProducts]);

  const vendorProducts = allProducts;
  const hlsProducts = allProducts;

  const filterProducts = (products: Product[]) => {
    return products.filter((product) =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const goToPage = (nextPage: number) => {
    const boundedPage = Math.min(Math.max(nextPage, 1), paginationMeta.totalPages || 1);
    setPage(boundedPage);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const PaginationControls = () => {
    if (loading || paginationMeta.totalPages <= 1) return null;

    const start = (paginationMeta.page - 1) * paginationMeta.limit + 1;
    const end = Math.min(paginationMeta.page * paginationMeta.limit, paginationMeta.total);

    return (
      <div className="mt-6 flex flex-col items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white px-4 py-3 sm:flex-row">
        <p className="text-sm text-slate-600">
          Showing {start}-{end} of {paginationMeta.total} products
        </p>
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!paginationMeta.hasPrevPage}
            onClick={() => goToPage(paginationMeta.page - 1)}
          >
            <ChevronLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="min-w-24 text-center text-sm font-medium text-slate-700">
            Page {paginationMeta.page} of {paginationMeta.totalPages}
          </span>
          <button
            type="button"
            className="inline-flex h-9 items-center gap-1 rounded-lg border border-slate-200 px-3 text-sm font-medium text-slate-700 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
            disabled={!paginationMeta.hasNextPage}
            onClick={() => goToPage(paginationMeta.page + 1)}
          >
            Next
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
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
          <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-5">
            {filteredProducts.map((product) => (
              <Link key={product.id} to={`/product/${product.id}`} className="block">
                <div className="group h-full cursor-pointer overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm transition-all hover:-translate-y-1 hover:border-emerald-200 hover:shadow-xl focus:outline-none focus:ring-2 focus:ring-emerald-500">
                  <div className="relative">
                    <div className="w-full h-32 sm:h-48 flex items-center justify-center bg-gradient-to-br from-white to-emerald-50 p-3 sm:p-5 border-b border-slate-100">
                      <img
                        src={product.image}
                        alt={product.name}
                        className="max-h-full max-w-full object-contain transition-transform duration-300 group-hover:scale-105"
                      />
                    </div>
                    <span className="absolute left-2 top-2 sm:left-3 sm:top-3 rounded-full bg-white/95 px-2 sm:px-3 py-1 text-[10px] sm:text-[11px] font-semibold uppercase tracking-wide text-emerald-700 shadow-sm">
                      {product.category}
                    </span>
                  </div>

                  <div className="p-3 sm:p-5 flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-2 sm:gap-3">
                      <div className="min-w-0 [&>span]:hidden">
                        <h3 className="text-xs sm:text-lg font-semibold text-gray-950 leading-snug line-clamp-2">{product.name}</h3>
                        <span className="text-sm sm:text-xl font-semibold text-emerald-600">₦{product.price.toLocaleString()}</span>
                      </div>
                      <div className="shrink-0 text-right">
                        <span className="block text-sm sm:text-xl font-semibold text-emerald-600">₦{product.price.toLocaleString()}</span>
                      </div>
                    </div>

                    <button
                      type="button"
                      className="mt-3 sm:mt-4 inline-flex w-full items-center justify-center gap-1.5 sm:gap-2 rounded-lg bg-orange-500 px-2 sm:px-4 py-2 sm:py-2.5 text-xs sm:text-sm font-semibold text-white transition-colors hover:bg-orange-600 disabled:opacity-60"
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
                {filterProducts(allProducts).length} of {paginationMeta.total} products
              </span>
            </div>
            <ProductGrid products={allProducts} />
            <PaginationControls />
          </TabsContent>

          <TabsContent value="vendor" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                Vendor Products
              </h2>
              <span className="text-gray-600 text-sm">
                {filterProducts(vendorProducts).length} of {paginationMeta.total} products
              </span>
            </div>
            <ProductGrid products={vendorProducts} />
            <PaginationControls />
          </TabsContent>

          <TabsContent value="hls" className="space-y-4 sm:space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
                HLS Products
              </h2>
              <span className="text-gray-600 text-sm">
                {filterProducts(hlsProducts).length} of {paginationMeta.total} products
              </span>
            </div>
            <ProductGrid products={hlsProducts} />
            <PaginationControls />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default MarketplacePage;
