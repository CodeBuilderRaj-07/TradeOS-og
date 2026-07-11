DO $$
BEGIN
  IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='trades' AND column_name='quantity') THEN
    ALTER TABLE trades ALTER COLUMN quantity DROP NOT NULL;
  END IF;
END $$;
