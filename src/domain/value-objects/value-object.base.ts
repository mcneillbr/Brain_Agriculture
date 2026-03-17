export abstract class ValueObject<Props> {
  protected readonly props: Props

  constructor(props: Props) {
    this.props = Object.freeze({ ...props })
  }

  equals(other?: ValueObject<Props>): boolean {
    if (!other || !(other instanceof ValueObject)) return false
    return JSON.stringify(this.props) === JSON.stringify(other.props)
  }
}