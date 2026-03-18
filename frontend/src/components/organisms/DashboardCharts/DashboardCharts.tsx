'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import DonutChart from '@/components/molecules/DonutChart/DonutChart'
import type { DashboardDto } from '@/domain/types'

interface DashboardChartsProps {
  data: DashboardDto
}

const Section = styled.section`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 640px) {
    gap: 12px;
    flex-direction: column;
    align-items: flex-start;
  }
`

const Title = styled.h2`
  font-size: 18px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`

const Badge = styled.span`
  padding: 6px 14px;
  background-color: ${theme.colors.primaryXLight};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.full};
  font-size: 12px;
  font-weight: 600;
  color: ${theme.colors.primary};
`

const ChartsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 24px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

export default function DashboardCharts({ data }: DashboardChartsProps) {
  const landUseTotal =
    data.byLandUse.arableArea + data.byLandUse.vegetationArea + data.byLandUse.unusedArea

  const landUseData =
    landUseTotal > 0
      ? [
          {
            label: 'Arável',
            value: data.byLandUse.arableArea,
            percentage: Number(((data.byLandUse.arableArea / landUseTotal) * 100).toFixed(2)),
          },
          {
            label: 'Vegetação',
            value: data.byLandUse.vegetationArea,
            percentage: Number(((data.byLandUse.vegetationArea / landUseTotal) * 100).toFixed(2)),
          },
          {
            label: 'Não Utilizado',
            value: data.byLandUse.unusedArea,
            percentage: Number(((data.byLandUse.unusedArea / landUseTotal) * 100).toFixed(2)),
          },
        ].filter((slice) => slice.value > 0)
      : []

  return (
    <Section>
      <Header>
        <Title>Análise de Distribuição</Title>
        <Badge>Dados Anuais</Badge>
      </Header>
      <ChartsGrid>
        <DonutChart data={data.byState} centerLabel="Regional" title="Propriedades por Estado" />
        <DonutChart data={data.byCrop} centerLabel="Tipos de Produção" title="Propriedades por Cultura" />
        <DonutChart data={landUseData} centerLabel="Terra Sat" title="Eficiência de Uso de Terra" />
      </ChartsGrid>
    </Section>
  )
}
