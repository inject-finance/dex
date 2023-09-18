import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindAllPools {
  constructor(private readonly repository: PoolsRepository) {}

  run() {
    return this.repository.find({
      relations: { tokenA: true, tokenB: true }
    })
  }
}
