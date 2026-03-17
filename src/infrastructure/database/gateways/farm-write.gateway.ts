import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FarmOrmEntity } from '../orm-entities/farm.orm-entity'
import { FarmInfraMapper } from '../mappers/farm.infra-mapper'
import { Farm } from '../../../domain/entities/farm.entity'

@Injectable()
export class FarmWriteGateway {
  constructor(
    @InjectRepository(FarmOrmEntity)
    private readonly repo: Repository<FarmOrmEntity>,
  ) {}

  async save(farm: Farm): Promise<void> {
    const orm = FarmInfraMapper.toOrm(farm)
    await this.repo.insert(orm)
  }

  async update(farm: Farm): Promise<void> {
    const orm = FarmInfraMapper.toOrm(farm)
    await this.repo.save(orm)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}