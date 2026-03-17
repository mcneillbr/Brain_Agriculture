import { AggregateRoot } from './aggregate-root.base'
import { DomainError } from './domain-error'
import { Area } from '../value-objects/area.vo'
import { State } from '../value-objects/state.vo'
import { Crop, CreateCropProps } from './crop.entity'
import { FarmCropAddedEvent } from '../events/farm-crop-added.event'
import { FarmCreatedEvent } from '../events/farm-created.event'

interface FarmProps {
  producerId: string
  name: string
  city: string
  state: State
  area: Area
  crops: Crop[]
}

export interface CreateFarmProps {
  id?: string
  producerId: string
  name: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
  crops?: Crop[]
}

export class Farm extends AggregateRoot<FarmProps> {
  private constructor(props: FarmProps, id?: string) {
    super(props, id)
  }

  static create(props: CreateFarmProps): Farm {
    if (!props.producerId) throw new DomainError('producerId é obrigatório')
    if (!props.name || props.name.trim().length < 2) {
      throw new DomainError('Nome da fazenda deve ter ao menos 2 caracteres')
    }
    if (!props.city || props.city.trim().length < 2) {
      throw new DomainError('Cidade inválida')
    }

    const state = State.create(props.state)
    const area = Area.create(props.totalArea, props.arableArea, props.vegetationArea)

    const farm = new Farm(
      {
        producerId: props.producerId,
        name: props.name.trim(),
        city: props.city.trim(),
        state,
        area,
        crops: props.crops ?? [],
      },
      props.id,
    )

    if (!props.id) {
      farm.addDomainEvent(new FarmCreatedEvent(farm.id, props.producerId))
    }

    return farm
  }

  get producerId(): string {
    return this.props.producerId
  }

  get name(): string {
    return this.props.name
  }

  get city(): string {
    return this.props.city
  }

  get state(): State {
    return this.props.state
  }

  get area(): Area {
    return this.props.area
  }

  get crops(): Crop[] {
    return [...this.props.crops]
  }

  addCrop(input: CreateCropProps): Crop {
    const duplicate = this.props.crops.some(
      (c) => c.name.value === input.name && c.harvestId === input.harvestId,
    )
    if (duplicate) {
      throw new DomainError(
        `Cultura "${input.name}" já cadastrada nesta fazenda para a safra informada`,
      )
    }

    const crop = Crop.create({ ...input, farmId: this.id })
    this.props.crops.push(crop)
    this.addDomainEvent(new FarmCropAddedEvent(this.id, crop.id, crop.name.value))
    this.touch()

    return crop
  }

  removeCrop(cropId: string): void {
    const index = this.props.crops.findIndex((c) => c.id === cropId)
    if (index === -1) {
      throw new DomainError(`Cultura com id "${cropId}" não encontrada nesta fazenda`)
    }
    this.props.crops.splice(index, 1)
    this.touch()
  }

  updateInfo(data: Partial<Pick<CreateFarmProps, 'name' | 'city' | 'state'>>): void {
    if (data.name !== undefined) {
      if (data.name.trim().length < 2) throw new DomainError('Nome da fazenda inválido')
      this.props.name = data.name.trim()
    }
    if (data.city !== undefined) {
      if (data.city.trim().length < 2) throw new DomainError('Cidade inválida')
      this.props.city = data.city.trim()
    }
    if (data.state !== undefined) {
      this.props.state = State.create(data.state)
    }
    this.touch()
  }

  updateAreas(totalArea: number, arableArea: number, vegetationArea: number): void {
    this.props.area = Area.create(totalArea, arableArea, vegetationArea)
    this.touch()
  }
}