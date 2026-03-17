import {
  Body,
  Controller,
  Delete,
  HttpCode,
  HttpStatus,
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