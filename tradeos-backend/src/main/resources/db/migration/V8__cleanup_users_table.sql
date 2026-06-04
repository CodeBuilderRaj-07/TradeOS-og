-- Remove orphaned columns added by previous Hibernate ddl-auto=update runs
ALTER TABLE users DROP COLUMN IF EXISTS username;
ALTER TABLE users DROP COLUMN IF EXISTS hashed_password;
