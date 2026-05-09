-- Unify Admin Role Check
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  -- Check both app_metadata and raw_app_meta_data for maximum compatibility
  RETURN (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin' OR
    auth.jwt() ->> 'email' IN (SELECT email FROM auth.users WHERE raw_app_meta_data ->> 'role' = 'admin')
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Re-apply Unified Product Policies
DROP POLICY IF EXISTS "Admins have full access on products" ON public.products;
CREATE POLICY "Admins have full access on products" 
ON public.products FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Re-apply Unified Category Policies
DROP POLICY IF EXISTS "Admins have full access on categories" ON public.categories;
CREATE POLICY "Admins have full access on categories" 
ON public.categories FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- Fix Storage Policies (Simplify and unify)
DROP POLICY IF EXISTS "Admin Upload" ON storage.objects;
DROP POLICY IF EXISTS "Admin Update" ON storage.objects;
DROP POLICY IF EXISTS "Admin Delete" ON storage.objects;

CREATE POLICY "Admin Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'products' AND public.is_admin());
CREATE POLICY "Admin Update" ON storage.objects FOR UPDATE USING (bucket_id = 'products' AND public.is_admin());
CREATE POLICY "Admin Delete" ON storage.objects FOR DELETE USING (bucket_id = 'products' AND public.is_admin());

-- Add "Featured" and "Trending" flags to products
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT FALSE;
ALTER TABLE public.products ADD COLUMN IF NOT EXISTS is_trending BOOLEAN DEFAULT FALSE;

-- Create Orders Management for Admin
CREATE POLICY "Admins can view all orders" ON public.orders FOR SELECT TO authenticated USING (public.is_admin());
CREATE POLICY "Admins can update all orders" ON public.orders FOR UPDATE TO authenticated USING (public.is_admin());
