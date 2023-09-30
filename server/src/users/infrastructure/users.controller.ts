/* eslint-disable max-params */
import { PaginationDto } from '@/common/dto/pagination.dto'
import { FindLiquidityByUserIdAndPool } from '@/liquidity/application/findLiquidityByUserIdAndPool/findLiquidityByUserIdAndPool'
import { RemoveLiquidity } from '@/liquidity/application/removeLiquidity/removeLiquidity'
import { RemoveLiquidityDto } from '@/liquidity/application/removeLiquidity/removeLiquidity.dto'
import { SaveLiquidity } from '@/liquidity/application/saveLiquidity/saveLiquidity'
import { SaveLiquidityDto } from '@/liquidity/application/saveLiquidity/saveLiquidity.dto'
import { FindUserPoolsByTokens } from '@/pools/application/findUserPoolsByTokens/findUserPoolsByTokens'
import { FindUserPositions } from '@/staking/application/findUserPositions/findUserPositions'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common'
import { Public } from './decorators/public.decorator'

@Controller('users')
export class UsersController {
  constructor(
    private readonly findLiquidityByUserIdAndPool: FindLiquidityByUserIdAndPool,
    private readonly findUserPoolsByTokens: FindUserPoolsByTokens,
    private readonly saveLiquidity: SaveLiquidity,
    private readonly removeLiquidity: RemoveLiquidity,
    private readonly findUserPositions: FindUserPositions
  ) {}

  @Get('/:id/pools/tokens')
  findUserPools(
    @Param('id') id: string,
    @Query() { key, value }: PaginationDto
  ) {
    return this.findUserPoolsByTokens.run({ userId: id, key, value })
  }

  @Get('/:id/liquidity')
  findMyLiquidity(
    @Param('id') id: string,
    @Query() { key, value }: PaginationDto
  ) {
    return this.findLiquidityByUserIdAndPool.run({ userId: id, key, value })
  }

  @Post('/:id/liquidity')
  save(@Body() dto: SaveLiquidityDto) {
    return this.saveLiquidity.run(dto)
  }

  @Delete('/:userId/liquidity/:poolId')
  remove(@Param() dto: RemoveLiquidityDto) {
    return this.removeLiquidity.run(dto)
  }

  @Public()
  @Get('/:id/positions')
  findPositions(@Param('id') id: string) {
    return this.findUserPositions.run(id)
  }
}
