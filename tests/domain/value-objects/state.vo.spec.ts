import { DomainError } from '../../../src/domain/entities/domain-error'
import { State } from '../../../src/domain/value-objects/state.vo'

describe('State', () => {
  it('creates state from valid uppercase UF', () => {
    const state = State.create('SP')

    expect(state.value).toBe('SP')
    expect(state.toString()).toBe('SP')
  })

  it('normalizes lowercase and whitespace input', () => {
    const state = State.create('  mg ')

    expect(state.value).toBe('MG')
  })

  it('throws for invalid UF', () => {
    expect(() => State.create('XX')).toThrow(DomainError)
  })

  it('returns all 27 brazilian state codes', () => {
    const states = State.all()

    expect(states).toHaveLength(27)
    expect(states).toContain('SP')
    expect(states).toContain('AM')
    expect(states).toContain('DF')
  })
})