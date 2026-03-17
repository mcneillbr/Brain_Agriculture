import { Module } from '@nestjs/common'
import { FARM_REPOSITORY } from '../../domain/repositories/farm.repository'
import { HARVEST_REPOSITORY } from '../../domain/repositories/harvest.repository'
import { PRODUCER_REPOSITORY } from '../../domain/repositories/producer.repository'
import { DatabaseModule } from '../client/database.module'
import { FarmReadGateway } from './gateways/farm-read.gateway'
import { FarmWriteGateway } from './gateways/farm-write.gateway'
import { HarvestReadGateway } from './gateways/harvest-read.gateway'
import { HarvestWriteGateway } from './gateways/harvest-write.gateway'
import { ProducerReadGateway } from './gateways/producer-read.gateway'
import { ProducerWriteGateway } from './gateways/producer-write.gateway'
import { FarmRepositoryImpl } from './farm.repository.impl'
import { HarvestRepositoryImpl } from './harvest.repository.impl'
import { ProducerRepositoryImpl } from './producer.repository.impl'

@Module({
  imports: [DatabaseModule],
  providers: [
    ProducerReadGateway,
    ProducerWriteGateway,
    FarmReadGateway,
    FarmWriteGateway,
    HarvestReadGateway,
    HarvestWriteGateway,
    ProducerRepositoryImpl,
    FarmRepositoryImpl,
    HarvestRepositoryImpl,
    {
      provide: PRODUCER_REPOSITORY,
      useExisting: ProducerRepositoryImpl,
    },
    {
      provide: FARM_REPOSITORY,
      useExisting: FarmRepositoryImpl,
    },
    {
      provide: HARVEST_REPOSITORY,
      useExisting: HarvestRepositoryImpl,
    },
  ],
  exports: [PRODUCER_REPOSITORY, FARM_REPOSITORY, HARVEST_REPOSITORY],
})
export class InfrastructureModule {}
