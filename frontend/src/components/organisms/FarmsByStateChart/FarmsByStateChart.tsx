'use client'

import styled from 'styled-components'
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { theme } from '@/styles/theme'
import type { FarmsByStateDto } from '@/domain/types'

interface FarmsByStateChartProps {
  data: FarmsByStateDto[]
}

const Card = styled.section`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.card};
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
`

const Empty = styled.div`
  height: 280px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.textMuted};
  font-size: 14px;
`

export default function FarmsByStateChart({ data }: FarmsByStateChartProps) {
  const total = data.reduce((sum, item) => sum + item.count, 0)

  return (
    <Card>
      <Title>Fazendas por Estado</Title>
      {data.length === 0 ? (
        <Empty>Nenhum dado disponível</Empty>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} margin={{ top: 12, right: 8, left: -8, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} vertical={false} />
            <XAxis dataKey="state" stroke={theme.colors.textSecondary} fontSize={12} />
            <YAxis stroke={theme.colors.textSecondary} fontSize={12} allowDecimals={false} />
            <Tooltip
              cursor={{ fill: theme.colors.primaryXLight }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.surface,
              }}
              formatter={(value: number) => {
                const percentage = total > 0 ? (Number(value) / total) * 100 : 0
                return [`${Number(value).toLocaleString('pt-BR')} (${percentage.toFixed(1)}%)`, 'Fazendas']
              }}
            />
            <Bar dataKey="count" fill={theme.colors.primary} radius={[8, 8, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
