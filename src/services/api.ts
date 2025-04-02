import { toast } from "sonner";
import { 
  Product, 
  Category, 
  Cart, 
  User, 
  LoginCredentials, 
  RegisterData,
  ApiResponse
} from "@/types";

// Update these values with your WordPress/WooCommerce site details
const API_URL = 'https://ohmyparty.in/autoparts/wp-json/wc/v3';
const CONSUMER_KEY = 'ck_5190fcd4acc882402c34583eaafc187d981ddf78';
const CONSUMER_SECRET = 'cs_17d7c67acc2e8b0675b54a375065a6b7d7bbbd21';

// Helper to handle API errors
const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  const message = error?.response?.data?.message || 'An error occurred. Please try again.';
  toast.error(message);
  throw new Error(message);
};

// Create the base API configuration for authentication
const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authentication token from localStorage if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Use consumer key/secret for unauthenticated requests
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    headers['Authorization'] = `Basic ${auth}`;
  }

  return headers;
};

// Product APIs
export const productApi = {
  getProducts: async (params?: Record<string, string>): Promise<Product[]> => {
    try {
      const queryString = params ? new URLSearchParams(params).toString() : '';
      const response = await fetch(`${API_URL}/products?${queryString}`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
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

// Cart APIs
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

// Auth APIs
export const authApi = {
  login: async (credentials: LoginCredentials): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      const data = await response.json();
      if (data.token) {
        localStorage.setItem('auth_token', data.token);
      }
      return data;
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  register: async (userData: RegisterData): Promise<ApiResponse<User>> => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
  
  logout: (): void => {
    localStorage.removeItem('auth_token');
  },
  
  getCurrentUser: async (): Promise<User | null> => {
    try {
      const response = await fetch(`${API_URL}/auth/me`, {
        headers: getHeaders(),
      });
      
      if (!response.ok) {
        if (response.status === 401) {
          localStorage.removeItem('auth_token');
          return null;
        }
        throw new Error(`Error ${response.status}: ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error('Error getting current user:', error);
      return null;
    }
  },
};

// Checkout APIs
export const checkoutApi = {
  createOrder: async (orderData: any): Promise<any> => {
    try {
      const response = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: getHeaders(),
        body: JSON.stringify(orderData),
      });
      
      if (!response.ok) throw new Error(`Error ${response.status}: ${response.statusText}`);
      
      return await response.json();
    } catch (error) {
      return handleApiError(error);
    }
  },
};
