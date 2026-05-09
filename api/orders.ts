import { supabase } from '@/lib/supabase';

export interface Order {
  id: string;
  user_id: string;
  order_number: string;
  status: 'pending' | 'confirmed' | 'packed' | 'out_for_delivery' | 'delivered' | 'cancelled';
  total_amount: number;
  items_count: number;
  created_at: string;
  delivery_eta?: string;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  quantity: number;
  unit_price: number;
  total_price: number;
}

export interface OrderTracking {
  orderId: string;
  status: string;
  etaMinutes: number;
  storeLocation: { latitude: number; longitude: number };
  destinationLocation: { latitude: number; longitude: number };
  riderLocation: { latitude: number; longitude: number };
  timeline: Array<{ id: string; at: string | null; done: boolean }>;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'http://localhost:3001';

export const orderApi = {
  async getOrders() {
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) throw error;
    return data as Order[];
  },

  async getOrderById(id: string) {
    const { data, error } = await supabase
      .from('orders')
      .select('*, order_items(*, products(*))')
      .eq('id', id)
      .single();
    
    if (error) throw error;
    return data;
  },

  async createOrder(orderData: Omit<Order, 'id' | 'created_at' | 'order_number'>, items: { product_id: string, quantity: number, price: number }[]) {
    const orderNumber = `SPC-${Math.floor(1000 + Math.random() * 9000)}`;
    
    // 1. Create the order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        ...orderData,
        order_number: orderNumber,
        status: 'pending',
      })
      .select()
      .single();
    
    if (orderError) throw orderError;

    // 2. Create order items
    const orderItems = items.map(item => ({
      order_id: order.id,
      product_id: item.product_id,
      quantity: item.quantity,
      unit_price: item.price,
      total_price: item.price * item.quantity
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItems);
    
    if (itemsError) throw itemsError;

    return order;
  },

  async getOrderTracking(id: string): Promise<OrderTracking | null> {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 1500);
    try {
      const response = await fetch(`${API_BASE_URL}/v1/orders/${id}/tracking`, {
        signal: controller.signal,
      });
      if (!response.ok) return null;
      return await response.json();
    } catch {
      return null;
    } finally {
      clearTimeout(timeout);
    }
  }
};
