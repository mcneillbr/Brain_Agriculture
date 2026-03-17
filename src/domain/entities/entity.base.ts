import { randomUUID } from 'crypto'

export abstract class Entity<Props> {
  protected readonly _id: string
  protected props: Props

  constructor(props: Props, id?: string) {
    this._id = id ?? randomUUID()
    this.props = props
  }

  get id(): string {
    return this._id
  }

  equals(entity?: Entity<Props>): boolean {
    if (!entity || !(entity instanceof Entity)) return false
    return this._id === entity._id
  }
}