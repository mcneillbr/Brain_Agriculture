import { render, screen } from '@testing-library/react'
import NewProducerPage from './page'

const mockDispatch = jest.fn()

jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    back: jest.fn(),
  }),
}))

jest.mock('@/application/store/hooks', () => ({
  useAppDispatch: () => mockDispatch,
}))

jest.mock('@/components/templates/AppLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('NewProducerPage', () => {
  it('renderiza formulário com seções principais', () => {
    render(<NewProducerPage />)

    expect(screen.getByText('Novo Produtor Rural')).toBeInTheDocument()
    expect(screen.getByText('Informações do Produtor')).toBeInTheDocument()
    expect(screen.getByText('Informações da Propriedade')).toBeInTheDocument()
    expect(screen.getByText('Áreas & Dimensões')).toBeInTheDocument()
    expect(screen.getByText('Safras & Culturas')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Salvar Produtor' })).toBeInTheDocument()
  })
})
