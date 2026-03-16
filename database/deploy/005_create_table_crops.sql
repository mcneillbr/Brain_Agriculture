-- Deploy brain_agriculture:005_create_table_crops to pg
-- requires: 003_create_table_farms
-- requires: 004_create_table_harvests

BEGIN;

CREATE TABLE crops (
  id         uuid         PRIMARY KEY DEFAULT gen_random_uuid(),
  farm_id    uuid         NOT NULL REFERENCES farms (id) ON DELETE CASCADE,
  harvest_id uuid         NOT NULL REFERENCES harvests (id) ON DELETE RESTRICT,
  name       varchar(100) NOT NULL,
  created_at timestamp    NOT NULL DEFAULT now(),

  CONSTRAINT uq_crop_farm_harvest_name UNIQUE (farm_id, harvest_id, name),
  CONSTRAINT chk_crops_name_valid CHECK (
    name IN (
      'Soja', 'Milho', 'Algodão', 'Café', 'Cana-de-açúcar',
      'Trigo', 'Arroz', 'Feijão', 'Sorgo', 'Girassol'
    )
  )
);

CREATE INDEX idx_crops_farm_id    ON crops (farm_id);
CREATE INDEX idx_crops_harvest_id ON crops (harvest_id);
CREATE INDEX idx_crops_name       ON crops (name);

COMMENT ON TABLE  crops      IS 'Culturas plantadas por fazenda e safra';
COMMENT ON COLUMN crops.name IS 'Nome da cultura (Soja, Milho, Café, etc.)';

COMMIT;