import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { UsersController } from './infrastructure/users.controller'
import { UsersRepository } from './domain/users.repository'
import { UsersService } from './services/users.service'
import { ConfigModule, ConfigService } from '@nestjs/config'
import { PassportModule } from '@nestjs/passport'
import { JwtModule } from '@nestjs/jwt'
import { JwtStrategy } from './infrastructure/strategies/jwt.strategy'
import { APP_GUARD } from '@nestjs/core'
import { JwtAuthGuard } from './infrastructure/guards/jwt-auth.guard'
import { AuthService } from './application/auth/auth.service'
import { AddressGuard } from './infrastructure/guards/address.guard'
import { FindUserByAddress } from './application/findUserByAddress/findUserByAddress'
import { AuthController } from './infrastructure/auth.controller'
import { FindLiquidityByUserIdAndPool } from '@/liquidity/application/findLiquidityByUserIdAndPool/findLiquidityByUserIdAndPool'
import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { SaveLiquidity } from '@/liquidity/application/saveLiquidity/saveLiquidity'
import { CacheModule } from '@nestjs/cache-manager'
import { FindLiquidityById } from '@/liquidity/application/findLiquidityById/findLiquidityById'
import { FindUserPoolsByTokens } from '@/pools/application/findUserPoolsByTokens/findUserPoolsByTokens'
import { FindUserPositions } from '@/staking/application/findUserPositions/findUserPositions'
import { PositionsRepository } from '@/staking/domain/positions.repository'
import { RemoveLiquidity } from '@/liquidity/application/removeLiquidity/removeLiquidity'

@Module({
  imports: [
    HttpModule,
    ConfigModule,
    PassportModule,
    CacheModule.register(),
    JwtModule.registerAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get('JWT_SECRET'),
        signOptions: {
          expiresIn: '24h'
        }
      })
    })
  ],
  controllers: [UsersController, AuthController],
  providers: [
    JwtStrategy,
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
    UsersService,
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
  exports: [UsersService, UsersRepository]
})
export class UsersModule {}
