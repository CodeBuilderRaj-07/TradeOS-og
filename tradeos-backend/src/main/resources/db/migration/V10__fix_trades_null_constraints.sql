DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades' AND column_name='user_id') THEN
    ALTER TABLE trades ALTER COLUMN user_id DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades' AND column_name='direction') THEN
    ALTER TABLE trades ALTER COLUMN direction DROP NOT NULL;
  END IF;
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades' AND column_name='entry_date') THEN
    ALTER TABLE trades ALTER COLUMN entry_date DROP NOT NULL;
  END IF;
END $$;
