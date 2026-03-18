-- Revert brain_agriculture:006_insert_initial_data from pg

BEGIN;

-- ============================================================
-- Revert Seed Data — Brain Agriculture
-- Ordem inversa: crops → farms → producers → harvests
-- ============================================================

truncate table crops cascade;
truncate table farms cascade;
truncate table producers cascade;
truncate table harvests cascade;

COMMIT;
