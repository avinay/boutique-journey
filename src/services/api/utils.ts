
import { toast } from "sonner";

// Update these values with your WordPress/WooCommerce site details
export const API_URL = 'https://ohmyparty.in/autoparts/wp-json/wc/v3';
export const CONSUMER_KEY = 'ck_5190fcd4acc882402c34583eaafc187d981ddf78';
export const CONSUMER_SECRET = 'cs_17d7c67acc2e8b0675b54a375065a6b7d7bbbd21';

// Helper to handle API errors
export const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  // More detailed logging for debugging
  if (error instanceof Error) {
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Special handling for CORS errors
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.warn('This may be a CORS issue. Make sure the API allows cross-origin requests from this domain.');
      const corsMessage = 'API request failed - this might be due to CORS restrictions on the API server.';
      toast.error(corsMessage);
      throw new Error(corsMessage);
    }
  }
  
  const message = error?.response?.data?.message || 'An error occurred. Please try again.';
  toast.error(message);
  throw new Error(message);
};

// Create the base API configuration for authentication
export const getHeaders = (): HeadersInit => {
  const headers: HeadersInit = {
    'Content-Type': 'application/json',
  };

  // Add authentication token from localStorage if available
  const token = localStorage.getItem('auth_token');
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  } else {
    // Use consumer key/secret for basic authentication
    const auth = btoa(`${CONSUMER_KEY}:${CONSUMER_SECRET}`);
    headers['Authorization'] = `Basic ${auth}`;
  }

  return headers;
};
