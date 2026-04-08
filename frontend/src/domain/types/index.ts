// ─── Core DTOs — mirrors the NestJS backend application/dto/ exactly ──────────

export interface CreateProducerDto {
  name: string
  document: string
}

export interface UpdateProducerDto {
  name?: string
  document?: string
}

export interface ProducerDto {
  id: string
  name: string
  document: string
  documentType: 'CPF' | 'CNPJ'
  documentFormatted: string
  createdAt: string
  updatedAt: string
}

// ─── Farm ─────────────────────────────────────────────────────────────────────

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
  createdAt: string
  updatedAt: string
}

// ─── Crop ─────────────────────────────────────────────────────────────────────

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
  createdAt?: string
}

// ─── Harvest ──────────────────────────────────────────────────────────────────

export interface CreateHarvestDto {
  name: string
  year: number
}

export interface HarvestDto {
  id: string
  name: string
  year: number
  createdAt: string
}

// ─── Dashboard ────────────────────────────────────────────────────────────────

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

// ─── Reports ─────────────────────────────────────────────────────────────────

export interface ReportsFiltersDto {
  harvestId: string | null
  state: string | null
}

export interface ReportsKpisDto {
  totalProducers: number
  totalFarms: number
  totalArea: number
  avgAreaPerFarm: number
}

export interface FarmsByStateDto {
  state: string
  count: number
}

export interface AreasByCropDto {
  crop: string
  totalArea: number
}

export interface ProducerReportRowDto {
  producerId: string
  name: string
  document: string
  farmsCount: number
  totalArea: number
  states: string[]
  crops: string[]
  updatedAt: string
}
