import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common'
import { ApiOperation, ApiParam, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApplicationDispatcher } from '../../../application/dispatcher'
import { CreateFarmHttpDto, UpdateFarmHttpDto } from '../dtos/farm.http-dto'
import { ParseUuidPipe } from '../pipes/parse-uuid.pipe'

@ApiTags('Fazendas')
@Controller('farms')
export class FarmController {
  constructor(private readonly dispatcher: ApplicationDispatcher) {}

  @Get()
  @ApiOperation({ summary: 'Listar todas as fazendas' })
  @ApiResponse({ status: 200, description: 'Lista de fazendas retornada com sucesso' })
  findAll() {
    return this.dispatcher.getAllFarms()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar fazenda por ID' })
  @ApiParam({ name: 'id', description: 'UUID da fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda encontrada' })
  @ApiResponse({ status: 404, description: 'Fazenda não encontrada' })
  async findOne(@Param('id', ParseUuidPipe) id: string) {
    const farm = await this.dispatcher.getFarmById(id)
    if (!farm) {
      throw new NotFoundException(`Fazenda com id "${id}" não encontrada`)
    }
    return farm
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar nova fazenda' })
  @ApiResponse({ status: 201, description: 'Fazenda criada com sucesso' })
  create(@Body() body: CreateFarmHttpDto) {
    return this.dispatcher.createFarm(body)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar fazenda' })
  @ApiParam({ name: 'id', description: 'UUID da fazenda' })
  @ApiResponse({ status: 200, description: 'Fazenda atualizada' })
  update(@Param('id', ParseUuidPipe) id: string, @Body() body: UpdateFarmHttpDto) {
    return this.dispatcher.updateFarm(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover fazenda' })
  @ApiParam({ name: 'id', description: 'UUID da fazenda' })
  @ApiResponse({ status: 204, description: 'Fazenda removida' })
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.dispatcher.deleteFarm(id)
  }
}