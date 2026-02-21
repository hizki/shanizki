/*
  # Create storage bucket for product images

  1. New Storage Bucket
    - Creates a new public storage bucket named 'product-images' if it doesn't exist
    - Enables public access for product images
  
  2. Security
    - Enables RLS on the bucket
    - Adds policy for authenticated users to upload images
    - Adds policy for public users to view images
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM storage.buckets WHERE id = 'product-images'
  ) THEN
    insert into storage.buckets (id, name, public)
    values ('product-images', 'product-images', true);
  END IF;
END $$;

-- Enable RLS
alter table storage.objects enable row level security;

-- Drop existing policies if they exist
DO $$
BEGIN
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Authenticated users can upload product images'
  ) THEN
    DROP POLICY "Authenticated users can upload product images" ON storage.objects;
  END IF;
  
  IF EXISTS (
    SELECT 1 FROM pg_policies WHERE policyname = 'Product images are viewable by everyone'
  ) THEN
    DROP POLICY "Product images are viewable by everyone" ON storage.objects;
  END IF;
END $$;

-- Allow authenticated users to upload files
create policy "Authenticated users can upload product images"
on storage.objects for insert
to authenticated
with check (
  bucket_id = 'product-images' AND
  (storage.extension(name) = 'jpg' OR
   storage.extension(name) = 'jpeg' OR
   storage.extension(name) = 'png' OR
   storage.extension(name) = 'webp')
);

-- Allow public users to view files
create policy "Product images are viewable by everyone"
on storage.objects for select
to public
using ( bucket_id = 'product-images' );