import { Farm } from '../../../src/domain/entities/farm.entity'
import { IFarmRepository, FARM_REPOSITORY } from '../../../src/domain/repositories/farm.repository'

class InMemoryFarmRepository implements IFarmRepository {
  private readonly store = new Map<string, Farm>()

  async findById(id: string): Promise<Farm | null> {
    return this.store.get(id) ?? null
  }

  async findByProducerId(producerId: string): Promise<Farm[]> {
    return [...this.store.values()].filter((farm) => farm.producerId === producerId)
  }

  async findAll(): Promise<Farm[]> {
    return [...this.store.values()]
  }

  async save(farm: Farm): Promise<void> {
    this.store.set(farm.id, farm)
  }

  async update(farm: Farm): Promise<void> {
    this.store.set(farm.id, farm)
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id)
  }

  async countAll(): Promise<number> {
    return this.store.size
  }

  async sumTotalArea(): Promise<number> {
    return [...this.store.values()].reduce((sum, farm) => sum + farm.area.totalArea, 0)
  }

  async countByState(): Promise<{ state: string; count: number }[]> {
    const map = new Map<string, number>()

    for (const farm of this.store.values()) {
      map.set(farm.state.value, (map.get(farm.state.value) ?? 0) + 1)
    }

    return [...map.entries()].map(([state, count]) => ({ state, count }))
  }

  async countByCrop(): Promise<{ crop: string; count: number }[]> {
    const map = new Map<string, number>()

    for (const farm of this.store.values()) {
      for (const crop of farm.crops) {
        map.set(crop.name.value, (map.get(crop.name.value) ?? 0) + 1)
      }
    }

    return [...map.entries()].map(([crop, count]) => ({ crop, count }))
  }

  async sumAreaUsage(): Promise<{ arableArea: number; vegetationArea: number }> {
    return [...this.store.values()].reduce(
      (acc, farm) => ({
        arableArea: acc.arableArea + farm.area.arableArea,
        vegetationArea: acc.vegetationArea + farm.area.vegetationArea,
      }),
      { arableArea: 0, vegetationArea: 0 },
    )
  }
}

function createFarm(producerId: string, state: string) {
  return Farm.create({
    producerId,
    name: `Farm ${state}`,
    city: 'City',
    state,
    totalArea: 100,
    arableArea: 60,
    vegetationArea: 20,
  })
}

describe('IFarmRepository contract', () => {
  let repository: IFarmRepository

  beforeEach(() => {
    repository = new InMemoryFarmRepository()
  })

  it('exposes injection token as symbol', () => {
    expect(typeof FARM_REPOSITORY).toBe('symbol')
  })

  it('saves and finds farm by id', async () => {
    const farm = createFarm('producer-1', 'SP')
    await repository.save(farm)

    await expect(repository.findById(farm.id)).resolves.toBe(farm)
  })

  it('finds farms by producer id and returns all', async () => {
    const farm1 = createFarm('producer-1', 'SP')
    const farm2 = createFarm('producer-1', 'MG')
    const farm3 = createFarm('producer-2', 'RS')

    await repository.save(farm1)
    await repository.save(farm2)
    await repository.save(farm3)

    await expect(repository.findByProducerId('producer-1')).resolves.toHaveLength(2)
    await expect(repository.findAll()).resolves.toHaveLength(3)
  })

  it('updates and deletes farm', async () => {
    const farm = createFarm('producer-1', 'SP')
    await repository.save(farm)

    farm.updateInfo({ city: 'New City' })
    await repository.update(farm)

    const updated = await repository.findById(farm.id)
    expect(updated?.city).toBe('New City')

    await repository.delete(farm.id)
    await expect(repository.findById(farm.id)).resolves.toBeNull()
  })

  it('provides dashboard aggregates', async () => {
    const farm1 = createFarm('producer-1', 'SP')
    const farm2 = createFarm('producer-2', 'MG')

    farm1.addCrop({ farmId: farm1.id, harvestId: 'harvest-1', name: 'Soja' })
    farm2.addCrop({ farmId: farm2.id, harvestId: 'harvest-2', name: 'Milho' })
    farm2.addCrop({ farmId: farm2.id, harvestId: 'harvest-3', name: 'Soja' })

    await repository.save(farm1)
    await repository.save(farm2)

    await expect(repository.countAll()).resolves.toBe(2)
    await expect(repository.sumTotalArea()).resolves.toBe(200)

    const byState = await repository.countByState()
    expect(byState).toEqual(
      expect.arrayContaining([
        { state: 'SP', count: 1 },
        { state: 'MG', count: 1 },
      ]),
    )

    const byCrop = await repository.countByCrop()
    expect(byCrop).toEqual(
      expect.arrayContaining([
        { crop: 'Soja', count: 2 },
        { crop: 'Milho', count: 1 },
      ]),
    )

    await expect(repository.sumAreaUsage()).resolves.toEqual({
      arableArea: 120,
      vegetationArea: 40,
    })
  })
})