
-- Drop the existing public policies that allow anyone to modify careers
DROP POLICY IF EXISTS "Public insert careers" ON public.careers;
DROP POLICY IF EXISTS "Public update careers" ON public.careers;
DROP POLICY IF EXISTS "Public delete careers" ON public.careers;

-- Keep public read access for job listings
-- The "Public read careers" policy should remain as is

-- Create admin-only policies for INSERT, UPDATE, DELETE
-- Only users with the admin email can modify careers
CREATE POLICY "Admin only insert careers"
  ON public.careers
  FOR INSERT
  WITH CHECK (
    auth.email() = 'anantyaoverseas@gmail.com'
  );

CREATE POLICY "Admin only update careers"
  ON public.careers
  FOR UPDATE
  USING (
    auth.email() = 'anantyaoverseas@gmail.com'
  );

CREATE POLICY "Admin only delete careers"
  ON public.careers
  FOR DELETE
  USING (
    auth.email() = 'anantyaoverseas@gmail.com'
  );
