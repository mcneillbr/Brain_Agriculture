import { Global, Module } from '@nestjs/common'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { getDataSourceOptions } from './data-source'
import { CropOrmEntity } from '../database/orm-entities/crop.orm-entity'
import { FarmOrmEntity } from '../database/orm-entities/farm.orm-entity'
import { HarvestOrmEntity } from '../database/orm-entities/harvest.orm-entity'
import { ProducerOrmEntity } from '../database/orm-entities/producer.orm-entity'

@Global()
@Module({
	imports: [
		ConfigModule,
		TypeOrmModule.forRootAsync({
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => getDataSourceOptions(configService),
		}),
		TypeOrmModule.forFeature([ProducerOrmEntity, FarmOrmEntity, CropOrmEntity, HarvestOrmEntity]),
	],
	exports: [TypeOrmModule],
})
export class DatabaseModule {}

