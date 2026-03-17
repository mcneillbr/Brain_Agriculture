import { Module } from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { validateEnvironmentVariables } from './infrastructure/client/env.validation'
import { HttpModule } from './presentation/http/http.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      cache: true,
      envFilePath: '.env',
      validate: validateEnvironmentVariables,
    }),
    HttpModule,
  ],
})
export class AppModule {}
