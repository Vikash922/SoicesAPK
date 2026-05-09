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
  is_out_of_stock?: boolean;
  is_active?: boolean;
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

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  comment: string;
  images: string[];
  created_at: string;
  profiles?: { full_name: string; avatar_url: string };
}

export interface CommunityRecipe {
  id: string;
  product_id: string;
  user_id: string;
  title: string;
  description: string;
  image_url: string;
  created_at: string;
  profiles?: { full_name: string; avatar_url: string };
}

export const productApi = {
  // ... existing functions ...
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
      .or('is_trending.eq.true,total_sold.gt.10')
      .order('total_sold', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data as Product[];
  },

  async getFeaturedProducts() {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('is_featured', true)
      .limit(5);
    
    if (error) throw error;
    return data as Product[];
  },

  async searchProducts(query: string, filters?: any) {
    let q = supabase.from('products').select('*').ilike('name', `%${query}%`);
    
    if (filters?.category) {
      q = q.eq('category_id', filters.category);
    }
    if (filters?.minPrice) {
      q = q.gte('price', filters.minPrice);
    }
    if (filters?.maxPrice) {
      q = q.lte('price', filters.maxPrice);
    }
    
    const { data, error } = await q;
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
  },

  async getReviews(productId: string) {
    const { data, error } = await supabase
      .from('reviews')
      .select('*, profiles(full_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Review[];
  },

  async getCommunityRecipes(productId: string) {
    const { data, error } = await supabase
      .from('community_recipes')
      .select('*, profiles(full_name, avatar_url)')
      .eq('product_id', productId)
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as CommunityRecipe[];
  }
};
