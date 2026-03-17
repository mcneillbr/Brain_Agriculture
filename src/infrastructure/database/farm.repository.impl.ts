import { Injectable } from '@nestjs/common'
import { Farm } from '../../domain/entities/farm.entity'
import { IFarmRepository } from '../../domain/repositories/farm.repository'
import { FarmReadGateway } from './gateways/farm-read.gateway'
import { FarmWriteGateway } from './gateways/farm-write.gateway'

@Injectable()
export class FarmRepositoryImpl implements IFarmRepository {
  constructor(
    private readonly farmReadGateway: FarmReadGateway,
    private readonly farmWriteGateway: FarmWriteGateway,
  ) {}

  findById(id: string): Promise<Farm | null> {
    return this.farmReadGateway.findById(id)
  }

  findByProducerId(producerId: string): Promise<Farm[]> {
    return this.farmReadGateway.findByProducerId(producerId)
  }

  findAll(): Promise<Farm[]> {
    return this.farmReadGateway.findAll()
  }

  save(farm: Farm): Promise<void> {
    return this.farmWriteGateway.save(farm)
  }

  update(farm: Farm): Promise<void> {
    return this.farmWriteGateway.update(farm)
  }

  delete(id: string): Promise<void> {
    return this.farmWriteGateway.delete(id)
  }

  countAll(): Promise<number> {
    return this.farmReadGateway.countAll()
  }

  sumTotalArea(): Promise<number> {
    return this.farmReadGateway.sumTotalArea()
  }

  countByState(): Promise<{ state: string; count: number }[]> {
    return this.farmReadGateway.countByState()
  }

  countByCrop(): Promise<{ crop: string; count: number }[]> {
    return this.farmReadGateway.countByCrop()
  }

  sumAreaUsage(): Promise<{ arableArea: number; vegetationArea: number }> {
    return this.farmReadGateway.sumAreaUsage()
  }
}
