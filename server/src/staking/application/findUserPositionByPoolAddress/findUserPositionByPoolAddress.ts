import { PositionsRepository } from '@/staking/domain/positions.repository'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindUserPositionByPoolAddress {
  constructor(private readonly repository: PositionsRepository) {}

  run(userId: string, poolAddress: string) {
    return this.repository.findOne({
      where: { user: new User(userId), pool: { address: poolAddress } },
      relations: { user: true, pool: { tokenA: true, tokenB: true } }
    })
  }
}
