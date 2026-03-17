import { ValueObject } from './value-object.base'
import { DomainError } from '../entities/domain-error'

export type DocumentType = 'CPF' | 'CNPJ'

interface DocumentProps {
  value: string
  type: DocumentType
}

export class Document extends ValueObject<DocumentProps> {
  private constructor(props: DocumentProps) {
    super(props)
  }

  static create(raw: string): Document {
    if (!raw) throw new DomainError('Documento não pode ser vazio')

    const digits = raw.replace(/\D/g, '')

    if (digits.length === 11) {
      if (!Document.validateCPF(digits)) {
        throw new DomainError(`CPF inválido: ${raw}`)
      }
      return new Document({ value: digits, type: 'CPF' })
    }

    if (digits.length === 14) {
      if (!Document.validateCNPJ(digits)) {
        throw new DomainError(`CNPJ inválido: ${raw}`)
      }
      return new Document({ value: digits, type: 'CNPJ' })
    }

    throw new DomainError(
      `Documento inválido: esperado CPF (11 dígitos) ou CNPJ (14 dígitos), recebido ${digits.length} dígitos`,
    )
  }

  get value(): string {
    return this.props.value
  }

  get type(): DocumentType {
    return this.props.type
  }

  get formatted(): string {
    const v = this.props.value
    if (this.props.type === 'CPF') {
      return `${v.slice(0, 3)}.${v.slice(3, 6)}.${v.slice(6, 9)}-${v.slice(9)}`
    }
    return `${v.slice(0, 2)}.${v.slice(2, 5)}.${v.slice(5, 8)}/${v.slice(8, 12)}-${v.slice(12)}`
  }

  private static validateCPF(cpf: string): boolean {
    if (/^(\d)\1{10}$/.test(cpf)) return false

    const calcDigit = (cpf: string, length: number): number => {
      let sum = 0
      for (let i = 0; i < length; i++) {
        sum += parseInt(cpf[i]) * (length + 1 - i)
      }
      const remainder = (sum * 10) % 11
      return remainder >= 10 ? 0 : remainder
    }

    return (
      calcDigit(cpf, 9) === parseInt(cpf[9]) &&
      calcDigit(cpf, 10) === parseInt(cpf[10])
    )
  }

  private static validateCNPJ(cnpj: string): boolean {
    if (/^(\d)\1{13}$/.test(cnpj)) return false

    const calcDigit = (cnpj: string, weights: number[]): number => {
      const sum = weights.reduce((acc, w, i) => acc + parseInt(cnpj[i]) * w, 0)
      const remainder = sum % 11
      return remainder < 2 ? 0 : 11 - remainder
    }

    return (
      calcDigit(cnpj, [5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === parseInt(cnpj[12]) &&
      calcDigit(cnpj, [6, 5, 4, 3, 2, 9, 8, 7, 6, 5, 4, 3, 2]) === parseInt(cnpj[13])
    )
  }
}