DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='strategies' AND column_name='user_id') THEN
    ALTER TABLE strategies ALTER COLUMN user_id DROP NOT NULL;
  END IF;
END $$;
