import { supabase } from '@/lib/supabase';
import { Platform } from 'react-native';

export interface AdminStats {
  total_revenue: number;
  active_orders: number;
  low_stock: number;
  avg_rating: number;
}

export interface CouponData {
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  product_id?: string | null;
  min_purchase_amount?: number;
  expiry_date?: string;
  usage_limit?: number;
}

export const adminApi = {
  async getAdminStats() {
    const { data, error } = await supabase.rpc('get_admin_stats');
    if (error) throw error;
    return data as AdminStats;
  },

  async getRecentOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*, profiles(full_name)')
      .order('created_at', { ascending: false })
      .limit(10);
    
    if (error) throw error;
    return data;
  },

  // Product Management
  async addProduct(productData: any) {
    const { data, error } = await supabase
      .from('products')
      .insert([productData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async updateProduct(id: string, productData: any) {
    const { data, error } = await supabase
      .from('products')
      .update(productData)
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async toggleProductStock(id: string, isOutOfStock: boolean) {
    const { data, error } = await supabase
      .from('products')
      .update({ is_out_of_stock: isOutOfStock })
      .eq('id', id)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Image Management
  async uploadProductImage(uri: string, fileName: string) {
    try {
      const fileExt = fileName.split('.').pop() || 'jpg';
      const path = `${Date.now()}.${fileExt}`;

      // In React Native, we need to create a proper blob-like object for FormData
      const photo = {
        uri: uri,
        type: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
        name: fileName,
      };

      const formData = new FormData();
      formData.append('file', photo as any);

      const { data, error } = await supabase.storage
        .from('products')
        .upload(path, photo as any, { // Using photo object directly often works better with supabase-js in RN
          contentType: `image/${fileExt === 'jpg' ? 'jpeg' : fileExt}`,
          upsert: true
        });

      if (error) {
        console.error('Supabase storage upload error:', error);
        throw error;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('products')
        .getPublicUrl(data.path);

      return publicUrl;
    } catch (err) {
      console.error('Upload image catch error:', err);
      throw err;
    }
  },

  async deleteProduct(id: string) {
    const { error } = await supabase
      .from('products')
      .delete()
      .eq('id', id);
    
    if (error) {
      console.error('Delete product error:', error);
      throw error;
    }
    return true;
  },

  // Coupon Management
  async createCoupon(couponData: CouponData) {
    const { data, error } = await supabase
      .from('coupons')
      .insert([couponData])
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  async getCoupons() {
    const { data, error } = await supabase
      .from('coupons')
      .select('*, products(name)')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data;
  },

  async deleteCoupon(id: string) {
    const { error } = await supabase
      .from('coupons')
      .delete()
      .eq('id', id);
    
    if (error) throw error;
    return true;
  }
};
