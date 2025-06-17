
-- Add apply_link column to careers table
ALTER TABLE public.careers 
ADD COLUMN apply_link TEXT;

-- Ensure RLS is enabled on careers table
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read careers" ON public.careers;
DROP POLICY IF EXISTS "Admin only insert careers" ON public.careers;
DROP POLICY IF EXISTS "Admin only update careers" ON public.careers;
DROP POLICY IF EXISTS "Admin only delete careers" ON public.careers;

-- Create public read policy for careers
CREATE POLICY "Public read careers"
  ON public.careers
  FOR SELECT
  USING (true);

-- Create admin-only policies for INSERT, UPDATE, DELETE
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

-- Ensure RLS is enabled on products table and create admin-only policies
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read products" ON public.products;
DROP POLICY IF EXISTS "Admin only insert products" ON public.products;
DROP POLICY IF EXISTS "Admin only update products" ON public.products;
DROP POLICY IF EXISTS "Admin only delete products" ON public.products;

-- Create public read policy for products
CREATE POLICY "Public read products"
  ON public.products
  FOR SELECT
  USING (true);

-- Create admin-only policies for products
CREATE POLICY "Admin only insert products"
  ON public.products
  FOR INSERT
  WITH CHECK (
    auth.email() = 'anantyaoverseas@gmail.com'
  );

CREATE POLICY "Admin only update products"
  ON public.products
  FOR UPDATE
  USING (
    auth.email() = 'anantyaoverseas@gmail.com'
  );

CREATE POLICY "Admin only delete products"
  ON public.products
  FOR DELETE
  USING (
    auth.email() = 'anantyaoverseas@gmail.com'
  );

-- Insert initial sample data for textiles and electronics categories
INSERT INTO public.products (name, category, subcategory, description, price, status) VALUES
-- Textile Products
('Premium Cotton Shirts', 'textiles', 'cotton', 'High-quality cotton shirts for export, available in various sizes and colors', '$15-25 per piece', 'active'),
('Organic Cotton Fabric', 'textiles', 'cotton', 'GOTS certified organic cotton fabric, 100% pure cotton', '$8-12 per meter', 'active'),
('Cotton Bed Sheets Set', 'textiles', 'home', 'Comfortable cotton bed sheet sets with pillowcases', '$20-35 per set', 'active'),
('Pure Silk Sarees', 'textiles', 'silk', 'Traditional silk sarees with intricate designs', '$50-150 per piece', 'active'),
('Silk Scarves', 'textiles', 'silk', 'Luxurious silk scarves for fashion and accessories', '$25-45 per piece', 'active'),
('Ready-made Kurtas', 'textiles', 'garments', 'Traditional Indian kurtas for men and women', '$18-30 per piece', 'active'),
('Cotton Towel Set', 'textiles', 'home', 'Absorbent cotton towels in various sizes', '$12-20 per set', 'active'),
('Embroidered Table Runners', 'textiles', 'home', 'Decorative table runners with traditional embroidery', '$15-25 per piece', 'active'),

-- Electronic Audio Products
('Bluetooth Headphones', 'electronics', 'consumer', 'Wireless Bluetooth headphones with noise cancellation', '$25-45 per piece', 'active'),
('Portable Speakers', 'electronics', 'consumer', 'Compact portable speakers with excellent sound quality', '$30-60 per piece', 'active'),
('Audio Amplifiers', 'electronics', 'components', 'High-quality audio amplifiers for sound systems', '$80-150 per piece', 'active'),
('Microphone Systems', 'electronics', 'industrial', 'Professional microphone systems for events and studios', '$100-250 per piece', 'active'),
('Audio Cables', 'electronics', 'accessories', 'Premium audio cables and connectors', '$5-15 per piece', 'active'),
('Wireless Earbuds', 'electronics', 'consumer', 'True wireless earbuds with charging case', '$20-40 per piece', 'active'),
('Sound Mixers', 'electronics', 'industrial', 'Professional audio mixing consoles', '$200-500 per piece', 'active'),
('Audio Interfaces', 'electronics', 'components', 'USB audio interfaces for recording and production', '$75-180 per piece', 'active')
ON CONFLICT DO NOTHING;
