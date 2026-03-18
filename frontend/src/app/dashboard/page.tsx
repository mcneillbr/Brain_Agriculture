'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import StatCard from '@/components/molecules/StatCard/StatCard'
import DashboardCharts from '@/components/organisms/DashboardCharts/DashboardCharts'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useDashboard } from '@/application/hooks/useDashboard'
import { Leaf, Mountain } from 'lucide-react'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;

  @media (max-width: 640px) {
    gap: 24px;
  }
`

const Header = styled.section`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`

const StatsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr));
  gap: 20px;

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
    gap: 16px;
  }
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 400px;
  width: 100%;
`

const ErrorContainer = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: ${theme.radii.lg};
  padding: 24px;
  color: #991b1b;
`

export default function DashboardPage() {
  const { data, loading, error } = useDashboard()

  if (loading) {
    return (
      <AppLayout>
        <LoadingContainer>
          <Spinner size={48} />
        </LoadingContainer>
      </AppLayout>
    )
  }

  if (error || !data) {
    return (
      <AppLayout>
        <ErrorContainer>
          <strong>Erro ao carregar o painel</strong>
          <p>{error || 'Erro desconhecido ocorreu'}</p>
        </ErrorContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <Title>Visão Geral Executiva</Title>
          <Subtitle>
            Dados agrícolas consolidados em tempo real e análise de distribuição de terras.
          </Subtitle>
        </Header>

        <StatsGrid>
          <StatCard
            title="Total de Propriedades Registradas"
            value={data.totalFarms}
            subtitle="Valor ao vivo da API"
            icon={<Leaf size={20} />}
          />
          <StatCard
            title="Área Produtiva Total"
            value={data.totalHectares}
            unit="ha"
            subtitle="Área agregada da API"
            icon={<Mountain size={20} />}
          />
        </StatsGrid>

        <DashboardCharts data={data} />
      </PageContainer>
    </AppLayout>
  )
}
