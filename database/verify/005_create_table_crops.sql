-- Verify brain_agriculture:005_create_table_crops on pg

BEGIN;

SELECT id, farm_id, harvest_id, name, created_at
FROM crops
WHERE false;

COMMIT;