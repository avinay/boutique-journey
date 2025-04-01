
import { useState } from "react";
import { X } from "lucide-react";
import { CartItem as CartItemType } from "@/types";
import { useCart } from "@/context/CartContext";
import { Link } from "react-router-dom";

interface CartItemProps {
  item: CartItemType;
}

const CartItem = ({ item }: CartItemProps) => {
  const { updateCartItem, removeCartItem, loading } = useCart();
  const [quantity, setQuantity] = useState(item.quantity);
  
  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newQuantity = parseInt(e.target.value);
    if (newQuantity > 0) {
      setQuantity(newQuantity);
    }
  };
  
  const handleBlur = async () => {
    if (quantity !== item.quantity) {
      await updateCartItem(item.id.toString(), quantity);
    }
  };
  
  const handleRemove = async () => {
    await removeCartItem(item.id.toString());
  };
  
  return (
    <div className="flex items-center py-4 border-b last:border-b-0">
      {/* Product Image */}
      <div className="w-20 h-20 flex-shrink-0 mr-4">
        <Link to={`/product/${item.product_id}`}>
          <img 
            src={item.image} 
            alt={item.name} 
            className="w-full h-full object-cover rounded-md"
          />
        </Link>
      </div>
      
      {/* Product Details */}
      <div className="flex-grow">
        <Link to={`/product/${item.product_id}`} className="font-medium text-gray-800 hover:text-brand-navy">
          {item.name}
        </Link>
        
        {/* Attributes */}
        {Object.keys(item.attributes).length > 0 && (
          <div className="text-sm text-gray-500 mt-1">
            {Object.entries(item.attributes).map(([key, value]) => (
              <div key={key}>{key}: {value}</div>
            ))}
          </div>
        )}
        
        {/* Mobile View: Price & Quantity */}
        <div className="flex items-center justify-between mt-2 md:hidden">
          <span className="font-semibold">${item.price}</span>
          <div className="flex items-center space-x-2">
            <label className="sr-only">Quantity</label>
            <div className="flex border border-gray-300 rounded-md">
              <button
                onClick={() => setQuantity(prev => {
                  const newQty = prev - 1;
                  if (newQty > 0) {
                    updateCartItem(item.id.toString(), newQty);
                    return newQty;
                  }
                  return prev;
                })}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                disabled={quantity <= 1 || loading}
              >
                -
              </button>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={handleQuantityChange}
                onBlur={handleBlur}
                className="w-12 text-center focus:outline-none"
                disabled={loading}
              />
              <button
                onClick={() => {
                  const newQty = quantity + 1;
                  setQuantity(newQty);
                  updateCartItem(item.id.toString(), newQty);
                }}
                className="px-2 py-1 text-gray-600 hover:bg-gray-100"
                disabled={loading}
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Desktop: Price */}
      <div className="hidden md:block font-semibold text-gray-800 w-24 text-right">
        ${item.price}
      </div>
      
      {/* Desktop: Quantity */}
      <div className="hidden md:flex items-center mx-6 border border-gray-300 rounded-md">
        <button
          onClick={() => setQuantity(prev => {
            const newQty = prev - 1;
            if (newQty > 0) {
              updateCartItem(item.id.toString(), newQty);
              return newQty;
            }
            return prev;
          })}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
          disabled={quantity <= 1 || loading}
        >
          -
        </button>
        <input
          type="number"
          min="1"
          value={quantity}
          onChange={handleQuantityChange}
          onBlur={handleBlur}
          className="w-12 text-center focus:outline-none"
          disabled={loading}
        />
        <button
          onClick={() => {
            const newQty = quantity + 1;
            setQuantity(newQty);
            updateCartItem(item.id.toString(), newQty);
          }}
          className="px-2 py-1 text-gray-600 hover:bg-gray-100"
          disabled={loading}
        >
          +
        </button>
      </div>
      
      {/* Desktop: Subtotal */}
      <div className="hidden md:block font-semibold text-gray-800 w-24 text-right">
        ${item.subtotal}
      </div>
      
      {/* Remove Button */}
      <button
        onClick={handleRemove}
        className="ml-4 p-1 text-gray-500 hover:text-red-500"
        disabled={loading}
        aria-label="Remove item"
      >
        <X size={18} />
      </button>
    </div>
  );
};

export default CartItem;
