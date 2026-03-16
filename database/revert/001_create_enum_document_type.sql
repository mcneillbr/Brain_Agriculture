-- Revert brain_agriculture:001_create_enum_document_type from pg

BEGIN;

DROP TYPE document_type_enum;

COMMIT;