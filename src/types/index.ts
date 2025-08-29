export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
}

export interface Profile {
  id: string;
  user_id: string;
  email: string;
  first_name: string;
  last_name: string;
  company?: string;
  phone?: string;
  created_at: string;
  updated_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  created_at: string;
}

export interface Provider {
  id: string;
  name: string;
  slug: string;
  description: string;
  logo_url?: string;
  website?: string;
  rating: number;
  total_reviews: number;
  verified: boolean;
  created_at: string;
}

export interface Dataset {
  id: string;
  title: string;
  slug: string;
  description: string;
  long_description?: string;
  category_id: string;
  provider_id: string;
  price: number;
  original_price?: number;
  currency: string;
  size_description: string;
  record_count: number;
  update_frequency: string;
  data_format: string[];
  tags: string[];
  image_url?: string;
  sample_data?: any;
  featured: boolean;
  active: boolean;
  rating: number;
  total_reviews: number;
  total_downloads: number;
  created_at: string;
  updated_at: string;
  category?: Category;
  provider?: Provider;
}

export interface CartItem {
  id: string;
  user_id: string;
  dataset_id: string;
  quantity: number;
  price: number;
  created_at: string;
  dataset?: Dataset;
}

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: string;
  total_amount: number;
  currency: string;
  payment_intent_id?: string;
  payment_status: string;
  billing_email: string;
  billing_name: string;
  created_at: string;
  updated_at: string;
  order_items?: OrderItem[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  dataset_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
  created_at: string;
  dataset?: Dataset;
}

export interface Review {
  id: string;
  user_id: string;
  dataset_id: string;
  rating: number;
  title: string;
  comment: string;
  verified_purchase: boolean;
  created_at: string;
  updated_at: string;
}