import { Module } from '@nestjs/common'
import { AddCropToFarmCollaboration } from './collaborations/add-crop-to-farm.collaboration'
import { CreateFarmCollaboration } from './collaborations/create-farm.collaboration'
import { CreateHarvestCollaboration } from './collaborations/create-harvest.collaboration'
import { CreateProducerCollaboration } from './collaborations/create-producer.collaboration'
import { DeleteFarmCollaboration } from './collaborations/delete-farm.collaboration'
import { DeleteProducerCollaboration } from './collaborations/delete-producer.collaboration'
import { GetDashboardCollaboration } from './collaborations/get-dashboard.collaboration'
import { UpdateFarmCollaboration } from './collaborations/update-farm.collaboration'
import { UpdateProducerCollaboration } from './collaborations/update-producer.collaboration'
import { ApplicationDispatcher } from './dispatcher'
import { InfrastructureModule } from '../infrastructure/database/infrastructure.module'

const APPLICATION_PROVIDERS = [
  ApplicationDispatcher,
  CreateProducerCollaboration,
  UpdateProducerCollaboration,
  DeleteProducerCollaboration,
  CreateFarmCollaboration,
  UpdateFarmCollaboration,
  DeleteFarmCollaboration,
  AddCropToFarmCollaboration,
  CreateHarvestCollaboration,
  GetDashboardCollaboration,
]

@Module({
  imports: [InfrastructureModule],
  providers: APPLICATION_PROVIDERS,
  exports: APPLICATION_PROVIDERS,
})
export class ApplicationModule {}
