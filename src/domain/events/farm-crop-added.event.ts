import { DomainEvent } from './domain-event.base'

export class FarmCropAddedEvent extends DomainEvent {
  readonly eventName = 'farm.crop_added'
  readonly cropId: string
  readonly cropName: string

  constructor(farmId: string, cropId: string, cropName: string) {
    super(farmId)
    this.cropId = cropId
    this.cropName = cropName
  }
}