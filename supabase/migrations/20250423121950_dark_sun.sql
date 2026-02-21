/*
  # Fix RLS policies for processes table

  1. Changes
    - Drop existing policies to avoid conflicts
    - Re-enable RLS
    - Add policies for:
      - Public read access
      - Authenticated users can manage processes
*/

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Processes are viewable by everyone" ON processes;
DROP POLICY IF EXISTS "Authenticated users can manage processes" ON processes;

-- Enable Row Level Security
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;

-- Allow public read access
CREATE POLICY "Processes are viewable by everyone" 
  ON processes
  FOR SELECT
  TO public
  USING (true);

-- Allow authenticated users to manage processes
CREATE POLICY "Authenticated users can manage processes"
  ON processes
  FOR ALL
  TO authenticated
  USING (true)
  WITH CHECK (true);