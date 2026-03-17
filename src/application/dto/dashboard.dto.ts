export interface PieSliceDto {
  label: string
  value: number
  percentage: number
}

export interface DashboardDto {
  totalFarms: number
  totalHectares: number
  byState: PieSliceDto[]
  byCrop: PieSliceDto[]
  byLandUse: {
    arableArea: number
    vegetationArea: number
    unusedArea: number
  }
}