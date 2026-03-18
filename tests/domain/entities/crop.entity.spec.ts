import { DomainError } from '../../../src/domain/entities/domain-error'
import { Crop } from '../../../src/domain/entities/crop.entity'

describe('Crop', () => {
  it('creates crop with valid values', () => {
    const crop = Crop.create({
      farmId: '550e8400-e29b-41d4-a716-446655440000',
      harvestId: '550e8400-e29b-41d4-a716-446655440001',
      name: 'Soja',
    })

    expect(crop.farmId).toBe('550e8400-e29b-41d4-a716-446655440000')
    expect(crop.harvestId).toBe('550e8400-e29b-41d4-a716-446655440001')
    expect(crop.name.value).toBe('Soja')
  })

  it('throws when farmId is missing', () => {
    expect(() =>
      Crop.create({
        farmId: '',
        harvestId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Soja',
      }),
    ).toThrow(DomainError)
  })

  it('throws when harvestId is missing', () => {
    expect(() =>
      Crop.create({
        farmId: '550e8400-e29b-41d4-a716-446655440000',
        harvestId: '',
        name: 'Soja',
      }),
    ).toThrow(DomainError)
  })

  it('throws when crop name is not allowed', () => {
    expect(() =>
      Crop.create({
        farmId: '550e8400-e29b-41d4-a716-446655440000',
        harvestId: '550e8400-e29b-41d4-a716-446655440001',
        name: 'Batata',
      }),
    ).toThrow(DomainError)
  })
})