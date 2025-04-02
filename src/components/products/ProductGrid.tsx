
import { useState, useEffect } from "react";
import { productApi } from "@/services/api";
import { Product } from "@/types";
import ProductCard from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";

interface ProductGridProps {
  categoryId?: number;
  limit?: number;
  title?: string;
  showFilters?: boolean;
  sortBy?: string;
}

const ProductGrid = ({ categoryId, limit = 12, title, showFilters = false, sortBy = "popularity" }: ProductGridProps) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedSortBy, setSortBy] = useState(sortBy);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
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
        if (categoryId) {
          params.category = categoryId.toString();
          fetchedProducts = await productApi.getProducts(params);
        } else {
          fetchedProducts = await productApi.getProducts(params);
        }
        
        console.log("Fetched products:", fetchedProducts);
        setProducts(fetchedProducts);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load products");
        console.error("Error fetching products:", err);
      } finally {
        setLoading(false);
      }
    };

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

      {/* Error State */}
      {error && !loading && (
        <div className="text-center py-10">
          <div className="text-red-500 mb-2">Failed to load products</div>
          <p className="text-gray-600">{error}</p>
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
