import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { IProducerRepository, PRODUCER_REPOSITORY } from '../../domain/repositories/producer.repository'

@Injectable()
export class DeleteProducerCollaboration implements Collaboration<string, void> {
  constructor(
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository,
  ) {}

  async run(id: string): Promise<void> {
    const producer = await this.producerRepository.findById(id)
    if (!producer) throw new NotFoundException(`Produtor com id "${id}" não encontrado`)

    await this.producerRepository.delete(id)
  }
}