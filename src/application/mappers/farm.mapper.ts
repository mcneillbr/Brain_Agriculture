import { Farm } from '../../domain/entities/farm.entity'
import { FarmDto } from '../dto/farm.dto'
import { CropMapper } from './crop.mapper'

export class FarmMapper {
  static toDto(farm: Farm, options?: { producerName?: string }): FarmDto {
    return {
      id: farm.id,
      producerId: farm.producerId,
      producerName: options?.producerName,
      name: farm.name,
      city: farm.city,
      state: farm.state.value,
      totalArea: farm.area.totalArea,
      arableArea: farm.area.arableArea,
      vegetationArea: farm.area.vegetationArea,
      unusedArea: farm.area.unusedArea,
      arablePercentage: farm.area.arablePercentage,
      vegetationPercentage: farm.area.vegetationPercentage,
      crops: CropMapper.toDtoList(farm.crops),
      createdAt: farm.createdAt,
      updatedAt: farm.updatedAt,
    }
  }

  static toDtoList(farms: Farm[], options?: { producerNameById?: Map<string, string> }): FarmDto[] {
    return farms.map((farm) =>
      FarmMapper.toDto(farm, {
        producerName: options?.producerNameById?.get(farm.producerId),
      }),
    )
  }
}