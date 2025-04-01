
import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { productApi } from "@/services/api";
import { Product } from "@/types";
import ProductDetails from "@/components/products/ProductDetails";
import ProductGrid from "@/components/products/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const ProductPage = () => {
  const { id } = useParams<{ id: string }>();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;
      
      setLoading(true);
      try {
        const productData = await productApi.getProduct(parseInt(id));
        setProduct(productData);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to load product");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProduct();
  }, [id]);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          {/* Loading State */}
          {loading && (
            <ProductDetails product={null} loading={true} />
          )}
          
          {/* Error State */}
          {error && !loading && (
            <div className="text-center py-12">
              <h2 className="text-xl text-red-500 mb-2">Error</h2>
              <p className="text-gray-600">{error}</p>
            </div>
          )}
          
          {/* Product Details */}
          {!loading && !error && product && (
            <>
              <ProductDetails product={product} />
              
              {/* Related Products */}
              <div className="mt-20">
                <h2 className="text-2xl font-bold mb-6">You may also like</h2>
                {product.categories && product.categories.length > 0 && (
                  <ProductGrid 
                    categoryId={product.categories[0].id} 
                    limit={4}
                  />
                )}
              </div>
            </>
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ProductPage;
