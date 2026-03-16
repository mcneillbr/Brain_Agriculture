-- Verify brain_agriculture:003_create_table_farms on pg

BEGIN;

SELECT id, producer_id, name, city, state,
       total_area, arable_area, vegetation_area,
       created_at, updated_at
FROM farms
WHERE false;

COMMIT;