import { ValueObject } from '../../../src/domain/value-objects/value-object.base'

interface DummyProps {
  code: string
  count: number
}

class DummyValueObject extends ValueObject<DummyProps> {
  constructor(props: DummyProps) {
    super(props)
  }

  get code(): string {
    return this.props.code
  }

  setCode(code: string): void {
    ;(this.props as unknown as { code: string }).code = code
  }
}

describe('ValueObject base', () => {
  it('equals returns true for same props', () => {
    const a = new DummyValueObject({ code: 'A', count: 1 })
    const b = new DummyValueObject({ code: 'A', count: 1 })

    expect(a.equals(b)).toBe(true)
  })

  it('equals returns false for different props', () => {
    const a = new DummyValueObject({ code: 'A', count: 1 })
    const b = new DummyValueObject({ code: 'B', count: 1 })

    expect(a.equals(b)).toBe(false)
  })

  it('equals returns false for undefined', () => {
    const a = new DummyValueObject({ code: 'A', count: 1 })

    expect(a.equals(undefined)).toBe(false)
  })

  it('freezes props to keep immutability', () => {
    const vo = new DummyValueObject({ code: 'A', count: 1 })

    expect(() => vo.setCode('B')).toThrow(TypeError)
    expect(vo.code).toBe('A')
  })
})