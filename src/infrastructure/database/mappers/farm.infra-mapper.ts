import { Farm } from '../../../domain/entities/farm.entity'
import { Crop } from '../../../domain/entities/crop.entity'
import { FarmOrmEntity } from '../orm-entities/farm.orm-entity'
import { CropOrmEntity } from '../orm-entities/crop.orm-entity'

export class FarmInfraMapper {
  static toDomain(orm: FarmOrmEntity): Farm {
    const crops: Crop[] = (orm.crops ?? []).map((c) =>
      Crop.create({
        id: c.id,
        farmId: c.farmId,
        harvestId: c.harvestId,
        name: c.name,
        createdAt: c.createdAt,
      }),
    )

    return Farm.create({
      id: orm.id,
      producerId: orm.producerId,
      name: orm.name,
      city: orm.city,
      state: orm.state,
      totalArea: orm.totalArea,
      arableArea: orm.arableArea,
      vegetationArea: orm.vegetationArea,
      crops,
    })
  }

  static toOrm(domain: Farm): FarmOrmEntity {
    const orm        = new FarmOrmEntity()
    orm.id           = domain.id
    orm.producerId   = domain.producerId
    orm.name         = domain.name
    orm.city         = domain.city
    orm.state        = domain.state.value
    orm.totalArea    = domain.area.totalArea
    orm.arableArea   = domain.area.arableArea
    orm.vegetationArea = domain.area.vegetationArea
    orm.crops        = domain.crops.map(FarmInfraMapper.cropToOrm)
    return orm
  }

  private static cropToOrm(crop: Crop): CropOrmEntity {
    const orm      = new CropOrmEntity()
    orm.id         = crop.id
    orm.farmId     = crop.farmId
    orm.harvestId  = crop.harvestId
    orm.name       = crop.name.value
    return orm
  }
}