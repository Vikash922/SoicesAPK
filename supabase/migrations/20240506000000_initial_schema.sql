-- Create profiles table
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  full_name TEXT,
  avatar_url TEXT,
  phone TEXT,
  spice_points INTEGER DEFAULT 0,
  membership_tier TEXT DEFAULT 'SPICE SEEKER',
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own profile" ON public.profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON public.profiles
  FOR UPDATE USING (auth.uid() = id);

-- Trigger to create profile on signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (new.id, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE OR REPLACE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create categories table
CREATE TABLE IF NOT EXISTS public.categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  icon_url TEXT,
  color_hex TEXT,
  display_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (TRUE);

-- Create products table
CREATE TABLE IF NOT EXISTS public.products (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  description TEXT,
  short_description TEXT,
  category_id UUID REFERENCES public.categories(id),
  spice_heat_level INTEGER DEFAULT 0,
  is_organic BOOLEAN DEFAULT FALSE,
  is_premium BOOLEAN DEFAULT FALSE,
  avg_rating DECIMAL DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  origin_country TEXT,
  region TEXT,
  images TEXT[] DEFAULT '{}',
  total_sold INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Products are viewable by everyone" ON public.products FOR SELECT USING (TRUE);

-- Create product variants table
CREATE TABLE IF NOT EXISTS public.product_variants (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  weight_value DECIMAL,
  weight_unit TEXT,
  selling_price DECIMAL NOT NULL,
  stock_quantity INTEGER DEFAULT 0,
  is_default BOOLEAN DEFAULT FALSE
);

ALTER TABLE public.product_variants ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Product variants are viewable by everyone" ON public.product_variants FOR SELECT USING (TRUE);

-- Create carts and cart_items
CREATE TABLE IF NOT EXISTS public.carts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

ALTER TABLE public.carts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cart" ON public.carts USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.cart_items (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  cart_id UUID REFERENCES public.carts(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  quantity INTEGER DEFAULT 1,
  price_at_addition DECIMAL,
  UNIQUE(cart_id, product_id)
);

ALTER TABLE public.cart_items ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own cart items" ON public.cart_items
  USING (EXISTS (SELECT 1 FROM public.carts WHERE id = cart_items.cart_id AND user_id = auth.uid()));

-- Create wishlists
CREATE TABLE IF NOT EXISTS public.wishlists (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  product_id UUID REFERENCES public.products(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Users can manage their own wishlist" ON public.wishlists USING (auth.uid() = user_id);
