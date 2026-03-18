'use client'

import styled, { keyframes } from 'styled-components'
import { theme } from '@/styles/theme'

const spin = keyframes`
  to { transform: rotate(360deg); }
`

const Circle = styled.div<{ $size: number }>`
  width: ${({ $size }) => $size}px;
  height: ${({ $size }) => $size}px;
  border: 3px solid ${theme.colors.primaryXLight};
  border-top-color: ${theme.colors.primary};
  border-radius: 50%;
  animation: ${spin} 0.7s linear infinite;
  flex-shrink: 0;
`

interface SpinnerProps {
  size?: number
}

export default function Spinner({ size = 32 }: SpinnerProps) {
  return <Circle $size={size} role="status" aria-label="Loading" />
}
