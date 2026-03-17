import { DomainEvent } from './domain-event.base'
import { DocumentType } from '../value-objects/document.vo'

export class ProducerCreatedEvent extends DomainEvent {
  readonly eventName = 'producer.created'
  readonly documentType: DocumentType

  constructor(producerId: string, documentType: DocumentType) {
    super(producerId)
    this.documentType = documentType
  }
}