import {
  IProducerRepository,
  PRODUCER_REPOSITORY,
} from '../../../src/domain/repositories/producer.repository'
import { Producer } from '../../../src/domain/entities/producer.entity'

class InMemoryProducerRepository implements IProducerRepository {
  private readonly store = new Map<string, Producer>()

  async findById(id: string): Promise<Producer | null> {
    return this.store.get(id) ?? null
  }

  async findByDocument(document: string): Promise<Producer | null> {
    const normalized = document.replace(/\D/g, '')
    for (const producer of this.store.values()) {
      if (producer.document.value === normalized) return producer
    }
    return null
  }

  async findAll(): Promise<Producer[]> {
    return [...this.store.values()]
  }

  async save(producer: Producer): Promise<void> {
    this.store.set(producer.id, producer)
  }

  async update(producer: Producer): Promise<void> {
    this.store.set(producer.id, producer)
  }

  async delete(id: string): Promise<void> {
    this.store.delete(id)
  }

  async existsByDocument(document: string, excludeId?: string): Promise<boolean> {
    const normalized = document.replace(/\D/g, '')
    for (const producer of this.store.values()) {
      if (producer.document.value === normalized && producer.id !== excludeId) return true
    }
    return false
  }
}

describe('IProducerRepository contract', () => {
  let repository: IProducerRepository

  beforeEach(() => {
    repository = new InMemoryProducerRepository()
  })

  it('exposes injection token as symbol', () => {
    expect(typeof PRODUCER_REPOSITORY).toBe('symbol')
  })

  it('saves and finds producer by id', async () => {
    const producer = Producer.create({ name: 'Ana', document: '52998224725' })
    await repository.save(producer)

    await expect(repository.findById(producer.id)).resolves.toBe(producer)
  })

  it('finds producer by normalized document', async () => {
    const producer = Producer.create({ name: 'Ana', document: '529.982.247-25' })
    await repository.save(producer)

    await expect(repository.findByDocument('52998224725')).resolves.toBe(producer)
  })

  it('updates and deletes producer', async () => {
    const producer = Producer.create({ name: 'Ana', document: '52998224725' })
    await repository.save(producer)

    producer.updateName('Ana Maria')
    await repository.update(producer)

    const updated = await repository.findById(producer.id)
    expect(updated?.name).toBe('Ana Maria')

    await repository.delete(producer.id)
    await expect(repository.findById(producer.id)).resolves.toBeNull()
  })

  it('checks existsByDocument with optional excludeId', async () => {
    const producer = Producer.create({ name: 'Ana', document: '52998224725' })
    await repository.save(producer)

    await expect(repository.existsByDocument('52998224725')).resolves.toBe(true)
    await expect(repository.existsByDocument('52998224725', producer.id)).resolves.toBe(false)
  })
})