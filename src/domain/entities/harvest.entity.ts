import { AggregateRoot } from './aggregate-root.base'
import { DomainError } from './domain-error'

interface HarvestProps {
  name: string
  year: number
  createdAt?: Date
}

export interface CreateHarvestProps {
  id?: string
  name: string
  year: number
  createdAt?: Date
}

export class Harvest extends AggregateRoot<HarvestProps> {
  private constructor(props: HarvestProps, id?: string) {
    super(props, id)
  }

  static create(props: CreateHarvestProps): Harvest {
    const currentYear = new Date().getFullYear()

    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Nome da safra deve ter ao menos 2 caracteres')
    }
    if (!Number.isInteger(props.year) || props.year < 1900 || props.year > currentYear + 5) {
      throw new DomainError(
        `Ano da safra inválido: ${props.year}. Deve ser entre 1900 e ${currentYear + 5}`,
      )
    }

    return new Harvest({ name: props.name.trim(), year: props.year }, props.id)
  }

  get name(): string {
    return this.props.name
  }

  get year(): number {
    return this.props.year
  }
}