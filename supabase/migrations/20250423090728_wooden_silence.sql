/*
  # Update products table for jar-specific fields

  1. Changes
    - Add new columns for jar-specific information:
      - what_is_it (text)
      - what_to_do (text)
      - processes (text[])
    - Remove unused columns:
      - details

  2. Security
    - Maintain existing RLS policies
*/

DO $$ 
BEGIN
  -- Add new columns if they don't exist
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'what_is_it') THEN
    ALTER TABLE products ADD COLUMN what_is_it text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'what_to_do') THEN
    ALTER TABLE products ADD COLUMN what_to_do text;
  END IF;

  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'processes') THEN
    ALTER TABLE products ADD COLUMN processes text[];
  END IF;

  -- Remove details column if it exists
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'products' AND column_name = 'details') THEN
    ALTER TABLE products DROP COLUMN details;
  END IF;
END $$;