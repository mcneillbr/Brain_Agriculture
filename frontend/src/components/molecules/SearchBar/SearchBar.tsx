'use client'

import { ChangeEvent } from 'react'
import styled from 'styled-components'
import { Search } from 'lucide-react'
import { theme } from '@/styles/theme'

interface SearchBarProps {
  placeholder?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Wrapper = styled.div`
  position: relative;
  display: flex;
  align-items: center;

  @media (max-width: 640px) {
    flex: 1;
    min-width: 0;
  }
`

const Icon = styled.span`
  position: absolute;
  left: 12px;
  color: ${theme.colors.textMuted};
  pointer-events: none;
  user-select: none;

  svg {
    width: 16px;
    height: 16px;
    stroke-width: 2.2;
  }
`

const StyledInput = styled.input`
  padding: 8px 14px 8px 36px;
  border: 1.5px solid ${theme.colors.border};
  border-radius: ${theme.radii.full};
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.background};
  outline: none;
  width: 240px;
  transition: border-color 0.15s ease, width 0.2s ease;

  &::placeholder {
    color: ${theme.colors.textMuted};
  }

  &:focus {
    border-color: ${theme.colors.primary};
    width: 300px;
  }

  @media (max-width: 1024px) {
    width: 220px;

    &:focus {
      width: 240px;
    }
  }

  @media (max-width: 640px) {
    width: 100%;
    min-width: 0;

    &:focus {
      width: 100%;
    }
  }
`

export default function SearchBar({
  placeholder = 'Pesquisar dados...',
  value,
  onChange,
}: SearchBarProps) {
  return (
    <Wrapper>
      <Icon aria-hidden="true">
        <Search />
      </Icon>
      <StyledInput
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        aria-label={placeholder}
      />
    </Wrapper>
  )
}
