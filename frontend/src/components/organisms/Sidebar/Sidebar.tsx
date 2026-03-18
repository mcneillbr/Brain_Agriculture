'use client'

import { useEffect } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { usePathname } from 'next/navigation'
import NavItem from '@/components/molecules/NavItem/NavItem'
import { House, Settings, Sprout, Tractor, Users, X, ChartColumn } from 'lucide-react'

interface SidebarProps {
  mobileOpen?: boolean
  onClose?: () => void
}

const DesktopContainer = styled.aside`
  width: 240px;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  background-color: ${theme.colors.surface};
  border-right: 1px solid ${theme.colors.border};
  padding: 24px 16px;
  display: flex;
  flex-direction: column;
  gap: 32px;
  overflow-y: auto;

  @media (max-width: 1024px) {
    display: none;
  }
`

const MobileOverlay = styled.div<{ $open: boolean }>`
  display: none;

  @media (max-width: 1024px) {
    display: block;
    position: fixed;
    inset: 0;
    background-color: rgba(10, 22, 20, 0.4);
    opacity: ${({ $open }) => ($open ? 1 : 0)};
    pointer-events: ${({ $open }) => ($open ? 'auto' : 'none')};
    transition: opacity 0.2s ease;
    z-index: 70;
  }
`

const MobilePanel = styled.aside<{ $open: boolean }>`
  display: none;

  @media (max-width: 1024px) {
    display: flex;
    flex-direction: column;
    gap: 24px;
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    width: min(280px, 86vw);
    background-color: ${theme.colors.surface};
    border-right: 1px solid ${theme.colors.border};
    padding: 20px 16px;
    overflow-y: auto;
    transform: translateX(${({ $open }) => ($open ? '0' : '-100%')});
    transition: transform 0.24s ease;
    z-index: 80;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.16);
  }
`

const MobileHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
`

const CloseButton = styled.button`
  width: 38px;
  height: 38px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.sm};
  background-color: ${theme.colors.surface};
  color: ${theme.colors.textSecondary};
  cursor: pointer;

  &:hover {
    color: ${theme.colors.primary};
    background-color: ${theme.colors.primaryXLight};
  }

  svg {
    width: 18px;
    height: 18px;
    stroke-width: 2.2;
  }
`

const Logo = styled.div`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 0 10px;
`

const LogoCircle = styled.div`
  width: 32px;
  height: 32px;
  background-color: ${theme.colors.primaryXLight};
  border-radius: ${theme.radii.sm};
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;

  svg {
    width: 18px;
    height: 18px;
    color: ${theme.colors.primary};
    stroke-width: 2.2;
  }
`

const LogoText = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
`

const NavSection = styled.nav`
  display: flex;
  flex-direction: column;
  gap: 6px;
  flex: 1;
`

const NavLabel = styled.p`
  font-size: 10px;
  font-weight: 600;
  color: ${theme.colors.textMuted};
  text-transform: uppercase;
  letter-spacing: 0.05em;
  padding: 0 14px;
  margin-bottom: 8px;
`

const Footer = styled.div`
  margin-top: auto;
  padding: 16px;
  border-radius: ${theme.radii.lg};
  background: linear-gradient(135deg, ${theme.colors.primary} 0%, ${theme.colors.primaryDark} 100%);
  color: #fff;
`

const Quote = styled.p`
  font-size: 11px;
  font-weight: 500;
  opacity: 0.9;
  font-style: italic;
  line-height: 1.4;
`

const navItems = [
  {
    label: 'Dashboard',
    icon: House,
    href: '/dashboard',
    isActive: (pathname: string) => pathname === '/dashboard',
  },
  {
    label: 'Producers',
    icon: Users,
    href: '/producers',
    isActive: (pathname: string) => pathname.startsWith('/producers'),
  },
  {
    label: 'Farms',
    icon: Sprout,
    href: '/farms',
    isActive: (pathname: string) => pathname.startsWith('/farms'),
  },
  {
    label: 'Reports',
    icon: ChartColumn,
    href: '/reports',
    isActive: (pathname: string) => pathname.startsWith('/reports'),
  },
  {
    label: 'Settings',
    icon: Settings,
    href: '/settings',
    isActive: (pathname: string) => pathname === '/settings',
  },
]

function SidebarContent({ pathname }: { pathname: string }) {
  return (
    <>
      <Logo>
        <LogoCircle>
          <Tractor />
        </LogoCircle>
        <LogoText>Brain Agriculture</LogoText>
      </Logo>

      <NavSection>
        <NavLabel>Menu Principal</NavLabel>
        {navItems.map((item) => {
          const Icon = item.icon
          return (
            <NavItem
              key={item.href}
              label={item.label}
              icon={<Icon />}
              href={item.href}
              active={item.isActive(pathname)}
            />
          )
        })}
      </NavSection>

      <Footer>
        <Quote>&quot;Tecnologia para um futuro sustentável.&quot;</Quote>
      </Footer>
    </>
  )
}

export default function Sidebar({ mobileOpen = false, onClose }: SidebarProps) {
  const pathname = usePathname()

  useEffect(() => {
    onClose?.()
  }, [pathname, onClose])

  return (
    <>
      <DesktopContainer>
        <SidebarContent pathname={pathname} />
      </DesktopContainer>

      <MobileOverlay $open={mobileOpen} onClick={onClose} aria-hidden={!mobileOpen} />

      <MobilePanel $open={mobileOpen} aria-hidden={!mobileOpen} aria-label="Navigation menu">
        <MobileHeader>
          <Logo>
            <LogoCircle>
              <Tractor />
            </LogoCircle>
            <LogoText>Brain Agriculture</LogoText>
          </Logo>
          <CloseButton type="button" onClick={onClose} aria-label="Close navigation menu">
            <X />
          </CloseButton>
        </MobileHeader>

        <NavSection>
          <NavLabel>Main Menu</NavLabel>
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <NavItem
                key={item.href}
                label={item.label}
                icon={<Icon />}
                href={item.href}
                active={item.isActive(pathname)}
              />
            )
          })}
        </NavSection>

        <Footer>
          <Quote>&quot;Technology for a sustainable future.&quot;</Quote>
        </Footer>
      </MobilePanel>
    </>
  )
}
