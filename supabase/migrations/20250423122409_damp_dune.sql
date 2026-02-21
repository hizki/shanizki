/*
  # Update product_processes table RLS policies

  1. Changes
    - Drop existing RLS policies
    - Create a new policy allowing all operations for everyone
    
  2. Security
    - Make all operations public since no authentication is needed
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Product processes are viewable by everyone" ON product_processes;

-- Create a single policy for all operations
CREATE POLICY "Allow all operations on product_processes"
ON product_processes
FOR ALL
TO public
USING (true)
WITH CHECK (true);