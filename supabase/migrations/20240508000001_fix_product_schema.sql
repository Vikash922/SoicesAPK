-- Add missing columns to products table to align with API and Demo expectations
ALTER TABLE public.products 
ADD COLUMN IF NOT EXISTS image TEXT,
ADD COLUMN IF NOT EXISTS price DECIMAL;

-- Make slug optional to allow simple product creation
ALTER TABLE public.products ALTER COLUMN slug DROP NOT NULL;
