import { CropDto } from './crop.dto'

export interface CreateFarmDto {
  producerId: string
  name: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
}

export interface UpdateFarmDto {
  name?: string
  city?: string
  state?: string
  totalArea?: number
  arableArea?: number
  vegetationArea?: number
}

export interface FarmDto {
  id: string
  producerId: string
  producerName?: string
  name: string
  city: string
  state: string
  totalArea: number
  arableArea: number
  vegetationArea: number
  unusedArea: number
  arablePercentage: number
  vegetationPercentage: number
  crops: CropDto[]
  createdAt: Date
  updatedAt: Date
}