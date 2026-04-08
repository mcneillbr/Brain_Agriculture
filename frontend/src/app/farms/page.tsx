'use client'

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { Download, LandPlot, Map, Plus } from 'lucide-react'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import Spinner from '@/components/atoms/Spinner/Spinner'
import Button from '@/components/atoms/Button/Button'
import FarmTable from '@/components/organisms/FarmTable/FarmTable'
import { useFarms } from '@/application/hooks/useFarms'
import { theme } from '@/styles/theme'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const Header = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 16px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const Title = styled.h1`
  font-size: 32px;
  font-weight: 900;
  letter-spacing: -0.02em;
  color: ${theme.colors.textPrimary};
  margin-bottom: 4px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`

const HeaderActions = styled.div`
  display: flex;
  gap: 10px;

  @media (max-width: 640px) {
    display: grid;
    grid-template-columns: 1fr;
  }
`

const StatGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.article`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  padding: 22px;
  box-shadow: ${theme.shadows.card};
`

const StatTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`

const StatLabel = styled.span`
  font-size: 12px;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textSecondary};
`

const IconWrap = styled.div`
  width: 30px;
  height: 30px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
  }
`

const StatValue = styled.strong`
  display: block;
  margin-top: 12px;
  font-size: 40px;
  color: ${theme.colors.textPrimary};
  line-height: 1;
  letter-spacing: -0.03em;
`

const StatUnit = styled.span`
  font-size: 16px;
  color: ${theme.colors.textMuted};
  margin-left: 6px;
`

const StatMeta = styled.p<{ $tone?: 'positive' | 'neutral' }>`
  margin-top: 18px;
  font-size: 13px;
  font-weight: ${({ $tone }) => ($tone === 'positive' ? 700 : 500)};
  color: ${({ $tone }) => ($tone === 'positive' ? theme.colors.success : theme.colors.textSecondary)};
`

const TableCard = styled.section`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  box-shadow: ${theme.shadows.md};
  overflow: hidden;
`

const LoadingContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 320px;
`

const ErrorContainer = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: ${theme.radii.lg};
  padding: 16px;
  color: #991b1b;
`

function formatCompact(value: number): string {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}k`
  }
  return new Intl.NumberFormat('pt-BR').format(Math.round(value))
}

export default function FarmsPage() {
  const router = useRouter()
  const { items, loading, error } = useFarms()

  const [currentPage, setCurrentPage] = useState(1)
  const pageSize = 10

  const totals = useMemo(() => {
    const totalFarms = items.length
    const totalArea = items.reduce((sum, farm) => sum + farm.totalArea, 0)
    const avgArea = totalFarms === 0 ? 0 : totalArea / totalFarms
    const byState = new Set(items.map((farm) => farm.state))
    const createdThisMonth = items.filter((farm) => {
      const created = new Date(farm.createdAt)
      const now = new Date()
      return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
    }).length

    return {
      totalFarms,
      totalArea,
      avgArea,
      statesCount: byState.size,
      createdThisMonth,
    }
  }, [items])

  const totalPages = Math.max(1, Math.ceil(items.length / pageSize))

  useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [currentPage, totalPages])

  const pageItems = useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return items.slice(start, start + pageSize)
  }, [currentPage, items, pageSize])

  const handleExportCsv = () => {
    const header = ['Nome da Fazenda', 'Produtor', 'Cidade', 'Estado', 'Área Total', 'Agricultável %', 'Vegetação %']
    const rows = items.map((farm) => [
      farm.name,
      farm.producerName ?? '',
      farm.city,
      farm.state,
      farm.totalArea,
      Math.round(farm.arablePercentage),
      Math.round(farm.vegetationPercentage),
    ])

    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'farms.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  if (loading) {
    return (
      <AppLayout>
        <LoadingContainer>
          <Spinner size={48} />
        </LoadingContainer>
      </AppLayout>
    )
  }

  if (error) {
    return (
      <AppLayout>
        <ErrorContainer>
          <strong>Erro ao carregar fazendas</strong>
          <p>{error}</p>
        </ErrorContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <div>
            <Title>Fazendas</Title>
            <Subtitle>Gerencie e monitore propriedades rurais cadastradas e suas culturas.</Subtitle>
          </div>

          <HeaderActions>
            <Button variant="ghost" onClick={handleExportCsv}>
              <Download size={16} /> Exportar
            </Button>
            <Button variant="primary" onClick={() => router.push('/producers/new')}>
              <Plus size={16} /> Nova Fazenda
            </Button>
          </HeaderActions>
        </Header>

        <StatGrid>
          <StatCard>
            <StatTop>
              <StatLabel>Total de Fazendas</StatLabel>
              <IconWrap>
                <LandPlot />
              </IconWrap>
            </StatTop>
            <StatValue>{totals.totalFarms}</StatValue>
            <StatMeta $tone="positive">+{totals.createdThisMonth} neste mês</StatMeta>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Área Total</StatLabel>
              <IconWrap>
                <Map />
              </IconWrap>
            </StatTop>
            <StatValue>
              {formatCompact(totals.totalArea)}
              <StatUnit>ha</StatUnit>
            </StatValue>
            <StatMeta>Cobrindo {totals.statesCount} estados</StatMeta>
          </StatCard>

          <StatCard>
            <StatTop>
              <StatLabel>Área Média</StatLabel>
              <IconWrap>
                <LandPlot />
              </IconWrap>
            </StatTop>
            <StatValue>
              {new Intl.NumberFormat('pt-BR').format(Math.round(totals.avgArea))}
              <StatUnit>ha</StatUnit>
            </StatValue>
            <StatMeta>Entre todos os produtores</StatMeta>
          </StatCard>
        </StatGrid>

        <TableCard>
          <FarmTable
            farms={pageItems}
            totalItems={items.length}
            pageSize={pageSize}
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(Math.max(1, Math.min(totalPages, page)))}
            onView={(farm) => router.push(`/farms/${farm.id}`)}
          />
        </TableCard>
      </PageContainer>
    </AppLayout>
  )
}
