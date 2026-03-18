'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'

interface AvatarProps {
  name: string
  subtitle?: string
}

const Container = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
`

const Circle = styled.div`
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background-color: ${theme.colors.primaryXLight};
  color: ${theme.colors.primary};
  font-size: 13px;
  font-weight: 700;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
`

const TextBlock = styled.div`
  display: flex;
  flex-direction: column;

  @media (max-width: 640px) {
    display: none;
  }
`

const Name = styled.span`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textPrimary};
  line-height: 1.2;
`

const Sub = styled.span`
  font-size: 11px;
  color: ${theme.colors.textMuted};
`

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase()
}

export default function Avatar({ name, subtitle }: AvatarProps) {
  return (
    <Container>
      <Circle aria-hidden="true">{getInitials(name)}</Circle>
      <TextBlock>
        <Name>{name}</Name>
        {subtitle && <Sub>{subtitle}</Sub>}
      </TextBlock>
    </Container>
  )
}
