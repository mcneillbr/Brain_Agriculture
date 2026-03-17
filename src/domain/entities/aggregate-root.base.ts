import { Entity } from './entity.base'
import { DomainEvent } from '../events/domain-event.base'

export abstract class AggregateRoot<Props> extends Entity<Props> {
  private _domainEvents: DomainEvent[] = []
  private _createdAt: Date
  private _updatedAt: Date

  constructor(props: Props, id?: string) {
    super(props, id)
    this._createdAt = new Date()
    this._updatedAt = new Date()
  }

  get createdAt(): Date {
    return this._createdAt
  }

  get updatedAt(): Date {
    return this._updatedAt
  }

  get domainEvents(): DomainEvent[] {
    return [...this._domainEvents]
  }

  protected addDomainEvent(event: DomainEvent): void {
    this._domainEvents.push(event)
  }

  clearDomainEvents(): void {
    this._domainEvents = []
  }

  protected touch(): void {
    this._updatedAt = new Date()
  }
}