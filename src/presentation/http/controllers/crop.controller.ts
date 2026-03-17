import { Body, Controller, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApplicationDispatcher } from '../../../application/dispatcher'
import { AddCropHttpDto } from '../dtos/crop-harvest.http-dto'

@ApiTags('Culturas')
@Controller('crops')
export class CropController {
  constructor(private readonly dispatcher: ApplicationDispatcher) {}

  @Post()
  @ApiOperation({ summary: 'Adicionar cultura a uma fazenda' })
  @ApiResponse({ status: 201, description: 'Cultura adicionada com sucesso' })
  create(@Body() body: AddCropHttpDto) {
    return this.dispatcher.addCropToFarm(body)
  }
}
