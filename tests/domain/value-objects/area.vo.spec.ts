import { DomainError } from '../../../src/domain/entities/domain-error'
import { Area } from '../../../src/domain/value-objects/area.vo'

describe('Area', () => {
  it('creates area with valid values', () => {
    const area = Area.create(100, 40, 30)

    expect(area.totalArea).toBe(100)
    expect(area.arableArea).toBe(40)
    expect(area.vegetationArea).toBe(30)
    expect(area.unusedArea).toBe(30)
  })

  it('allows arable + vegetation equal to total', () => {
    const area = Area.create(100, 60, 40)

    expect(area.unusedArea).toBe(0)
    expect(area.unusedPercentage).toBe(0)
  })

  it('calculates percentages correctly', () => {
    const area = Area.create(200, 50, 30)

    expect(area.arablePercentage).toBe(25)
    expect(area.vegetationPercentage).toBe(15)
    expect(area.unusedPercentage).toBe(60)
  })

  it('throws when totalArea is not greater than zero', () => {
    expect(() => Area.create(0, 0, 0)).toThrow(DomainError)
  })

  it('throws when arableArea is negative', () => {
    expect(() => Area.create(100, -1, 0)).toThrow(DomainError)
  })

  it('throws when vegetationArea is negative', () => {
    expect(() => Area.create(100, 0, -1)).toThrow(DomainError)
  })

  it('throws when arableArea + vegetationArea is greater than totalArea', () => {
    expect(() => Area.create(100, 70, 40)).toThrow(DomainError)
  })
})