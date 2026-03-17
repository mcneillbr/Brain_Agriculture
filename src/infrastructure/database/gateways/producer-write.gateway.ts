import { Injectable } from '@nestjs/common'
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm'
import { ProducerOrmEntity } from '../orm-entities/producer.orm-entity'
import { ProducerInfraMapper } from '../mappers/producer.infra-mapper'
import { Producer } from '../../../domain/entities/producer.entity'

@Injectable()
export class ProducerWriteGateway {
  constructor(
    @InjectRepository(ProducerOrmEntity)
    private readonly repo: Repository<ProducerOrmEntity>,
  ) {}

  async save(producer: Producer): Promise<void> {
    const orm = ProducerInfraMapper.toOrm(producer)
    await this.repo.insert(orm)
  }

  async update(producer: Producer): Promise<void> {
    const orm = ProducerInfraMapper.toOrm(producer)
    await this.repo.save(orm)
  }

  async delete(id: string): Promise<void> {
    await this.repo.delete(id)
  }
}