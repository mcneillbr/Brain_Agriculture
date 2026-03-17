import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { UpdateProducerDto, ProducerDto } from '../dto/producer.dto'
import { IProducerRepository, PRODUCER_REPOSITORY } from '../../domain/repositories/producer.repository'
import { ProducerMapper } from '../mappers/producer.mapper'
import { DomainError } from '../../domain/entities/domain-error'

interface UpdateProducerInput {
  id: string
  data: UpdateProducerDto
}

@Injectable()
export class UpdateProducerCollaboration implements Collaboration<UpdateProducerInput, ProducerDto> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository,
  ) {}

  async run(input: UpdateProducerInput): Promise<ProducerDto> {
    const producer = await this.producerRepository.findById(input.id)
    if (!producer) throw new NotFoundException(`Produtor com id "${input.id}" não encontrado`)

    if (input.data.name) {
      producer.updateName(input.data.name)
    }

    if (input.data.document) {
      const alreadyExists = await this.producerRepository.existsByDocument(
        input.data.document,
        input.id,
      )
      if (alreadyExists) {
        throw new DomainError(`Documento ${input.data.document} já está em uso`)
      }
      producer.updateDocument(input.data.document)
    }

    await this.producerRepository.update(producer)

    return ProducerMapper.toDto(producer)
  }
}