import { PositionsRepository } from '@/staking/domain/positions.repository'
import { User } from '@/users/domain/user.entity'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindUserPositions {
  constructor(private readonly repository: PositionsRepository) {}

  run(userId: string) {
    return this.repository.find({
      where: { user: new User(userId) },
      relations: { user: true, pool: { tokenA: true, tokenB: true } }
    })
  }
}
