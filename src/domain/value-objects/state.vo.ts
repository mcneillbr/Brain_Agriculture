import { ValueObject } from './value-object.base'
import { DomainError } from '../entities/domain-error'

const BRAZILIAN_STATES = [
  'AC', 'AL', 'AM', 'AP', 'BA', 'CE', 'DF', 'ES', 'GO',
  'MA', 'MG', 'MS', 'MT', 'PA', 'PB', 'PE', 'PI', 'PR',
  'RJ', 'RN', 'RO', 'RR', 'RS', 'SC', 'SE', 'SP', 'TO',
] as const

export type BrazilianStateCode = typeof BRAZILIAN_STATES[number]

interface StateProps {
  value: BrazilianStateCode
}

export class State extends ValueObject<StateProps> {
  private constructor(props: StateProps) {
    super(props)
  }

  static create(value: string): State {
    const upper = value?.trim().toUpperCase()

    if (!BRAZILIAN_STATES.includes(upper as BrazilianStateCode)) {
      throw new DomainError(
        `Estado inválido: "${value}". Use uma sigla válida (ex: SP, MG, RS)`,
      )
    }

    return new State({ value: upper as BrazilianStateCode })
  }

  static all(): BrazilianStateCode[] {
    return [...BRAZILIAN_STATES]
  }

  get value(): BrazilianStateCode {
    return this.props.value
  }

  toString(): string {
    return this.props.value
  }
}