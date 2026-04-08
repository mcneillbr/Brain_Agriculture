import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import FarmsPage from './page'

const mockPush = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@/components/templates/AppLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/application/hooks/useFarms', () => ({
  useFarms: () => ({
    loading: false,
    error: null,
    items: [
      {
        id: 'farm-1',
        producerId: 'prod-1',
        producerName: 'Joao Silva',
        name: 'Fazenda Boa Vista',
        city: 'Sorriso',
        state: 'MT',
        totalArea: 1200,
        arableArea: 960,
        vegetationArea: 240,
        unusedArea: 0,
        arablePercentage: 80,
        vegetationPercentage: 20,
        crops: [],
        createdAt: '2024-12-01T00:00:00.000Z',
        updatedAt: '2024-12-01T00:00:00.000Z',
      },
    ],
  }),
}))

describe('FarmsPage', () => {
  beforeEach(() => {
    mockPush.mockReset()
  })

  it('renders farms page and allows create action', async () => {
    const user = userEvent.setup()
    render(<FarmsPage />)

    expect(screen.getByText('Fazendas')).toBeInTheDocument()
    expect(screen.getByText('Total de Fazendas')).toBeInTheDocument()
    expect(screen.getAllByText('Fazenda Boa Vista').length).toBeGreaterThan(0)

    await user.click(screen.getByRole('button', { name: /Nova Fazenda/i }))
    expect(mockPush).toHaveBeenCalledWith('/producers/new')
  })
})
