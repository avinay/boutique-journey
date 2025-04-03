
import { Product, Category } from "@/types";
import { API_URL, getHeaders, handleApiError } from "./utils";

export const productApi = {
  getProducts: async (params?: Record<string, string>): Promise<Product[]> => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const url = `${API_URL}/products?${queryString}`;
      console.log("API request URL:", url);
      
      const response = await fetch(url, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      const data = await response.json();
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getProduct: async (id: number): Promise<Product> => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getCategories: async (): Promise<Category[]> => {
    try {
      const response = await fetch(`${API_URL}/products/categories`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  getProductsByCategory: async (categoryId: number): Promise<Product[]> => {
    try {
      const response = await fetch(`${API_URL}/products?category=${categoryId}`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
