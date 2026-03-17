import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import { IsString, IsNotEmpty, MinLength, IsOptional } from 'class-validator'

export class CreateProducerHttpDto {
  @ApiProperty({ example: 'João Silva', description: 'Nome completo do produtor' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string

  @ApiProperty({ example: '529.982.247-25', description: 'CPF ou CNPJ (com ou sem formatação)' })
  @IsString()
  @IsNotEmpty()
  document!: string
}

export class UpdateProducerHttpDto {
  @ApiPropertyOptional({ example: 'João Silva Atualizado' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @ApiPropertyOptional({ example: '11.222.333/0001-81' })
  @IsOptional()
  @IsString()
  document?: string
}

export class ProducerResponseDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  id!: string

  @ApiProperty({ example: 'João Silva' })
  name!: string

  @ApiProperty({ example: '52998224725' })
  document!: string

  @ApiProperty({ enum: ['CPF', 'CNPJ'], example: 'CPF' })
  documentType!: 'CPF' | 'CNPJ'

  @ApiProperty({ example: '529.982.247-25' })
  documentFormatted!: string

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}