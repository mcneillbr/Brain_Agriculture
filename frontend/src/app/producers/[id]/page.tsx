'use client'

import { useParams, useRouter } from 'next/navigation'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import Button from '@/components/atoms/Button/Button'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useProducers } from '@/application/hooks/useProducers'
import { useEffect, useState } from 'react'
import ProducerForm from '@/components/organisms/ProducerForm/ProducerForm'
import type { ProducerDto } from '@/domain/types'
import { ArrowLeft, PencilLine, Trash2 } from 'lucide-react'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
`

const Header = styled.section`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 20px;

  @media (max-width: 768px) {
    flex-direction: column;
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
  margin-bottom: 8px;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
`

const Actions = styled.div`
  display: flex;
  gap: 12px;

  @media (max-width: 768px) {
    width: 100%;

    button {
      flex: 1;
    }
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

const Card = styled.div`
  background: white;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  padding: 32px;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 24px;
`

const InfoBlock = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InfoLabel = styled.p`
  font-size: 12px;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  font-weight: 600;
`

const InfoValue = styled.p`
  font-size: 16px;
  color: ${theme.colors.textPrimary};
  font-weight: 500;
`

export default function ProducerDetailPage() {
  const params = useParams()
  const router = useRouter()
  const id = params.id as string
  
  const { items, update, remove } = useProducers()
  const [producer, setProducer] = useState<ProducerDto | null>(null)
  const [isEditing, setIsEditing] = useState(false)

  useEffect(() => {
    const found = items.find(p => p.id === id)
    setProducer(found || null)
  }, [items, id])

  if (!producer) {
    return (
      <AppLayout>
        <LoadingContainer>
          <Spinner size={48} />
        </LoadingContainer>
      </AppLayout>
    )
  }

  const handleDelete = async () => {
    if (confirm('Tem certeza que deseja deletar este produtor?')) {
      await remove(id)
      router.push('/producers')
    }
  }

  if (isEditing) {
    return (
      <AppLayout>
        <ProducerForm
          initialData={producer}
          onSubmit={async (data) => {
            await update(id, data)
            setIsEditing(false)
          }}
          onCancel={() => setIsEditing(false)}
        />
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <TitleSection>
            <Title>{producer.name}</Title>
            <Subtitle>{producer.document}</Subtitle>
          </TitleSection>
          <Actions>
            <Button variant="secondary" onClick={() => router.back()}>
              <ArrowLeft size={16} />
              Voltar
            </Button>
            <Button variant="primary" onClick={() => setIsEditing(true)}>
              <PencilLine size={16} />
              Editar
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              <Trash2 size={16} />
              Deletar
            </Button>
          </Actions>
        </Header>

        <Card>
          <InfoGrid>
            <InfoBlock>
              <InfoLabel>Tipo de Documento</InfoLabel>
              <InfoValue>{producer.documentType}</InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>Número do Documento</InfoLabel>
              <InfoValue>{producer.documentFormatted}</InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>Criado</InfoLabel>
              <InfoValue>
                {new Date(producer.createdAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </InfoValue>
            </InfoBlock>
            <InfoBlock>
              <InfoLabel>Atualizado</InfoLabel>
              <InfoValue>
                {new Date(producer.updatedAt).toLocaleDateString('pt-BR', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </InfoValue>
            </InfoBlock>
          </InfoGrid>
        </Card>
      </PageContainer>
    </AppLayout>
  )
}
