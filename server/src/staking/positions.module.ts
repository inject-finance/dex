import { Module } from '@nestjs/common'
import { PositionsRepository } from './domain/positions.repository'
import { PositionsController } from './infrastructure/positions.controller'
import { FindUserPositions } from './application/findUserPositions/findUserPositions'
import { SavePosition } from './application/savePosition/savePosition'
import { RedeemRewards } from './application/redeemRewards/redeemRewards'
import { FindUserPositionByPoolAddress } from './application/findUserPositionByPoolAddress/findUserPositionByPoolAddress'

@Module({
  imports: [],
  controllers: [PositionsController],
  providers: [
    SavePosition,
    FindUserPositions,
    PositionsRepository,
    FindUserPositionByPoolAddress,
    RedeemRewards
  ]
})
export class PositionsModule {}
