import { randomUUID } from 'crypto'
import { DataType, newDb } from 'pg-mem'
import { DataSource } from 'typeorm'
import { CropOrmEntity } from '../../../../src/infrastructure/database/orm-entities/crop.orm-entity'
import { FarmOrmEntity } from '../../../../src/infrastructure/database/orm-entities/farm.orm-entity'
import { HarvestOrmEntity } from '../../../../src/infrastructure/database/orm-entities/harvest.orm-entity'
import { ProducerOrmEntity } from '../../../../src/infrastructure/database/orm-entities/producer.orm-entity'

export async function createPgMemDataSource(): Promise<DataSource> {
  const db = newDb({ autoCreateForeignKeyIndices: true })

  // Functions used by TypeORM/driver introspection during bootstrap.
  db.public.registerFunction({
    name: 'current_database',
    implementation: () => 'pg_mem_test',
    returns: DataType.text,
  })
  db.public.registerFunction({
    name: 'version',
    implementation: () => 'PostgreSQL 16.0 (pg-mem)',
    returns: DataType.text,
  })
  db.public.registerFunction({
    name: 'uuid_generate_v4',
    implementation: () => randomUUID(),
    returns: DataType.uuid,
  })

  const dataSource = db.adapters.createTypeormDataSource({
    type: 'postgres',
    entities: [ProducerOrmEntity, FarmOrmEntity, CropOrmEntity, HarvestOrmEntity],
    synchronize: true,
    logging: false,
  })

  await dataSource.initialize()

  return dataSource
}