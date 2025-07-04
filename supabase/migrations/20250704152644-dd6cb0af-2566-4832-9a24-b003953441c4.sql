
-- Create catalog_requests table
CREATE TABLE public.catalog_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  company TEXT,
  product_category TEXT NOT NULL,
  specific_products TEXT,
  business_type TEXT,
  additional_requirements TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.catalog_requests ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can insert their own catalog requests" 
  ON public.catalog_requests 
  FOR INSERT 
  WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

CREATE POLICY "Users can view their own catalog requests" 
  ON public.catalog_requests 
  FOR SELECT 
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all catalog requests" 
  ON public.catalog_requests 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

CREATE POLICY "Admins can update catalog requests" 
  ON public.catalog_requests 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

-- Add trigger for updated_at
CREATE TRIGGER update_catalog_requests_updated_at
  BEFORE UPDATE ON public.catalog_requests
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();
