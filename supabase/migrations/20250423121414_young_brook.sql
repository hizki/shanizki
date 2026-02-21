/*
  # Create processes table and update products table

  1. New Tables
    - `processes`
      - `id` (uuid, primary key)
      - `name` (text, unique)
      - `description` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Changes to existing tables
    - Update products table to use a junction table for processes
    - Remove the processes array column

  3. Security
    - Enable RLS on processes table
    - Add policies for public read access
*/

-- Create processes table
CREATE TABLE IF NOT EXISTS processes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create junction table for products and processes
CREATE TABLE IF NOT EXISTS product_processes (
  product_id uuid REFERENCES products(id) ON DELETE CASCADE,
  process_id uuid REFERENCES processes(id) ON DELETE CASCADE,
  PRIMARY KEY (product_id, process_id)
);

-- Copy existing processes data to the new table
DO $$
DECLARE
  product_record RECORD;
  process_name text;
  process_id uuid;
BEGIN
  FOR product_record IN SELECT id, processes FROM products WHERE processes IS NOT NULL LOOP
    FOREACH process_name IN ARRAY product_record.processes LOOP
      -- Insert process if it doesn't exist
      INSERT INTO processes (name, description)
      VALUES (process_name, 'תיאור יתווסף בקרוב')
      ON CONFLICT (name) DO NOTHING
      RETURNING id INTO process_id;

      -- If process_id is null (meaning it already existed), get its id
      IF process_id IS NULL THEN
        SELECT id INTO process_id FROM processes WHERE name = process_name;
      END IF;

      -- Create the relationship in the junction table
      INSERT INTO product_processes (product_id, process_id)
      VALUES (product_record.id, process_id)
      ON CONFLICT DO NOTHING;
    END LOOP;
  END LOOP;
END $$;

-- Remove the old processes column
ALTER TABLE products DROP COLUMN IF EXISTS processes;

-- Enable RLS on new tables
ALTER TABLE processes ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_processes ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Processes are viewable by everyone"
  ON processes FOR SELECT
  TO public
  USING (true);

CREATE POLICY "Product processes are viewable by everyone"
  ON product_processes FOR SELECT
  TO public
  USING (true);

-- Create updated_at trigger for processes
CREATE TRIGGER processes_updated_at
  BEFORE UPDATE ON processes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at();