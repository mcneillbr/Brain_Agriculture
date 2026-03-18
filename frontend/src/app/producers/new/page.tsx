'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import styled from 'styled-components'
import { theme } from '@/styles/theme'
import AppLayout from '@/components/templates/AppLayout/AppLayout'
import Button from '@/components/atoms/Button/Button'
import Input from '@/components/atoms/Input/Input'
import Spinner from '@/components/atoms/Spinner/Spinner'
import { api } from '@/application/services/api'
import type {
  CreateProducerDto,
  CreateFarmDto,
  CreateHarvestDto,
  AddCropToFarmDto,
  HarvestDto,
} from '@/domain/types'
import { UserRound, Home, Ruler, Leaf, ArrowLeft, X } from 'lucide-react'

const PageContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 32px;
  max-width: 50rem;
  margin: 0 auto;
`

const Header = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 16px;

  button {
    background-color: transparent;
    border: none;
    padding: 8px;
    cursor: pointer;
    color: ${theme.colors.textSecondary};
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radii.lg};

    &:hover {
      background-color: ${theme.colors.surface};
      color: ${theme.colors.textPrimary};
    }
  }
`

const Title = styled.h1`
  font-size: 28px;
  font-weight: 900;
  color: ${theme.colors.textPrimary};
  letter-spacing: -0.02em;
`

const Subtitle = styled.p`
  font-size: 14px;
  color: ${theme.colors.textSecondary};
  margin-top: 8px;
`

const Section = styled.section`
  background-color: ${theme.colors.surface};
  border-radius: ${theme.radii.xl};
  border: 1px solid ${theme.colors.border};
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 20px;
`

const SectionHeader = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
  padding-bottom: 16px;
  border-bottom: 1px solid ${theme.colors.border};
  margin-bottom: 8px;

  svg {
    width: 20px;
    height: 20px;
    color: ${theme.colors.primary};
  }

  h2 {
    font-size: 18px;
    font-weight: 700;
    color: ${theme.colors.textPrimary};
  }
`

const FormGrid = styled.div<{ columns?: number }>`
  display: grid;
  grid-template-columns: repeat(${(p) => p.columns || 2}, 1fr);
  gap: 16px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`

const FormGroup = styled.div<{ $fullWidth?: boolean }>`
  display: flex;
  flex-direction: column;
  gap: 8px;
  grid-column: ${(p) => (p.$fullWidth ? '1 / -1' : 'auto')};
`

const Label = styled.label`
  font-size: 13px;
  font-weight: 600;
  color: ${theme.colors.textSecondary};
  text-transform: uppercase;
  letter-spacing: 0.5px;
`

const FormInput = styled(Input)`
  height: 40px;
  font-size: 14px;
`

const FormSelect = styled.select`
  height: 40px;
  border: 1px solid ${theme.colors.border};
  border-radius: ${theme.radii.lg};
  padding: 8px 12px;
  font-size: 14px;
  color: ${theme.colors.textPrimary};
  background-color: ${theme.colors.background};
  font-family: inherit;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: ${theme.colors.primary};
    box-shadow: 0 0 0 3px ${theme.colors.primary}20;
  }
`

const ValidationMessage = styled.div<{ type?: 'error' | 'success' }>`
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border-radius: ${theme.radii.lg};
  font-size: 13px;
  font-weight: 500;
  background-color: ${(p) => (p.type === 'error' ? '#fee2e2' : '#f0fdf4')};
  border: 1px solid ${(p) => (p.type === 'error' ? '#fecaca' : '#86efac')};
  color: ${(p) => (p.type === 'error' ? '#dc2626' : '#15803d')};
`

const CropsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
`

const CropCheckbox = styled.label`
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  border-radius: 9999px;
  border: 1px solid ${theme.colors.border};
  background-color: ${theme.colors.background};
  cursor: pointer;
  font-size: 13px;
  font-weight: 500;
  transition: all 0.2s;

  &:hover {
    background-color: ${theme.colors.surface};
  }

  input {
    cursor: pointer;
  }

  input:checked + span {
    color: ${theme.colors.primary};
    font-weight: 600;
  }
`

