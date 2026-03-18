import { render, screen, waitFor } from '@testing-library/react'
import ReportsPage from './ReportsPage'

jest.mock('@/components/templates/AppLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/application/hooks/useReports', () => ({
  useReports: () => ({
    filters: { harvestId: null, state: null },
    kpis: {
      totalProducers: 48,
      totalFarms: 127,
      totalArea: 85430,
      avgAreaPerFarm: 672,
    },
    farmsByState: [
      { state: 'MT', count: 32 },
      { state: 'SP', count: 24 },
    ],
    areasByCrop: [
      { crop: 'Soja', totalArea: 38200 },
      { crop: 'Milho', totalArea: 21500 },
    ],
    producerReport: [],
    loading: false,
    error: null,
    applyFilters: jest.fn(),
  }),
}))

jest.mock('@/application/services/api', () => ({
  api: {
    harvests: {
      getAll: jest.fn().mockResolvedValue([]),
    },
  },
}))

describe('ReportsPage', () => {
  it('renderiza os 4 KPI cards com os valores corretos', async () => {
    render(<ReportsPage />)

    await waitFor(() => {
      expect(screen.getByText('Total de Produtores')).toBeInTheDocument()
    })

    expect(screen.getByText('48')).toBeInTheDocument()
    expect(screen.getByText('127')).toBeInTheDocument()
    expect(screen.getByText('85.430')).toBeInTheDocument()
    expect(screen.getByText('672')).toBeInTheDocument()
  })
})
