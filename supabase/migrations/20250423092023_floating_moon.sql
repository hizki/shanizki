/*
  # Update storage policies for product images

  1. Security
    - Drop existing policies to avoid conflicts
    - Enable storage policies for product-images bucket
    - Add policies for authenticated users to:
      - Upload images
      - Read images
      - Delete images
    
  Note: This ensures that only authenticated users can manage product images
  while still allowing public read access for displaying images
*/

-- Create bucket if it doesn't exist
insert into storage.buckets (id, name, public)
values ('product-images', 'product-images', true)
on conflict (id) do nothing;

-- Enable RLS
alter table storage.objects enable row level security;

-- Drop existing policies if they exist
drop policy if exists "Public can view product images" on storage.objects;
drop policy if exists "Authenticated users can upload product images" on storage.objects;
drop policy if exists "Authenticated users can update own product images" on storage.objects;
drop policy if exists "Authenticated users can delete product images" on storage.objects;

-- Allow public read access to all files
create policy "Public can view product images"
  on storage.objects for select
  using ( bucket_id = 'product-images' );

-- Allow authenticated users to upload files
create policy "Authenticated users can upload product images"
  on storage.objects for insert
  to authenticated
  with check ( bucket_id = 'product-images' );

-- Allow authenticated users to update their own files
create policy "Authenticated users can update own product images"
  on storage.objects for update
  to authenticated
  using ( bucket_id = 'product-images' )
  with check ( bucket_id = 'product-images' );

-- Allow authenticated users to delete files
create policy "Authenticated users can delete product images"
  on storage.objects for delete
  to authenticated
  using ( bucket_id = 'product-images' );