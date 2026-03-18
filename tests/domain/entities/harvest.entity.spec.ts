import { DomainError } from '../../../src/domain/entities/domain-error'
import { Harvest } from '../../../src/domain/entities/harvest.entity'

describe('Harvest', () => {
  it('creates harvest with trimmed name and valid year', () => {
    const harvest = Harvest.create({ name: '  Safra 2024  ', year: 2024 })

    expect(harvest.name).toBe('Safra 2024')
    expect(harvest.year).toBe(2024)
  })

  it('throws when name is invalid', () => {
    expect(() => Harvest.create({ name: ' ', year: 2024 })).toThrow(DomainError)
  })

  it('throws when year is below minimum', () => {
    expect(() => Harvest.create({ name: 'Safra', year: 1899 })).toThrow(DomainError)
  })

  it('throws when year is above currentYear + 5', () => {
    const year = new Date().getFullYear() + 6

    expect(() => Harvest.create({ name: 'Safra futura', year })).toThrow(DomainError)
  })

  it('accepts year equal to currentYear + 5', () => {
    const year = new Date().getFullYear() + 5

    const harvest = Harvest.create({ name: 'Safra limite', year })

    expect(harvest.year).toBe(year)
  })
})