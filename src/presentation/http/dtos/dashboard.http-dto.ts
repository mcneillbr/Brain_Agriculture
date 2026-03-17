import { ApiProperty } from '@nestjs/swagger'

export class PieSliceResponseDto {
  @ApiProperty({ example: 'SP' })
  label!: string

  @ApiProperty({ example: 42 })
  value!: number

  @ApiProperty({ example: 35.5 })
  percentage!: number
}

export class LandUseResponseDto {
  @ApiProperty({ example: 12500.5 })
  arableArea!: number

  @ApiProperty({ example: 8000.0 })
  vegetationArea!: number

  @ApiProperty({ example: 2000.0 })
  unusedArea!: number
}

export class DashboardResponseDto {
  @ApiProperty({ example: 150, description: 'Total de fazendas cadastradas' })
  totalFarms!: number

  @ApiProperty({ example: 22500.5, description: 'Soma de todas as áreas em hectares' })
  totalHectares!: number

  @ApiProperty({ type: [PieSliceResponseDto], description: 'Distribuição por estado' })
  byState!: PieSliceResponseDto[]

  @ApiProperty({ type: [PieSliceResponseDto], description: 'Distribuição por cultura plantada' })
  byCrop!: PieSliceResponseDto[]

  @ApiProperty({ type: LandUseResponseDto, description: 'Uso do solo em hectares' })
  byLandUse!: LandUseResponseDto
}