const HarvestYear = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr 2fr auto;
  gap: 12px;
  align-items: flex-end;
  padding: 16px;
  background-color: ${theme.colors.background};
  border-radius: ${theme.radii.lg};
  border: 1px solid ${theme.colors.border};

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }

  button {
    padding: 8px;
    background-color: transparent;
    border: none;
    cursor: pointer;
    color: #ef4444;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: ${theme.radii.lg};

    &:hover {
      background-color: #fee2e2;
    }
  }
`

const ActionsContainer = styled.div`
  display: flex;
  gap: 12px;
  justify-content: flex-end;
  padding-top: 16px;
  border-top: 1px solid ${theme.colors.border};

  @media (max-width: 640px) {
    flex-direction: column;
    justify-content: stretch;

    button {
      width: 100%;
    }
  }
`

const CancelButton = styled(Button)`
  background-color: transparent;
  color: ${theme.colors.primary};
  border: 1px solid ${theme.colors.primary}40;

  &:hover {
    background-color: ${theme.colors.primary}10;
  }
`

const CROP_OPTIONS = ['Soja', 'Milho', 'Algodão', 'Café', 'Cana-de-açúcar']

const STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapá' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceará' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espírito Santo' },
  { value: 'GO', label: 'Goiás' },
  { value: 'MA', label: 'Maranhão' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Pará' },
  { value: 'PB', label: 'Paraíba' },
  { value: 'PR', label: 'Paraná' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piauí' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondônia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'São Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
]

interface HarvestData {
  year: number
  crops: string[]
}

interface FormState {
  producer: {
    name: string
    document: string
  }
  farm: {
    name: string
    city: string
    state: string
    totalArea: number
    arableArea: number
    vegetationArea: number
  }
  harvests: HarvestData[]
}

function formatDocument(value: string): string {
  const digits = value.replace(/\D/g, '')
  if (digits.length <= 11) {
    return digits.replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d{1,2})$/, '$1-$2')
  } else {
    return digits.replace(/(\d{2})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1.$2').replace(/(\d{3})(\d)/, '$1/$2').replace(/(\d{4})(\d{1,2})$/, '$1-$2')
  }
}

export default function NewProducerPage() {
  const router = useRouter()
  const [formState, setFormState] = useState<FormState>({
    producer: { name: '', document: '' },
    farm: {
      name: '',
      city: '',
      state: '',
      totalArea: 0,
      arableArea: 0,
      vegetationArea: 0,
    },
    harvests: [],
  })
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [validationError, setValidationError] = useState<string | null>(null)
  const [harvests, setHarvests] = useState<HarvestDto[]>([])

  const handleProducerChange = (field: keyof typeof formState.producer, value: string) => {
    let processedValue = value
    if (field === 'document') {
      processedValue = formatDocument(value)
    }
    setFormState((prev) => ({
      ...prev,
      producer: { ...prev.producer, [field]: processedValue },
    }))
  }

  const handleFarmChange = (field: keyof typeof formState.farm, value: string | number) => {
    setFormState((prev) => ({
      ...prev,
      farm: { ...prev.farm, [field]: typeof value === 'string' && field !== 'state' ? value : value },
    }))
    setValidationError(null)
  }

  const handleAddHarvest = (year: number, crops: string[]) => {
    setFormState((prev) => ({
      ...prev,
      harvests: [...prev.harvests, { year, crops }],
    }))
  }

  const handleRemoveHarvest = (index: number) => {
    setFormState((prev) => ({
      ...prev,
      harvests: prev.harvests.filter((_, i) => i !== index),
    }))
  }

  const validateAreas = () => {
    const { totalArea, arableArea, vegetationArea } = formState.farm
    if (arableArea + vegetationArea > totalArea) {
      setValidationError(
        'A soma de Arable Area e Vegetation Area não pode exceder Total Area',
      )
      return false
    }
    setValidationError(null)
    return true
  }

  const handleSubmit = async () => {
    try {
      if (!validateAreas()) return

      setIsLoading(true)
      setError(null)

      // 1. Create Producer
      const producerData: CreateProducerDto = {
        name: formState.producer.name,
        document: formState.producer.document.replace(/\D/g, ''),
      }
      const producer = await api.producers.create(producerData)

      // 2. Create Farm
      const farmData: CreateFarmDto = {
        producerId: producer.id,
        name: formState.farm.name,
        city: formState.farm.city,
        state: formState.farm.state,
        totalArea: formState.farm.totalArea,
        arableArea: formState.farm.arableArea,
        vegetationArea: formState.farm.vegetationArea,
      }
      const farm = await api.farms.create(farmData)

      // 3. Create Harvests and Crops
      for (const harvestData of formState.harvests) {
        const harvestDto: CreateHarvestDto = {
          name: `Safra ${harvestData.year}`,
          year: harvestData.year,
        }
        const harvest = await api.harvests.create(harvestDto)

        // 4. Add Crops to Farm
        for (const cropName of harvestData.crops) {
          const cropData: AddCropToFarmDto = {
            farmId: farm.id,
            harvestId: harvest.id,
            name: cropName,
          }
          await api.crops.add(cropData)
        }
      }

      router.push(`/producers`)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao cadastrar produtor')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <AppLayout>
      <PageContainer>
        <Header>
          <button onClick={() => router.back()}>
            <ArrowLeft size={20} />
          </button>
          <div>
            <Title>Novo Produtor Rural</Title>
            <Subtitle>
              Insira os detalhes necessários para registrar um novo produtor e propriedade no banco
              de dados de gestão.
            </Subtitle>
          </div>
        </Header>

        {error && <ValidationMessage type="error">{error}</ValidationMessage>}

        {/* Producer Info */}
        <Section>
          <SectionHeader>
            <UserRound />
            <h2>Informações do Produtor</h2>
          </SectionHeader>
          <FormGrid>
            <FormGroup $fullWidth>
              <Label>Nome do Produtor / Razão Social</Label>
              <FormInput
                placeholder="João Silva ou Agro Corp"
                value={formState.producer.name}
                onChange={(e) => handleProducerChange('name', e.target.value)}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup $fullWidth>
              <Label>CPF ou CNPJ</Label>
              <FormInput
                placeholder="000.000.000-00"
                value={formState.producer.document}
                onChange={(e) => handleProducerChange('document', e.target.value)}
                disabled={isLoading}
              />
            </FormGroup>
          </FormGrid>
        </Section>

        {/* Farm Info */}
        <Section>
          <SectionHeader>
            <Home />
            <h2>Informações da Propriedade</h2>
          </SectionHeader>
          <FormGrid columns={3}>
            <FormGroup $fullWidth>
              <Label>Nome da Propriedade</Label>
              <FormInput
                placeholder="Fazenda Esperança"
                value={formState.farm.name}
                onChange={(e) => handleFarmChange('name', e.target.value)}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <Label>Cidade</Label>
              <FormInput
                placeholder="Sorriso"
                value={formState.farm.city}
                onChange={(e) => handleFarmChange('city', e.target.value)}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <Label>Estado</Label>
              <FormSelect
                value={formState.farm.state}
                onChange={(e) => handleFarmChange('state', e.target.value)}
                disabled={isLoading}
              >
                <option value="">Selecionar Estado</option>
                {STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </FormSelect>
            </FormGroup>
          </FormGrid>
        </Section>

        {/* Areas & Dimensions */}
        <Section>
          <SectionHeader>
            <Ruler />
            <h2>Áreas & Dimensões</h2>
          </SectionHeader>
          <FormGrid columns={3}>
            <FormGroup>
              <Label>Área Total (ha)</Label>
              <FormInput
                type="number"
                placeholder="0.00"
                value={formState.farm.totalArea || ''}
                onChange={(e) => handleFarmChange('totalArea', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <Label>Área Arável (ha)</Label>
              <FormInput
                type="number"
                placeholder="0.00"
                value={formState.farm.arableArea || ''}
                onChange={(e) => handleFarmChange('arableArea', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
              />
            </FormGroup>
            <FormGroup>
              <Label>Área de Vegetação (ha)</Label>
              <FormInput
                type="number"
                placeholder="0.00"
                value={formState.farm.vegetationArea || ''}
                onChange={(e) => handleFarmChange('vegetationArea', parseFloat(e.target.value) || 0)}
                disabled={isLoading}
              />
            </FormGroup>
          </FormGrid>
          {validationError && <ValidationMessage type="error">{validationError}</ValidationMessage>}
        </Section>

        {/* Harvests & Crops */}
        <Section>
          <SectionHeader>
            <Leaf />
            <h2>Safras & Culturas</h2>
          </SectionHeader>

          {formState.harvests.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {formState.harvests.map((harvest, idx) => (
                <HarvestYear key={idx}>
                  <div>
                    <Label>ANO DA SAFRA</Label>
                    <div style={{ fontWeight: 600, color: theme.colors.textPrimary }}>
                      {harvest.year}
                    </div>
                  </div>
                  <div>
                    <Label>CULTURAS</Label>
                    <div style={{ fontWeight: 600, color: theme.colors.textPrimary }}>
                      {harvest.crops.length}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: theme.colors.textSecondary }}>
                      {harvest.crops.join(', ')}
                    </div>
                  </div>
                  <button
                    type="button"
                    onClick={() => handleRemoveHarvest(idx)}
                    disabled={isLoading}
                  >
                    <X size={18} />
                  </button>
                </HarvestYear>
              ))}
            </div>
          )}

          <HarvestForm onAdd={handleAddHarvest} />
        </Section>

        {/* Actions */}
        <ActionsContainer>
          <CancelButton onClick={() => router.back()}>Cancelar</CancelButton>
          <Button
            onClick={handleSubmit}
            disabled={
              isLoading ||
              !formState.producer.name ||
              !formState.producer.document ||
              !formState.farm.name ||
              !formState.farm.city ||
              !formState.farm.state
            }
          >
            {isLoading ? <Spinner /> : 'Salvar Produtor'}
          </Button>
        </ActionsContainer>
      </PageContainer>
    </AppLayout>
  )
}

interface HarvestFormProps {
  onAdd: (year: number, crops: string[]) => void
}

function HarvestForm({ onAdd }: HarvestFormProps) {
  const [year, setYear] = useState(new Date().getFullYear())
  const [selectedCrops, setSelectedCrops] = useState<string[]>([])

  const handleCropToggle = (crop: string) => {
    setSelectedCrops((prev) =>
      prev.includes(crop) ? prev.filter((c) => c !== crop) : [...prev, crop],
    )
  }

  const handleAddHarvest = () => {
    if (selectedCrops.length === 0) return
    onAdd(year, selectedCrops)
    setYear(new Date().getFullYear())
    setSelectedCrops([])
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <FormGrid columns={2}>
        <FormGroup>
          <Label>Ano da Safra</Label>
          <FormSelect value={year} onChange={(e) => setYear(parseInt(e.target.value))}>
            {Array.from({ length: 10 }, (_, i) => new Date().getFullYear() - i).map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </FormSelect>
        </FormGroup>
      </FormGrid>

      <div>
        <Label>Culturas Plantadas</Label>
        <CropsContainer>
          {CROP_OPTIONS.map((crop) => (
            <CropCheckbox key={crop}>
              <input
                type="checkbox"
                checked={selectedCrops.includes(crop)}
                onChange={() => handleCropToggle(crop)}
              />
              <span>{crop}</span>
            </CropCheckbox>
          ))}
        </CropsContainer>
      </div>

      <Button
        onClick={handleAddHarvest}
        disabled={selectedCrops.length === 0}
        style={{ alignSelf: 'flex-start' }}
      >
        Adicionar Safra
      </Button>
    </div>
  )
}
