import { Module } from '@nestjs/common'
import { APP_FILTER, APP_INTERCEPTOR } from '@nestjs/core'
import { ApplicationModule } from '../../application/application.module'
import { CropController } from './controllers/crop.controller'
import { DashboardController } from './controllers/dashboard.controller'
import { FarmController } from './controllers/farm.controller'
import { HarvestController } from './controllers/harvest.controller'
import { ProducerController } from './controllers/producer.controller'
import { GlobalExceptionFilter } from './filters/global-exception.filter'
import { LoggingInterceptor } from './interceptors/logging.interceptor'

@Module({
  imports: [ApplicationModule],
  controllers: [
    ProducerController,
    FarmController,
    CropController,
    HarvestController,
    DashboardController,
  ],
  providers: [
    {
      provide: APP_INTERCEPTOR,
      useClass: LoggingInterceptor,
    },
    {
      provide: APP_FILTER,
      useClass: GlobalExceptionFilter,
    },
  ],
})
export class HttpModule {}
