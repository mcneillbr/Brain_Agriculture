'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts'
import type { PieSliceDto } from '@/domain/types'

interface DonutChartProps {
  title: string
  centerLabel: string
  data: PieSliceDto[]
}

const Card = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 24px;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 16px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`

const Title = styled.h3`
  font-size: 14px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const ChartWrapper = styled.div`
  height: 200px;
  position: relative;

  @media (max-width: 640px) {
    height: 180px;
  }
`

const Legend = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const LegendItem = styled.li`
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`

const Dot = styled.span<{ $color: string }>`
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background-color: ${({ $color }) => $color};
  flex-shrink: 0;
`

const LegendLabel = styled.span`
  flex: 1;
  color: ${theme.colors.textPrimary};
`

const LegendPercent = styled.span`
  font-weight: 600;
  color: ${theme.colors.textSecondary};
`

export default function DonutChart({ title, centerLabel, data }: DonutChartProps) {
  const hasData = data.length > 0

  return (
    <Card>
      <Title>{title}</Title>
      <ChartWrapper>
        {hasData ? (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                dataKey="value"
                nameKey="label"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={90}
                strokeWidth={2}
              >
                {data.map((_, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={theme.colors.chart[index % theme.colors.chart.length]}
                  />
                ))}
              </Pie>
              <Tooltip
                formatter={(value: number, name: string) => [value, name]}
                contentStyle={{
                  borderRadius: theme.radii.sm,
                  border: `1px solid ${theme.colors.border}`,
                  fontSize: 13,
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <div
            style={{
              height: '100%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: theme.colors.textMuted,
              fontSize: 13,
              fontWeight: 600,
            }}
          >
            Nenhum dado disponível
          </div>
        )}
        {/* Center label overlay */}
        {hasData && (
          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              textAlign: 'center',
              pointerEvents: 'none',
            }}
          >
            <div
              style={{
                fontSize: 12,
                color: theme.colors.textMuted,
                fontWeight: 500,
              }}
            >
              {centerLabel}
            </div>
          </div>
        )}
      </ChartWrapper>
      <Legend>
        {(hasData ? data : [{ label: 'No data', value: 0, percentage: 0 }]).map((slice, index) => (
          <LegendItem key={slice.label}>
            <Dot $color={theme.colors.chart[index % theme.colors.chart.length]} />
            <LegendLabel>{slice.label}</LegendLabel>
            <LegendPercent>{slice.percentage}%</LegendPercent>
          </LegendItem>
        ))}
      </Legend>
    </Card>
  )
}
