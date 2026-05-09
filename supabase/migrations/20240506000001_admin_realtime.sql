-- 1. Create a function to check for Admin role
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS boolean AS $$
BEGIN
  RETURN (
    auth.jwt() -> 'app_metadata' ->> 'role' = 'admin'
  );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 2. Update Products RLS Policies
DROP POLICY IF EXISTS "Products are viewable by everyone" ON public.products;
DROP POLICY IF EXISTS "Allow admin full access on products" ON public.products;

-- Everyone can view products
CREATE POLICY "Products are viewable by everyone" 
ON public.products FOR SELECT 
USING (TRUE);

-- Only Admins can modify products (Insert, Update, Delete)
CREATE POLICY "Admins have full access on products" 
ON public.products FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

-- 3. Enable Realtime for Products table
-- Note: You might need to add the table to the 'supabase_realtime' publication
ALTER TABLE public.products REPLICA IDENTITY FULL;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' 
    AND schemaname = 'public' 
    AND tablename = 'products'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.products;
  END IF;
EXCEPTION
  WHEN undefined_object THEN
    -- If publication doesn't exist, create it
    CREATE PUBLICATION supabase_realtime FOR TABLE public.products;
END;
$$;

-- 4. Similar for Categories
DROP POLICY IF EXISTS "Categories are viewable by everyone" ON public.categories;
CREATE POLICY "Categories are viewable by everyone" ON public.categories FOR SELECT USING (TRUE);

CREATE POLICY "Admins have full access on categories" 
ON public.categories FOR ALL 
TO authenticated
USING (public.is_admin())
WITH CHECK (public.is_admin());

ALTER TABLE public.categories REPLICA IDENTITY FULL;
ALTER PUBLICATION supabase_realtime ADD TABLE public.categories;
