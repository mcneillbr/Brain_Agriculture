import { Inject, Injectable } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { CreateProducerDto, ProducerDto } from '../dto/producer.dto'
import { IProducerRepository, PRODUCER_REPOSITORY } from '../../domain/repositories/producer.repository'
import { Producer } from '../../domain/entities/producer.entity'
import { ProducerMapper } from '../mappers/producer.mapper'
import { DomainError } from '../../domain/entities/domain-error'

@Injectable()
export class CreateProducerCollaboration implements Collaboration<CreateProducerDto, ProducerDto> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository,
  ) {}

  async run(input: CreateProducerDto): Promise<ProducerDto> {
    const producer = Producer.create({ name: input.name, document: input.document })

    const alreadyExists = await this.producerRepository.existsByDocument(producer.document.value)
    if (alreadyExists) {
      throw new DomainError(
        `Já existe um produtor cadastrado com o documento ${producer.document.formatted}`,
      )
    }

    await this.producerRepository.save(producer)

    return ProducerMapper.toDto(producer)
  }
}