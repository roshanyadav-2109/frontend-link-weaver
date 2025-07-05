
-- Create catalog_requests table
CREATE TABLE public.catalog_requests (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users,
  product_category TEXT NOT NULL,
  company_name TEXT,
  contact_person TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  requirements TEXT,
  quantity_range TEXT,
  budget_range TEXT,
  timeline TEXT,
  status TEXT NOT NULL DEFAULT 'pending',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create contact_submissions table
CREATE TABLE public.contact_submissions (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT NOT NULL,
  subject TEXT NOT NULL,
  message TEXT NOT NULL,
  company_name TEXT,
  preferred_contact TEXT,
  status TEXT NOT NULL DEFAULT 'new',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Update career applications table to match requirements
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS current_location TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS education TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS expected_salary TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS notice_period TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS linkedin_profile TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS portfolio_url TEXT;
ALTER TABLE public.job_applications ADD COLUMN IF NOT EXISTS skills TEXT[];

-- Enable RLS on new tables
ALTER TABLE public.catalog_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.contact_submissions ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for catalog_requests
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

-- Create RLS policies for contact_submissions
CREATE POLICY "Anyone can insert contact submissions" 
  ON public.contact_submissions 
  FOR INSERT 
  WITH CHECK (true);

CREATE POLICY "Admins can view all contact submissions" 
  ON public.contact_submissions 
  FOR SELECT 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

CREATE POLICY "Admins can update contact submissions" 
  ON public.contact_submissions 
  FOR UPDATE 
  USING (EXISTS (
    SELECT 1 FROM profiles 
    WHERE profiles.id = auth.uid() 
    AND profiles.is_admin = true
  ));

-- Add triggers for updated_at
CREATE TRIGGER update_catalog_requests_updated_at
  BEFORE UPDATE ON public.catalog_requests
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

CREATE TRIGGER update_contact_submissions_updated_at
  BEFORE UPDATE ON public.contact_submissions
  FOR EACH ROW EXECUTE FUNCTION update_timestamp();

-- Create storage bucket for resumes
INSERT INTO storage.buckets (id, name, public) VALUES ('resumes', 'resumes', false);

-- Create storage policies for resumes
CREATE POLICY "Anyone can upload resumes"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'resumes');

CREATE POLICY "Admins can view resumes"
ON storage.objects FOR SELECT
USING (bucket_id = 'resumes' AND EXISTS (
  SELECT 1 FROM profiles 
  WHERE profiles.id = auth.uid() 
  AND profiles.is_admin = true
));
