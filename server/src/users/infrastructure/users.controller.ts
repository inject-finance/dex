/* eslint-disable max-params */
import { PaginationDto } from '@/common/dto/pagination.dto'
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query
} from '@nestjs/common'
import type { User } from '../domain/user.entity'
import { FindLiquidityByUserIdAndPool } from '@/liquidity/application/findLiquidityByUserIdAndPool/findLiquidityByUserIdAndPool'
import { SaveLiquidityDto } from '@/liquidity/application/saveLiquidity/saveLiquidity.dto'
import { SaveLiquidity } from '@/liquidity/application/saveLiquidity/saveLiquidity'
import { FindUserPoolsByTokens } from '@/pools/application/findUserPoolsByTokens/findUserPoolsByTokens'
import { Public } from './decorators/public.decorator'
import { FindUserPositions } from '@/staking/application/findUserPositions/findUserPositions'
import { RemoveLiquidity } from '@/liquidity/application/removeLiquidity/removeLiquidity'
import { RemoveLiquidityDto } from '@/liquidity/application/removeLiquidity/removeLiquidity.dto'

@Controller('users')
export class UsersController {
  constructor(
    private readonly findLiquidityByUserIdAndPool: FindLiquidityByUserIdAndPool,
    private readonly findUserPoolsByTokens: FindUserPoolsByTokens,
    private readonly saveLiquidity: SaveLiquidity,
    private readonly removeLiquidity: RemoveLiquidity,
    private readonly findUserPositions: FindUserPositions
  ) {}

  @Get()
  findAll(@Query() dto: PaginationDto) {
    return this.userService.findAll(dto)
  }

  @Get('/:id')
  findById(@Param('id') id: string): Promise<User | null> {
    return this.userService.findById(id)
  }

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
