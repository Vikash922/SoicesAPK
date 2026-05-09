-- 1. Create the products table or update it if it already exists
create table if not exists public.products (
  id uuid default gen_random_uuid() primary key,
  name text not null,
  price numeric,
  image text,
  slug text unique,
  created_at timestamp with time zone default now()
);

-- Ensure missing columns exist in case the table was created by a different migration
do $$
begin
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='image') then
    alter table public.products add column image text;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='price') then
    alter table public.products add column price numeric;
  end if;
  if not exists (select 1 from information_schema.columns where table_name='products' and column_name='slug') then
    alter table public.products add column slug text unique;
  end if;
end $$;

-- 2. Enable Row Level Security
alter table public.products enable row level security;

-- 3. Create RLS Policies

-- A. Public Read: Anyone can view products
drop policy if exists "Public Read" on public.products;
create policy "Public Read"
on public.products
for select
to anon, authenticated
using (true);

-- B. Admin Insert: Only allow if auth.email() = 'admin@gmail.com'
drop policy if exists "Admin Insert" on public.products;
create policy "Admin Insert"
on public.products
for insert
with check (
  (auth.jwt() ->> 'email') = 'admin@gmail.com'
);

-- C. Admin Delete: Only allow if auth.email() = 'admin@gmail.com'
drop policy if exists "Admin Delete" on public.products;
create policy "Admin Delete"
on public.products
for delete
using (
  (auth.jwt() ->> 'email') = 'admin@gmail.com'
);

-- 4. Enable Real-Time for the products table
-- Check if the publication exists first, then add the table
do $$
begin
  if not exists (select 1 from pg_publication where pubname = 'supabase_realtime') then
    create publication supabase_realtime;
  end if;
  
  -- Adding table to publication
  alter publication supabase_realtime add table public.products;
exception
  when others then
    -- If table is already in the publication, just continue
    null;
end $$;
