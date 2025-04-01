
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { CreditCard } from "lucide-react";
import { useCart } from "@/context/CartContext";
import { useAuth } from "@/context/AuthContext";
import CartSummary from "@/components/cart/CartSummary";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";
import { toast } from "sonner";

const CheckoutPage = () => {
  const { cart, loading: cartLoading } = useCart();
  const { user, isAuthenticated } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    firstName: user?.first_name || "",
    lastName: user?.last_name || "",
    email: user?.email || "",
    address: "",
    city: "",
    state: "",
    postalCode: "",
    country: "US",
    phone: "",
    notes: "",
    paymentMethod: "credit_card"
  });
  
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isAuthenticated && !cartLoading) {
      navigate("/auth?redirect=checkout");
    }
  }, [isAuthenticated, cartLoading, navigate]);
  
  // Redirect to cart if empty
  useEffect(() => {
    if (!cartLoading && cart && cart.items.length === 0) {
      toast.error("Your cart is empty");
      navigate("/cart");
    }
  }, [cart, cartLoading, navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
    
    // Clear error when user types
    if (formErrors[name]) {
      setFormErrors({
        ...formErrors,
        [name]: ""
      });
    }
  };
  
  const validate = (): boolean => {
    const errors: Record<string, string> = {};
    
    // Basic validation
    if (!formData.firstName.trim()) errors.firstName = "First name is required";
    if (!formData.lastName.trim()) errors.lastName = "Last name is required";
    if (!formData.email.trim()) {
      errors.email = "Email is required";
    } else if (!/^\S+@\S+\.\S+$/.test(formData.email)) {
      errors.email = "Email is invalid";
    }
    if (!formData.address.trim()) errors.address = "Address is required";
    if (!formData.city.trim()) errors.city = "City is required";
    if (!formData.state.trim()) errors.state = "State is required";
    if (!formData.postalCode.trim()) errors.postalCode = "Postal code is required";
    if (!formData.phone.trim()) errors.phone = "Phone is required";
    
    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // Simulate order completion
    setTimeout(() => {
      toast.success("Order placed successfully!");
      navigate("/order-confirmation");
      setIsSubmitting(false);
    }, 2000);
  };
  
  if (cartLoading) {
    return (
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow py-8 md:py-12">
          <div className="container mx-auto px-4">
            <div className="animate-pulse space-y-8">
              <div className="h-8 bg-gray-200 w-1/4 rounded" />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="h-6 bg-gray-200 w-1/2 rounded" />
                  <div className="grid grid-cols-2 gap-4">
                    <div className="h-10 bg-gray-200 rounded" />
                    <div className="h-10 bg-gray-200 rounded" />
                  </div>
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-10 bg-gray-200 rounded" />
                  <div className="h-6 bg-gray-200 w-1/2 rounded mt-8" />
                  <div className="h-10 bg-gray-200 rounded" />
                </div>
                <div className="h-64 bg-gray-200 rounded" />
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }
  
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      <main className="flex-grow py-8 md:py-12">
        <div className="container mx-auto px-4">
          <h1 className="text-3xl font-bold mb-8">Checkout</h1>
          
          <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Checkout Form */}
            <div className="lg:col-span-2 space-y-8">
              {/* Shipping Information */}
              <div>
                <h2 className="text-xl font-bold mb-4">Shipping Information</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                      First Name*
                    </label>
                    <input
                      type="text"
                      id="firstName"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        formErrors.firstName 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-brand-navy"
                      }`}
                    />
                    {formErrors.firstName && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.firstName}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                      Last Name*
                    </label>
                    <input
                      type="text"
                      id="lastName"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        formErrors.lastName 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-brand-navy"
                      }`}
                    />
                    {formErrors.lastName && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.lastName}</p>
                    )}
                  </div>
                </div>
                
                <div className="mb-4">
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                    Email*
                  </label>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      formErrors.email 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-brand-navy"
                    }`}
                  />
                  {formErrors.email && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.email}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                    Phone*
                  </label>
                  <input
                    type="tel"
                    id="phone"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      formErrors.phone 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-brand-navy"
                    }`}
                  />
                  {formErrors.phone && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.phone}</p>
                  )}
                </div>
                
                <div className="mb-4">
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                    Address*
                  </label>
                  <input
                    type="text"
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                      formErrors.address 
                        ? "border-red-500 focus:ring-red-500" 
                        : "border-gray-300 focus:ring-brand-navy"
                    }`}
                  />
                  {formErrors.address && (
                    <p className="mt-1 text-sm text-red-500">{formErrors.address}</p>
                  )}
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div>
                    <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                      City*
                    </label>
                    <input
                      type="text"
                      id="city"
                      name="city"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        formErrors.city 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-brand-navy"
                      }`}
                    />
                    {formErrors.city && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.city}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                      State/Province*
                    </label>
                    <input
                      type="text"
                      id="state"
                      name="state"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        formErrors.state 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-brand-navy"
                      }`}
                    />
                    {formErrors.state && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.state}</p>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="postalCode" className="block text-sm font-medium text-gray-700 mb-1">
                      Postal Code*
                    </label>
                    <input
                      type="text"
                      id="postalCode"
                      name="postalCode"
                      value={formData.postalCode}
                      onChange={handleChange}
                      className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-1 ${
                        formErrors.postalCode 
                          ? "border-red-500 focus:ring-red-500" 
                          : "border-gray-300 focus:ring-brand-navy"
                      }`}
                    />
                    {formErrors.postalCode && (
                      <p className="mt-1 text-sm text-red-500">{formErrors.postalCode}</p>
                    )}
                  </div>
                  <div>
                    <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">
                      Country*
                    </label>
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-navy"
                    >
                      <option value="US">United States</option>
                      <option value="CA">Canada</option>
                      <option value="UK">United Kingdom</option>
                      <option value="AU">Australia</option>
                    </select>
                  </div>
                </div>
              </div>
              
              {/* Order Notes */}
              <div>
                <label htmlFor="notes" className="block text-sm font-medium text-gray-700 mb-1">
                  Order Notes (optional)
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  rows={3}
                  value={formData.notes}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-brand-navy"
                  placeholder="Special instructions for delivery"
                ></textarea>
              </div>
              
              {/* Payment Method */}
              <div>
                <h2 className="text-xl font-bold mb-4">Payment Method</h2>
                
                <div className="space-y-4">
                  <div className="border border-gray-200 rounded-md p-4 bg-gray-50 flex items-center">
                    <input
                      type="radio"
                      id="credit_card"
                      name="paymentMethod"
                      value="credit_card"
                      checked={formData.paymentMethod === "credit_card"}
                      onChange={handleChange}
                      className="h-4 w-4 text-brand-navy focus:ring-brand-navy border-gray-300"
                    />
                    <label htmlFor="credit_card" className="ml-2 flex items-center">
                      <CreditCard size={20} className="mr-2" />
                      Credit Card
                    </label>
                  </div>
                  
                  {/* Payment details would go here */}
                </div>
              </div>
            </div>
            
            {/* Order Summary */}
            <div className="lg:col-span-1">
              <CartSummary cart={cart} isCheckout={true} />
              
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full btn-primary py-3 mt-6"
              >
                {isSubmitting ? "Processing..." : "Place Order"}
              </button>
            </div>
          </form>
        </div>
      </main>
      
      <Footer />
    </div>
  );
};

export default CheckoutPage;
