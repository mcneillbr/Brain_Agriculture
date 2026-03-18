'use client'

import styled, { css } from 'styled-components'
import { theme } from '@/styles/theme'
import { ReactNode } from 'react'

type Variant = 'success' | 'warning' | 'neutral'

interface BadgeProps {
  variant?: Variant
  children: ReactNode
}

const variantStyles = {
  success: css`
    background-color: ${theme.colors.primaryXLight};
    color: ${theme.colors.success};
  `,
  warning: css`
    background-color: #FEF3E2;
    color: ${theme.colors.warning};
  `,
  neutral: css`
    background-color: #F3F4F6;
    color: ${theme.colors.textSecondary};
  `,
}

const StyledBadge = styled.span<{ $variant: Variant }>`
  display: inline-flex;
  align-items: center;
  gap: 2px;
  padding: 3px 8px;
  border-radius: ${theme.radii.full};
  font-size: 12px;
  font-weight: 600;
  ${({ $variant }) => variantStyles[$variant]}
`

export default function Badge({ variant = 'neutral', children }: BadgeProps) {
  return <StyledBadge $variant={variant}>{children}</StyledBadge>
}
