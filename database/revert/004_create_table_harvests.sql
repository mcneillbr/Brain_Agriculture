-- Revert brain_agriculture:004_create_table_harvests from pg

BEGIN;

DROP TABLE harvests;

COMMIT;