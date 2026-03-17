import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HarvestOrmEntity } from '../orm-entities/harvest.orm-entity'
import { HarvestInfraMapper } from '../mappers/harvest.infra-mapper'
import { Harvest } from '../../../domain/entities/harvest.entity'

@Injectable()
export class HarvestWriteGateway {
  constructor(
    @InjectRepository(HarvestOrmEntity)
    private readonly repo: Repository<HarvestOrmEntity>,
  ) {}

  async save(harvest: Harvest): Promise<void> {
    const orm = HarvestInfraMapper.toOrm(harvest)
    await this.repo.insert(orm)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }

  async update(harvest: Harvest): Promise<void> {
    const orm = HarvestInfraMapper.toOrm(harvest)
    await this.repo.save(orm)
  }
}