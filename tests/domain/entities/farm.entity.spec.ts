import { DomainError } from '../../../src/domain/entities/domain-error'
import { Farm } from '../../../src/domain/entities/farm.entity'

function createValidFarm() {
  return Farm.create({
    producerId: '550e8400-e29b-41d4-a716-446655440000',
    name: 'Fazenda Esperanca',
    city: 'Ribeirao Preto',
    state: 'SP',
    totalArea: 500,
    arableArea: 300,
    vegetationArea: 150,
  })
}

describe('Farm', () => {
  it('creates farm with valid props and emits farm.created event', () => {
    const farm = createValidFarm()

    expect(farm.producerId).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(farm.name).toBe('Fazenda Esperanca')
    expect(farm.city).toBe('Ribeirao Preto')
    expect(farm.state.value).toBe('SP')
    expect(farm.area.totalArea).toBe(500)
    expect(farm.domainEvents).toHaveLength(1)
    expect(farm.domainEvents[0].eventName).toBe('farm.created')
  })

  it('does not emit farm.created on rehydration with id', () => {
    const farm = Farm.create({
      id: '550e8400-e29b-41d4-a716-446655440099',
      producerId: '550e8400-e29b-41d4-a716-446655440000',
      name: 'Fazenda Esperanca',
      city: 'Ribeirao Preto',
      state: 'SP',
      totalArea: 500,
      arableArea: 300,
      vegetationArea: 150,
    })

    expect(farm.domainEvents).toHaveLength(0)
  })

  it('throws when producerId is missing', () => {
    expect(() =>
      Farm.create({
        producerId: '',
        name: 'Fazenda Esperanca',
        city: 'Ribeirao Preto',
        state: 'SP',
        totalArea: 500,
        arableArea: 300,
        vegetationArea: 150,
      }),
    ).toThrow(DomainError)
  })

  it('throws when city is invalid', () => {
    expect(() =>
      Farm.create({
        producerId: '550e8400-e29b-41d4-a716-446655440000',
        name: 'Fazenda Esperanca',
        city: 'A',
        state: 'SP',
        totalArea: 500,
        arableArea: 300,
        vegetationArea: 150,
      }),
    ).toThrow(DomainError)
  })

  it('adds crop and emits farm.crop_added event', () => {
    const farm = createValidFarm()
    farm.clearDomainEvents()

    const crop = farm.addCrop({
      harvestId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Soja',
      farmId: 'will-be-overridden',
    })

    expect(crop.farmId).toBe(farm.id)
    expect(farm.crops).toHaveLength(1)
    expect(farm.domainEvents).toHaveLength(1)
    expect(farm.domainEvents[0].eventName).toBe('farm.crop_added')
  })

  it('blocks duplicate crop by name and harvest', () => {
    const farm = createValidFarm()

    farm.addCrop({
      harvestId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Soja',
      farmId: 'ignored',
    })

    expect(() =>
      farm.addCrop({
        harvestId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Soja',
        farmId: 'ignored',
      }),
    ).toThrow(DomainError)
  })

  it('allows same crop name for a different harvest', () => {
    const farm = createValidFarm()

    farm.addCrop({
      harvestId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Soja',
      farmId: 'ignored',
    })
    farm.addCrop({
      harvestId: '550e8400-e29b-41d4-a716-446655440002',
      name: 'Soja',
      farmId: 'ignored',
    })

    expect(farm.crops).toHaveLength(2)
  })

  it('removes crop by id', () => {
    const farm = createValidFarm()
    const crop = farm.addCrop({
      harvestId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Milho',
      farmId: 'ignored',
    })

    farm.removeCrop(crop.id)

    expect(farm.crops).toHaveLength(0)
  })

  it('throws when removing non-existing crop', () => {
    const farm = createValidFarm()

    expect(() => farm.removeCrop('missing-crop-id')).toThrow(DomainError)
  })

  it('updates info with normalized values', () => {
    const farm = createValidFarm()

    farm.updateInfo({ name: '  Fazenda Nova  ', city: '  Campinas  ', state: 'mg' })

    expect(farm.name).toBe('Fazenda Nova')
    expect(farm.city).toBe('Campinas')
    expect(farm.state.value).toBe('MG')
  })

  it('updates areas with valid values', () => {
    const farm = createValidFarm()

    farm.updateAreas(700, 350, 200)

    expect(farm.area.totalArea).toBe(700)
    expect(farm.area.arableArea).toBe(350)
    expect(farm.area.vegetationArea).toBe(200)
  })

  it('throws when updating areas with invalid values', () => {
    const farm = createValidFarm()

    expect(() => farm.updateAreas(100, 80, 30)).toThrow(DomainError)
  })
})