-- Revert brain_agriculture:006_insert_initial_data from pg

BEGIN;

-- ============================================================
-- Revert Seed Data — Brain Agriculture
-- Ordem inversa: crops → farms → producers → harvests
-- ============================================================

DELETE FROM crops     WHERE id::text LIKE 'd1000000-0000-0000-0000-%';
DELETE FROM farms     WHERE id::text LIKE 'c1000000-0000-0000-0000-%';
DELETE FROM producers WHERE id::text LIKE 'b1000000-0000-0000-0000-%';
DELETE FROM harvests  WHERE id::text LIKE 'a1000000-0000-0000-0000-%';

COMMIT;
