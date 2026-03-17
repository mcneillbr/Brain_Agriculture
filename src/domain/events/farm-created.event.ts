import { DomainEvent } from './domain-event.base'

export class FarmCreatedEvent extends DomainEvent {
  readonly eventName = 'farm.created'
  readonly producerId: string

  constructor(farmId: string, producerId: string) {
    super(farmId)
    this.producerId = producerId
  }
}