/*
  # Fix processes table RLS policies

  1. Changes
    - Drop existing RLS policies
    - Create a new policy allowing all operations for everyone
    
  2. Security
    - Make all operations public since no authentication is needed
*/

-- Drop existing policies
DROP POLICY IF EXISTS "Processes are viewable by everyone" ON processes;
DROP POLICY IF EXISTS "Authenticated users can manage processes" ON processes;

-- Create a single policy for all operations
CREATE POLICY "Allow all operations on processes"
ON processes
FOR ALL
TO public
USING (true)
WITH CHECK (true);