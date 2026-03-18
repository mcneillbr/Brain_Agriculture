import { render, screen } from '@testing-library/react'
import DashboardPage from './page'

jest.mock('@/components/templates/AppLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/organisms/DashboardCharts/DashboardCharts', () => ({
  __esModule: true,
  default: () => <div>charts-mock</div>,
}))

jest.mock('@/application/hooks/useDashboard', () => ({
  useDashboard: () => ({
    loading: false,
    error: null,
    data: {
      totalFarms: 127,
      totalHectares: 85430,
      byState: [],
      byCrop: [],
      byLandUse: { arableArea: 10, vegetationArea: 10, unusedArea: 5 },
    },
  }),
}))

describe('DashboardPage', () => {
  it('renderiza título e KPIs principais', () => {
    render(<DashboardPage />)

    expect(screen.getByText('Visão Geral Executiva')).toBeInTheDocument()
    expect(screen.getByText('Total de Propriedades Registradas')).toBeInTheDocument()
    expect(screen.getByText('127')).toBeInTheDocument()
    expect(screen.getByText('Área Produtiva Total')).toBeInTheDocument()
    expect(screen.getByText('85.430')).toBeInTheDocument()
  })
})
