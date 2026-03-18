import { DomainError } from '../../../src/domain/entities/domain-error'
import { Producer } from '../../../src/domain/entities/producer.entity'

describe('Producer', () => {
  it('creates producer with trimmed name and normalized document', () => {
    const producer = Producer.create({
      name: '  Joao Silva  ',
      document: '529.982.247-25',
    })

    expect(producer.name).toBe('Joao Silva')
    expect(producer.document.value).toBe('52998224725')
    expect(producer.domainEvents).toHaveLength(1)
    expect(producer.domainEvents[0].eventName).toBe('producer.created')
  })

  it('does not add created event when rehydrating with id', () => {
    const producer = Producer.create({
      id: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Joao Silva',
      document: '52998224725',
    })

    expect(producer.domainEvents).toHaveLength(0)
  })

  it('throws when name is invalid on create', () => {
    expect(() =>
      Producer.create({ name: 'A', document: '52998224725' }),
    ).toThrow(DomainError)
  })

  it('throws when document is invalid on create', () => {
    expect(() =>
      Producer.create({ name: 'Joao Silva', document: '12345678901' }),
    ).toThrow(DomainError)
  })

  it('updates name and refreshes updatedAt', async () => {
    const producer = Producer.create({ name: 'Joao Silva', document: '52998224725' })
    const before = producer.updatedAt.getTime()

    await new Promise((resolve) => setTimeout(resolve, 1))
    producer.updateName('  Maria Souza  ')

    expect(producer.name).toBe('Maria Souza')
    expect(producer.updatedAt.getTime()).toBeGreaterThanOrEqual(before)
  })

  it('throws when updating name with invalid value', () => {
    const producer = Producer.create({ name: 'Joao Silva', document: '52998224725' })

    expect(() => producer.updateName(' ')).toThrow(DomainError)
  })

  it('updates document and refreshes updatedAt', async () => {
    const producer = Producer.create({ name: 'Joao Silva', document: '52998224725' })
    const before = producer.updatedAt.getTime()

    await new Promise((resolve) => setTimeout(resolve, 1))
    producer.updateDocument('11.444.777/0001-61')

    expect(producer.document.type).toBe('CNPJ')
    expect(producer.document.value).toBe('11444777000161')
    expect(producer.updatedAt.getTime()).toBeGreaterThanOrEqual(before)
  })
})