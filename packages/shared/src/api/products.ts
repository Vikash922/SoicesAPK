import { supabase } from '@/lib/supabase';

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  short_description: string;
  price: number;
  original_price?: number;
  image: string;
  images?: string[];
  category_id: string;
  spice_heat_level: number;
  is_organic: boolean;
  is_premium: boolean;
  avg_rating: number;
  review_count: number;
  origin_country: string;
  region?: string;
  stock_quantity: number;
  nutrition_info?: { label: string; value: string }[];
  storage_tips?: string;
  total_sold?: number;
  created_at?: string;
  updated_at?: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  icon_url: string;
  color_hex: string;
}

export const productApi = {
  async getProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_active', true);
    
    if (error) throw error;
    return data as Product[];
  },

  async getProductById(id: string) {
    const { data, error } = await supabase
      .from('products')
      .select('*, categories(*)')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async getTrendingProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('total_sold', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data as Product[];
  },

  async getCategories() {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('is_active', true)
      .order('display_order');
    
    if (error) throw error;
    return data as Category[];
  }
};
