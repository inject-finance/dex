/* eslint-disable no-negated-condition */
import { Pool } from '@/pools/domain/pool.entity'
import { PositionsRepository } from '@/staking/domain/positions.repository'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'
import { FindUserPositions } from '../findUserPositions/findUserPositions'
import { SavePositionDto } from './savePosition.dto'

@Injectable()
export class SavePosition {
  constructor(
    private readonly repository: PositionsRepository,
    private readonly findLiquidityById: FindUserPositions
  ) {}

  run({ userId, poolId, end, start }: SavePositionDto) {
    const data = this.repository.create({
      user: new User(userId),
      pool: new Pool(poolId),
      end,
      start
    })
    return this.repository.save(data)
  }
}
