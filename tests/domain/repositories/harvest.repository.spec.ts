import { Harvest } from '../../../src/domain/entities/harvest.entity'
import {
  IHarvestRepository,
  HARVEST_REPOSITORY,
} from '../../../src/domain/repositories/harvest.repository'

class InMemoryHarvestRepository implements IHarvestRepository {
  private readonly store = new Map<string, Harvest>()

  async findById(id: string): Promise<Harvest | null> {
    return this.store.get(id) ?? null
  }

  async findByYear(year: number): Promise<Harvest | null> {
    for (const harvest of this.store.values()) {
      if (harvest.year === year) return harvest
    }
    return null
  }

  async findAll(): Promise<Harvest[]> {
    return [...this.store.values()]
  }

  async save(harvest: Harvest): Promise<void> {
    this.store.set(harvest.id, harvest)
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id)
  }

  async existsByYear(year: number, excludeId?: string): Promise<boolean> {
    for (const harvest of this.store.values()) {
      if (harvest.year === year && harvest.id !== excludeId) return true
    }
    return false
  }
}

describe('IHarvestRepository contract', () => {
  let repository: IHarvestRepository

  beforeEach(() => {
    repository = new InMemoryHarvestRepository()
  })

  it('exposes injection token as symbol', () => {
    expect(typeof HARVEST_REPOSITORY).toBe('symbol')
  })

  it('saves and finds by id', async () => {
    const harvest = Harvest.create({ name: 'Safra 2024', year: 2024 })
    await repository.save(harvest)

    await expect(repository.findById(harvest.id)).resolves.toBe(harvest)
  })

  it('finds by year and lists all', async () => {
    const a = Harvest.create({ name: 'Safra 2024', year: 2024 })
    const b = Harvest.create({ name: 'Safra 2025', year: 2025 })
    await repository.save(a)
    await repository.save(b)

    await expect(repository.findByYear(2024)).resolves.toBe(a)
    await expect(repository.findAll()).resolves.toHaveLength(2)
  })

  it('deletes harvest by id', async () => {
    const harvest = Harvest.create({ name: 'Safra 2024', year: 2024 })
    await repository.save(harvest)

    await repository.delete(harvest.id)

    await expect(repository.findById(harvest.id)).resolves.toBeNull()
  })

  it('checks existsByYear with optional excludeId', async () => {
    const harvest = Harvest.create({ name: 'Safra 2024', year: 2024 })
    await repository.save(harvest)

    await expect(repository.existsByYear(2024)).resolves.toBe(true)
    await expect(repository.existsByYear(2024, harvest.id)).resolves.toBe(false)
  })
})