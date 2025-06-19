
-- Create manufacturer_partnerships table for storing partnership applications
CREATE TABLE public.manufacturer_partnerships (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  gstin TEXT NOT NULL,
  company_name TEXT NOT NULL,
  representative_name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  address TEXT,
  city TEXT,
  state TEXT,
  country TEXT,
  product_category TEXT,
  years_in_business INTEGER,
  annual_turnover TEXT,
  manufacturing_capacity TEXT,
  export_experience TEXT,
  certifications TEXT,
  previous_deals TEXT,
  target_markets TEXT,
  additional_info TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Add trigger to update the updated_at timestamp
CREATE TRIGGER manufacturer_partnerships_updated_at
  BEFORE UPDATE ON public.manufacturer_partnerships
  FOR EACH ROW
  EXECUTE FUNCTION public.update_timestamp();

-- Enable RLS (Row Level Security)
ALTER TABLE public.manufacturer_partnerships ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to insert (for the partnership form)
CREATE POLICY "Anyone can submit partnership applications" 
  ON public.manufacturer_partnerships 
  FOR INSERT 
  WITH CHECK (true);

-- Create policy to allow admins to view all partnerships
CREATE POLICY "Admins can view all partnership applications" 
  ON public.manufacturer_partnerships 
  FOR SELECT 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );

-- Create policy to allow admins to update partnerships
CREATE POLICY "Admins can update partnership applications" 
  ON public.manufacturer_partnerships 
  FOR UPDATE 
  USING (
    EXISTS (
      SELECT 1 FROM public.profiles 
      WHERE profiles.id = auth.uid() 
      AND profiles.is_admin = true
    )
  );
