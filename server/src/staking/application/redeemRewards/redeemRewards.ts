/* eslint-disable no-negated-condition */
import { Pool } from '@/pools/domain/pool.entity'
import { PositionsRepository } from '@/staking/domain/positions.repository'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class RedeemRewards {
  constructor(private readonly repository: PositionsRepository) {}

  async run({ userId, poolId }: { userId: string; poolId: string }) {
    await this.repository.delete({
      user: new User(userId),
      pool: new Pool(poolId)
    })
  }
}
