/* eslint-disable no-negated-condition */
import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { Pool } from '@/pools/domain/pool.entity'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { SaveLiquidityDto } from './saveLiquidity.dto'
import { FindLiquidityById } from '../findLiquidityById/findLiquidityById'

@Injectable()
export class SaveLiquidity {
  constructor(
    private readonly repository: LiquidityRepository,
    private readonly findLiquidityById: FindLiquidityById
  ) {}

  async run({ userId, poolId }: SaveLiquidityDto) {
    const liquidity = await this.repository.findOneBy({
      user: new User(userId),
      pool: new Pool(poolId)
    })

    if (!liquidity) {
      const data = this.repository.create({
        user: new User(userId),
        pool: new Pool(poolId)
      })
      return this.repository.save(data)
    }

    return this.repository.update(liquidity, { id: liquidity.id })
  }
}
