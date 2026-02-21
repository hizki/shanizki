/*
  # Create cat images table and storage

  1. New Tables
    - `cat_images`
      - `id` (uuid, primary key)
      - `url` (text)
      - `thumbnail_url` (text)
      - `order` (integer)
      - `created_at` (timestamp)

  2. Storage
    - Create cat-images bucket for storing cat photos
    - Enable public access for viewing images
    
  3. Security
    - Enable RLS on both table and storage
    - Add policies for public viewing
*/

-- Create cat_images table
CREATE TABLE IF NOT EXISTS cat_images (
  id uuid PRIMARY KEY,
  url text NOT NULL,
  thumbnail_url text NOT NULL,
  "order" integer NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE cat_images ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on cat_images"
ON cat_images
FOR ALL
TO public
USING (true)
WITH CHECK (true);

-- Create storage bucket for cat images
INSERT INTO storage.buckets (id, name, public)
VALUES ('cat-images', 'cat-images', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create storage policies
CREATE POLICY "Allow public viewing of cat images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'cat-images');

CREATE POLICY "Allow all operations on cat images"
ON storage.objects FOR ALL
TO public
USING (bucket_id = 'cat-images')
WITH CHECK (bucket_id = 'cat-images');

-- Create site_settings table for page visibility
CREATE TABLE IF NOT EXISTS site_settings (
  key text PRIMARY KEY,
  value jsonb NOT NULL,
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE site_settings ENABLE ROW LEVEL SECURITY;

-- Create policy for public access
CREATE POLICY "Allow all operations on site_settings"
ON site_settings
FOR ALL
TO public
USING (true)
WITH CHECK (true);