import { Harvest } from '../../../domain/entities/harvest.entity'
import { HarvestOrmEntity } from '../orm-entities/harvest.orm-entity'

export class HarvestInfraMapper {
  static toDomain(orm: HarvestOrmEntity): Harvest {
    return Harvest.create({
      id: orm.id,
      name: orm.name,
      year: orm.year,
    })
  }

  static toOrm(domain: Harvest): HarvestOrmEntity {
    const orm = new HarvestOrmEntity()
    orm.id   = domain.id
    orm.name = domain.name
    orm.year = domain.year
    return orm
  }
}