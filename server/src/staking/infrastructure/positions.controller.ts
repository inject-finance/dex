/* eslint-disable max-params */
import { Public } from '@/users/infrastructure/decorators/public.decorator'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { FindUserPositions } from '../application/findUserPositions/findUserPositions'
import { RedeemRewards } from '../application/redeemRewards/redeemRewards'
import { SavePosition } from '../application/savePosition/savePosition'
import { SavePositionDto } from '../application/savePosition/savePosition.dto'
import { FindUserPositionByPoolAddress } from '../application/findUserPositionByPoolAddress/findUserPositionByPoolAddress'

@Controller('positions')
export class PositionsController {
  constructor(
    private readonly findUserPositions: FindUserPositions,
    private readonly savePositionDto: SavePosition,
    private readonly redeemRewards: RedeemRewards,
    private readonly findUserPositionByPoolAddress: FindUserPositionByPoolAddress
  ) {}

  @Public()
  @Post('/')
  savePosition(@Body() dto: SavePositionDto) {
    return this.savePositionDto.run(dto)
  }

  @Public()
  @Post('/redeem')
  redeemPosition(@Body() dto: { userId: string; poolId: string }) {
    return this.redeemRewards.run(dto)
  }

  @Public()
  @Get('/user/:userId/pools/:poolAddress')
  userPositionByPoolAddress(
    @Param('userId') userId: string,
    @Param('poolAddress') poolAddress: string
  ) {
    return this.findUserPositionByPoolAddress.run(userId, poolAddress)
  }

  @Public()
  @Get('/:id')
  findPositions(@Param('id') id: string) {
    return this.findUserPositions.run(id)
  }
}
