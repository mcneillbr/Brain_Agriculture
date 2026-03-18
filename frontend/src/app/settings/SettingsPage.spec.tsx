import { render, screen } from '@testing-library/react'
import SettingsPage from './page'

jest.mock('@/components/templates/AppLayout/AppLayout', () => ({
  __esModule: true,
  default: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
}))

describe('SettingsPage', () => {
  it('renderiza título e bloco principal', () => {
    render(<SettingsPage />)

    expect(screen.getByText('Configurações')).toBeInTheDocument()
    expect(screen.getByText('Salvar Preferências')).toBeInTheDocument()
    expect(screen.getByText('Controle do Espaço de Trabalho')).toBeInTheDocument()
    expect(screen.getByText('Notificações')).toBeInTheDocument()
  })
})
