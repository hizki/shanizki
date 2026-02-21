/*
  # Add storage policies for product images

  1. Storage Policies
    - Creates storage bucket 'product-images' if it doesn't exist
    - Enables policies for authenticated users to:
      - Upload images to the products folder
      - Read images from the products folder
      - Update their own uploaded images
      - Delete their own uploaded images

  2. Security
    - Only authenticated users can upload images
    - Public read access for all images
    - Update/delete restricted to image owners
*/

-- Create the storage bucket if it doesn't exist
DO $$
BEGIN
  INSERT INTO storage.buckets (id, name)
  VALUES ('product-images', 'product-images')
  ON CONFLICT (id) DO NOTHING;
END $$;

-- Enable RLS on the bucket
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Policy for public read access to all files in the bucket
CREATE POLICY "Public read access"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'product-images');

-- Policy for authenticated users to upload files
CREATE POLICY "Authenticated users can upload images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'product-images' AND
  (storage.foldername(name))[1] = 'products'
);

-- Policy for authenticated users to update their own files
CREATE POLICY "Users can update own images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid())
WITH CHECK (bucket_id = 'product-images' AND owner = auth.uid());

-- Policy for authenticated users to delete their own files
CREATE POLICY "Users can delete own images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'product-images' AND owner = auth.uid());