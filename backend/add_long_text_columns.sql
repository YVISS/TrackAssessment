-- Idempotent script to add `long_text` column to questionnaire tables.
-- Edit the table names below to match your Supabase schema before running.
-- Run in Supabase SQL editor or psql connected to the project.

-- Common candidate table name patterns for each category.
ALTER TABLE IF EXISTS verbal_ability        ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_verbal_ability ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS verbal_ability_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS numerical_ability     ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_numerical_ability ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS numerical_ability_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS science_test          ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_science_test ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS science_test_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS clerical_ability      ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_clerical_ability ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS clerical_ability_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS interpersonal_skills_test ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_interpersonal_skills_test ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS interpersonal_skills_test_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS logical_reasoning    ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_logical_reasoning ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS logical_reasoning_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS entrepreneurship_test ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_entrepreneurship_test ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS entrepreneurship_test_questions ADD COLUMN IF NOT EXISTS long_text text;

ALTER TABLE IF EXISTS mechanical_ability   ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS questionnaire_mechanical_ability ADD COLUMN IF NOT EXISTS long_text text;
ALTER TABLE IF EXISTS mechanical_ability_questions ADD COLUMN IF NOT EXISTS long_text text;

-- If you have other table names, add them here, for example:
-- ALTER TABLE IF EXISTS my_custom_table ADD COLUMN IF NOT EXISTS long_text text;

-- End of script
