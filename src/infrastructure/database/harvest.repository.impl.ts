import { Injectable } from '@nestjs/common'
import { Harvest } from '../../domain/entities/harvest.entity'
import { IHarvestRepository } from '../../domain/repositories/harvest.repository'
import { HarvestReadGateway } from './gateways/harvest-read.gateway'
import { HarvestWriteGateway } from './gateways/harvest-write.gateway'

@Injectable()
export class HarvestRepositoryImpl implements IHarvestRepository {
  constructor(
    private readonly harvestReadGateway: HarvestReadGateway,
    private readonly harvestWriteGateway: HarvestWriteGateway,
  ) {}

  findById(id: string): Promise<Harvest | null> {
    return this.harvestReadGateway.findById(id)
  }

  findByYear(year: number): Promise<Harvest | null> {
    return this.harvestReadGateway.findByYear(year)
  }

  findAll(): Promise<Harvest[]> {
    return this.harvestReadGateway.findAll()
  }

  save(harvest: Harvest): Promise<void> {
    return this.harvestWriteGateway.save(harvest)
  }

  delete(id: string): Promise<void> {
    return this.harvestWriteGateway.delete(id)
  }

  existsByYear(year: number, excludeId?: string): Promise<boolean> {
    return this.harvestReadGateway.existsByYear(year, excludeId)
  }
}
