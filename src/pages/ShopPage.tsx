
import { useState } from "react";
import ProductGrid from "@/components/products/ProductGrid";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const ShopPage = () => {
  const [pageSize, setPageSize] = useState(12);
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2">Shop</h1>
            <p className="text-gray-600">Browse our complete collection of products</p>
            
            <Alert variant="warning" className="mt-4">
              <AlertCircle className="h-4 w-4 mr-2" />
              <AlertDescription>
                Our shop is currently in diagnostic mode. You may see some test data while we resolve API connection issues.
              </AlertDescription>
            </Alert>
          </div>
          
          <div className="flex flex-col md:flex-row gap-8">
            <div className="md:w-1/4 mb-6 md:mb-0 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <h2 className="text-xl font-semibold mb-4">Filter Options</h2>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Products per page
                      </label>
                      <select 
                        value={pageSize} 
                        onChange={(e) => setPageSize(Number(e.target.value))}
                        className="w-full p-2 border rounded focus:ring-1 focus:ring-brand-navy"
                      >
                        <option value={12}>12</option>
                        <option value={24}>24</option>
                        <option value={36}>36</option>
                      </select>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="md:w-3/4">
              <ProductGrid 
                limit={pageSize} 
                title="All Products" 
                showFilters={true}
              />
            </div>
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default ShopPage;
