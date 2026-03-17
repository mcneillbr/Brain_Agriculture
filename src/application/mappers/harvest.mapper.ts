import { Harvest } from '../../domain/entities/harvest.entity'
import { HarvestDto } from '../dto/harvest.dto'

export class HarvestMapper {
  static toDto(harvest: Harvest): HarvestDto {
    return {
      id: harvest.id,
      name: harvest.name,
      year: harvest.year,
      createdAt: harvest.createdAt,
    }
  }

  static toDtoList(harvests: Harvest[]): HarvestDto[] {
    return harvests.map(HarvestMapper.toDto)
  }
}