import { appConfig } from '@/common/config/app.config'
import { PagerMiddleware } from '@/common/middlewares/pager.middleware'
import { dbProvider } from '@/common/providers/db.provider'
import { TokensModule } from '@/tokens/tokens.module'
import { UsersModule } from '@/users/users.module'
import {
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { TypeOrmModule } from '@nestjs/typeorm'
import { PoolsModule } from './pools/pools.module'
import { LiquidityModule } from './liquidity/liquidity.module'
import { PositionsModule } from './staking/positions.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      load: [appConfig]
    }),
    TypeOrmModule.forRootAsync({ ...dbProvider }),
    TokensModule,
    PoolsModule,
    UsersModule,
    LiquidityModule,
    PositionsModule
  ],
  controllers: []
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(PagerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.GET })
  }
}
