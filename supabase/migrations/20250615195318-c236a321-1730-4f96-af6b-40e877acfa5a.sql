
-- Create table for careers (job openings)
CREATE TABLE public.careers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  department text NOT NULL,
  location text NOT NULL,
  type text NOT NULL,
  description text NOT NULL,
  status text NOT NULL DEFAULT 'active',
  created_at timestamp with time zone DEFAULT now(),
  updated_at timestamp with time zone DEFAULT now()
);

-- Enable real-time updates
ALTER TABLE public.careers REPLICA IDENTITY FULL;

-- Enable Row Level Security for future-proofing, but start with open policies
ALTER TABLE public.careers ENABLE ROW LEVEL SECURITY;

-- Public read for the careers table (let everyone see job openings)
CREATE POLICY "Public read careers"
  ON public.careers
  FOR SELECT
  USING (true);

-- Admin insert/update/delete for job postings (for simplicity: anyone can add/edit/delete; add tighter policies later)
CREATE POLICY "Public insert careers"
  ON public.careers
  FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Public update careers"
  ON public.careers
  FOR UPDATE
  USING (true);

CREATE POLICY "Public delete careers"
  ON public.careers
  FOR DELETE
  USING (true);

-- Add the table to the realtime publication
ALTER PUBLICATION supabase_realtime ADD TABLE public.careers;
