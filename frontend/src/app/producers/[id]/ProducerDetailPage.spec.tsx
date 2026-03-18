import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProducerDetailPage from '@/app/producers/[id]/page'
import { useProducers } from '@/application/hooks/useProducers'
import { useRouter, useParams } from 'next/navigation'

// Mock dos hooks do Next.js
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
  useParams: jest.fn(),
}))

// Mock do hook useProducers
jest.mock('@/application/hooks/useProducers')

// Mock dos componentes
jest.mock('@/components/templates/AppLayout/AppLayout', () => {
  return function MockAppLayout({ children }: { children: React.ReactNode }) {
    return <div data-testid="app-layout">{children}</div>
  }
})

jest.mock('@/components/atoms/Button/Button', () => {
  return function MockButton({
    children,
    onClick,
    variant,
  }: {
    children: React.ReactNode
    onClick?: () => void
    variant?: string
  }) {
    return (
      <button onClick={onClick} data-variant={variant}>
        {children}
      </button>
    )
  }
})

jest.mock('@/components/atoms/Spinner/Spinner', () => {
  return function MockSpinner({ size }: { size: number }) {
    return <div data-testid="spinner" data-size={size} />
  }
})

jest.mock('@/components/organisms/ProducerForm/ProducerForm', () => {
  return function MockProducerForm({
    onSubmit,
    onCancel,
  }: {
    onSubmit: (data: any) => void
    onCancel: () => void
  }) {
    return (
      <div data-testid="producer-form">
        <button onClick={() => onSubmit({ name: 'Updated' })}>Submit</button>
        <button onClick={onCancel}>Cancel</button>
      </div>
    )
  }
})

const mockProducer = {
  id: '1',
  name: 'Produtor Teste',
  document: '12345678901234',
  documentType: 'CNPJ',
  documentFormatted: '12.345.678/0001-34',
  createdAt: new Date('2024-01-01').toISOString(),
  updatedAt: new Date('2024-01-15').toISOString(),
}

describe('ProducerDetailPage', () => {
  let mockRouter: any
  let mockUseProducers: any

  beforeEach(() => {
    // Reset mocks
    jest.clearAllMocks()

    // Setup do router mock
    mockRouter = {
      push: jest.fn(),
      back: jest.fn(),
    }
    ;(useRouter as jest.Mock).mockReturnValue(mockRouter)

    // Setup do params mock
    ;(useParams as jest.Mock).mockReturnValue({ id: '1' })

    // Setup do useProducers mock
    mockUseProducers = {
      items: [mockProducer],
      update: jest.fn().mockResolvedValue(undefined),
      remove: jest.fn().mockResolvedValue(undefined),
    }
    ;(useProducers as jest.Mock).mockReturnValue(mockUseProducers)
  })

  it(
    'renderiza página de detalhes do produtor com informações corretas',
    async () => {
      render(<ProducerDetailPage />)

      // Aguardar carregamento do produtor
      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      // Verificar informações exibidas
      expect(screen.getByText(mockProducer.document)).toBeInTheDocument()
      expect(screen.getByText(mockProducer.documentType)).toBeInTheDocument()
      expect(screen.getByText(mockProducer.documentFormatted)).toBeInTheDocument()
    },
    10000 // Timeout aumentado para 10 segundos
  )

  it(
    'exibe spinner enquanto carrega',
    () => {
      ;(useProducers as jest.Mock).mockReturnValue({
        items: [],
        update: jest.fn(),
        remove: jest.fn(),
      })

      render(<ProducerDetailPage />)

      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    },
    10000
  )

  it(
    'navega para trás quando clicar em "Voltar"',
    async () => {
      const user = userEvent.setup()
      render(<ProducerDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      const backButton = screen.getAllByRole('button').find(
        (btn) => btn.textContent?.includes('Voltar')
      )

      await user.click(backButton!)

      expect(mockRouter.back).toHaveBeenCalled()
    },
    10000
  )

  it(
    'abre formulário de edição quando clicar em "Editar"',
    async () => {
      const user = userEvent.setup()
      render(<ProducerDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      const editButton = screen.getAllByRole('button').find(
        (btn) => btn.textContent?.includes('Editar')
      )

      await user.click(editButton!)

      expect(screen.getByTestId('producer-form')).toBeInTheDocument()
    },
    10000
  )

  it(
    'deleta produtor quando confirmado',
    async () => {
      const user = userEvent.setup()
      window.confirm = jest.fn(() => true)

      render(<ProducerDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      const deleteButton = screen.getAllByRole('button').find(
        (btn) => btn.textContent?.includes('Deletar')
      )

      await user.click(deleteButton!)

      expect(mockUseProducers.remove).toHaveBeenCalledWith('1')

      await waitFor(() => {
        expect(mockRouter.push).toHaveBeenCalledWith('/producers')
      })
    },
    10000
  )

  it(
    'não deleta quando usuário cancela confirmação',
    async () => {
      const user = userEvent.setup()
      window.confirm = jest.fn(() => false)

      render(<ProducerDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      const deleteButton = screen.getAllByRole('button').find(
        (btn) => btn.textContent?.includes('Deletar')
      )

      await user.click(deleteButton!)

      expect(mockUseProducers.remove).not.toHaveBeenCalled()
    },
    10000
  )

  it(
    'edita produtor e volta para visualização',
    async () => {
      const user = userEvent.setup()
      render(<ProducerDetailPage />)

      // Esperar renderização inicial
      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      // Clicar em editar
      const editButton = screen.getAllByRole('button').find(
        (btn) => btn.textContent?.includes('Editar')
      )
      await user.click(editButton!)

      // Verificar se formulário aparece
      expect(screen.getByTestId('producer-form')).toBeInTheDocument()

      // Submeter formulário
      const submitButton = screen.getByRole('button', { name: /submit/i })
      await user.click(submitButton)

      // Verificar se update foi chamado
      expect(mockUseProducers.update).toHaveBeenCalledWith('1', {
        name: 'Updated',
      })

      // Aguardar volta para visualização
      await waitFor(() => {
        expect(screen.queryByTestId('producer-form')).not.toBeInTheDocument()
      })
    },
    10000
  )

  it(
    'formata datas corretamente em pt-BR',
    async () => {
      render(<ProducerDetailPage />)

      await waitFor(() => {
        expect(screen.getByText(mockProducer.name)).toBeInTheDocument()
      })

      // Verificar se datas estão formatadas em português
      const dateElements = screen.getAllByText(/\d{1,2}\s+de\s+.+\s+de\s+\d{4}|^\d{1,2}\/\d{1,2}\/\d{4}$/)
      expect(dateElements.length).toBeGreaterThan(0)
    },
    10000
  )

  it(
    'exibe mensagem de carregamento quando produtor não é encontrado',
    () => {
      ;(useParams as jest.Mock).mockReturnValue({ id: 'inexistente' })
      ;(useProducers as jest.Mock).mockReturnValue({
        items: [mockProducer],
        update: jest.fn(),
        remove: jest.fn(),
      })

      render(<ProducerDetailPage />)

      expect(screen.getByTestId('spinner')).toBeInTheDocument()
    },
    10000
  )
})
