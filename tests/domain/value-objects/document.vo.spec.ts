import { DomainError } from '../../../src/domain/entities/domain-error'
import { Document } from '../../../src/domain/value-objects/document.vo'

describe('Document', () => {
  it('creates a valid CPF document from digits', () => {
    const document = Document.create('52998224725')

    expect(document.type).toBe('CPF')
    expect(document.value).toBe('52998224725')
    expect(document.formatted).toBe('529.982.247-25')
  })

  it('creates a valid CPF document from formatted input', () => {
    const document = Document.create('529.982.247-25')

    expect(document.type).toBe('CPF')
    expect(document.value).toBe('52998224725')
  })

  it('creates a valid CNPJ document from digits', () => {
    const document = Document.create('11444777000161')

    expect(document.type).toBe('CNPJ')
    expect(document.value).toBe('11444777000161')
    expect(document.formatted).toBe('11.444.777/0001-61')
  })

  it('creates a valid CNPJ document from formatted input', () => {
    const document = Document.create('11.444.777/0001-61')

    expect(document.type).toBe('CNPJ')
    expect(document.value).toBe('11444777000161')
  })

  it('throws for empty input', () => {
    expect(() => Document.create('')).toThrow(DomainError)
  })

  it('throws for invalid length', () => {
    expect(() => Document.create('1234567890')).toThrow(DomainError)
  })

  it('throws for invalid CPF check digits', () => {
    expect(() => Document.create('52998224724')).toThrow(DomainError)
  })

  it('throws for invalid CNPJ check digits', () => {
    expect(() => Document.create('11444777000160')).toThrow(DomainError)
  })

  it('throws for repeated CPF digits', () => {
    expect(() => Document.create('11111111111')).toThrow(DomainError)
  })

  it('throws for repeated CNPJ digits', () => {
    expect(() => Document.create('11111111111111')).toThrow(DomainError)
  })

  it('supports value object equality by normalized value and type', () => {
    const a = Document.create('529.982.247-25')
    const b = Document.create('52998224725')

    expect(a.equals(b)).toBe(true)
  })
})