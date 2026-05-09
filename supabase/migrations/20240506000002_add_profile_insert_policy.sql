-- Add INSERT policy for profiles
-- This is required for upsert operations from the client
CREATE POLICY "Users can insert their own profile" ON public.profiles
  FOR INSERT WITH CHECK (auth.uid() = id);
