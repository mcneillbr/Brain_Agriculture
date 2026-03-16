-- Deploy brain_agriculture:004_create_table_harvests to pg
-- requires: 003_create_table_farms

BEGIN;

CREATE TABLE harvests (
  id         uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  name       varchar(100) NOT NULL,
  year       integer      NOT NULL,
  created_at timestamp    NOT NULL DEFAULT now(),

  CONSTRAINT uq_harvests_year  UNIQUE (year),
  CONSTRAINT chk_harvests_year CHECK (year BETWEEN 1900 AND 2100),
  CONSTRAINT chk_harvests_name_length CHECK (length(trim(name)) >= 2)
);

CREATE INDEX idx_harvests_year ON harvests (year);

COMMENT ON TABLE  harvests      IS 'Safras disponíveis para registro de culturas';
COMMENT ON COLUMN harvests.year IS 'Ano da safra (ex: 2024)';
COMMENT ON COLUMN harvests.name IS 'Nome descritivo (ex: Safra 2024)';

COMMIT;