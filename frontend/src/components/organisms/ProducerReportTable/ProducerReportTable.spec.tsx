import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import ProducerReportTable from './ProducerReportTable'
import type { ProducerReportRowDto } from '@/domain/types'

function buildRows(count: number): ProducerReportRowDto[] {
  return Array.from({ length: count }, (_, index) => ({
    producerId: String(index + 1),
    name: `Produtor ${String.fromCharCode(65 + (index % 26))}${index}`,
    document: index % 2 === 0 ? '529.982.247-25' : '11.222.333/0001-81',
    farmsCount: (index % 5) + 1,
    totalArea: 1000 + index * 50,
    states: index % 2 === 0 ? ['MT', 'GO'] : ['SP'],
    crops: index % 2 === 0 ? ['Soja', 'Milho'] : ['Café'],
    updatedAt: `2024-12-${String((index % 28) + 1).padStart(2, '0')}`,
  }))
}

describe('ProducerReportTable', () => {
  it('filtra linhas pela busca', async () => {
    const user = userEvent.setup()
    render(<ProducerReportTable rows={buildRows(12)} />)

    await user.type(screen.getByLabelText('Buscar produtor...'), 'Produtor A0')

    expect(screen.getByText('Produtor A0')).toBeInTheDocument()
    expect(screen.queryByText('Produtor B1')).not.toBeInTheDocument()
  })

  it('ordenação alterna ao clicar no cabeçalho', async () => {
    const user = userEvent.setup()
    const rows: ProducerReportRowDto[] = [
      {
        producerId: '1',
        name: 'Zulu Agro',
        document: '11.222.333/0001-81',
        farmsCount: 1,
        totalArea: 200,
        states: ['SP'],
        crops: ['Café'],
        updatedAt: '2024-12-01',
      },
      {
        producerId: '2',
        name: 'Alpha Agro',
        document: '529.982.247-25',
        farmsCount: 2,
        totalArea: 300,
        states: ['MT'],
        crops: ['Soja'],
        updatedAt: '2024-12-02',
      },
    ]

    render(<ProducerReportTable rows={rows} />)

    const sortButton = screen.getByRole('button', { name: /produtor/i })

    await user.click(sortButton)
    const rowTextsAsc = screen.getAllByRole('row').map((row) => row.textContent || '')
    expect(rowTextsAsc[1]).toContain('Alpha Agro')

    await user.click(sortButton)
    const rowTextsDesc = screen.getAllByRole('row').map((row) => row.textContent || '')
    expect(rowTextsDesc[1]).toContain('Zulu Agro')
  })

  it('paginação avança de página', async () => {
    const user = userEvent.setup()
    render(<ProducerReportTable rows={buildRows(12)} />)

    expect(screen.queryByText('Produtor A0')).not.toBeInTheDocument()
    expect(screen.getByText('Produtor L11')).toBeInTheDocument()

    await user.click(screen.getByRole('button', { name: 'Próximo' }))

    expect(screen.getByText('Produtor A0')).toBeInTheDocument()
  })
})
