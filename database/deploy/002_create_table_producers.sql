-- Deploy brain_agriculture:002_create_table_producers to pg
-- requires: 001_create_enum_document_type

BEGIN;

CREATE TABLE producers (
  id              uuid            PRIMARY KEY DEFAULT gen_random_uuid(),
  name            varchar(255)    NOT NULL,
  document        varchar(14)     NOT NULL,
  document_type   document_type_enum NOT NULL,
  created_at      timestamp       NOT NULL DEFAULT now(),
  updated_at      timestamp       NOT NULL DEFAULT now(),

  CONSTRAINT uq_producers_document UNIQUE (document),
  CONSTRAINT chk_producers_document_length CHECK (
    (document_type = 'CPF'  AND length(document) = 11) OR
    (document_type = 'CNPJ' AND length(document) = 14)
  ),
  CONSTRAINT chk_producers_document_digits CHECK (document ~ '^\d+$'),
  CONSTRAINT chk_producers_name_length CHECK (length(trim(name)) >= 2)
);

CREATE INDEX idx_producers_document ON producers (document);

COMMENT ON TABLE  producers                 IS 'Produtores rurais cadastrados no sistema';
COMMENT ON COLUMN producers.document        IS 'CPF (11 dígitos) ou CNPJ (14 dígitos), somente números';
COMMENT ON COLUMN producers.document_type   IS 'Tipo do documento: CPF ou CNPJ';

COMMIT;