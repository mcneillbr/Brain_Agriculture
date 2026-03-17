import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProducerOrmEntity } from '../orm-entities/producer.orm-entity'
import { ProducerInfraMapper } from '../mappers/producer.infra-mapper'
import { Producer } from '../../../domain/entities/producer.entity'

@Injectable()
export class ProducerReadGateway {
  constructor(
    @InjectRepository(ProducerOrmEntity)
    private readonly repo: Repository<ProducerOrmEntity>,
  ) {}

  async findById(id: string): Promise<Producer | null> {
    const orm = await this.repo.findOneBy({ id })
    return orm ? ProducerInfraMapper.toDomain(orm) : null
  }

  async findByDocument(document: string): Promise<Producer | null> {
    const orm = await this.repo.findOneBy({ document })
    return orm ? ProducerInfraMapper.toDomain(orm) : null
  }

  async findAll(): Promise<Producer[]> {
    const orms = await this.repo.find({ order: { createdAt: 'DESC' } })
    return orms.map(ProducerInfraMapper.toDomain)
  }

  async existsByDocument(document: string, excludeId?: string): Promise<boolean> {
    const qb = this.repo
      .createQueryBuilder('p')
      .where('p.document = :document', { document })

    if (excludeId) {
      qb.andWhere('p.id != :excludeId', { excludeId })
    }

    return qb.getExists()
  }
}