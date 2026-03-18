'use client'

import styled from 'styled-components'
import { PencilLine, Trash2 } from 'lucide-react'
import { theme } from '@/styles/theme'
import type { ProducerDto } from '@/domain/types'

interface ProducerTableProps {
  producers: ProducerDto[]
  onEdit?: (producer: ProducerDto) => void
  onDelete?: (id: string) => void
}

const Wrapper = styled.div`
  width: 100%;
`

const TableScroller = styled.div`
  overflow-x: auto;

  @media (max-width: 768px) {
    display: none;
  }
`

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  background-color: ${theme.colors.surface};
  min-width: 720px;
`

const THead = styled.thead`
  background-color: ${theme.colors.primaryXLight};
  border-bottom: 1px solid ${theme.colors.border};
`

const TH = styled.th`
  padding: 18px 20px;
  text-align: left;
  font-weight: 600;
  color: ${theme.colors.primary};
  font-size: 11px;
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const TR = styled.tr`
  border-bottom: 1px solid ${theme.colors.border};

  &:hover {
    background-color: ${theme.colors.primaryXLight};
  }
`

const TD = styled.td`
  padding: 18px 20px;
  font-size: 13px;
  color: ${theme.colors.textPrimary};
`

const ProducerIdentity = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ProducerAvatar = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 999px;
  background-color: ${theme.colors.primaryXLight};
  color: ${theme.colors.primary};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 800;
  flex-shrink: 0;
`

const ProducerName = styled.span`
  font-size: 15px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`

const DocumentTypeBadge = styled.span<{ $documentType: 'CPF' | 'CNPJ' }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 56px;
  padding: 4px 8px;
  border-radius: ${theme.radii.full};
  font-size: 11px;
  font-weight: 700;
  background-color: ${({ $documentType }) =>
    $documentType === 'CPF' ? theme.colors.primaryXLight : '#fff7e8'};
  color: ${({ $documentType }) =>
    $documentType === 'CPF' ? theme.colors.primary : theme.colors.warning};
`

const Actions = styled.div`
  display: flex;
  gap: 10px;
  justify-content: center;
`

const ActionButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  transition: transform 0.2s ease, opacity 0.2s ease;
  padding: 4px 8px;
  opacity: 0.7;

  &:hover {
    transform: scale(1.15);
    opacity: 1;
  }

  &:active {
    transform: scale(0.95);
  }

  svg {
    width: 17px;
    height: 17px;
    stroke-width: 2.2;
  }
`

const EmptyState = styled.div`
  padding: 40px;
  text-align: center;
  color: ${theme.colors.textMuted};
`

const MobileList = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    flex-direction: column;
  }
`

const MobileCard = styled.article`
  padding: 18px 16px;
  border-top: 1px solid ${theme.colors.border};
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const MobileHeader = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
`

const MobileMeta = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 12px;
`

const MetaBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const MetaLabel = styled.span`
  font-size: 10px;
  letter-spacing: 0.06em;
  text-transform: uppercase;
  color: ${theme.colors.textMuted};
  font-weight: 700;
`

const MetaValue = styled.span`
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  font-weight: 600;
  line-height: 1.4;
`

function getInitials(name: string): string {
  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join('')
    .toUpperCase()
}

export default function ProducerTable({
  producers,
  onEdit,
  onDelete,
}: ProducerTableProps) {
  if (producers.length === 0) {
    return (
      <EmptyState>
        <p>Nenhum produtor encontrado. Crie um para começar.</p>
      </EmptyState>
    )
  }

  return (
    <Wrapper>
      <TableScroller>
        <Table>
          <THead>
            <tr>
              <TH>Nome do Produtor</TH>
              <TH>CPF / CNPJ</TH>
              <TH>Tipo</TH>
              <TH>Criado</TH>
              <TH>Atualizado</TH>
              <TH style={{ width: '120px', textAlign: 'center' }}>Ações</TH>
            </tr>
          </THead>
          <tbody>
            {producers.map((producer) => (
              <TR key={producer.id}>
                <TD>
                  <ProducerIdentity>
                    <ProducerAvatar>{getInitials(producer.name)}</ProducerAvatar>
                    <ProducerName>{producer.name}</ProducerName>
                  </ProducerIdentity>
                </TD>
                <TD>{producer.documentFormatted}</TD>
                <TD>
                  <DocumentTypeBadge $documentType={producer.documentType}>
                    {producer.documentType}
                  </DocumentTypeBadge>
                </TD>
                <TD>{new Date(producer.createdAt).toLocaleDateString('pt-BR')}</TD>
                <TD>{new Date(producer.updatedAt).toLocaleDateString('pt-BR')}</TD>
                <TD>
                  <Actions>
                    <ActionButton
                      onClick={() => onEdit?.(producer)}
                      title="Ver ou editar"
                      aria-label={`Ver ou editar ${producer.name}`}
                    >
                      <PencilLine />
                    </ActionButton>
                    <ActionButton
                      onClick={() => onDelete?.(producer.id)}
                      title="Deletar"
                      aria-label={`Deletar ${producer.name}`}
                    >
                      <Trash2 />
                    </ActionButton>
                  </Actions>
                </TD>
              </TR>
            ))}
          </tbody>
        </Table>
      </TableScroller>

      <MobileList>
        {producers.map((producer) => (
          <MobileCard key={producer.id}>
            <MobileHeader>
              <ProducerIdentity>
                <ProducerAvatar>{getInitials(producer.name)}</ProducerAvatar>
                <ProducerName>{producer.name}</ProducerName>
              </ProducerIdentity>
              <DocumentTypeBadge $documentType={producer.documentType}>
                {producer.documentType}
              </DocumentTypeBadge>
            </MobileHeader>

            <MobileMeta>
              <MetaBlock>
                <MetaLabel>Document</MetaLabel>
                <MetaValue>{producer.documentFormatted}</MetaValue>
              </MetaBlock>
              <MetaBlock>
                <MetaLabel>Created</MetaLabel>
                <MetaValue>{new Date(producer.createdAt).toLocaleDateString('pt-BR')}</MetaValue>
              </MetaBlock>
            </MobileMeta>

            <Actions>
              <ActionButton
                onClick={() => onEdit?.(producer)}
                title="View or edit"
                aria-label={`View or edit ${producer.name}`}
              >
                <PencilLine />
              </ActionButton>
              <ActionButton
                onClick={() => onDelete?.(producer.id)}
                title="Delete"
                aria-label={`Delete ${producer.name}`}
              >
                <Trash2 />
              </ActionButton>
            </Actions>
          </MobileCard>
        ))}
      </MobileList>
    </Wrapper>
  )
}
