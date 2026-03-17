import { Crop } from '../../domain/entities/crop.entity'
import { CropDto } from '../dto/crop.dto'

export class CropMapper {
  static toDto(crop: Crop): CropDto {
    return {
      id: crop.id,
      farmId: crop.farmId,
      harvestId: crop.harvestId,
      name: crop.name.value,
      createdAt: crop.createdAt,
    }
  }

  static toDtoList(crops: Crop[]): CropDto[] {
    return crops.map(CropMapper.toDto)
  }
}