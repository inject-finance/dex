import { PagerMiddleware } from '@/common/middlewares/pager.middleware'
import { TokensModule } from '@/tokens/tokens.module'
import { UsersModule } from '@/users/users.module'
import {
  Logger,
  MiddlewareConsumer,
  Module,
  NestModule,
  RequestMethod
} from '@nestjs/common'
import { ConfigModule } from '@nestjs/config'
import { DatabaseModule } from './database.module'
import { LiquidityModule } from './liquidity/liquidity.module'
import { PoolsModule } from './pools/pools.module'
import { PositionsModule } from './staking/positions.module'
import { HttpModule } from '@nestjs/axios'
@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule,
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

  constructor() {
    Logger.log('process.env', process.env.JWT_SECRET)
  }
}
