/*
  # Add instructions field to products table

  1. Changes
    - Add new column `instructions` for product usage instructions
    
  2. Security
    - Maintain existing RLS policies
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS instructions text;