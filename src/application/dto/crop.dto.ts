export interface AddCropToFarmDto {
  farmId: string
  harvestId: string
  name: string
}

export interface CropDto {
  id: string
  farmId: string
  harvestId: string
  name: string
  createdAt?: Date
}