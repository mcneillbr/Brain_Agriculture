'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import SearchBar from '@/components/molecules/SearchBar/SearchBar'
import Avatar from '@/components/atoms/Avatar/Avatar'
import { usePathname } from 'next/navigation'
import { Bell, CircleHelp, Menu, Tractor } from 'lucide-react'

interface TopBarProps {
  onOpenMenu?: () => void
}

const Container = styled.header`
  grid-column: 2;
  grid-row: 1;
  background-color: ${theme.colors.surface};
  border-bottom: 1px solid ${theme.colors.border};
  padding: 12px 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
  position: sticky;
  top: 0;
  z-index: 40;

  @media (max-width: 1024px) {
    grid-column: 1;
    padding: 14px 16px;
  }

  @media (max-width: 640px) {
    padding: 12px 14px;
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
`

const Left = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;

  @media (max-width: 1024px) {
    flex: 1;
  }

  @media (max-width: 640px) {
    justify-content: space-between;
    gap: 12px;
  }
`

const MenuButton = styled.button`
  display: none;
  width: 40px;
  height: 40px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.textSecondary};
  cursor: pointer;
  flex-shrink: 0;

  &:hover {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.primaryXLight};
  }

  @media (max-width: 1024px) {
    display: inline-flex;
    align-items: center;
    justify-content: center;
  }

  svg {
    width: 20px;
    height: 20px;
    stroke-width: 2.2;
  }
`

const Brand = styled.div`
  display: none;
  align-items: center;
  gap: 10px;
  min-width: 0;

  @media (max-width: 1024px) {
    display: flex;
  }
`

const BrandIcon = styled.div`
  width: 36px;
  height: 36px;
  border-radius: ${theme.radii.sm};
  background-color: ${theme.colors.primaryXLight};
  display: flex;
  align-items: center;
  justify-content: center;
  color: ${theme.colors.primary};
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`

const BrandText = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: ${theme.colors.textPrimary};
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (max-width: 640px) {
    max-width: 150px;
  }
`

const Breadcrumb = styled.span`
  font-size: 13px;
  color: ${theme.colors.textSecondary};
  font-weight: 500;

  @media (max-width: 1024px) {
    display: none;
  }
`

const Right = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-left: auto;

  @media (max-width: 640px) {
    width: 100%;
    justify-content: space-between;
    gap: 10px;
    margin-left: 0;
  }
`

const IconButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  color: ${theme.colors.textSecondary};
  transition: color 0.2s ease;
  padding: 6px;
  border-radius: ${theme.radii.sm};

  &:hover {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.primaryXLight};
  }

  @media (max-width: 640px) {
    padding: 8px;
  }

  svg {
    width: 19px;
    height: 19px;
    stroke-width: 2.2;
  }
`

function getBreadcrumb(pathname: string): string {
  if (pathname === '/dashboard') return 'Painel / Principal'
  if (pathname.startsWith('/producers')) {
    if (pathname === '/producers') return 'Produtores / Lista'
    return 'Produtores / Detalhes'
  }
  if (pathname === '/settings') return 'Configurações / Espaço de trabalho'
  return 'Painel'
}

export default function TopBar({ onOpenMenu }: TopBarProps) {
  const pathname = usePathname()
  const breadcrumb = getBreadcrumb(pathname)

  return (
    <Container>
      <Left>
        <MenuButton type="button" onClick={onOpenMenu} aria-label="Abrir menu de navegação">
          <Menu />
        </MenuButton>
        <Brand>
          <BrandIcon aria-hidden="true">
            <Tractor />
          </BrandIcon>
          <BrandText>Brain Agriculture</BrandText>
        </Brand>
        <Breadcrumb>{breadcrumb}</Breadcrumb>
        <SearchBar />
      </Left>
      <Right>
        <IconButton title="Notificações">
          <Bell />
        </IconButton>
        <IconButton title="Ajuda">
          <CircleHelp />
        </IconButton>
        <Avatar name="Portal Admin" subtitle="Gerenciar Ativos" />
      </Right>
    </Container>
  )
}
