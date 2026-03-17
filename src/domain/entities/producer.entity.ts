import { AggregateRoot } from './aggregate-root.base'
import { DomainError } from './domain-error'
import { Document } from '../value-objects/document.vo'
import { ProducerCreatedEvent } from '../events/producer-created.event'

interface ProducerProps {
  name: string
  document: Document
}

export interface CreateProducerProps {
  id?: string
  name: string
  document: string
}

export class Producer extends AggregateRoot<ProducerProps> {
  private constructor(props: ProducerProps, id?: string) {
    super(props, id)
  }

  static create(props: CreateProducerProps): Producer {
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Nome do produtor deve ter ao menos 2 caracteres')
    }

    const document = Document.create(props.document)

    const producer = new Producer({ name: props.name.trim(), document }, props.id)

    if (!props.id) {
      producer.addDomainEvent(new ProducerCreatedEvent(producer.id, document.type))
    }

    return producer
  }

  get name(): string {
    return this.props.name
  }

  get document(): Document {
    return this.props.document
  }

  updateName(name: string): void {
    if (!name || name.trim().length < 2) {
      throw new DomainError('Nome do produtor deve ter ao menos 2 caracteres')
    }
    this.props.name = name.trim()
    this.touch()
  }

  updateDocument(raw: string): void {
    this.props.document = Document.create(raw)
    this.touch()
  }
}