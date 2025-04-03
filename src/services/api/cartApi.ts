
import { Cart } from "@/types";
import { API_URL, getHeaders, handleApiError } from "./utils";

export const cartApi = {
  getCart: async (): Promise<Cart> => {
    try {
      const response = await fetch(`${API_URL}/cart`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  addToCart: async (productId: number, quantity: number, variation_id?: number): Promise<Cart> => {
    try {
      const response = await fetch(`${API_URL}/cart/add`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify({ product_id: productId, quantity, variation_id }),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  updateCartItem: async (itemKey: string, quantity: number): Promise<Cart> => {
    try {
      const response = await fetch(`${API_URL}/cart/item/${itemKey}`, {
        method: 'PUT',
        headers: getHeaders(),
        body: JSON.stringify({ quantity }),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  removeCartItem: async (itemKey: string): Promise<Cart> => {
    try {
      const response = await fetch(`${API_URL}/cart/item/${itemKey}`, {
        method: 'DELETE',
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
