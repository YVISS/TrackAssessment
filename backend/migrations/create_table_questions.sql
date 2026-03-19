-- Create Table_Questions (run only if the table does not yet exist)
-- Adjust types/defaults as needed; run in Supabase SQL editor

CREATE TABLE IF NOT EXISTS public.Table_Questions (
  id bigserial PRIMARY KEY,
  question_id text,
  question text,
  long_text text,
  opt_a text,
  opt_b text,
  opt_c text,
  opt_d text,
  opt_e text,
  answer text,
  created_at timestamptz DEFAULT now() NOT NULL,
  created_by text,
  image_url text
);

CREATE INDEX IF NOT EXISTS idx_table_questions_question_id ON public.Table_Questions (question_id);
CREATE INDEX IF NOT EXISTS idx_table_questions_created_at ON public.Table_Questions (created_at);
