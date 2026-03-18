'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import ProducerTable from '@/components/organisms/ProducerTable/ProducerTable'
import Button from '@/components/atoms/Button/Button'
import { useProducers } from '@/application/hooks/useProducers'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { Building2, Download, Printer, Search, TrendingUp, UserRound } from 'lucide-react'

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
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: stretch;

    button {
      align-self: flex-start;
    }
  }
`

const TitleSection = styled.div`
  flex: 1;
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
  margin-bottom: 4px;

  @media (max-width: 640px) {
    font-size: 24px;
  }
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`

const FiltersCard = styled.section`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  overflow: hidden;
  box-shadow: ${theme.shadows.card};
`

const FiltersBar = styled.div`
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  border-bottom: 1px solid ${theme.colors.border};

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }

  @media (max-width: 640px) {
    padding: 16px;
  }
`

const FiltersGroup = styled.div`
  display: flex;
  gap: 12px;
  flex: 1;
  flex-wrap: wrap;
  align-items: center;
`

const SearchField = styled.div`
  position: relative;
  min-width: 260px;
  flex: 1;

  @media (max-width: 640px) {
    min-width: 100%;
  }
`

const SearchIcon = styled.span`
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: ${theme.colors.textMuted};
  pointer-events: none;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.2;
  }
`

const SearchInput = styled.input`
  width: 100%;
  height: 46px;
  border: 1px solid transparent;
  border-radius: ${theme.radii.md};
  background-color: ${theme.colors.background};
  padding: 0 16px 0 40px;
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  outline: none;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.surface};
  }
`

const Select = styled.select`
  height: 46px;
  min-width: 180px;
  border: 1px solid transparent;
  border-radius: ${theme.radii.md};
  background-color: ${theme.colors.background};
  padding: 0 14px;
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  outline: none;

  &:focus {
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.surface};
  }

  @media (max-width: 640px) {
    min-width: calc(50% - 6px);
    flex: 1;
  }
`

const UtilityActions = styled.div`
  display: flex;
  gap: 10px;
  flex-shrink: 0;
`

const IconAction = styled.button`
  width: 46px;
  height: 46px;
  border-radius: ${theme.radii.md};
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.textSecondary};
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
    border-color: ${theme.colors.primary};
    background-color: ${theme.colors.primaryXLight};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`

const StatsGrid = styled.section`
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 16px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const StatCard = styled.div`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  padding: 20px;
  box-shadow: ${theme.shadows.card};
  display: flex;
  align-items: center;
  gap: 14px;
`

const StatIcon = styled.div<{ $tone: 'success' | 'primary' | 'warning' }>`
  width: 48px;
  height: 48px;
  border-radius: 999px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 22px;
  background-color: ${({ $tone }) => {
    if ($tone === 'success') return '#ecfdf3'
    if ($tone === 'warning') return '#fff7e8'
    return theme.colors.primaryXLight
  }};
  color: ${({ $tone }) => {
    if ($tone === 'success') return theme.colors.success
    if ($tone === 'warning') return theme.colors.warning
    return theme.colors.primary
  }};

  svg {
    width: 22px;
    height: 22px;
    stroke-width: 2.2;
  }
`

const StatContent = styled.div`
  display: flex;
  flex-direction: column;
  gap: 2px;
`

const StatLabel = styled.span`
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textMuted};
  font-weight: 700;
`

const StatValue = styled.strong`
  font-size: 24px;
  line-height: 1.1;
  color: ${theme.colors.textPrimary};
`

