import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProducersPage from './page'

const mockPush = jest.fn()
const mockRemove = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}))

jest.mock('@/components/templates/AppLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

jest.mock('@/components/organisms/ProducerTable/ProducerTable', () => ({
  __esModule: true,
  default: () => <div>producer-table-mock</div>,
}))

jest.mock('@/application/hooks/useProducers', () => ({
  useProducers: () => ({
    loading: false,
    error: null,
    remove: mockRemove,
    items: [
      {
        id: '1',
        name: 'João da Silva',
        document: '52998224725',
        documentType: 'CPF',
        documentFormatted: '529.982.247-25',
        createdAt: '2024-12-01',
        updatedAt: '2024-12-01',
      },
      {
        id: '2',
        name: 'Agro Corp',
        document: '11222333000181',
        documentType: 'CNPJ',
        documentFormatted: '11.222.333/0001-81',
        createdAt: '2024-12-01',
        updatedAt: '2024-12-01',
      },
    ],
  }),
}))

describe('ProducersPage', () => {
  it('renderiza página e navega para novo produtor', async () => {
    const user = userEvent.setup()
    render(<ProducersPage />)

    expect(screen.getByText('Produtores')).toBeInTheDocument()
    expect(screen.getByText('Total de Produtores')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: '+ Novo Produtor' }))
    expect(mockPush).toHaveBeenCalledWith('/producers/new')
  })
})
