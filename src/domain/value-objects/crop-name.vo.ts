import { ValueObject } from './value-object.base'
import { DomainError } from '../entities/domain-error'

const ALLOWED_CROPS = [
  'Soja',
  'Milho',
  'Algodão',
  'Café',
  'Cana-de-açúcar',
  'Trigo',
  'Arroz',
  'Feijão',
  'Sorgo',
  'Girassol',
] as const

export type CropNameValue = typeof ALLOWED_CROPS[number]

interface CropNameProps {
  value: CropNameValue
}

export class CropName extends ValueObject<CropNameProps> {
  private constructor(props: CropNameProps) {
    super(props)
  }

  static create(value: string): CropName {
    if (!ALLOWED_CROPS.includes(value as CropNameValue)) {
      throw new DomainError(
        `Cultura inválida: "${value}". Culturas permitidas: ${ALLOWED_CROPS.join(', ')}`,
      )
    }

    return new CropName({ value: value as CropNameValue })
  }

  static allowed(): CropNameValue[] {
    return [...ALLOWED_CROPS]
  }

  get value(): CropNameValue {
    return this.props.value
  }

  toString(): string {
    return this.props.value
  }
}