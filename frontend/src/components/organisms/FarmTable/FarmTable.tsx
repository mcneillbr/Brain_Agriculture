'use client'

import styled from 'styled-components'
import { Eye } from 'lucide-react'
import { theme } from '@/styles/theme'
import type { FarmDto } from '@/domain/types'

interface FarmTableProps {
  farms: FarmDto[]
  totalItems: number
  pageSize: number
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  onView?: (farm: FarmDto) => void
}

const Wrapper = styled.div`
  width: 100%;
`

const TableScroller = styled.div`
  overflow-x: auto;

  @media (max-width: 900px) {
    display: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  min-width: 1180px;
`

const THead = styled.thead`
  background-color: #f6faf9;
  border-bottom: 1px solid ${theme.colors.border};
`

const TH = styled.th<{ $align?: 'left' | 'right' | 'center' }>`
  padding: 18px 20px;
  text-align: ${({ $align }) => $align ?? 'left'};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.08em;
  color: ${theme.colors.textSecondary};
  font-weight: 800;
`

const TR = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background-color: #fbfefd;
  }
`

const TD = styled.td<{ $align?: 'left' | 'right' | 'center' }>`
  padding: 16px 20px;
  text-align: ${({ $align }) => $align ?? 'left'};
  color: ${theme.colors.textPrimary};
  font-size: 14px;
`

const FarmIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const FarmIcon = styled.div`
  width: 34px;
  height: 34px;
  border-radius: ${theme.radii.md};
  background-color: ${theme.colors.primaryXLight};
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  flex-shrink: 0;
`

const FarmName = styled.span`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`

const ProducerName = styled.span`
  font-size: 15px;
  font-weight: 600;
`

const StateBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
  padding: 2px 8px;
  border-radius: ${theme.radii.full};
  background-color: ${theme.colors.primaryXLight};
  color: ${theme.colors.primary};
  font-size: 10px;
  font-weight: 800;
  margin-left: 8px;
`

const AreaValue = styled.span`
  font-weight: 800;
  font-style: italic;
  font-size: 24px;
`

const LandUseStack = styled.div`
  width: 140px;
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MiniLabel = styled.span<{ $tone: 'arable' | 'vegetation' }>`
  font-size: 10px;
  font-weight: 800;
  text-transform: uppercase;
  color: ${({ $tone }) => ($tone === 'arable' ? theme.colors.success : theme.colors.primary)};
`

const ProgressBar = styled.div`
  height: 6px;
  width: 100%;
  background-color: #eaf2f0;
  border-radius: ${theme.radii.full};
  overflow: hidden;
`

const Progress = styled.div<{ $value: number; $tone: 'arable' | 'vegetation' }>`
  height: 100%;
  width: ${({ $value }) => `${Math.max(0, Math.min(100, $value))}%`};
  border-radius: ${theme.radii.full};
  background-color: ${({ $tone }) => ($tone === 'arable' ? '#22b16f' : '#8bbdb6')};
`

const CropsWrap = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
`

const CropBadge = styled.span<{ $name: string }>`
  padding: 3px 8px;
  border-radius: ${theme.radii.sm};
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  background-color: ${({ $name }) => {
    const normalized = $name.toLowerCase()
    if (normalized.includes('soja')) return theme.colors.primary
    if (normalized.includes('milho')) return '#e8a838'
    if (normalized.includes('algod')) return '#198bc7'
    if (normalized.includes('caf')) return '#7a5435'
    if (normalized.includes('cana')) return '#3f9c4f'
    return '#6b8a87'
  }};
`

const HarvestBadge = styled.span`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 5px 12px;
  border-radius: ${theme.radii.full};
  font-size: 12px;
  font-style: italic;
  font-weight: 700;
  background-color: ${theme.colors.primaryXLight};
  color: ${theme.colors.primary};
`

