import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { Injectable } from '@nestjs/common'
import { FindUserPoolsByTokensDto } from './findUserPoolsByTokens.dto'

@Injectable()
export class FindUserPoolsByTokens {
  constructor(private readonly repository: LiquidityRepository) {}

  async run({
    userId,
    key,
    value
  }: FindUserPoolsByTokensDto & { key?: string; value?: string }) {
    const data = await this.repository.findUserPoolsByTokens({
      userId,
      key,
      value
    })

    return data.map((e) => e.pool)
  }
}
