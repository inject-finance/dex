import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { Injectable } from '@nestjs/common'
import { FindLiquidityByUserIdDto } from './findLiquidityByUserId.dto'

@Injectable()
export class FindLiquidityByUserIdAndPool {
  constructor(private readonly repository: LiquidityRepository) {}

  run({
    userId,
    key,
    value
  }: FindLiquidityByUserIdDto & { key?: string; value?: string }) {
    return this.repository.findUserPoolsByTokens({ userId, key, value })
  }
}
