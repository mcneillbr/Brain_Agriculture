import { configureStore } from '@reduxjs/toolkit'
import { api } from '@/application/services/api'
import dashboardReducer from './slices/dashboardSlice'
import producersReducer from './slices/producersSlice'
import reportsReducer, { setFilters } from './slices/reportsSlice'
import { refreshDerivedData } from './refreshData'

jest.mock('@/application/services/api', () => ({
  api: {
    dashboard: jest.fn(),
    producers: {
      getAll: jest.fn(),
      getById: jest.fn(),
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    farms: {
      create: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    harvests: {
      getAll: jest.fn(),
      create: jest.fn(),
    },
    crops: {
      add: jest.fn(),
    },
    reports: {
      getData: jest.fn(),
    },
  },
}))

function makeStore() {
  return configureStore({
    reducer: {
      dashboard: dashboardReducer,
      producers: producersReducer,
      reports: reportsReducer,
    },
  })
}

describe('refreshDerivedData', () => {
  it('atualiza dashboard, produtores e relatórios usando os filtros atuais', async () => {
    const store = makeStore()
    const mockDashboard = api.dashboard as jest.MockedFunction<typeof api.dashboard>
    const mockGetAllProducers = api.producers.getAll as jest.MockedFunction<typeof api.producers.getAll>
    const mockGetReportsData = api.reports.getData as jest.MockedFunction<typeof api.reports.getData>
    const filters = { harvestId: 'harvest-1', state: 'MT' }

    mockDashboard.mockResolvedValue({
      totalFarms: 2,
      totalHectares: 450,
      byState: [{ label: 'MT', value: 2, percentage: 100 }],
      byCrop: [{ label: 'Soja', value: 450, percentage: 100 }],
      byLandUse: {
        arableArea: 300,
        vegetationArea: 100,
        unusedArea: 50,
      },
    })

    mockGetAllProducers.mockResolvedValue([
      {
        id: 'producer-1',
        name: 'Produtor 1',
        document: '12345678901',
        documentType: 'CPF',
        documentFormatted: '123.456.789-01',
        createdAt: '2026-03-18T00:00:00.000Z',
        updatedAt: '2026-03-18T00:00:00.000Z',
      },
    ])

    mockGetReportsData.mockResolvedValue({
      kpis: {
        totalProducers: 1,
        totalFarms: 2,
        totalArea: 450,
        avgAreaPerFarm: 225,
      },
      farmsByState: [{ state: 'MT', count: 2 }],
      areasByCrop: [{ crop: 'Soja', totalArea: 450 }],
      producerReport: [
        {
          producerId: 'producer-1',
          name: 'Produtor 1',
          document: '123.456.789-01',
          farmsCount: 2,
          totalArea: 450,
          states: ['MT'],
          crops: ['Soja'],
          updatedAt: '2026-03-18T00:00:00.000Z',
        },
      ],
    })

    store.dispatch(setFilters(filters))
    await store.dispatch(refreshDerivedData() as never)

    expect(mockDashboard).toHaveBeenCalledTimes(1)
    expect(mockGetAllProducers).toHaveBeenCalledTimes(1)
    expect(mockGetReportsData).toHaveBeenCalledWith(filters)

    const state = store.getState()
    expect(state.dashboard.data?.totalFarms).toBe(2)
    expect(state.producers.items).toHaveLength(1)
    expect(state.reports.filters).toEqual(filters)
    expect(state.reports.kpis.totalArea).toBe(450)
    expect(state.reports.producerReport).toHaveLength(1)
  })
})