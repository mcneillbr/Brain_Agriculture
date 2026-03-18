'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { InputHTMLAttributes } from 'react'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Wrapper = styled.div`
  display: flex;
  flex-direction: column;
  gap: 6px;
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
`

const StyledInput = styled.input<{ $hasError: boolean }>`
  padding: 10px 14px;
  border: 1.5px solid ${({ $hasError }) => ($hasError ? theme.colors.danger : theme.colors.border)};
  border-radius: ${theme.radii.sm};
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.surface};
  outline: none;
  transition: border-color 0.15s ease;
  width: 100%;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${({ $hasError }) => ($hasError ? theme.colors.danger : theme.colors.primary)};
  }
`

const ErrorText = styled.span`
  font-size: 12px;
  color: ${theme.colors.danger};
`

export default function Input({ label, error, id, ...rest }: InputProps) {
  return (
    <Wrapper>
      {label && <Label htmlFor={id}>{label}</Label>}
      <StyledInput id={id} $hasError={!!error} {...rest} />
      {error && <ErrorText>{error}</ErrorText>}
    </Wrapper>
  )
}
