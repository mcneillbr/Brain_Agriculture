import { Body, Controller, Get, Post } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApplicationDispatcher } from '../../../application/dispatcher'
import { CreateHarvestHttpDto } from '../dtos/crop-harvest.http-dto'

@ApiTags('Safras')
@Controller('harvests')
export class HarvestController {
  constructor(private readonly dispatcher: ApplicationDispatcher) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as safras' })
  @ApiResponse({ status: 200, description: 'Lista de safras retornada com sucesso' })
  findAll() {
    return this.dispatcher.getAllHarvests()
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova safra' })
  @ApiResponse({ status: 201, description: 'Safra criada com sucesso' })
  create(@Body() body: CreateHarvestHttpDto) {
    return this.dispatcher.createHarvest(body)
  }
}
