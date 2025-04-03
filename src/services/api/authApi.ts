
import { User, LoginCredentials, RegisterData, ApiResponse } from "@/types";
import { API_URL, getHeaders, handleApiError } from "./utils";

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
