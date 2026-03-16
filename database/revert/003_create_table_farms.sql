-- Revert brain_agriculture:003_create_table_farms from pg

BEGIN;

DROP TABLE farms;

COMMIT;