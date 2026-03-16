-- Revert brain_agriculture:005_create_table_crops from pg

BEGIN;

DROP TABLE crops;

COMMIT;