import {
  Controller, Get, Post, Patch, Delete,
  Param, Body, HttpCode, HttpStatus, NotFoundException,
} from '@nestjs/common'
import {
  ApiTags, ApiOperation, ApiResponse, ApiParam,
} from '@nestjs/swagger'
import { ApplicationDispatcher } from '../../../application/dispatcher'
import { CreateProducerHttpDto, UpdateProducerHttpDto } from '../dtos/producer.http-dto'
import { ParseUuidPipe } from '../pipes/parse-uuid.pipe'

@ApiTags('Produtores')
@Controller('producers')
export class ProducerController {
  constructor(private readonly dispatcher: ApplicationDispatcher) {}

  @Get()
  @ApiOperation({ summary: 'Listar todos os produtores' })
  @ApiResponse({ status: 200, description: 'Lista de produtores retornada com sucesso' })
  findAll() {
    return this.dispatcher.getAllProducers()
  }

  @Get(':id')
  @ApiOperation({ summary: 'Buscar produtor por ID' })
  @ApiParam({ name: 'id', description: 'UUID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor encontrado' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  async findOne(@Param('id', ParseUuidPipe) id: string) {
    const producer = await this.dispatcher.getProducerById(id)
    if (!producer) {
      throw new NotFoundException(`Produtor com id "${id}" não encontrado`)
    }
    return producer
  }

  @Post()
  @ApiOperation({ summary: 'Cadastrar novo produtor' })
  @ApiResponse({ status: 201, description: 'Produtor criado com sucesso' })
  @ApiResponse({ status: 422, description: 'Erro de domínio — CPF/CNPJ inválido ou duplicado' })
  create(@Body() body: CreateProducerHttpDto) {
    return this.dispatcher.createProducer(body)
  }

  @Patch(':id')
  @ApiOperation({ summary: 'Atualizar produtor' })
  @ApiParam({ name: 'id', description: 'UUID do produtor' })
  @ApiResponse({ status: 200, description: 'Produtor atualizado' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  update(@Param('id', ParseUuidPipe) id: string, @Body() body: UpdateProducerHttpDto) {
    return this.dispatcher.updateProducer(id, body)
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Remover produtor' })
  @ApiParam({ name: 'id', description: 'UUID do produtor' })
  @ApiResponse({ status: 204, description: 'Produtor removido' })
  @ApiResponse({ status: 404, description: 'Produtor não encontrado' })
  remove(@Param('id', ParseUuidPipe) id: string) {
    return this.dispatcher.deleteProducer(id)
  }
}