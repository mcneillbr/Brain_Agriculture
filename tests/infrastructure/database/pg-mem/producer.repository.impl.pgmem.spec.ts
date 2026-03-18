import { DataSource } from 'typeorm'
import { makeProducer } from '../../../support/builders'
import { ProducerRepositoryImpl } from '../../../../src/infrastructure/database/producer.repository.impl'
import { ProducerReadGateway } from '../../../../src/infrastructure/database/gateways/producer-read.gateway'
import { ProducerWriteGateway } from '../../../../src/infrastructure/database/gateways/producer-write.gateway'
import { ProducerOrmEntity } from '../../../../src/infrastructure/database/orm-entities/producer.orm-entity'
import { createPgMemDataSource } from '../support/pg-mem.datasource'

describe('ProducerRepositoryImpl (pg-mem)', () => {
  let dataSource: DataSource
  let repository: ProducerRepositoryImpl

  beforeEach(async () => {
    dataSource = await createPgMemDataSource()

    const ormRepository = dataSource.getRepository(ProducerOrmEntity)
    repository = new ProducerRepositoryImpl(
      new ProducerReadGateway(ormRepository),
      new ProducerWriteGateway(ormRepository),
    )
  })

  afterEach(async () => {
    if (dataSource?.isInitialized) {
      await dataSource.destroy()
    }
  })

  it('persists and retrieves producer by id and document', async () => {
    const producer = makeProducer()

    await repository.save(producer)

    await expect(repository.findById(producer.id)).resolves.not.toBeNull()
    await expect(repository.findByDocument(producer.document.value)).resolves.not.toBeNull()
    await expect(repository.existsByDocument(producer.document.value)).resolves.toBe(true)
  })

  it('updates and deletes producer', async () => {
    const producer = makeProducer()
    await repository.save(producer)

    producer.updateName('Ana Souza')
    await repository.update(producer)

    const updated = await repository.findById(producer.id)
    expect(updated?.name).toBe('Ana Souza')

    await repository.delete(producer.id)
    await expect(repository.findById(producer.id)).resolves.toBeNull()
  })
})