
import { Link } from "react-router-dom";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "@/context/CartContext";
import CartItem from "@/components/cart/CartItem";
import CartSummary from "@/components/cart/CartSummary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

const CartPage = () => {
  const { cart, loading } = useCart();
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
          
          {loading ? (
            <div className="animate-pulse space-y-4">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="flex items-center py-4 border-b">
                  <div className="w-20 h-20 bg-gray-200 rounded-md mr-4" />
                  <div className="flex-grow">
                    <div className="h-6 bg-gray-200 rounded w-1/2 mb-2" />
                    <div className="h-4 bg-gray-200 rounded w-1/4" />
                  </div>
                  <div className="w-24 h-6 bg-gray-200 rounded" />
                </div>
              ))}
            </div>
          ) : (
            cart && cart.items.length === 0 ? (
              <div className="text-center py-16">
                <div className="flex justify-center mb-4">
                  <ShoppingCart size={60} className="text-gray-400" />
                </div>
                <h2 className="text-2xl font-medium text-gray-900 mb-2">Your cart is empty</h2>
                <p className="text-gray-600 mb-8">
                  Looks like you haven't added any products to your cart yet.
                </p>
                <Link to="/shop" className="btn-primary inline-flex items-center">
                  <ArrowLeft size={16} className="mr-2" />
                  Continue Shopping
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Cart Items */}
                <div className="lg:col-span-2">
                  {/* Cart Headers - Desktop only */}
                  <div className="hidden md:grid grid-cols-12 gap-4 pb-2 border-b text-sm font-medium text-gray-500">
                    <div className="col-span-6">Product</div>
                    <div className="col-span-2 text-right">Price</div>
                    <div className="col-span-2 text-center">Quantity</div>
                    <div className="col-span-2 text-right">Subtotal</div>
                  </div>
                  
                  {/* Cart Items */}
                  <div>
                    {cart?.items.map(item => (
                      <CartItem key={item.id} item={item} />
                    ))}
                  </div>
                  
                  {/* Continue Shopping */}
                  <div className="mt-6">
                    <Link to="/shop" className="text-brand-navy hover:text-opacity-90 inline-flex items-center">
                      <ArrowLeft size={16} className="mr-2" />
                      Continue Shopping
                    </Link>
                  </div>
                </div>
                
                {/* Cart Summary */}
                <div className="lg:col-span-1">
                  <CartSummary cart={cart} />
                </div>
              </div>
            )
          )}
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CartPage;
