import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger'
import {
  IsString, IsNotEmpty, MinLength, IsNumber,
  Min, IsOptional, IsUUID,
} from 'class-validator'

export class CreateFarmHttpDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  producerId!: string

  @ApiProperty({ example: 'Fazenda Esperança' })
  @IsString()
  @IsNotEmpty()
  @MinLength(2)
  name!: string

  @ApiProperty({ example: 'Ribeirão Preto' })
  @IsString()
  @IsNotEmpty()
  city!: string

  @ApiProperty({ example: 'SP', description: 'Sigla do estado brasileiro' })
  @IsString()
  @IsNotEmpty()
  state!: string

  @ApiProperty({ example: 500.0, description: 'Área total em hectares' })
  @IsNumber()
  @Min(0)
  totalArea!: number

  @ApiProperty({ example: 300.0, description: 'Área agricultável em hectares' })
  @IsNumber()
  @Min(0)
  arableArea!: number

  @ApiProperty({ example: 150.0, description: 'Área de vegetação em hectares' })
  @IsNumber()
  @Min(0)
  vegetationArea!: number
}

export class UpdateFarmHttpDto {
  @ApiPropertyOptional({ example: 'Fazenda Nova' })
  @IsOptional()
  @IsString()
  @MinLength(2)
  name?: string

  @ApiPropertyOptional({ example: 'Campinas' })
  @IsOptional()
  @IsString()
  city?: string

  @ApiPropertyOptional({ example: 'MG' })
  @IsOptional()
  @IsString()
  state?: string

  @ApiPropertyOptional({ example: 600.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  totalArea?: number

  @ApiPropertyOptional({ example: 350.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  arableArea?: number

  @ApiPropertyOptional({ example: 200.0 })
  @IsOptional()
  @IsNumber()
  @Min(0)
  vegetationArea?: number
}

export class FarmResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  producerId!: string

  @ApiPropertyOptional({ example: 'Joao Silva' })
  producerName?: string

  @ApiProperty({ example: 'Fazenda Esperança' })
  name!: string

  @ApiProperty({ example: 'Ribeirão Preto' })
  city!: string

  @ApiProperty({ example: 'SP' })
  state!: string

  @ApiProperty({ example: 500.0 })
  totalArea!: number

  @ApiProperty({ example: 300.0 })
  arableArea!: number

  @ApiProperty({ example: 150.0 })
  vegetationArea!: number

  @ApiProperty({ example: 50.0 })
  unusedArea!: number

  @ApiProperty({ example: 60.0 })
  arablePercentage!: number

  @ApiProperty({ example: 30.0 })
  vegetationPercentage!: number

  @ApiProperty({ isArray: true })
  crops!: object[]

  @ApiProperty()
  createdAt!: Date

  @ApiProperty()
  updatedAt!: Date
}