import type { Metadata } from 'next'
import StyledComponentsRegistry from '@/styles/StyledComponentsRegistry'
import { StoreProvider } from '@/application/store/provider'

export const metadata: Metadata = {
  title: 'Brain Agriculture',
  description: 'Technology for a sustainable future',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <StyledComponentsRegistry>
          <StoreProvider>{children}</StoreProvider>
        </StyledComponentsRegistry>
      </body>
    </html>
  )
}
