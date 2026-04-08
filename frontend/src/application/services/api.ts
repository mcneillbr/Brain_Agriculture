import type {
  CreateProducerDto,
  UpdateProducerDto,
  ProducerDto,
  DashboardDto,
  CreateFarmDto,
  UpdateFarmDto,
  FarmDto,
  CreateHarvestDto,
  HarvestDto,
  AddCropToFarmDto,
  CropDto,
  ReportsFiltersDto,
  ReportsKpisDto,
  FarmsByStateDto,
  AreasByCropDto,
  ProducerReportRowDto,
} from '@/domain/types'

const BASE = '/api'

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init)
  if (!response.ok) {
    const message = await response.text().catch(() => response.statusText)
    throw new Error(`HTTP ${response.status}: ${message}`)
  }
  if (response.status === 204) return undefined as T
  return response.json() as Promise<T>
}

export const api = {
  dashboard: (filters?: ReportsFiltersDto): Promise<DashboardDto> => {
    const params = new URLSearchParams()
    if (filters?.harvestId) params.set('harvestId', filters.harvestId)
    if (filters?.state) params.set('state', filters.state)
    const query = params.toString()
    return request<DashboardDto>(`${BASE}/dashboard${query ? `?${query}` : ''}`)
  },

  producers: {
    getAll: (filters?: ReportsFiltersDto): Promise<ProducerDto[]> => {
      const params = new URLSearchParams()
      if (filters?.harvestId) params.set('harvestId', filters.harvestId)
      if (filters?.state) params.set('state', filters.state)
      const query = params.toString()
      return request<ProducerDto[]>(`${BASE}/producers${query ? `?${query}` : ''}`)
    },

    getById: (id: string): Promise<ProducerDto> =>
      request<ProducerDto>(`${BASE}/producers/${id}`),

    create: (body: CreateProducerDto): Promise<ProducerDto> =>
      request<ProducerDto>(`${BASE}/producers`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),

    update: (id: string, body: UpdateProducerDto): Promise<ProducerDto> =>
      request<ProducerDto>(`${BASE}/producers/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),

    delete: (id: string): Promise<void> =>
      request<void>(`${BASE}/producers/${id}`, { method: 'DELETE' }),
  },

  farms: {
    getAll: (): Promise<FarmDto[]> =>
      request<FarmDto[]>(`${BASE}/farms`),

    getById: (id: string): Promise<FarmDto> =>
      request<FarmDto>(`${BASE}/farms/${id}`),

    create: (body: CreateFarmDto): Promise<FarmDto> =>
      request<FarmDto>(`${BASE}/farms`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),

    update: (id: string, body: UpdateFarmDto): Promise<FarmDto> =>
      request<FarmDto>(`${BASE}/farms/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),

    delete: (id: string): Promise<void> =>
      request<void>(`${BASE}/farms/${id}`, { method: 'DELETE' }),
  },

  harvests: {
    getAll: (): Promise<HarvestDto[]> =>
      request<HarvestDto[]>(`${BASE}/harvests`),

    create: (body: CreateHarvestDto): Promise<HarvestDto> =>
      request<HarvestDto>(`${BASE}/harvests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  },

  crops: {
    add: (body: AddCropToFarmDto): Promise<CropDto> =>
      request<CropDto>(`${BASE}/crops`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      }),
  },

  reports: {
    getData: async (filters: ReportsFiltersDto): Promise<{
      kpis: ReportsKpisDto
      farmsByState: FarmsByStateDto[]
      areasByCrop: AreasByCropDto[]
      producerReport: ProducerReportRowDto[]
    }> => {
      const [dashboard, producers] = await Promise.all([
        api.dashboard(filters),
        api.producers.getAll(filters),
      ])

      const kpis: ReportsKpisDto = {
        totalProducers: producers.length,
        totalFarms: dashboard.totalFarms,
        totalArea: dashboard.totalHectares,
        avgAreaPerFarm:
          dashboard.totalFarms > 0
            ? Math.round(dashboard.totalHectares / dashboard.totalFarms)
            : 0,
      }

      const farmsByState: FarmsByStateDto[] = dashboard.byState.map((item) => ({
        state: item.label,
        count: item.value,
      }))

      const areasByCrop: AreasByCropDto[] = dashboard.byCrop.map((item) => ({
        crop: item.label,
        totalArea: item.value,
      }))

      const producerReport: ProducerReportRowDto[] = producers.map((producer) => {
        const producerAny = producer as ProducerDto & {
          farmsCount?: number
          totalArea?: number
          states?: string[]
          crops?: string[]
          farms?: Array<{ state?: string; totalArea?: number; crops?: Array<{ name?: string }> }>
        }

        const farmsCount =
          producerAny.farmsCount ??
          (Array.isArray(producerAny.farms) ? producerAny.farms.length : 0)

        const totalArea =
          producerAny.totalArea ??
          (Array.isArray(producerAny.farms)
            ? producerAny.farms.reduce((sum, farm) => sum + Number(farm.totalArea ?? 0), 0)
            : 0)

        const states =
          producerAny.states ??
          (Array.isArray(producerAny.farms)
            ? Array.from(
                new Set(producerAny.farms.map((farm) => farm.state).filter(Boolean) as string[]),
              )
            : [])

        const crops =
          producerAny.crops ??
          (Array.isArray(producerAny.farms)
            ? Array.from(
                new Set(
                  producerAny.farms
                    .flatMap((farm) => farm.crops ?? [])
                    .map((crop) => crop.name)
                    .filter(Boolean) as string[],
                ),
              )
            : [])

        return {
          producerId: producer.id,
          name: producer.name,
          document: producer.documentFormatted,
          farmsCount,
          totalArea,
          states,
          crops,
          updatedAt: producer.updatedAt,
        }
      })

      return { kpis, farmsByState, areasByCrop, producerReport }
    },
  },
}
