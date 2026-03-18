'use client'

import { useCallback, useState } from 'react'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import Sidebar from '@/components/organisms/Sidebar/Sidebar'
import TopBar from '@/components/organisms/TopBar/TopBar'
import { GlobalStyles } from '@/styles/GlobalStyles'

interface AppLayoutProps {
  children: React.ReactNode
}

const Container = styled.div`
  display: grid;
  grid-template-columns: 240px 1fr;
  grid-template-rows: auto 1fr;
  min-height: 100vh;
  background-color: ${theme.colors.background};

  @media (max-width: 1024px) {
    grid-template-columns: 1fr;
    grid-template-rows: auto 1fr;
  }
`

const MainContent = styled.main`
  grid-column: 2;
  grid-row: 2;
  padding: 24px;
  overflow-y: auto;
  background-color: ${theme.colors.background};

  @media (max-width: 1024px) {
    grid-column: 1;
    grid-row: 2;
    padding: 16px;
  }

  @media (max-width: 640px) {
    padding: 14px;
  }
`

export default function AppLayout({ children }: AppLayoutProps) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const handleCloseMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false)
  }, [])

  return (
    <>
      <GlobalStyles />
      <Container>
        <Sidebar
          mobileOpen={isMobileMenuOpen}
          onClose={handleCloseMobileMenu}
        />
        <TopBar onOpenMenu={() => setIsMobileMenuOpen(true)} />
        <MainContent>{children}</MainContent>
      </Container>
    </>
  )
}
