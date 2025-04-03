
import { useState, useEffect } from "react";
import { productApi } from "@/services/api";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { RefreshCw } from "lucide-react"; // Using lucide-react icon
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductGridProps {
  categoryId?: number;
  limit?: number;
  title?: string;
  showFilters?: boolean;
  sortBy?: string;
}

// Mock data for when the API fails
const mockProducts: Product[] = [
  {
    id: 1,
    name: "Sample Product 1",
    slug: "sample-product-1",
    permalink: "",
    date_created: new Date().toISOString(),
    price: "24.99",
    regular_price: "29.99",
    sale_price: "24.99",
    description: "This is a sample product description.",
    short_description: "Sample product",
    categories: [{ id: 1, name: "Sample", slug: "sample", parent: 0, description: "", count: 5, image: null }],
    images: [{ id: 1, src: "https://via.placeholder.com/300x300", alt: "Sample Product" }],
    attributes: [],
    variations: [],
    stock_status: "instock",
    average_rating: "4.5"
  },
  {
    id: 2,
    name: "Sample Product 2",
    slug: "sample-product-2",
    permalink: "",
    date_created: new Date().toISOString(),
    price: "19.99",
    regular_price: "19.99",
    sale_price: "",
    description: "This is another sample product description.",
    short_description: "Another sample",
    categories: [{ id: 1, name: "Sample", slug: "sample", parent: 0, description: "", count: 5, image: null }],
    images: [{ id: 2, src: "https://via.placeholder.com/300x300", alt: "Sample Product" }],
    attributes: [],
    variations: [],
    stock_status: "instock",
    average_rating: "4.0"
  },
];

// Generate multiple mock products based on the limit
const generateMockProducts = (count: number): Product[] => {
  return Array.from({ length: count }).map((_, index) => ({
    ...mockProducts[index % mockProducts.length],
    id: index + 1,
    name: `Sample Product ${index + 1}`,
    slug: `sample-product-${index + 1}`
  }));
};

const ProductGrid = ({ categoryId, limit = 12, title, showFilters = false, sortBy = "popularity" }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSortBy, setSortBy] = useState(sortBy);
  const [useMockData, setUseMockData] = useState(false);
  const [apiErrorDetails, setApiErrorDetails] = useState<string | null>(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError(null);
    setApiErrorDetails(null);
    try {
      let params: Record<string, string> = {
        per_page: limit.toString()
      };
      
      if (selectedSortBy === "price_low") {
        params.orderby = "price";
        params.order = "asc";
      } else if (selectedSortBy === "price_high") {
        params.orderby = "price";
        params.order = "desc";
      } else if (selectedSortBy === "date") {
        params.orderby = "date";
      } else {
        params.orderby = "popularity";
      }
      
      console.log("Fetching products with params:", params);
      
      let fetchedProducts;
      if (useMockData) {
        // Use mock data when API fails
        console.log("Using mock data");
        fetchedProducts = generateMockProducts(limit);
        toast.info("Using demo data - API connection failed");
      } else {
        // Try to fetch real data
        try {
          const queryString = params ? new URLSearchParams(params).toString() : '';
          const apiUrl = `https://ohmyparty.in/autoparts/wp-json/wc/v3/products?${queryString}`;
          console.log("Testing direct API call to:", apiUrl);
          
          // Make a test call directly to check for CORS issues
          const testResponse = await fetch(apiUrl, {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': 'Basic ' + btoa('ck_5190fcd4acc882402c34583eaafc187d981ddf78:cs_17d7c67acc2e8b0675b54a375065a6b7d7bbbd21')
            },
            mode: 'cors',
          });
          
          console.log("Direct API call result:", testResponse.status, testResponse.statusText);
          
          // Now try with our API service
          if (categoryId) {
            params.category = categoryId.toString();
            fetchedProducts = await productApi.getProducts(params);
          } else {
            fetchedProducts = await productApi.getProducts(params);
          }
          
          console.log("Products fetched successfully:", fetchedProducts);
        } catch (apiError) {
          console.error("API fetch failed, details:", apiError);
          setApiErrorDetails(apiError instanceof Error ? apiError.message : JSON.stringify(apiError));
          setUseMockData(true);
          fetchedProducts = generateMockProducts(limit);
          toast.info("Using demo data - API connection failed");
        }
      }
      
      console.log("Products to display:", fetchedProducts);
      setProducts(fetchedProducts);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Failed to load products";
      setError(errorMessage);
      console.error("Error fetching products:", err);
    } finally {
      setLoading(false);
    }
  };

  // Switch to real API data
  const switchToRealData = () => {
    setUseMockData(false);
    fetchProducts();
  };

  useEffect(() => {
    fetchProducts();
  }, [categoryId, limit, selectedSortBy]);

  return (
    <div>
      {/* Header with title and filters */}
      {(title || showFilters) && (
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6">
          {title && <h2 className="text-2xl font-bold mb-4 sm:mb-0">{title}</h2>}
          
          {showFilters && (
            <div className="flex items-center space-x-4">
              <label htmlFor="sort" className="text-sm text-gray-600">
                Sort by:
              </label>
              <select
                id="sort"
                value={selectedSortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="py-1 px-2 border rounded text-sm focus:outline-none focus:ring-1 focus:ring-brand-navy"
              >
                <option value="popularity">Popularity</option>
                <option value="date">Newest</option>
                <option value="price_low">Price: Low to High</option>
                <option value="price_high">Price: High to Low</option>
              </select>
            </div>
          )}
        </div>
      )}
      
      {/* Loading State */}
      {loading && (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {[...Array(limit)].map((_, index) => (
            <div key={index} className="bg-white rounded-lg overflow-hidden shadow">
              <Skeleton className="aspect-square bg-gray-200" />
              <div className="p-4">
                <Skeleton className="h-4 bg-gray-200 rounded mb-2" />
                <Skeleton className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <Skeleton className="h-6 bg-gray-200 rounded w-1/4 mt-2" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Error State and API Debug Information */}
      {error && !loading && !useMockData && (
        <div className="text-center py-10">
          <Alert variant="destructive" className="mb-4">
            <AlertDescription>
              {error}
            </AlertDescription>
          </Alert>
          
          {apiErrorDetails && (
            <div className="bg-gray-100 border rounded p-3 mb-4 text-sm overflow-auto max-h-40 text-left">
              <h4 className="font-medium mb-1">API Error Details:</h4>
              <pre className="whitespace-pre-wrap">{apiErrorDetails}</pre>
            </div>
          )}
          
          <div className="flex gap-4 justify-center">
            <Button 
              onClick={fetchProducts}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Retry
            </Button>
            <Button 
              onClick={() => {
                setUseMockData(true);
                fetchProducts();
              }}
              variant="outline"
            >
              Use Demo Data
            </Button>
          </div>
        </div>
      )}
      
      {/* Demo mode indicator */}
      {useMockData && !loading && (
        <div className="mb-4 bg-yellow-50 border border-yellow-200 rounded p-3 text-sm flex items-center justify-between">
          <span className="text-yellow-800">Using demo data. Real API connection failed.</span>
          <Button 
            onClick={switchToRealData} 
            variant="outline" 
            size="sm"
            className="text-xs"
          >
            Try Real API
          </Button>
        </div>
      )}
      
      {/* Products Grid */}
      {!loading && !error && (
        <>
          {products.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-gray-600">No products found.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}
        </>
      )}
    </div>
  );
};

export default ProductGrid;
