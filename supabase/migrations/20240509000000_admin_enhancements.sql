-- Create coupons table
CREATE TABLE IF NOT EXISTS public.coupons (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL CHECK (discount_type IN ('percentage', 'fixed')),
    discount_value DECIMAL NOT NULL,
    product_id UUID REFERENCES public.products(id) ON DELETE CASCADE, -- If null, applies to all products
    min_purchase_amount DECIMAL DEFAULT 0,
    max_discount_amount DECIMAL,
    expiry_date TIMESTAMP WITH TIME ZONE,
    usage_limit INTEGER,
    used_count INTEGER DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS for coupons
ALTER TABLE public.coupons ENABLE ROW LEVEL SECURITY;

-- Policies for coupons
CREATE POLICY "Coupons are viewable by everyone" ON public.coupons FOR SELECT USING (is_active = TRUE);
CREATE POLICY "Admins can manage coupons" ON public.coupons FOR ALL USING (auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data ->> 'role' = 'admin'));

-- Add stock control to products if not exists
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_out_of_stock BOOLEAN DEFAULT FALSE;

-- Create storage bucket for product images if it doesn't exist
-- Note: This usually needs to be done via Supabase Dashboard or API, 
-- but we can insert into storage.buckets if we have permissions.
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for products bucket
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'products');
CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND (auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data ->> 'role' = 'admin')));
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND (auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data ->> 'role' = 'admin')));
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND (auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data ->> 'role' = 'admin')));
