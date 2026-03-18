import { DataSource } from 'typeorm'
import { makeHarvest } from '../../../support/builders'
import { HarvestRepositoryImpl } from '../../../../src/infrastructure/database/harvest.repository.impl'
import { HarvestReadGateway } from '../../../../src/infrastructure/database/gateways/harvest-read.gateway'
import { HarvestWriteGateway } from '../../../../src/infrastructure/database/gateways/harvest-write.gateway'
import { HarvestOrmEntity } from '../../../../src/infrastructure/database/orm-entities/harvest.orm-entity'
import { createPgMemDataSource } from '../support/pg-mem.datasource'

describe('HarvestRepositoryImpl (pg-mem)', () => {
  let dataSource: DataSource
  let repository: HarvestRepositoryImpl

  beforeEach(async () => {
    dataSource = await createPgMemDataSource()

    const ormRepository = dataSource.getRepository(HarvestOrmEntity)
    repository = new HarvestRepositoryImpl(
      new HarvestReadGateway(ormRepository),
      new HarvestWriteGateway(ormRepository),
    )
  })

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy()
    }
  })

  it('persists and finds harvest by year', async () => {
    const harvest = makeHarvest({ name: 'Safra 2024', year: 2024 })

    await repository.save(harvest)

    await expect(repository.findById(harvest.id)).resolves.not.toBeNull()
    await expect(repository.findByYear(harvest.year)).resolves.not.toBeNull()
    await expect(repository.existsByYear(harvest.year)).resolves.toBe(true)
  })

  it('deletes harvest', async () => {
    const harvest = makeHarvest({ name: 'Safra 2025', year: 2025 })
    await repository.save(harvest)

    await repository.delete(harvest.id)

    await expect(repository.findById(harvest.id)).resolves.toBeNull()
  })
})