
import { Product, Category } from "@/types";
import { API_URL, getHeaders, handleApiError } from "./utils";

export const productApi = {
  getProducts: async (params?: Record<string, string>): Promise<Product[]> => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const url = `${API_URL}/products?${queryString}`;
      console.log("API request URL:", url);
      
      const response = await fetch(url, {
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
