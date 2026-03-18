import { DataSource } from 'typeorm'
import { makeFarm, makeHarvest, makeProducer, VALID_CNPJ, VALID_CPF } from '../../../support/builders'
import { FarmRepositoryImpl } from '../../../../src/infrastructure/database/farm.repository.impl'
import { HarvestRepositoryImpl } from '../../../../src/infrastructure/database/harvest.repository.impl'
import { ProducerRepositoryImpl } from '../../../../src/infrastructure/database/producer.repository.impl'
import { FarmReadGateway } from '../../../../src/infrastructure/database/gateways/farm-read.gateway'
import { FarmWriteGateway } from '../../../../src/infrastructure/database/gateways/farm-write.gateway'
import { HarvestReadGateway } from '../../../../src/infrastructure/database/gateways/harvest-read.gateway'
import { HarvestWriteGateway } from '../../../../src/infrastructure/database/gateways/harvest-write.gateway'
import { ProducerReadGateway } from '../../../../src/infrastructure/database/gateways/producer-read.gateway'
import { ProducerWriteGateway } from '../../../../src/infrastructure/database/gateways/producer-write.gateway'
import { FarmOrmEntity } from '../../../../src/infrastructure/database/orm-entities/farm.orm-entity'
import { HarvestOrmEntity } from '../../../../src/infrastructure/database/orm-entities/harvest.orm-entity'
import { ProducerOrmEntity } from '../../../../src/infrastructure/database/orm-entities/producer.orm-entity'
import { createPgMemDataSource } from '../support/pg-mem.datasource'

describe('FarmRepositoryImpl (pg-mem)', () => {
  let dataSource: DataSource
  let farmRepository: FarmRepositoryImpl
  let producerRepository: ProducerRepositoryImpl
  let harvestRepository: HarvestRepositoryImpl

  beforeEach(async () => {
    dataSource = await createPgMemDataSource()

    const producerOrmRepo = dataSource.getRepository(ProducerOrmEntity)
    const farmOrmRepo = dataSource.getRepository(FarmOrmEntity)
    const harvestOrmRepo = dataSource.getRepository(HarvestOrmEntity)

    producerRepository = new ProducerRepositoryImpl(
      new ProducerReadGateway(producerOrmRepo),
      new ProducerWriteGateway(producerOrmRepo),
    )
    farmRepository = new FarmRepositoryImpl(
      new FarmReadGateway(farmOrmRepo),
      new FarmWriteGateway(farmOrmRepo),
    )
    harvestRepository = new HarvestRepositoryImpl(
      new HarvestReadGateway(harvestOrmRepo),
      new HarvestWriteGateway(harvestOrmRepo),
    )
  })

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy()
    }
  })

  it('persists farm and finds by id and producer', async () => {
    const producer = makeProducer()
    await producerRepository.save(producer)

    const farm = makeFarm({ producerId: producer.id, city: 'Campinas', state: 'SP' })
    await farmRepository.save(farm)

    await expect(farmRepository.findById(farm.id)).resolves.not.toBeNull()
    await expect(farmRepository.findByProducerId(producer.id)).resolves.toHaveLength(1)
    await expect(farmRepository.findAll()).resolves.toHaveLength(1)
  })

  it('updates and deletes farm', async () => {
    const producer = makeProducer()
    await producerRepository.save(producer)

    const farm = makeFarm({ producerId: producer.id, city: 'Campinas', state: 'SP' })
    await farmRepository.save(farm)

    farm.updateInfo({ city: 'Ribeirao Preto' })
    await farmRepository.update(farm)

    const updated = await farmRepository.findById(farm.id)
    expect(updated?.city).toBe('Ribeirao Preto')

    await farmRepository.delete(farm.id)
    await expect(farmRepository.findById(farm.id)).resolves.toBeNull()
  })

  it('returns dashboard aggregates', async () => {
    const producerA = makeProducer({ document: VALID_CPF })
    const producerB = makeProducer({ name: 'Bia Lima', document: VALID_CNPJ })
    await producerRepository.save(producerA)
    await producerRepository.save(producerB)

    const harvest2024 = makeHarvest({ name: 'Safra 2024', year: 2024 })
    const harvest2025 = makeHarvest({ name: 'Safra 2025', year: 2025 })
    await harvestRepository.save(harvest2024)
    await harvestRepository.save(harvest2025)

    const farmA = makeFarm({
      producerId: producerA.id,
      name: 'Fazenda A',
      city: 'Campinas',
      state: 'SP',
      totalArea: 100,
      arableArea: 60,
      vegetationArea: 20,
    })

    const farmB = makeFarm({
      producerId: producerB.id,
      name: 'Fazenda B',
      city: 'Uberlandia',
      state: 'MG',
      totalArea: 200,
      arableArea: 120,
      vegetationArea: 40,
    })

    await farmRepository.save(farmA)
    await farmRepository.save(farmB)

    farmA.addCrop({ farmId: farmA.id, harvestId: harvest2024.id, name: 'Soja' })
    farmB.addCrop({ farmId: farmB.id, harvestId: harvest2024.id, name: 'Milho' })
    farmB.addCrop({ farmId: farmB.id, harvestId: harvest2025.id, name: 'Soja' })

    await farmRepository.update(farmA)
    await farmRepository.update(farmB)

    await expect(farmRepository.countAll()).resolves.toBe(2)
    await expect(farmRepository.sumTotalArea()).resolves.toBe(300)

    const byState = await farmRepository.countByState()
    expect(byState).toEqual(
      expect.arrayContaining([
        { state: 'SP', count: 1 },
        { state: 'MG', count: 1 },
      ]),
    )

    const byCrop = await farmRepository.countByCrop()
    expect(byCrop).toEqual(
      expect.arrayContaining([
        { crop: 'Soja', count: 2 },
        { crop: 'Milho', count: 1 },
      ]),
    )

    await expect(farmRepository.sumAreaUsage()).resolves.toEqual({
      arableArea: 180,
      vegetationArea: 60,
    })
  })
})