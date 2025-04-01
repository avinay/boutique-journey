
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import { Cart } from "@/types";
import { Link } from "react-router-dom";

interface CartSummaryProps {
  cart: Cart | null;
  isCheckout?: boolean;
}

const CartSummary = ({ cart, isCheckout = false }: CartSummaryProps) => {
  const [couponCode, setCouponCode] = useState("");
  const [isApplyingCoupon, setIsApplyingCoupon] = useState(false);
  
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!couponCode) return;
    
    setIsApplyingCoupon(true);
    
    // In a real app, we would call an API to apply the coupon
    setTimeout(() => {
      setCouponCode("");
      setIsApplyingCoupon(false);
      
      // Mock success for now
      alert("Coupon code applied successfully!");
    }, 1000);
  };
  
  if (!cart) return null;
  
  return (
    <div className="bg-white rounded-lg shadow p-6">
      <h2 className="text-lg font-bold mb-4">Order Summary</h2>
      
      <div className="space-y-3 mb-6">
        <div className="flex justify-between text-gray-600">
          <span>Subtotal</span>
          <span>${cart.totals.subtotal}</span>
        </div>
        
        {Number(cart.totals.discount) > 0 && (
          <div className="flex justify-between text-green-600">
            <span>Discount</span>
            <span>-${cart.totals.discount}</span>
          </div>
        )}
        
        {Number(cart.totals.tax) > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Tax</span>
            <span>${cart.totals.tax}</span>
          </div>
        )}
        
        {Number(cart.totals.shipping) > 0 && (
          <div className="flex justify-between text-gray-600">
            <span>Shipping</span>
            <span>${cart.totals.shipping}</span>
          </div>
        )}
        
        <div className="border-t pt-3 mt-3">
          <div className="flex justify-between font-semibold">
            <span>Total</span>
            <span>${cart.totals.total}</span>
          </div>
        </div>
      </div>
      
      {!isCheckout && (
        <>
          {/* Coupon Code */}
          <form onSubmit={handleApplyCoupon} className="mb-6">
            <label htmlFor="coupon" className="block text-sm font-medium text-gray-700 mb-1">
              Promotional Code
            </label>
            <div className="flex">
              <input
                id="coupon"
                type="text"
                className="flex-grow px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-1 focus:ring-brand-navy"
                value={couponCode}
                onChange={(e) => setCouponCode(e.target.value)}
                placeholder="Enter code"
              />
              <button
                type="submit"
                className="bg-brand-navy text-white px-4 py-2 rounded-r-md hover:bg-opacity-90 disabled:opacity-50"
                disabled={!couponCode || isApplyingCoupon}
              >
                Apply
              </button>
            </div>
          </form>
          
          {/* Checkout Button */}
          <Link
            to="/checkout"
            className="w-full btn-primary flex items-center justify-center py-3"
          >
            Proceed to Checkout
            <ArrowRight size={16} className="ml-2" />
          </Link>
        </>
      )}
    </div>
  );
};

export default CartSummary;
