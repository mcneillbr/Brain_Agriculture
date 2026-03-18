-- Verify brain_agriculture:006_insert_initial_data on pg

BEGIN;

-- ============================================================
-- Verify Seed Data — Brain Agriculture
-- ============================================================ 
SELECT COUNT(*) AS total_harvests 
FROM harvests 
WHERE id::text LIKE 'a1000000-0000-4000-8000-%';

SELECT COUNT(*) AS total_producers 
FROM producers 
WHERE id::text LIKE 'b1000000-0000-4000-8000-%';

SELECT COUNT(*) AS total_farms 
FROM farms 
WHERE id::text LIKE 'c1000000-0000-4000-8000-%';

SELECT COUNT(*) AS total_crops 
FROM crops 
WHERE id::text LIKE 'd1000000-0000-4000-8000-%';

ROLLBACK;
