-- Verify brain_agriculture:002_create_table_producers on pg

BEGIN;

SELECT id, name, document, document_type, created_at, updated_at
FROM producers
WHERE false;

COMMIT;