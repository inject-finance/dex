import { FindLiquidityById } from '@/liquidity/application/findLiquidityById/findLiquidityById'
import { FindLiquidityByUserIdAndPool } from '@/liquidity/application/findLiquidityByUserIdAndPool/findLiquidityByUserIdAndPool'
import { RemoveLiquidity } from '@/liquidity/application/removeLiquidity/removeLiquidity'
import { SaveLiquidity } from '@/liquidity/application/saveLiquidity/saveLiquidity'
import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { FindUserPoolsByTokens } from '@/pools/application/findUserPoolsByTokens/findUserPoolsByTokens'
import { FindUserPositions } from '@/staking/application/findUserPositions/findUserPositions'
import { PositionsRepository } from '@/staking/domain/positions.repository'
import { CacheModule } from '@nestjs/cache-manager'
import { Module } from '@nestjs/common'
import { APP_GUARD } from '@nestjs/core'
import { JwtModule } from '@nestjs/jwt'
import { AuthService } from './application/auth/auth.service'
import { FindUserByAddress } from './application/findUserByAddress/findUserByAddress'
import { UsersRepository } from './domain/users.repository'
import { AuthController } from './infrastructure/auth.controller'
import { AddressGuard } from './infrastructure/guards/address.guard'
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard'
import { UsersController } from './infrastructure/users.controller'
import { ConfigModule } from '@nestjs/config'

@Module({
  imports: [
    ConfigModule.forRoot(),
    CacheModule.register(),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET,
      signOptions: { expiresIn: '24h' }
    })
  ],
  controllers: [UsersController, AuthController],
  providers: [
    {
      provide: APP_GUARD,
      useClass: JwtAuthGuard
    },
    AuthService,
    {
      provide: APP_GUARD,
      useClass: AddressGuard
    },
    UsersRepository,
    FindUserByAddress,
    FindLiquidityByUserIdAndPool,
    FindLiquidityById,
    FindUserPoolsByTokens,
    SaveLiquidity,
    RemoveLiquidity,
    LiquidityRepository,
    FindUserPositions,
    PositionsRepository
  ],
  exports: [UsersRepository]
})
export class UsersModule {}
