/*
  # Add further reading links to processes table

  1. Changes
    - Add further_reading_links column to processes table
    - Column will store an array of objects with title and url
*/

ALTER TABLE processes ADD COLUMN IF NOT EXISTS further_reading_links jsonb[];