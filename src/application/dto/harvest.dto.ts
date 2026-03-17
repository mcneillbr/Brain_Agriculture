export interface CreateHarvestDto {
  name: string
  year: number
}

export interface HarvestDto {
  id: string
  name: string
  year: number
  createdAt: Date
}