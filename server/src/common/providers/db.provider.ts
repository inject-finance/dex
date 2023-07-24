import { ConfigService, ConfigModule } from '@nestjs/config'
import type { TypeOrmModuleAsyncOptions } from '@nestjs/typeorm'
import { constants } from '../constants'

export const dbProvider = {
  imports: [ConfigModule],
  inject: [ConfigService],
  useFactory: (configService: ConfigService) => ({
    ...configService.get<TypeOrmModuleAsyncOptions>(constants.database)
  })
}
