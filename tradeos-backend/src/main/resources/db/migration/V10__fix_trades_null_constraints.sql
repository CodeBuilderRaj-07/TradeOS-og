-- Drop NOT NULL from columns that were auto-added by Hibernate but are not set by the entity
ALTER TABLE trades ALTER COLUMN user_id DROP NOT NULL;
ALTER TABLE trades ALTER COLUMN direction DROP NOT NULL;
ALTER TABLE trades ALTER COLUMN entry_date DROP NOT NULL;
