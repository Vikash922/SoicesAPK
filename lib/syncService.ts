import { supabase } from './supabase';
import { CartItem } from '@/store/useCartStore';

export const syncService = {
  /**
   * Syncs local cart items to Supabase.
   * Creates a cart for the user if it doesn't exist, then merges items.
   */
  async syncCart(userId: string, localItems: CartItem[]) {
    if (localItems.length === 0) return;

    // 1. Get or Create Cart
    let { data: cart, error: cartError } = await supabase
      .from('carts')
      .select('id')
      .eq('user_id', userId)
      .single();

    if (cartError && cartError.code === 'PGRST116') {
      const { data: newCart, error: createError } = await supabase
        .from('carts')
        .insert({ user_id: userId })
        .select()
        .single();
      if (createError) throw createError;
      cart = newCart;
    } else if (cartError) {
      throw cartError;
    }

    if (!cart) return;

    // 2. Upsert Items
    // In a production app, we'd handle variant_id properly. 
    // Here we map store 'id' to 'product_id'.
    const cartItems = localItems.map(item => ({
      cart_id: cart.id,
      product_id: item.id,
      quantity: item.qty,
      price_at_addition: item.price
    }));

    const { error: upsertError } = await supabase
      .from('cart_items')
      .upsert(cartItems, { onConflict: 'cart_id,product_id' });

    if (upsertError) throw upsertError;
  },

  /**
   * Syncs local wishlist to Supabase.
   */
  async syncWishlist(userId: string, localItems: any[]) {
    if (localItems.length === 0) return;

    const wishlistItems = localItems.map(item => ({
      user_id: userId,
      product_id: item.id
    }));

    const { error: upsertError } = await supabase
      .from('wishlists')
      .upsert(wishlistItems, { onConflict: 'user_id,product_id' });

    if (upsertError) throw upsertError;
  },

  /**
   * Fetches cart from Supabase and returns formatted items.
   */
  async fetchCloudCart(userId: string) {
    const { data: cartItems, error } = await supabase
      .from('carts')
      .select(`
        id,
        cart_items (
          product_id,
          quantity,
          price_at_addition,
          products (
            name,
            images
          )
        )
      `)
      .eq('user_id', userId)
      .single();

    if (error) {
      if (error.code === 'PGRST116') return [];
      throw error;
    }

    return (cartItems as any).cart_items.map((item: any) => ({
      id: item.product_id,
      name: item.products.name,
      image: item.products.images[0],
      price: item.price_at_addition,
      qty: item.quantity
    }));
  },

  /**
   * Fetches wishlist from Supabase.
   */
  async fetchCloudWishlist(userId: string) {
    const { data: wishlistItems, error } = await supabase
      .from('wishlists')
      .select(`
        product_id,
        products (
          name,
          images,
          avg_rating,
          product_variants (
            selling_price
          )
        )
      `)
      .eq('user_id', userId);

    if (error) throw error;

    return (wishlistItems || []).map((item: any) => ({
      id: item.products.id,
      name: item.products.name,
      image: item.products.images?.[0] || item.products.image,
      price: item.products.product_variants?.[0]?.selling_price || item.products.price || 0,
      rating: item.products.avg_rating || 0
    }));

  }
};