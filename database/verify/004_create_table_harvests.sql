-- Verify brain_agriculture:004_create_table_harvests on pg

BEGIN;

SELECT id, name, year, created_at
FROM harvests
WHERE false;

COMMIT;