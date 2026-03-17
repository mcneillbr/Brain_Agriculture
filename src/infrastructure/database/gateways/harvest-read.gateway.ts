import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { HarvestOrmEntity } from '../orm-entities/harvest.orm-entity'
import { HarvestInfraMapper } from '../mappers/harvest.infra-mapper'
import { Harvest } from '../../../domain/entities/harvest.entity'

@Injectable()
export class HarvestReadGateway {
  constructor(
    @InjectRepository(HarvestOrmEntity)
    private readonly repo: Repository<HarvestOrmEntity>,
  ) {}

  async findById(id: string): Promise<Harvest | null> {
    const orm = await this.repo.findOneBy({ id })
    return orm ? HarvestInfraMapper.toDomain(orm) : null
  }

  async findByYear(year: number): Promise<Harvest | null> {
    const orm = await this.repo.findOneBy({ year })
    return orm ? HarvestInfraMapper.toDomain(orm) : null
  }

  async findAll(): Promise<Harvest[]> {
    const orms = await this.repo.find({ order: { year: 'DESC' } })
    return orms.map(HarvestInfraMapper.toDomain)
  }

  async existsByYear(year: number, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('h')
      .where('h.year = :year', { year })

    if (excludeId) {
      qb.andWhere('h.id != :excludeId', { excludeId })
    }

    return qb.getExists()
  }
}