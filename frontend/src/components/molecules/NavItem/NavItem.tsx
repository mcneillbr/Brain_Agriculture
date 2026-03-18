'use client'

import styled, { css } from 'styled-components'
import { theme } from '@/styles/theme'
import Link from 'next/link'
import { ReactNode } from 'react'

interface NavItemProps {
  label: string
  icon: ReactNode
  href: string
  active?: boolean
}

const StyledLink = styled(Link)<{ $active: boolean }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: ${theme.radii.sm};
  font-size: 14px;
  font-weight: 500;
  transition: all 0.15s ease;

  ${({ $active }) =>
    $active
      ? css`
          background-color: ${theme.colors.primary};
          color: #fff;
        `
      : css`
          color: ${theme.colors.textSecondary};
          &:hover {
            background-color: ${theme.colors.primaryXLight};
            color: ${theme.colors.primary};
          }
        `}
`

const IconWrap = styled.span`
  font-size: 18px;
  line-height: 1;
  flex-shrink: 0;
  
  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`

export default function NavItem({ label, icon, href, active = false }: NavItemProps) {
  return (
    <StyledLink href={href} $active={active}>
      <IconWrap>{icon}</IconWrap>
      {label}
    </StyledLink>
  )
}