const Actions = styled.div`
  display: flex;
  justify-content: center;
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  transition: color 0.2s ease;

  &:hover {
    color: ${theme.colors.primary};
  }

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${theme.colors.textMuted};
`

const Footer = styled.footer`
  padding: 16px 20px;
  border-top: 1px solid ${theme.colors.border};
  background-color: #f7fbfa;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;

  @media (max-width: 900px) {
    flex-direction: column;
    align-items: stretch;
  }
`

const CountText = styled.p`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
`

const Pagination = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
`

const PageButton = styled.button<{ $active?: boolean }>`
  min-width: 40px;
  height: 34px;
  border-radius: ${theme.radii.sm};
  border: 1px solid ${({ $active }) => ($active ? theme.colors.primary : theme.colors.border)};
  background-color: ${({ $active }) => ($active ? theme.colors.primary : theme.colors.surface)};
  color: ${({ $active }) => ($active ? '#fff' : theme.colors.textPrimary)};
  font-size: 13px;
  font-weight: 700;
  cursor: pointer;

  &:disabled {
    opacity: 0.45;
    cursor: not-allowed;
  }
`

const MobileList = styled.div`
  display: none;

  @media (max-width: 900px) {
    display: flex;
    flex-direction: column;
    border-top: 1px solid ${theme.colors.border};
  }
`

const MobileCard = styled.article`
  padding: 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
  border-bottom: 1px solid ${theme.colors.border};
`

const MobileTop = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

const MobileMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
`

const MobileLabel = styled.span`
  font-size: 10px;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  color: ${theme.colors.textMuted};
  font-weight: 700;
`

const MobileValue = styled.span`
  font-size: 13px;
  color: ${theme.colors.textPrimary};
  font-weight: 600;
`

function formatArea(value: number): string {
  return new Intl.NumberFormat('pt-BR').format(value)
}

function getHarvestLabel(farm: FarmDto): string {
  if (farm.crops.length === 0) return 'Sem safra'

  const firstCrop = farm.crops[0]
  if (!firstCrop.harvestId) return 'Sem safra'

  return firstCrop.harvestId.slice(0, 8)
}

function pageWindow(currentPage: number, totalPages: number): number[] {
  if (totalPages <= 5) {
    return Array.from({ length: totalPages }, (_, idx) => idx + 1)
  }

  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, start + 4)
  const offsetStart = Math.max(1, end - 4)
  return Array.from({ length: end - offsetStart + 1 }, (_, idx) => offsetStart + idx)
}

