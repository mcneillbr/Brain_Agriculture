-- Deploy brain_agriculture:001_create_enum_document_type to pg
-- requires: none

BEGIN;

CREATE TYPE document_type_enum AS ENUM ('CPF', 'CNPJ');

COMMIT;