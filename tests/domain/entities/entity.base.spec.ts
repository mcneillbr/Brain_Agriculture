import { Entity } from '../../../src/domain/entities/entity.base'

interface DummyProps {
  name: string
}

class DummyEntity extends Entity<DummyProps> {
  constructor(props: DummyProps, id?: string) {
    super(props, id)
  }
}

describe('Entity base', () => {
  it('uses provided id when available', () => {
    const entity = new DummyEntity({ name: 'alpha' }, 'custom-id')

    expect(entity.id).toBe('custom-id')
  })

  it('generates id when not provided', () => {
    const entity = new DummyEntity({ name: 'alpha' })

    expect(entity.id).toBeDefined()
    expect(entity.id.length).toBeGreaterThan(0)
  })

  it('equals returns true for same id', () => {
    const a = new DummyEntity({ name: 'alpha' }, 'same-id')
    const b = new DummyEntity({ name: 'beta' }, 'same-id')

    expect(a.equals(b)).toBe(true)
  })

  it('equals returns false for different ids', () => {
    const a = new DummyEntity({ name: 'alpha' }, 'id-1')
    const b = new DummyEntity({ name: 'alpha' }, 'id-2')

    expect(a.equals(b)).toBe(false)
  })

  it('equals returns false for undefined', () => {
    const a = new DummyEntity({ name: 'alpha' }, 'id-1')

    expect(a.equals(undefined)).toBe(false)
  })
})