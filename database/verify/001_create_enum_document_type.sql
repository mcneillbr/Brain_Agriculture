-- Verify brain_agriculture:001_create_enum_document_type on pg

BEGIN;

SELECT 0
FROM pg_type
WHERE typname = 'document_type_enum'
  AND typtype = 'e';

COMMIT;