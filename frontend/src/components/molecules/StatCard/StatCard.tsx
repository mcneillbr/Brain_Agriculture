'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Badge from '@/components/atoms/Badge/Badge'
import { ReactNode } from 'react'

interface StatCardProps {
  title: string
  value: number
  unit?: string
  growth?: number
  subtitle: string
  icon?: ReactNode
}

const Card = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 24px;
  box-shadow: ${theme.shadows.card};
  display: flex;
  flex-direction: column;
  gap: 12px;

  @media (max-width: 640px) {
    padding: 20px;
  }
`

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  gap: 12px;
`

const Title = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.05em;
`

const IconWrap = styled.div`
  width: 40px;
  height: 40px;
  background-color: ${theme.colors.primaryXLight};
  border-radius: ${theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
`

const ValueRow = styled.div`
  display: flex;
  align-items: baseline;
  gap: 8px;
`

const Value = styled.span`
  font-size: 32px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  line-height: 1;

  @media (max-width: 640px) {
    font-size: 28px;
  }
`

const Unit = styled.span`
  font-size: 16px;
  font-weight: 500;
  color: ${theme.colors.textSecondary};
`

const Footer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;

  @media (max-width: 640px) {
    flex-wrap: wrap;
  }
`

const Subtitle = styled.span`
  font-size: 12px;
  color: ${theme.colors.textMuted};
`

export default function StatCard({ title, value, unit, growth, subtitle, icon }: StatCardProps) {
  const hasGrowth = typeof growth === 'number' && Number.isFinite(growth)
  const isPositive = hasGrowth ? growth >= 0 : true

  return (
    <Card>
      <Header>
        <Title>{title}</Title>
        {icon && <IconWrap>{icon}</IconWrap>}
      </Header>
      <ValueRow>
        <Value>{value.toLocaleString('pt-BR')}</Value>
        {unit && <Unit>{unit}</Unit>}
      </ValueRow>
      <Footer>
        {hasGrowth && (
          <Badge variant={isPositive ? 'success' : 'warning'}>
            {isPositive ? '↑' : '↓'} {Math.abs(growth)}%
          </Badge>
        )}
        <Subtitle>{subtitle}</Subtitle>
      </Footer>
    </Card>
  )
}
