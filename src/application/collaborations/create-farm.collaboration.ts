import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { CreateFarmDto, FarmDto } from '../dto/farm.dto'
import { IFarmRepository, FARM_REPOSITORY } from '../../domain/repositories/farm.repository'
import { IProducerRepository, PRODUCER_REPOSITORY } from '../../domain/repositories/producer.repository'
import { Farm } from '../../domain/entities/farm.entity'
import { FarmMapper } from '../mappers/farm.mapper'

@Injectable()
export class CreateFarmCollaboration implements Collaboration<CreateFarmDto, FarmDto> {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(PRODUCER_REPOSITORY)
    private readonly producerRepository: IProducerRepository,
  ) {}

  async run(input: CreateFarmDto): Promise<FarmDto> {
    const producer = await this.producerRepository.findById(input.producerId)
    if (!producer) {
      throw new NotFoundException(`Produtor com id "${input.producerId}" não encontrado`)
    }

    const farm = Farm.create({
      producerId: input.producerId,
      name: input.name,
      city: input.city,
      state: input.state,
      totalArea: input.totalArea,
      arableArea: input.arableArea,
      vegetationArea: input.vegetationArea,
    })

    await this.farmRepository.save(farm)

    return FarmMapper.toDto(farm)
  }
}