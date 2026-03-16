-- Revert brain_agriculture:002_create_table_producers from pg

BEGIN;

DROP TABLE producers;

COMMIT;