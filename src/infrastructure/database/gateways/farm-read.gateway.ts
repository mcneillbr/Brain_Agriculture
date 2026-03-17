import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { FarmOrmEntity } from '../orm-entities/farm.orm-entity'
import { FarmInfraMapper } from '../mappers/farm.infra-mapper'
import { Farm } from '../../../domain/entities/farm.entity'

@Injectable()
export class FarmReadGateway {
  constructor(
    @InjectRepository(FarmOrmEntity)
    private readonly repo: Repository<FarmOrmEntity>,
  ) {}

  async findById(id: string): Promise<Farm | null> {
    const orm = await this.repo.findOne({ where: { id }, relations: ['crops'] })
    return orm ? FarmInfraMapper.toDomain(orm) : null
  }

  async findByProducerId(producerId: string): Promise<Farm[]> {
    const orms = await this.repo.find({
      where: { producerId },
      relations: ['crops'],
      order: { createdAt: 'DESC' },
    })
    return orms.map(FarmInfraMapper.toDomain)
  }

  async findAll(): Promise<Farm[]> {
    const orms = await this.repo.find({ relations: ['crops'], order: { createdAt: 'DESC' } })
    return orms.map(FarmInfraMapper.toDomain)
  }

  async countAll(): Promise<number> {
    return this.repo.count()
  }

  async sumTotalArea(): Promise<number> {
    const result = await this.repo
      .createQueryBuilder('f')
      .select('COALESCE(SUM(f.total_area), 0)', 'total')
      .getRawOne<{ total: string }>()
    return Number(result?.total ?? 0)
  }

  async countByState(): Promise<{ state: string; count: number }[]> {
    return this.repo
      .createQueryBuilder('f')
      .select('f.state', 'state')
      .addSelect('COUNT(f.id)', 'count')
      .groupBy('f.state')
      .orderBy('count', 'DESC')
      .getRawMany<{ state: string; count: string }>()
      .then((rows) => rows.map((r) => ({ state: r.state, count: Number(r.count) })))
  }

  async countByCrop(): Promise<{ crop: string; count: number }[]> {
    return this.repo
      .createQueryBuilder('f')
      .innerJoin('f.crops', 'c')
      .select('c.name', 'crop')
      .addSelect('COUNT(c.id)', 'count')
      .groupBy('c.name')
      .orderBy('count', 'DESC')
      .getRawMany<{ crop: string; count: string }>()
      .then((rows) => rows.map((r) => ({ crop: r.crop, count: Number(r.count) })))
  }

  async sumAreaUsage(): Promise<{ arableArea: number; vegetationArea: number }> {
    const result = await this.repo
      .createQueryBuilder('f')
      .select('COALESCE(SUM(f.arable_area), 0)', 'arableArea')
      .addSelect('COALESCE(SUM(f.vegetation_area), 0)', 'vegetationArea')
      .getRawOne<{ arableArea: string; vegetationArea: string }>()
    return {
      arableArea: Number(result?.arableArea ?? 0),
      vegetationArea: Number(result?.vegetationArea ?? 0),
    }
  }
}