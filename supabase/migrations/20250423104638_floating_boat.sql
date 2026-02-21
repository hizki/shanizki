/*
  # Create assets storage bucket

  1. New Storage Bucket
    - Creates a new public storage bucket named 'assets' for general assets like logos
    - Enables public access for all assets
  
  2. Security
    - Enables RLS on the bucket
    - Adds policy for public access to view assets
    - Adds policy for authenticated users to manage assets
*/

-- Create the assets bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('assets', 'assets', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policy for public read access
CREATE POLICY "Assets are viewable by everyone"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'assets');

-- Create policy for authenticated users to manage assets
CREATE POLICY "Authenticated users can manage assets"
ON storage.objects FOR ALL
TO authenticated
USING (bucket_id = 'assets')
WITH CHECK (bucket_id = 'assets');