export default function FarmTable({
  farms,
  totalItems,
  pageSize,
  currentPage,
  totalPages,
  onPageChange,
  onView,
}: FarmTableProps) {
  if (totalItems === 0) {
    return (
      <EmptyState>
        <p>Nenhuma fazenda encontrada. Cadastre uma nova fazenda para começar.</p>
      </EmptyState>
    )
  }

  const firstItem = farms.length === 0 ? 0 : (currentPage - 1) * pageSize + 1
  const lastItem = farms.length === 0 ? 0 : firstItem + farms.length - 1
  const visiblePages = pageWindow(currentPage, totalPages)

  return (
    <Wrapper>
      <TableScroller>
        <Table>
          <THead>
            <tr>
              <TH>Nome da Fazenda</TH>
              <TH>Produtor</TH>
              <TH>Cidade / Estado</TH>
              <TH $align="right">Área Total (ha)</TH>
              <TH>Agricultável / Vegetação</TH>
              <TH>Culturas</TH>
              <TH>Safra</TH>
              <TH $align="center">Ações</TH>
            </tr>
          </THead>
          <tbody>
            {farms.map((farm) => (
              <TR key={farm.id}>
                <TD>
                  <FarmIdentity>
                    <FarmIcon aria-hidden="true">🌱</FarmIcon>
                    <FarmName>{farm.name}</FarmName>
                  </FarmIdentity>
                </TD>
                <TD>
                  <ProducerName>{farm.producerName ?? 'Produtor não informado'}</ProducerName>
                </TD>
                <TD>
                  {farm.city}
                  <StateBadge>{farm.state}</StateBadge>
                </TD>
                <TD $align="right">
                  <AreaValue>{formatArea(farm.totalArea)}</AreaValue>
                </TD>
                <TD>
                  <LandUseStack>
                    <MiniLabel $tone="arable">Agricultável {Math.round(farm.arablePercentage)}%</MiniLabel>
                    <ProgressBar>
                      <Progress $tone="arable" $value={farm.arablePercentage} />
                    </ProgressBar>

                    <MiniLabel $tone="vegetation">
                      Vegetação {Math.round(farm.vegetationPercentage)}%
                    </MiniLabel>
                    <ProgressBar>
                      <Progress $tone="vegetation" $value={farm.vegetationPercentage} />
                    </ProgressBar>
                  </LandUseStack>
                </TD>
                <TD>
                  <CropsWrap>
                    {farm.crops.length === 0 && <CropBadge $name="empty">Sem cultura</CropBadge>}
                    {farm.crops.slice(0, 3).map((crop) => (
                      <CropBadge key={crop.id} $name={crop.name}>
                        {crop.name}
                      </CropBadge>
                    ))}
                  </CropsWrap>
                </TD>
                <TD>
                  <HarvestBadge>{getHarvestLabel(farm)}</HarvestBadge>
                </TD>
                <TD $align="center">
                  <Actions>
                    <IconButton
                      type="button"
                      onClick={() => onView?.(farm)}
                      disabled={!onView}
                      title="Ver detalhes"
                      aria-label={`Ver detalhes da fazenda ${farm.name}`}
                    >
                      <Eye />
                    </IconButton>
                  </Actions>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </TableScroller>

      <MobileList>
        {farms.map((farm) => (
          <MobileCard key={farm.id}>
            <MobileTop>
              <FarmIdentity>
                <FarmIcon aria-hidden="true">🌱</FarmIcon>
                <FarmName>{farm.name}</FarmName>
              </FarmIdentity>
              <IconButton
                type="button"
                onClick={() => onView?.(farm)}
                disabled={!onView}
                aria-label={`Ver detalhes ${farm.name}`}
              >
                <Eye />
              </IconButton>
            </MobileTop>

            <MobileMeta>
              <div>
                <MobileLabel>Produtor</MobileLabel>
                <MobileValue>{farm.producerName ?? 'Não informado'}</MobileValue>
              </div>
              <div>
                <MobileLabel>Área total</MobileLabel>
                <MobileValue>{formatArea(farm.totalArea)} ha</MobileValue>
              </div>
              <div>
                <MobileLabel>Localização</MobileLabel>
                <MobileValue>
                  {farm.city} / {farm.state}
                </MobileValue>
              </div>
              <div>
                <MobileLabel>Safra</MobileLabel>
                <MobileValue>{getHarvestLabel(farm)}</MobileValue>
              </div>
            </MobileMeta>

            <CropsWrap>
              {farm.crops.length === 0 && <CropBadge $name="empty">Sem cultura</CropBadge>}
              {farm.crops.slice(0, 3).map((crop) => (
                <CropBadge key={crop.id} $name={crop.name}>
                  {crop.name}
                </CropBadge>
              ))}
            </CropsWrap>
          </MobileCard>
        ))}
      </MobileList>

      <Footer>
        <CountText>
          Exibindo {firstItem}-{lastItem} de {totalItems} fazendas
        </CountText>

        <Pagination>
          <PageButton
            type="button"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage === 1}
          >
            Anterior
          </PageButton>

          {visiblePages.map((page) => (
            <PageButton
              key={page}
              type="button"
              $active={page === currentPage}
              onClick={() => onPageChange(page)}
            >
              {page}
            </PageButton>
          ))}

          <PageButton
            type="button"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
          >
            Próxima
          </PageButton>
        </Pagination>
      </Footer>
    </Wrapper>
  )
}
