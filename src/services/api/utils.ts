
import { toast } from "sonner";

// Update these values with your WordPress/WooCommerce site details
export const API_URL = 'https://ohmyparty.in/autoparts/wp-json/wc/v3';
export const CONSUMER_KEY = 'ck_5190fcd4acc882402c34583eaafc187d981ddf78';
export const CONSUMER_SECRET = 'cs_17d7c67acc2e8b0675b54a375065a6b7d7bbbd21';

// Enhanced error handling with more diagnostics
export const handleApiError = (error: any): never => {
  console.error('API Error:', error);
  
  // More detailed logging for debugging
  if (error instanceof Error) {
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Special handling for CORS errors
    if (error.message.includes('Failed to fetch') || error.name === 'TypeError') {
      console.warn('This is likely a CORS issue. The API server needs to allow cross-origin requests from this domain.');
      toast.error('API connection error - CORS restrictions may be blocking access.');
      throw new Error('CORS issue: API server is not allowing requests from this domain.');
    }
  }
  
  // Response error object parsing
  if (error?.response) {
    console.error('Response status:', error.response.status);
    console.error('Response data:', error.response.data);
    
    const message = error.response.data?.message || 'API server returned an error.';
    toast.error(message);
    throw new Error(message);
  }
  
  const message = error?.message || 'An error occurred. Please try again.';
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

// Test direct API connection to diagnose issues
export const testApiConnection = async (): Promise<{success: boolean, message: string, details?: any}> => {
  try {
    console.log("Testing direct API connection to:", API_URL);
    
    // Make a simple OPTIONS request first to check CORS
    const optionsResponse = await fetch(API_URL, {
      method: 'OPTIONS',
      mode: 'cors',
      cache: 'no-cache',
    });
    
    console.log("OPTIONS response:", optionsResponse.status, optionsResponse.statusText);
    console.log("CORS headers:", {
      'Access-Control-Allow-Origin': optionsResponse.headers.get('Access-Control-Allow-Origin'),
      'Access-Control-Allow-Methods': optionsResponse.headers.get('Access-Control-Allow-Methods'),
      'Access-Control-Allow-Headers': optionsResponse.headers.get('Access-Control-Allow-Headers'),
    });
    
    // Now try a GET request
    const getResponse = await fetch(`${API_URL}/products?per_page=1`, {
      method: 'GET',
      headers: getHeaders(),
      mode: 'cors',
      cache: 'no-cache',
    });
    
    if (!getResponse.ok) {
      const errorText = await getResponse.text();
      return {
        success: false,
        message: `API returned status ${getResponse.status}: ${getResponse.statusText}`,
        details: errorText
      };
    }
    
    const data = await getResponse.json();
    return {
      success: true,
      message: "API connection successful!",
      details: data
    };
  } catch (error) {
    console.error("API test failed:", error);
    
    // Determine if this is a CORS issue
    const isCorsError = error instanceof Error && 
      (error.message.includes('Failed to fetch') || 
       error.name === 'TypeError' || 
       error.message.includes('CORS'));
    
    return {
      success: false,
      message: isCorsError 
        ? "CORS error: The API server is not allowing cross-origin requests from this domain." 
        : `Connection failed: ${error instanceof Error ? error.message : String(error)}`,
      details: error
    };
  }
};
