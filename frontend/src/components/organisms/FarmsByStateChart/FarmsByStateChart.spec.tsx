import { render, screen } from '@testing-library/react'
import FarmsByStateChart from './FarmsByStateChart'

jest.mock('recharts', () => ({
  ResponsiveContainer: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  BarChart: ({
    children,
    data,
  }: {
    children: React.ReactNode
    data: Array<{ state: string }>
  }) => (
    <div>
      {data.map((item) => (
        <div key={item.state} data-testid={`bar-${item.state}`}>
          {item.state}
        </div>
      ))}
      {children}
    </div>
  ),
  CartesianGrid: () => null,
  XAxis: ({ dataKey }: { dataKey: string }) => <div data-testid={`x-axis-${dataKey}`} />,
  YAxis: () => null,
  Tooltip: () => null,
  Bar: () => <div />,
}))

describe('FarmsByStateChart', () => {
  it('renderiza barras para todos os estados recebidos', () => {
    const data = [
      { state: 'MT', count: 32 },
      { state: 'SP', count: 24 },
      { state: 'GO', count: 18 },
    ]

    render(<FarmsByStateChart data={data} />)

    expect(screen.getByTestId('bar-MT')).toBeInTheDocument()
    expect(screen.getByTestId('bar-SP')).toBeInTheDocument()
    expect(screen.getByTestId('bar-GO')).toBeInTheDocument()
  })
})
