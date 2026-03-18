'use client'

import styled from 'styled-components'
import { theme } from '@/styles/theme'
import { useState, ChangeEvent, FormEvent } from 'react'
import Button from '@/components/atoms/Button/Button'
import Input from '@/components/atoms/Input/Input'

interface ProducerFormProps {
  onSubmit: (data: { name: string; document: string }) => void | Promise<void>
  onCancel: () => void
  initialData?: { name: string; document: string }
}

const Overlay = styled.div`
  position: fixed;
  inset: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`

const Modal = styled.div`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.radii.lg};
  padding: 32px;
  max-width: 400px;
  width: 90%;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15);
`

const Title = styled.h2`
  font-size: 20px;
  font-weight: 700;
  color: ${theme.colors.textPrimary};
  margin-bottom: 24px;
`

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const Actions = styled.div`
  display: flex;
  gap: 12px;
  margin-top: 12px;
`

function maskCpf(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .slice(0, 14)
}

function maskCnpj(value: string): string {
  return value
    .replace(/\D/g, '')
    .replace(/(\d{2})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1/$2')
    .replace(/(\d{4})(\d{1,2})$/, '$1-$2')
    .slice(0, 18)
}

function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return maskCpf(value)
  } else {
    return maskCnpj(value)
  }
}

export default function ProducerForm({
  onSubmit,
  onCancel,
  initialData,
}: ProducerFormProps) {
  const [formData, setFormData] = useState(initialData || { name: '', document: '' })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, name: e.target.value })
  }

  const handleDocumentChange = (e: ChangeEvent<HTMLInputElement>) => {
    const formatted = formatDocument(e.target.value)
    setFormData({ ...formData, document: formatted })
  }

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Nome é obrigatório'
    }

    const cleanDoc = formData.document.replace(/\D/g, '')
    if (!cleanDoc) {
      newErrors.document = 'CPF/CNPJ é obrigatório'
    } else if (cleanDoc.length !== 11 && cleanDoc.length !== 14) {
      newErrors.document = 'Digite um CPF válido (11 dígitos) ou CNPJ (14 dígitos)'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsSubmitting(true)
    try {
      await onSubmit({
        name: formData.name.trim(),
        document: cleanDoc,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Overlay onClick={onCancel}>
      <Modal onClick={(e) => e.stopPropagation()}>
        <Title>{initialData ? 'Editar Produtor' : 'Novo Produtor'}</Title>
        <Form onSubmit={handleSubmit}>
          <Input
            id="name"
            label="Nome"
            value={formData.name}
            onChange={handleNameChange}
            error={errors.name}
            placeholder="Digite o nome completo"
            disabled={isSubmitting}
          />
          <Input
            id="document"
            label="CPF/CNPJ"
            value={formData.document}
            onChange={handleDocumentChange}
            error={errors.document}
            placeholder="000.000.000-00 ou 00.000.000/0000-00"
            disabled={isSubmitting}
          />
          <Actions>
            <Button
              variant="ghost"
              type="button"
              onClick={onCancel}
              disabled={isSubmitting}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Salvando...' : 'Salvar'}
            </Button>
          </Actions>
        </Form>
      </Modal>
    </Overlay>
  )
}
