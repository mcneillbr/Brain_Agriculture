import { Controller, Get } from '@nestjs/common'
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger'
import { ApplicationDispatcher } from '../../../application/dispatcher'

@ApiTags('Dashboard')
@Controller('dashboard')
export class DashboardController {
  constructor(private readonly dispatcher: ApplicationDispatcher) {}

  @Get()
  @ApiOperation({ summary: 'Obter dados consolidados do dashboard' })
  @ApiResponse({ status: 200, description: 'Dados do dashboard retornados com sucesso' })
  getDashboard() {
    return this.dispatcher.getDashboard()
  }
}
