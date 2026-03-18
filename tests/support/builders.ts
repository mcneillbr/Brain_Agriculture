/**
 * Shared domain entity builders for tests.
 *
 * Use these helpers when the test needs *any* valid entity and the specific
 * field values are irrelevant to what is being tested.  Override individual
 * fields via the `options` argument when the test cares about a specific
 * value.
 */
import { Farm } from '../../src/domain/entities/farm.entity'
import { Harvest } from '../../src/domain/entities/harvest.entity'
import { Producer } from '../../src/domain/entities/producer.entity'

// ─── Constants ────────────────────────────────────────────────────────────────

/** Valid CPF used as default test document for individual producers. */
export const VALID_CPF = '52998224725'

/** Valid CNPJ used as default test document for legal-entity producers. */
export const VALID_CNPJ = '11444777000161'

// ─── Builders ─────────────────────────────────────────────────────────────────

interface MakeProducerOptions {
  id?: string
  name?: string
  document?: string
}

export function makeProducer(options: MakeProducerOptions = {}): Producer {
  return Producer.create({
    name: options.name ?? 'Ana Silva',
    document: options.document ?? VALID_CPF,
    ...(options.id !== undefined ? { id: options.id } : {}),
  })
}

interface MakeFarmOptions {
  id?: string
  producerId?: string
  name?: string
  city?: string
  state?: string
  totalArea?: number
  arableArea?: number
  vegetationArea?: number
}

export function makeFarm(options: MakeFarmOptions = {}): Farm {
  return Farm.create({
    producerId: options.producerId ?? 'producer-default-id',
    name: options.name ?? 'Fazenda Esperanca',
    city: options.city ?? 'Ribeirao Preto',
    state: options.state ?? 'SP',
    totalArea: options.totalArea ?? 500,
    arableArea: options.arableArea ?? 300,
    vegetationArea: options.vegetationArea ?? 150,
    ...(options.id !== undefined ? { id: options.id } : {}),
  })
}

interface MakeHarvestOptions {
  id?: string
  name?: string
  year?: number
}

export function makeHarvest(options: MakeHarvestOptions = {}): Harvest {
  return Harvest.create({
    name: options.name ?? 'Safra 2024',
    year: options.year ?? 2024,
    ...(options.id !== undefined ? { id: options.id } : {}),
  })
}
