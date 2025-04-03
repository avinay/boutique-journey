
import { Product, Category } from "@/types";
import { API_URL, getHeaders, handleApiError, testApiConnection } from "./utils";

export const productApi = {
  testConnection: async () => {
    return await testApiConnection();
  },
  
  getProducts: async (params?: Record<string, string>): Promise<Product[]> => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const url = `${API_URL}/products?${queryString}`;
      console.log("API request URL:", url);
      
      const headers = getHeaders();
      console.log("Request headers:", JSON.stringify(headers, null, 2));
      
      const response = await fetch(url, {
        method: 'GET',
        headers: headers,
        mode: 'cors',
        cache: 'no-cache',
        // Add credentials: 'include' to send cookies if needed
        // credentials: 'include',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API response error:", response.status, response.statusText, errorText);
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      const data = await response.json();
      console.log("API response data received:", data.length, "products");
      return data;
    } catch (error) {
      console.error("getProducts error details:", error);
      if (error instanceof Error) {
        console.error("Error name:", error.name);
        console.error("Error message:", error.message);
        console.error("Error stack:", error.stack);
      }
      return handleApiError(error);
    }
  },
  
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/products/categories`, {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products?category=${categoryId}`, {
        method: 'GET',
        headers: getHeaders(),
        mode: 'cors',
        cache: 'no-cache',
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Error ${response.status}: ${errorText || response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