const StatMeta = styled.span`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
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

export default function ProducersPage() {
  const router = useRouter()
  const [query, setQuery] = useState('')
  const [documentType, setDocumentType] = useState<'ALL' | 'CPF' | 'CNPJ'>('ALL')
  const [sortBy, setSortBy] = useState<'recent' | 'oldest' | 'name'>('recent')
  const { items, loading, error, remove } = useProducers()

  const filteredItems = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase()

    const filtered = items.filter((producer) => {
      const matchesQuery =
        normalizedQuery.length === 0 ||
        producer.name.toLowerCase().includes(normalizedQuery) ||
        producer.documentFormatted.toLowerCase().includes(normalizedQuery) ||
        producer.document.toLowerCase().includes(normalizedQuery)

      const matchesType = documentType === 'ALL' || producer.documentType === documentType

      return matchesQuery && matchesType
    })

    return filtered.sort((left, right) => {
      if (sortBy === 'name') {
        return left.name.localeCompare(right.name)
      }

      if (sortBy === 'oldest') {
        return new Date(left.createdAt).getTime() - new Date(right.createdAt).getTime()
      }

      return new Date(right.createdAt).getTime() - new Date(left.createdAt).getTime()
    })
  }, [documentType, items, query, sortBy])

  const totalCpf = items.filter((producer) => producer.documentType === 'CPF').length
  const totalCnpj = items.filter((producer) => producer.documentType === 'CNPJ').length

  const handleExportCsv = () => {
    const rows = filteredItems.map((producer) => [
      producer.name,
      producer.documentFormatted,
      producer.documentType,
      new Date(producer.createdAt).toLocaleDateString('pt-BR'),
    ])

    const header = ['Nome', 'Documento', 'Tipo', 'Criado em']
    const csv = [header, ...rows]
      .map((row) => row.map((cell) => `"${String(cell).replaceAll('"', '""')}"`).join(','))
      .join('\n')

    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = 'producers.csv'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  const handlePrint = () => {
    window.print()
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
          <strong>Erro ao carregar produtores</strong>
          <p>{error}</p>
        </ErrorContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <TitleSection>
            <Title>Produtores</Title>
            <Subtitle>Gerencie e monitore produtores agrícolas registrados e seus ativos.</Subtitle>
          </TitleSection>
          <Button
            variant="primary"
            onClick={() => router.push('/producers/new')}
          >
            + Novo Produtor
          </Button>
        </Header>

        <FiltersCard>
          <FiltersBar>
            <FiltersGroup>
              <SearchField>
                <SearchIcon aria-hidden="true">
                  <Search />
                </SearchIcon>
                <SearchInput
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Pesquisar por nome ou documento..."
                  aria-label="Pesquisar produtores"
                />
              </SearchField>

              <Select
                value={documentType}
                onChange={(event) => setDocumentType(event.target.value as 'ALL' | 'CPF' | 'CNPJ')}
                aria-label="Filtrar por tipo de documento"
              >
                <option value="ALL">Todos os Tipos</option>
                <option value="CPF">CPF</option>
                <option value="CNPJ">CNPJ</option>
              </Select>

              <Select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value as 'recent' | 'oldest' | 'name')}
                aria-label="Ordenar produtores"
              >
                <option value="recent">Ordenar: Recentes</option>
                <option value="oldest">Ordenar: Antigos</option>
                <option value="name">Ordenar: Nome</option>
              </Select>
            </FiltersGroup>

            <UtilityActions>
              <IconAction type="button" onClick={handleExportCsv} title="Baixar CSV" aria-label="Baixar CSV">
                <Download />
              </IconAction>
              <IconAction type="button" onClick={handlePrint} title="Imprimir lista" aria-label="Imprimir lista">
                <Printer />
              </IconAction>
            </UtilityActions>
          </FiltersBar>

          <ProducerTable
            producers={filteredItems}
            onEdit={(producer) => router.push(`/producers/${producer.id}`)}
            onDelete={(id) => remove(id)}
          />
        </FiltersCard>

        <StatsGrid>
          <StatCard>
            <StatIcon $tone="success">
              <TrendingUp />
            </StatIcon>
            <StatContent>
              <StatLabel>Total de Produtores</StatLabel>
              <StatValue>{items.length}</StatValue>
              <StatMeta>Base carregada atualmente na interface</StatMeta>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $tone="primary">
              <UserRound />
            </StatIcon>
            <StatContent>
              <StatLabel>Registros CPF</StatLabel>
              <StatValue>{totalCpf}</StatValue>
              <StatMeta>Produtores individuais registrados</StatMeta>
            </StatContent>
          </StatCard>

          <StatCard>
            <StatIcon $tone="warning">
              <Building2 />
            </StatIcon>
            <StatContent>
              <StatLabel>Registros CNPJ</StatLabel>
              <StatValue>{totalCnpj}</StatValue>
              <StatMeta>Produtores corporativos registrados</StatMeta>
            </StatContent>
          </StatCard>
        </StatsGrid>


      </PageContainer>
    </AppLayout>
  )
}
