
import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Cart, CartItem } from "@/types";
import { cartApi } from "@/services/api";
import { toast } from "sonner";

interface CartContextType {
  cart: Cart | null;
  loading: boolean;
  error: string | null;
  addToCart: (productId: number, quantity: number, variationId?: number) => Promise<void>;
  updateCartItem: (itemKey: string, quantity: number) => Promise<void>;
  removeCartItem: (itemKey: string) => Promise<void>;
  clearCart: () => void;
}

const initialCart: Cart = {
  items: [],
  totals: {
    subtotal: "0.00",
    total: "0.00",
    tax: "0.00",
    discount: "0.00",
    shipping: "0.00",
  },
  item_count: 0,
};

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [cart, setCart] = useState<Cart | null>(initialCart);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCart = async () => {
      setLoading(true);
      try {
        const cartData = await cartApi.getCart();
        setCart(cartData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load cart');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCart();
  }, []);

  const addToCart = async (productId: number, quantity: number, variationId?: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCart = await cartApi.addToCart(productId, quantity, variationId);
      setCart(updatedCart);
      toast.success('Item added to cart');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to add item to cart';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateCartItem = async (itemKey: string, quantity: number) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCart = await cartApi.updateCartItem(itemKey, quantity);
      setCart(updatedCart);
      toast.success('Cart updated');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to update cart';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const removeCartItem = async (itemKey: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const updatedCart = await cartApi.removeCartItem(itemKey);
      setCart(updatedCart);
      toast.success('Item removed from cart');
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to remove item from cart';
      setError(message);
      toast.error(message);
    } finally {
      setLoading(false);
    }
  };

  const clearCart = () => {
    setCart(initialCart);
  };

  const value = {
    cart,
    loading,
    error,
    addToCart,
    updateCartItem,
    removeCartItem,
    clearCart,
  };

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

export const useCart = (): CartContextType => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};
