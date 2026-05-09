-- Create orders table
CREATE TABLE IF NOT EXISTS public.orders (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  order_number TEXT UNIQUE NOT NULL,
  status TEXT DEFAULT 'pending',
  total_amount DECIMAL NOT NULL,
  items_count INTEGER DEFAULT 0,
  delivery_eta TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own orders" ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create their own orders" ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create order items table
CREATE TABLE IF NOT EXISTS public.order_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id UUID REFERENCES public.orders(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  unit_price DECIMAL NOT NULL,
  total_price DECIMAL NOT NULL
);

ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can view their own order items" ON public.order_items
  FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = order_items.order_id AND user_id = auth.uid()));

-- Create reviews table
CREATE TABLE IF NOT EXISTS public.reviews (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  comment TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Reviews are viewable by everyone" ON public.reviews FOR SELECT USING (TRUE);
CREATE POLICY "Users can create reviews for products they bought" ON public.reviews
  FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create community recipes table
CREATE TABLE IF NOT EXISTS public.community_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.community_recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipes are viewable by everyone" ON public.community_recipes FOR SELECT USING (TRUE);
CREATE POLICY "Users can create their own recipes" ON public.community_recipes FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Create Admin stats function
CREATE OR REPLACE FUNCTION public.get_admin_stats()
RETURNS JSON AS $$
DECLARE
  total_revenue DECIMAL;
  active_orders_count INTEGER;
  low_stock_count INTEGER;
  avg_rating DECIMAL;
BEGIN
  SELECT SUM(total_amount) INTO total_revenue FROM public.orders WHERE status != 'cancelled';
  SELECT COUNT(*) INTO active_orders_count FROM public.orders WHERE status IN ('pending', 'confirmed', 'packed', 'out_for_delivery');
  SELECT COUNT(*) INTO low_stock_count FROM public.product_variants WHERE stock_quantity < 10;
  SELECT AVG(avg_rating) INTO avg_rating FROM public.products;
  
  RETURN json_build_object(
    'total_revenue', COALESCE(total_revenue, 0),
    'active_orders', active_orders_count,
    'low_stock', low_stock_count,
    'avg_rating', ROUND(COALESCE(avg_rating, 0), 1)
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
