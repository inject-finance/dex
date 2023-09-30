import { Module } from '@nestjs/common'
import { DataSource } from 'typeorm'
import { User } from './users/domain/user.entity'
import { Image } from './users/domain/image.entity'
import { Token } from './tokens/domain/tokens.entity'
import { Position } from './staking/domain/position.entity'
import { Pool } from './pools/domain/pool.entity'
import { Liquidity } from './liquidity/domain/liquidity.entity'
import { ConfigModule } from '@nestjs/config'
import * as dotenv from 'dotenv'

dotenv.config()

export const AppDataSource = new DataSource({
  type: process.env.DB_TYPE as any,
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  entities: [User, Image, Token, Position, Pool, Liquidity],
  synchronize: false,
  // logging: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  }
})

export const databaseProviders = [
  {
    provide: 'DATA_SOURCE',
    useFactory: async () => await AppDataSource.initialize()
  }
]

@Module({
  imports: [ConfigModule.forRoot({ isGlobal: true })],
  providers: [...databaseProviders],
  exports: [...databaseProviders]
})
export class DatabaseModule {}
