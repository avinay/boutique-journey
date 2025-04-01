
// Product Types
export interface Product {
  id: number;
  name: string;
  slug: string;
  permalink: string;
  date_created: string;
  price: string;
  regular_price: string;
  sale_price: string;
  description: string;
  short_description: string;
  categories: Category[];
  images: ProductImage[];
  attributes: ProductAttribute[];
  variations: number[];
  stock_status: 'instock' | 'outofstock' | 'onbackorder';
  average_rating: string;
}

export interface ProductImage {
  id: number;
  src: string;
  alt: string;
}

export interface ProductAttribute {
  id: number;
  name: string;
  position: number;
  visible: boolean;
  variation: boolean;
  options: string[];
}

// Category Types
export interface Category {
  id: number;
  name: string;
  slug: string;
  parent: number;
  description: string;
  image: {
    id: number;
    src: string;
    alt: string;
  } | null;
  count: number;
}

// Cart Types
export interface CartItem {
  id: number;
  product_id: number;
  variation_id: number;
  quantity: number;
  name: string;
  price: string;
  image: string;
  attributes: Record<string, string>;
  subtotal: string;
}

export interface Cart {
  items: CartItem[];
  totals: {
    subtotal: string;
    total: string;
    tax: string;
    discount: string;
    shipping: string;
  };
  item_count: number;
}

// Auth Types
export interface User {
  id: number;
  username: string;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
}

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  success: boolean;
  message?: string;
}
