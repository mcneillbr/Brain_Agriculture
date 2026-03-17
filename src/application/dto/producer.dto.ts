export interface CreateProducerDto {
  name: string
  document: string
}

export interface UpdateProducerDto {
  name?: string
  document?: string
}

export interface ProducerDto {
  id: string
  name: string
  document: string
  documentType: 'CPF' | 'CNPJ'
  documentFormatted: string
  createdAt: Date
  updatedAt: Date
}