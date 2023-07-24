import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { FindLiquidityByUserIdAndPool } from './application/findLiquidityByUserIdAndPool/findLiquidityByUserIdAndPool'
import { LiquidityRepository } from './domain/liquidity.repository'
import { LiquidityController } from './infrastructure/liquidity.controller'
import { FindLiquidityById } from './application/findLiquidityById/findLiquidityById'
import { SaveLiquidity } from './application/saveLiquidity/saveLiquidity'

@Module({
  imports: [HttpModule],
  controllers: [LiquidityController],
  providers: [
    FindLiquidityByUserIdAndPool,
    SaveLiquidity,
    FindLiquidityById,
    LiquidityRepository
  ],
  exports: [
    FindLiquidityByUserIdAndPool,
    FindLiquidityById,
    SaveLiquidity,
    FindLiquidityById
  ]
})
export class LiquidityModule {}
