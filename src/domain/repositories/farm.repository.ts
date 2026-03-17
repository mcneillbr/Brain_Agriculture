import { Farm } from '../entities/farm.entity'

export interface IFarmRepository {
  findById(id: string): Promise<Farm | null>
  findByProducerId(producerId: string): Promise<Farm[]>
  findAll(): Promise<Farm[]>
  save(farm: Farm): Promise<void>
  update(farm: Farm): Promise<void>
  delete(id: string): Promise<void>
  countAll(): Promise<number>
  sumTotalArea(): Promise<number>
  countByState(): Promise<{ state: string; count: number }[]>
  countByCrop(): Promise<{ crop: string; count: number }[]>
  sumAreaUsage(): Promise<{ arableArea: number; vegetationArea: number }>
}

export const FARM_REPOSITORY = Symbol('IFarmRepository')