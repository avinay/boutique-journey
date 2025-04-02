
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { productApi } from "@/services/api";
import { Product, Category } from "@/types";
import ProductGrid from "@/components/products/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent } from "@/components/ui/card";

const Home = () => {
  const [featuredCategories, setFeaturedCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categories = await productApi.getCategories();
        console.log("Fetched categories:", categories);
        // Get first 3 categories with images
        const featured = categories
          .filter(cat => cat.image?.src) // Only get categories with images
          .slice(0, 3);
        setFeaturedCategories(featured);
      } catch (error) {
        console.error("Error fetching categories:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchCategories();
  }, []);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow">
        {/* Hero Section */}
        <section className="bg-gradient-to-r from-gray-50 to-gray-100 py-16 md:py-24">
          <div className="container mx-auto px-4 md:px-6 lg:px-8">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-10 md:mb-0">
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-4">
                  Discover Premium Auto Parts
                </h1>
                <p className="text-xl text-gray-600 mb-8 max-w-md">
                  Shop our curated collection of high-quality auto parts for cars, bikes, and trucks.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/shop" className="btn-primary py-3 px-8">
                    Shop Now
                  </Link>
                  <Link to="/categories" className="btn-secondary py-3 px-8">
                    Browse Categories
                  </Link>
                </div>
              </div>
              
              <div className="md:w-1/2">
                <img 
                  src="https://ohmyparty.in/autoparts/wp-content/uploads/2025/03/car-headlight.jpg" 
                  alt="Featured products" 
                  className="w-full rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Featured Categories */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <h2 className="text-3xl font-bold text-center mb-10">Shop by Category</h2>
            
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1, 2, 3].map(i => (
                  <Skeleton key={i} className="aspect-[3/2] h-64 rounded-lg" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {featuredCategories.length > 0 ? (
                  featuredCategories.map(category => (
                    <Link 
                      key={category.id} 
                      to={`/category/${category.id}`} 
                      className="group relative rounded-lg overflow-hidden shadow-lg"
                    >
                      <div className="aspect-[3/2] overflow-hidden">
                        <img 
                          src={category.image?.src || "https://via.placeholder.com/400x300"} 
                          alt={category.name}
                          className="w-full h-full object-cover transition-transform group-hover:scale-105"
                        />
                      </div>
                      <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex items-end">
                        <div className="p-6 text-white">
                          <h3 className="text-xl font-bold mb-2">{category.name}</h3>
                          <p className="text-sm text-white/90 mb-3">{category.count} Products</p>
                          <span className="inline-flex items-center text-sm font-medium">
                            Shop Now <ArrowRight size={16} className="ml-1" />
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-10">
                    <Card>
                      <CardContent className="pt-6">
                        <p className="text-gray-600">No categories found with images. Please add some categories with images to your store.</p>
                      </CardContent>
                    </Card>
                  </div>
                )}
              </div>
            )}
          </div>
        </section>
        
        {/* Featured Products */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">Featured Products</h2>
              <Link to="/shop" className="text-brand-navy hover:text-opacity-90 flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <ProductGrid limit={8} />
          </div>
        </section>
        
        {/* New Arrivals */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="flex justify-between items-center mb-10">
              <h2 className="text-3xl font-bold">New Arrivals</h2>
              <Link to="/shop" className="text-brand-navy hover:text-opacity-90 flex items-center">
                View All <ArrowRight size={16} className="ml-1" />
              </Link>
            </div>
            <ProductGrid limit={4} sortBy="date" />
          </div>
        </section>
        
        {/* Promotional Banner */}
        <section className="py-16 bg-brand-navy text-white">
          <div className="container mx-auto px-4">
            <div className="flex flex-col md:flex-row items-center justify-between">
              <div className="md:w-1/2 mb-8 md:mb-0">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">
                  Auto Parts Sale Is On!
                </h2>
                <p className="text-lg text-white/90 mb-6">
                  Get up to 50% off on selected auto parts. Limited time offer.
                </p>
                <Link to="/shop" className="bg-white text-brand-navy px-8 py-3 rounded-md hover:bg-opacity-90 inline-block">
                  Shop the Sale
                </Link>
              </div>
              <div className="md:w-1/2">
                <img 
                  src="https://ohmyparty.in/autoparts/wp-content/uploads/2025/03/71kRLa2c2jL._AC_UF1000,1000_QL80_.jpg" 
                  alt="Auto Parts Sale" 
                  className="w-full rounded-lg"
                />
              </div>
            </div>
          </div>
        </section>
      </main>
      
      <Footer />
    </div>
  );
};

export default Home;
