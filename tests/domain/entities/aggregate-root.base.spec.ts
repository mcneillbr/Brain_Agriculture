import { AggregateRoot } from '../../../src/domain/entities/aggregate-root.base'
import { DomainEvent } from '../../../src/domain/events/domain-event.base'

interface DummyProps {
  label: string
}

class DummyEvent extends DomainEvent {
  readonly eventName = 'dummy.created'
}

class DummyAggregate extends AggregateRoot<DummyProps> {
  constructor(props: DummyProps, id?: string) {
    super(props, id)
  }

  emit(): void {
    this.addDomainEvent(new DummyEvent(this.id))
  }

  updateLabel(label: string): void {
    this.props = { label }
    this.touch()
  }
}

describe('AggregateRoot base', () => {
  it('starts with createdAt and updatedAt', () => {
    const aggregate = new DummyAggregate({ label: 'start' })

    expect(aggregate.createdAt).toBeInstanceOf(Date)
    expect(aggregate.updatedAt).toBeInstanceOf(Date)
  })

  it('stores and clears domain events', () => {
    const aggregate = new DummyAggregate({ label: 'start' })

    aggregate.emit()

    expect(aggregate.domainEvents).toHaveLength(1)
    expect(aggregate.domainEvents[0].eventName).toBe('dummy.created')

    aggregate.clearDomainEvents()

    expect(aggregate.domainEvents).toHaveLength(0)
  })

  it('updates updatedAt when touch is called', async () => {
    const aggregate = new DummyAggregate({ label: 'start' })
    const before = aggregate.updatedAt.getTime()

    await new Promise((resolve) => setTimeout(resolve, 1))
    aggregate.updateLabel('new')

    expect(aggregate.updatedAt.getTime()).toBeGreaterThanOrEqual(before)
  })
})