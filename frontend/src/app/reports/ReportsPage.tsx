'use client'

import { useEffect, useMemo, useState } from 'react'
import styled, { createGlobalStyle } from 'styled-components'
import { BarChart3, Building2, LandPlot, Users } from 'lucide-react'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import Button from '@/components/atoms/Button/Button'
import StatCard from '@/components/molecules/StatCard/StatCard'
import Spinner from '@/components/atoms/Spinner/Spinner'
import FarmsByStateChart from '@/components/organisms/FarmsByStateChart/FarmsByStateChart'
import AreaByCropChart from '@/components/organisms/AreaByCropChart/AreaByCropChart'
import ProducerReportTable from '@/components/organisms/ProducerReportTable/ProducerReportTable'
import { theme } from '@/styles/theme'
import { useReports } from '@/application/hooks/useReports'
import { api } from '@/application/services/api'
import type { HarvestDto, ReportsFiltersDto } from '@/domain/types'

const PrintStyles = createGlobalStyle`
  @media print {
    aside, header {
      display: none !important;
    }

    main {
      grid-column: 1 !important;
      grid-row: 1 !important;
      padding: 0 !important;
      overflow: visible !important;
    }

    .reports-filters,
    .reports-footer {
      display: none !important;
    }

    .reports-root {
      padding: 0 !important;
      gap: 16px !important;
    }

    .reports-table-wrap {
      max-height: none !important;
      overflow: visible !important;
    }
  }
`

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
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
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`

const FiltersCard = styled.section`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.card};
  padding: 16px;
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
  align-items: end;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Field = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 12px;
  font-weight: 700;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const Select = styled.select`
  height: 44px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.md};
  padding: 0 12px;
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.surface};
  font-size: 14px;
`

const KpiGrid = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(4, minmax(0, 1fr));

  @media (max-width: 1200px) {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  @media (max-width: 640px) {
    grid-template-columns: 1fr;
  }
`

const ChartsGrid = styled.section`
  display: grid;
  gap: 16px;
  grid-template-columns: repeat(2, minmax(0, 1fr));

  @media (max-width: 1100px) {
    grid-template-columns: 1fr;
  }
`

const FooterNote = styled.footer`
  background-color: ${theme.colors.primaryXLight};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  color: ${theme.colors.textSecondary};
  font-size: 13px;
  padding: 12px 14px;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 220px;
`

const ErrorContainer = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: ${theme.radii.lg};
  padding: 16px;
  color: #991b1b;
`

const BRAZIL_UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 'MA', 'MT', 'MS', 'MG',
  'PA', 'PB', 'PR', 'PE', 'PI', 'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO',
]

export default function ReportsPage() {
  const {
    filters,
    kpis,
    farmsByState,
    areasByCrop,
    producerReport,
    loading,
    error,
    applyFilters,
  } = useReports()

  const [harvestOptions, setHarvestOptions] = useState<HarvestDto[]>([])
  const [pendingFilters, setPendingFilters] = useState<ReportsFiltersDto>(filters)

  useEffect(() => {
    let isMounted = true

    async function loadHarvests() {
      try {
        const response = await api.harvests.getAll()
        if (isMounted) setHarvestOptions(response)
      } catch {
        if (isMounted) setHarvestOptions([])
      }
    }

    loadHarvests()

    return () => {
      isMounted = false
    }
  }, [])

  useEffect(() => {
    setPendingFilters(filters)
  }, [filters])

  const hasData = useMemo(() => {
    return producerReport.length > 0 || farmsByState.length > 0 || areasByCrop.length > 0
  }, [areasByCrop.length, farmsByState.length, producerReport.length])

  return (
    <AppLayout>
      <PrintStyles />
      <PageContainer className="reports-root">
        <Header>
          <Title>Relatórios</Title>
          <Subtitle>Análise de desempenho agrícola e uso da terra</Subtitle>
        </Header>

        <FiltersCard className="reports-filters">
          <Field>
            <Label>Safra</Label>
            <Select
              value={pendingFilters.harvestId ?? ''}
              onChange={(event) => {
                const value = event.target.value
                setPendingFilters((previous) => ({
                  ...previous,
                  harvestId: value === '' ? null : value,
                }))
              }}
            >
              <option value="">Todas as safras</option>
              {harvestOptions.map((harvest) => (
                <option key={harvest.id} value={harvest.id}>
                  {harvest.name}
                </option>
              ))}
            </Select>
          </Field>

          <Field>
            <Label>Estado</Label>
            <Select
              value={pendingFilters.state ?? ''}
              onChange={(event) => {
                const value = event.target.value
                setPendingFilters((previous) => ({
                  ...previous,
                  state: value === '' ? null : value,
                }))
              }}
            >
              <option value="">Todos os estados</option>
              {BRAZIL_UFS.map((uf) => (
                <option key={uf} value={uf}>
                  {uf}
                </option>
              ))}
            </Select>
          </Field>

          <Button
            variant="primary"
            onClick={() => {
              applyFilters(pendingFilters)
            }}
          >
            Aplicar Filtros
          </Button>
        </FiltersCard>

        {loading && !hasData ? (
          <LoadingContainer>
            <Spinner size={44} />
          </LoadingContainer>
        ) : (
          <>
            {error && (
              <ErrorContainer>
                <strong>Erro ao carregar relatórios</strong>
                <p>{error}</p>
              </ErrorContainer>
            )}

            <KpiGrid>
              <StatCard
                title="Total de Produtores"
                value={kpis.totalProducers}
                subtitle="cadastrados no sistema"
                icon={<Users size={20} />}
              />
              <StatCard
                title="Total de Fazendas"
                value={kpis.totalFarms}
                subtitle="propriedades ativas"
                icon={<Building2 size={20} />}
              />
              <StatCard
                title="Área Total"
                value={kpis.totalArea}
                unit="ha"
                subtitle="soma de todas as fazendas"
                icon={<LandPlot size={20} />}
              />
              <StatCard
                title="Média por Fazenda"
                value={kpis.avgAreaPerFarm}
                unit="ha"
                subtitle="área média"
                icon={<BarChart3 size={20} />}
              />
            </KpiGrid>

            <ChartsGrid>
              <FarmsByStateChart data={farmsByState} />
              <AreaByCropChart data={areasByCrop} />
            </ChartsGrid>

            <div className="reports-table-wrap">
              <ProducerReportTable rows={producerReport} />
            </div>
          </>
        )}

        <FooterNote className="reports-footer">
          Dados atualizados diariamente. Última sincronização: hoje às 03:00. Fonte: Censo Agrícola 2024.
        </FooterNote>
      </PageContainer>
    </AppLayout>
  )
}
