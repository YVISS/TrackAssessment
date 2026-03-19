-- Fix sequence for Table_Questions id column
-- Run in Supabase SQL editor

-- 1) Show current sequence (if any)
SELECT pg_get_serial_sequence('public.Table_Questions', 'id') AS sequence_name;

-- 2) Set the sequence to max(id)+1 so future inserts don't conflict
SELECT setval(
  pg_get_serial_sequence('public.Table_Questions','id'),
  COALESCE((SELECT MAX(id) FROM public.Table_Questions), 0) + 1,
  false
);
