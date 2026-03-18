'use client'

import styled, { css } from 'styled-components'
import { theme } from '@/styles/theme'
import { ButtonHTMLAttributes } from 'react'

type Variant = 'primary' | 'secondary' | 'ghost' | 'success' | 'danger'
type Size = 'sm' | 'md' | 'lg'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const sizeStyles = {
  sm: css`font-size: 12px; padding: 6px 12px;`,
  md: css`font-size: 14px; padding: 10px 20px;`,
  lg: css`font-size: 16px; padding: 13px 28px;`,
}

const variantStyles = {
  primary: css`
    background-color: ${theme.colors.primary};
    color: #fff;
    border: 1.5px solid ${theme.colors.primary};
    &:hover:not(:disabled) { background-color: ${theme.colors.primaryDark}; border-color: ${theme.colors.primaryDark}; }
  `,
  secondary: css`
    background-color: ${theme.colors.background};
    color: ${theme.colors.textPrimary};
    border: 1.5px solid ${theme.colors.border};
    &:hover:not(:disabled) { background-color: #e1e9e7; border-color: ${theme.colors.primary}; }
  `,
  ghost: css`
    background-color: transparent;
    color: ${theme.colors.primary};
    border: 1.5px solid ${theme.colors.border};
    &:hover:not(:disabled) { background-color: ${theme.colors.primaryXLight}; }
  `,
  success: css`
    background-color: ${theme.colors.success};
    color: #fff;
    border: 1.5px solid ${theme.colors.success};
    &:hover:not(:disabled) { opacity: 0.9; }
  `,
  danger: css`
    background-color: ${theme.colors.danger};
    color: #fff;
    border: 1.5px solid ${theme.colors.danger};
    &:hover:not(:disabled) { opacity: 0.9; }
  `,
}

const StyledButton = styled.button<{ $variant: Variant; $size: Size }>`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  border-radius: ${theme.radii.sm};
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
  white-space: nowrap;

  ${({ $size }) => sizeStyles[$size]}
  ${({ $variant }) => variantStyles[$variant]}

  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
  }
`

export default function Button({
  variant = 'primary',
  size = 'md',
  children,
  ...rest
}: ButtonProps) {
  return (
    <StyledButton $variant={variant} $size={size} {...rest}>
      {children}
    </StyledButton>
  )
}
