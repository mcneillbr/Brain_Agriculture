-- Deploy brain_agriculture:003_create_table_farms to pg
-- requires: 002_create_table_producers

BEGIN;

CREATE TABLE farms (
  id              uuid          PRIMARY KEY DEFAULT gen_random_uuid(),
  producer_id     uuid          NOT NULL REFERENCES producers (id) ON DELETE CASCADE,
  name            varchar(255)  NOT NULL,
  city            varchar(100)  NOT NULL,
  state           char(2)       NOT NULL,
  total_area      float         NOT NULL,
  arable_area     float         NOT NULL DEFAULT 0,
  vegetation_area float         NOT NULL DEFAULT 0,
  created_at      timestamp     NOT NULL DEFAULT now(),
  updated_at      timestamp     NOT NULL DEFAULT now(),

  CONSTRAINT chk_farms_name_length CHECK (length(trim(name)) >= 2),
  CONSTRAINT chk_farms_total_area_positive CHECK (total_area > 0),
  CONSTRAINT chk_farms_arable_area_non_negative CHECK (arable_area >= 0),
  CONSTRAINT chk_farms_vegetation_area_non_negative CHECK (vegetation_area >= 0),
  CONSTRAINT chk_farms_areas_sum CHECK (arable_area + vegetation_area <= total_area),
  CONSTRAINT chk_farms_state_valid CHECK (
    state IN (
      'AC','AL','AM','AP','BA','CE','DF','ES','GO',
      'MA','MG','MS','MT','PA','PB','PE','PI','PR',
      'RJ','RN','RO','RR','RS','SC','SE','SP','TO'
    )
  )
);

CREATE INDEX idx_farms_producer_id ON farms (producer_id);
CREATE INDEX idx_farms_state       ON farms (state);

COMMENT ON TABLE  farms                 IS 'Propriedades rurais vinculadas a produtores';
COMMENT ON COLUMN farms.total_area      IS 'Área total da fazenda em hectares';
COMMENT ON COLUMN farms.arable_area     IS 'Área agricultável em hectares';
COMMENT ON COLUMN farms.vegetation_area IS 'Área de vegetação em hectares';
COMMENT ON COLUMN farms.state           IS 'Sigla do estado brasileiro (UF)';

COMMIT;