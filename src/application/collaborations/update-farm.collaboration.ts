import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { UpdateFarmDto, FarmDto } from '../dto/farm.dto'
import { IFarmRepository, FARM_REPOSITORY } from '../../domain/repositories/farm.repository'
import { FarmMapper } from '../mappers/farm.mapper'

interface UpdateFarmInput {
  id: string
  data: UpdateFarmDto
}

@Injectable()
export class UpdateFarmCollaboration implements Collaboration<UpdateFarmInput, FarmDto> {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
  ) {}

  async run(input: UpdateFarmInput): Promise<FarmDto> {
    const farm = await this.farmRepository.findById(input.id)
    if (!farm) throw new NotFoundException(`Fazenda com id "${input.id}" não encontrada`)

    const { name, city, state, totalArea, arableArea, vegetationArea } = input.data

    farm.updateInfo({ name, city, state })

    if (totalArea !== undefined || arableArea !== undefined || vegetationArea !== undefined) {
      farm.updateAreas(
        totalArea ?? farm.area.totalArea,
        arableArea ?? farm.area.arableArea,
        vegetationArea ?? farm.area.vegetationArea,
      )
    }

    await this.farmRepository.update(farm)

    return FarmMapper.toDto(farm)
  }
}