import { ApiProperty } from '@nestjs/swagger'
import { IsString, IsNotEmpty, IsUUID, IsInt, Min } from 'class-validator'

export class AddCropHttpDto {
  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440000' })
  @IsUUID()
  farmId!: string

  @ApiProperty({ example: '550e8400-e29b-41d4-a716-446655440001' })
  @IsUUID()
  harvestId!: string

  @ApiProperty({
    example: 'Soja',
    description: 'Soja, Milho, Algodão, Café, Cana-de-açúcar, Trigo, Arroz, Feijão, Sorgo, Girassol',
  })
  @IsString()
  @IsNotEmpty()
  name!: string
}

export class CropResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty()
  farmId!: string

  @ApiProperty()
  harvestId!: string

  @ApiProperty({ example: 'Soja' })
  name!: string

  @ApiProperty()
  createdAt!: Date
}

export class CreateHarvestHttpDto {
  @ApiProperty({ example: 'Safra 2024' })
  @IsString()
  @IsNotEmpty()
  name!: string

  @ApiProperty({ example: 2024 })
  @IsInt()
  @Min(1900)
  year!: number
}

export class HarvestResponseDto {
  @ApiProperty()
  id!: string

  @ApiProperty({ example: 'Safra 2024' })
  name!: string

  @ApiProperty({ example: 2024 })
  year!: number

  @ApiProperty()
  createdAt!: Date
}