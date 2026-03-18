import { DomainError } from '../../../src/domain/entities/domain-error'
import { CropName } from '../../../src/domain/value-objects/crop-name.vo'

describe('CropName', () => {
  it('creates crop name when value is allowed', () => {
    const name = CropName.create('Soja')

    expect(name.value).toBe('Soja')
    expect(name.toString()).toBe('Soja')
  })

  it('throws when value is not allowed', () => {
    expect(() => CropName.create('Batata')).toThrow(DomainError)
  })

  it('returns all allowed crops', () => {
    const allowed = CropName.allowed()

    expect(allowed).toHaveLength(10)
    expect(allowed).toContain('Milho')
    expect(allowed).toContain('Café')
  })
})