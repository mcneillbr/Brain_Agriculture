import { Inject, Injectable, NotFoundException } from '@nestjs/common'
import { Collaboration } from './collaboration.base'
import { AddCropToFarmDto, CropDto } from '../dto/crop.dto'
import { IFarmRepository, FARM_REPOSITORY } from '../../domain/repositories/farm.repository'
import { IHarvestRepository, HARVEST_REPOSITORY } from '../../domain/repositories/harvest.repository'
import { CropMapper } from '../mappers/crop.mapper'

@Injectable()
export class AddCropToFarmCollaboration implements Collaboration<AddCropToFarmDto, CropDto> {
  constructor(
    @Inject(FARM_REPOSITORY)
    private readonly farmRepository: IFarmRepository,
    @Inject(HARVEST_REPOSITORY)
    private readonly harvestRepository: IHarvestRepository,
  ) {}

  async run(input: AddCropToFarmDto): Promise<CropDto> {
    const farm = await this.farmRepository.findById(input.farmId)
    if (!farm) throw new NotFoundException(`Fazenda com id "${input.farmId}" não encontrada`)

    const harvest = await this.harvestRepository.findById(input.harvestId)
    if (!harvest) throw new NotFoundException(`Safra com id "${input.harvestId}" não encontrada`)

    const crop = farm.addCrop({
      farmId: input.farmId,
      harvestId: input.harvestId,
      name: input.name,
    })

    await this.farmRepository.update(farm)

    return CropMapper.toDto(crop)
  }
}