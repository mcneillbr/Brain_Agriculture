'use client'

import { useEffect } from 'react'
import { useParams, useRouter } from 'next/navigation'
import styled from 'styled-components'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import Button from '@/components/atoms/Button/Button'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { useFarms } from '@/application/hooks/useFarms'
import { theme } from '@/styles/theme'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
`

const Title = styled.h1`
  font-size: 26px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
`

const Card = styled.section`
  background-color: ${theme.colors.surface};
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.xl};
  padding: 20px;
  box-shadow: ${theme.shadows.card};
`

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;

  @media (max-width: 900px) {
    grid-template-columns: 1fr;
  }
`

const Label = styled.div`
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: ${theme.colors.textMuted};
  margin-bottom: 4px;
`

const Value = styled.div`
  font-size: 16px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
`

const LoadingContainer = styled.div`
  min-height: 220px;
  display: flex;
  align-items: center;
  justify-content: center;
`

const ErrorContainer = styled.div`
  background-color: #fee2e2;
  border: 1px solid #fca5a5;
  border-radius: ${theme.radii.lg};
  padding: 16px;
  color: #991b1b;
`

export default function FarmDetailPage() {
  const router = useRouter()
  const params = useParams<{ id: string }>()
  const { selected, loading, error, fetchById } = useFarms()

  useEffect(() => {
    if (params.id) {
      fetchById(params.id)
    }
  }, [fetchById, params.id])

  if (loading && !selected) {
    return (
      <AppLayout>
        <LoadingContainer>
          <Spinner size={42} />
        </LoadingContainer>
      </AppLayout>
    )
  }

  if (error && !selected) {
    return (
      <AppLayout>
        <ErrorContainer>
          <strong>Erro ao carregar fazenda</strong>
          <p>{error}</p>
        </ErrorContainer>
      </AppLayout>
    )
  }

  if (!selected) {
    return (
      <AppLayout>
        <ErrorContainer>
          <strong>Fazenda não encontrada.</strong>
        </ErrorContainer>
      </AppLayout>
    )
  }

  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <Title>{selected.name}</Title>
          <Button variant="secondary" onClick={() => router.push('/farms')}>
            Voltar para lista
          </Button>
        </Header>

        <Card>
          <Grid>
            <div>
              <Label>Produtor</Label>
              <Value>{selected.producerName ?? selected.producerId}</Value>
            </div>
            <div>
              <Label>Cidade / Estado</Label>
              <Value>
                {selected.city} / {selected.state}
              </Value>
            </div>
            <div>
              <Label>Area total</Label>
              <Value>{selected.totalArea.toLocaleString('pt-BR')} ha</Value>
            </div>
            <div>
              <Label>Agricultavel / Vegetacao</Label>
              <Value>
                {selected.arableArea.toLocaleString('pt-BR')} ha /{' '}
                {selected.vegetationArea.toLocaleString('pt-BR')} ha
              </Value>
            </div>
          </Grid>
        </Card>
      </PageContainer>
    </AppLayout>
  )
}
