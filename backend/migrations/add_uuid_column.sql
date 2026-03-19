-- Migration: add uuid column (text) to Table_Questions
-- Adds a `uuid` column, backfills existing rows, creates a unique index,
-- and sets a default using gen_random_uuid() cast to text.

-- Ensure pgcrypto (gen_random_uuid) is available
CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE public.Table_Questions
  ADD COLUMN IF NOT EXISTS uuid text;

-- Backfill existing rows with generated UUIDs (as text)
UPDATE public.Table_Questions
SET uuid = gen_random_uuid()::text
WHERE uuid IS NULL;

-- Add unique index to enforce uniqueness
CREATE UNIQUE INDEX IF NOT EXISTS table_questions_uuid_idx ON public.Table_Questions(uuid);

-- Set default for future inserts
ALTER TABLE public.Table_Questions
  ALTER COLUMN uuid SET DEFAULT gen_random_uuid()::text;

-- NOTE: Keeping `id` bigserial as primary key to avoid breaking existing relations.
