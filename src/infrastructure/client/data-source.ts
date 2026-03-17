import 'dotenv/config'
import { ConfigService } from '@nestjs/config'
import { DataSource, DataSourceOptions } from 'typeorm'
import { ProducerOrmEntity } from '../database/orm-entities/producer.orm-entity'
import { FarmOrmEntity } from '../database/orm-entities/farm.orm-entity'
import { CropOrmEntity } from '../database/orm-entities/crop.orm-entity'
import { HarvestOrmEntity } from '../database/orm-entities/harvest.orm-entity'
import { validateEnvironmentVariables } from './env.validation'

const validatedEnvironment = validateEnvironmentVariables(process.env)

export function getDataSourceOptions(configService?: ConfigService): DataSourceOptions {
  return {
    type: 'postgres',
    host: configService?.get<string>('DB_HOST') ?? validatedEnvironment.DB_HOST,
    port: Number(configService?.get<number>('DB_PORT') ?? validatedEnvironment.DB_PORT),
    username: configService?.get<string>('DB_USER') ?? validatedEnvironment.DB_USER,
    password: configService?.get<string>('DB_PASS') ?? validatedEnvironment.DB_PASS,
    database: configService?.get<string>('DB_NAME') ?? validatedEnvironment.DB_NAME,
    entities: [ProducerOrmEntity, FarmOrmEntity, CropOrmEntity, HarvestOrmEntity],
    synchronize: false,
    logging: (configService?.get<string>('NODE_ENV') ?? validatedEnvironment.NODE_ENV) === 'development',
    ssl:
      (configService?.get<boolean>('DB_SSL') ?? validatedEnvironment.DB_SSL)
        ? { rejectUnauthorized: false }
        : false,
  }
}

export const dataSourceOptions: DataSourceOptions = getDataSourceOptions()

export const AppDataSource = new DataSource(dataSourceOptions)