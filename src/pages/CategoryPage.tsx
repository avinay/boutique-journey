
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "@/services/api";
import { Category } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const CategoryPage = () => {
  const { id } = useParams<{ id: string }>();
  const [category, setCategory] = useState<Category | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchCategory = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        // Get all categories and find the one matching the ID
        const categories = await productApi.getCategories();
        const found = categories.find(cat => cat.id === parseInt(id));
        
        if (found) {
          setCategory(found);
        } else {
          setError("Category not found");
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load category");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategory();
  }, [id]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <div className="animate-pulse">
              <div className="h-12 bg-gray-200 rounded-md mb-8 w-1/3" />
              <div className="h-6 bg-gray-200 rounded-md mb-12 w-2/3" />
            </div>
          )}
          
          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <h2 className="text-xl text-red-500 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
          
          {/* Category Header */}
          {!loading && !error && category && (
            <>
              <header className="mb-10">
                <h1 className="text-3xl md:text-4xl font-bold mb-3">{category.name}</h1>
                {category.description && (
                  <div 
                    className="text-gray-600 mb-6 prose max-w-none"
                    dangerouslySetInnerHTML={{ __html: category.description }}
                  />
                )}
                <div className="text-sm text-gray-500">
                  {category.count} {category.count === 1 ? "product" : "products"}
                </div>
              </header>
              
              {/* Category Banner Image */}
              {category.image && category.image.src && (
                <div className="mb-10 rounded-lg overflow-hidden">
                  <img
                    src={category.image.src}
                    alt={category.name}
                    className="w-full h-64 object-cover"
                  />
                </div>
              )}
              
              {/* Products Grid */}
              <ProductGrid
                categoryId={category.id}
                title="Products"
                showFilters={true}
              />
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CategoryPage;
