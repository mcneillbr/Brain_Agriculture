'use client'

import { useMemo, useState } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import SearchBar from '@/components/molecules/SearchBar/SearchBar'
import Button from '@/components/atoms/Button/Button'
import type { ProducerReportRowDto } from '@/domain/types'

interface ProducerReportTableProps {
  rows: ProducerReportRowDto[]
}

type SortKey = 'name' | 'document' | 'farmsCount' | 'totalArea' | 'states' | 'crops' | 'updatedAt'

type SortDirection = 'asc' | 'desc'

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

const Header = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: space-between;
  gap: 12px;
  align-items: center;
`

const Title = styled.h3`
  font-size: 16px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
`

const TableWrap = styled.div`
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  overflow: auto;
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 980px;
`

const TH = styled.th`
  text-align: left;
  font-size: 12px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 12px;
  color: ${theme.colors.textSecondary};
  background-color: ${theme.colors.primaryXLight};
  border-bottom: 1px solid ${theme.colors.border};
`

const THButton = styled.button`
  border: none;
  background: none;
  color: inherit;
  font: inherit;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 6px;
`

const TD = styled.td`
  padding: 12px;
  border-bottom: 1px solid ${theme.colors.border};
  color: ${theme.colors.textPrimary};
  font-size: 14px;
  vertical-align: top;
`

const TR = styled.tr`
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${theme.colors.primaryXLight};
  }
`

const Muted = styled.span`
  color: ${theme.colors.textSecondary};
`

const CropList = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const CropPill = styled.span<{ $index: number }>`
  font-size: 11px;
  font-weight: 700;
  border-radius: ${theme.radii.full};
  padding: 4px 8px;
  color: ${theme.colors.chart[6]};
  background-color: ${({ $index }) => `${theme.colors.chart[$index % theme.colors.chart.length]}22`};
  border: 1px solid ${({ $index }) => `${theme.colors.chart[$index % theme.colors.chart.length]}55`};
`

const Pagination = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
`

const PageInfo = styled.span`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  margin: 0 6px;
`

const Empty = styled.div`
  border: 1px dashed ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  color: ${theme.colors.textMuted};
  text-align: center;
  padding: 28px;
`

const PAGE_SIZE = 10

function normalizeText(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
}

function compareRows(
  left: ProducerReportRowDto,
  right: ProducerReportRowDto,
  key: SortKey,
  direction: SortDirection,
): number {
  const dir = direction === 'asc' ? 1 : -1

  if (key === 'farmsCount' || key === 'totalArea') {
    return (left[key] - right[key]) * dir
  }

  if (key === 'updatedAt') {
    return (
      (new Date(left.updatedAt).getTime() - new Date(right.updatedAt).getTime()) * dir
    )
  }

  if (key === 'states') {
    return left.states.join(',').localeCompare(right.states.join(','), 'pt-BR') * dir
  }

  if (key === 'crops') {
    return left.crops.join(',').localeCompare(right.crops.join(','), 'pt-BR') * dir
  }

  return left[key].localeCompare(right[key], 'pt-BR') * dir
}

export default function ProducerReportTable({ rows }: ProducerReportTableProps) {
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState<SortKey>('updatedAt')
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc')
  const [page, setPage] = useState(1)

  const filtered = useMemo(() => {
    const normalizedQuery = normalizeText(query.trim())
    if (!normalizedQuery) return rows

    return rows.filter((row) => {
      return (
        normalizeText(row.name).includes(normalizedQuery) ||
        normalizeText(row.document).includes(normalizedQuery)
      )
    })
  }, [query, rows])

  const sorted = useMemo(() => {
    return [...filtered].sort((left, right) => compareRows(left, right, sortKey, sortDirection))
  }, [filtered, sortDirection, sortKey])

  const totalPages = Math.max(1, Math.ceil(sorted.length / PAGE_SIZE))
  const safePage = Math.min(page, totalPages)

  const currentPageRows = useMemo(() => {
    const start = (safePage - 1) * PAGE_SIZE
    return sorted.slice(start, start + PAGE_SIZE)
  }, [safePage, sorted])

  const toggleSort = (nextKey: SortKey) => {
    setPage(1)
    if (sortKey === nextKey) {
      setSortDirection((previous) => (previous === 'asc' ? 'desc' : 'asc'))
      return
    }
    setSortKey(nextKey)
    setSortDirection(nextKey === 'updatedAt' ? 'desc' : 'asc')
  }

  const sortIndicator = (key: SortKey): string => {
    if (sortKey !== key) return '↕'
    return sortDirection === 'asc' ? '↑' : '↓'
  }

  return (
    <Card>
      <Header>
        <Title>Relatório de Produtores</Title>
        <SearchBar
          placeholder="Buscar produtor..."
          value={query}
          onChange={(event) => {
            setPage(1)
            setQuery(event.target.value)
          }}
        />
      </Header>

      {rows.length === 0 ? (
        <Empty>Nenhum produtor disponível para o relatório.</Empty>
      ) : (
        <>
          <TableWrap>
            <Table>
              <thead>
                <tr>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('name')}>
                      Produtor {sortIndicator('name')}
                    </THButton>
                  </TH>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('document')}>
                      Documento {sortIndicator('document')}
                    </THButton>
                  </TH>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('farmsCount')}>
                      Fazendas {sortIndicator('farmsCount')}
                    </THButton>
                  </TH>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('totalArea')}>
                      Área Total (ha) {sortIndicator('totalArea')}
                    </THButton>
                  </TH>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('states')}>
                      Estados {sortIndicator('states')}
                    </THButton>
                  </TH>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('crops')}>
                      Culturas {sortIndicator('crops')}
                    </THButton>
                  </TH>
                  <TH>
                    <THButton type="button" onClick={() => toggleSort('updatedAt')}>
                      Última Atualização {sortIndicator('updatedAt')}
                    </THButton>
                  </TH>
                </tr>
              </thead>
              <tbody>
                {currentPageRows.map((row) => (
                  <TR key={row.producerId}>
                    <TD>{row.name}</TD>
                    <TD>
                      <Muted>{row.document}</Muted>
                    </TD>
                    <TD>{row.farmsCount.toLocaleString('pt-BR')}</TD>
                    <TD>{row.totalArea.toLocaleString('pt-BR')}</TD>
                    <TD>{row.states.length > 0 ? row.states.join(', ') : '-'}</TD>
                    <TD>
                      {row.crops.length > 0 ? (
                        <CropList>
                          {row.crops.map((crop, index) => (
                            <CropPill key={`${row.producerId}-${crop}-${index}`} $index={index}>
                              {crop}
                            </CropPill>
                          ))}
                        </CropList>
                      ) : (
                        <Muted>-</Muted>
                      )}
                    </TD>
                    <TD>{new Date(row.updatedAt).toLocaleDateString('pt-BR')}</TD>
                  </TR>
                ))}
              </tbody>
            </Table>
          </TableWrap>

          <Pagination>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((previous) => Math.max(1, previous - 1))}
              disabled={safePage <= 1}
            >
              Anterior
            </Button>
            <PageInfo>
              Página {safePage} de {totalPages}
            </PageInfo>
            <Button
              variant="secondary"
              size="sm"
              onClick={() => setPage((previous) => Math.min(totalPages, previous + 1))}
              disabled={safePage >= totalPages}
            >
              Próximo
            </Button>
          </Pagination>
        </>
      )}
    </Card>
  )
}
