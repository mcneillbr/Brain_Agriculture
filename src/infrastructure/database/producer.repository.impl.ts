import { Injectable } from '@nestjs/common'
import { IProducerRepository } from '../../domain/repositories/producer.repository'
import { Producer } from '../../domain/entities/producer.entity'
import { ProducerReadGateway } from './gateways/producer-read.gateway'
import { ProducerWriteGateway } from './gateways/producer-write.gateway'

@Injectable()
export class ProducerRepositoryImpl implements IProducerRepository {
  constructor(
    private readonly producerReadGateway: ProducerReadGateway,
    private readonly producerWriteGateway: ProducerWriteGateway,
  ) {}

  findById(id: string): Promise<Producer | null> {
    return this.producerReadGateway.findById(id)
  }

  findByDocument(document: string): Promise<Producer | null> {
    return this.producerReadGateway.findByDocument(document)
  }

  findAll(): Promise<Producer[]> {
    return this.producerReadGateway.findAll()
  }

  save(producer: Producer): Promise<void> {
    return this.producerWriteGateway.save(producer)
  }

  update(producer: Producer): Promise<void> {
    return this.producerWriteGateway.update(producer)
  }

  delete(id: string): Promise<void> {
    return this.producerWriteGateway.delete(id)
  }

  existsByDocument(document: string, excludeId?: string): Promise<boolean> {
    return this.producerReadGateway.existsByDocument(document, excludeId)
  }
}
