import { Harvest } from '../entities/harvest.entity'

export interface IHarvestRepository {
  findById(id: string): Promise<Harvest | null>
  findByYear(year: number): Promise<Harvest | null>
  findAll(): Promise<Harvest[]>
  save(harvest: Harvest): Promise<void>
  delete(id: string): Promise<void>
  existsByYear(year: number, excludeId?: string): Promise<boolean>
}

export const HARVEST_REPOSITORY = Symbol('IHarvestRepository')