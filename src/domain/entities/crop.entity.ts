import { Entity } from './entity.base'
import { DomainError } from './domain-error'
import { CropName } from '../value-objects/crop-name.vo'

interface CropProps {
  farmId: string
  harvestId: string
  name: CropName
  createdAt?: Date
}

export interface CreateCropProps {
  id?: string
  farmId: string
  harvestId: string
  name: string
  createdAt?: Date
}

export class Crop extends Entity<CropProps> {
  private constructor(props: CropProps, id?: string) {
    super(props, id)
  }

  static create(props: CreateCropProps): Crop {
    if (!props.farmId) throw new DomainError('farmId é obrigatório')
    if (!props.harvestId) throw new DomainError('harvestId é obrigatório')

    const name = CropName.create(props.name)

    return new Crop({ farmId: props.farmId, harvestId: props.harvestId, name }, props.id)
  }

  get farmId(): string {
    return this.props.farmId
  }

  get harvestId(): string {
    return this.props.harvestId
  }

  get name(): CropName {
    return this.props.name
  }

  get createdAt(): Date | undefined {
    return this.props.createdAt
  }
}