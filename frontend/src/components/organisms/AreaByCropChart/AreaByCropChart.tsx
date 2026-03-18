'use client'

import styled from 'styled-components'
import { Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { theme } from '@/styles/theme'
import type { AreasByCropDto } from '@/domain/types'

interface AreaByCropChartProps {
  data: AreasByCropDto[]
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

export default function AreaByCropChart({ data }: AreaByCropChartProps) {
  return (
    <Card>
      <Title>Área por Cultura (ha)</Title>
      {data.length === 0 ? (
        <Empty>Nenhum dado disponível</Empty>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={data} layout="vertical" margin={{ top: 12, right: 8, left: 14, bottom: 8 }}>
            <CartesianGrid strokeDasharray="3 3" stroke={theme.colors.border} horizontal={false} />
            <XAxis type="number" stroke={theme.colors.textSecondary} fontSize={12} />
            <YAxis dataKey="crop" type="category" stroke={theme.colors.textSecondary} fontSize={12} width={110} />
            <Tooltip
              cursor={{ fill: theme.colors.primaryXLight }}
              contentStyle={{
                borderRadius: 12,
                border: `1px solid ${theme.colors.border}`,
                backgroundColor: theme.colors.surface,
              }}
              formatter={(value: number) => [`${Number(value).toLocaleString('pt-BR')} ha`, 'Área']}
            />
            <Bar dataKey="totalArea" radius={[0, 8, 8, 0]}>
              {data.map((item, index) => (
                <Cell key={`${item.crop}-${index}`} fill={theme.colors.chart[index % theme.colors.chart.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      )}
    </Card>
  )
}
