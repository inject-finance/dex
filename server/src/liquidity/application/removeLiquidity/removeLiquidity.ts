/* eslint-disable no-negated-condition */
import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { Pool } from '@/pools/domain/pool.entity'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { RemoveLiquidityDto } from './removeLiquidity.dto'

@Injectable()
export class RemoveLiquidity {
  constructor(private readonly repository: LiquidityRepository) {}

  async run({ userId, poolId }: RemoveLiquidityDto) {
    const liquidity = await this.repository.findOneBy({
      user: new User(userId),
      pool: new Pool(poolId)
    })

    if (liquidity) {
      await this.repository.delete({
        user: new User(userId),
        pool: new Pool(poolId)
      })
    }

    return liquidity
  }
}
