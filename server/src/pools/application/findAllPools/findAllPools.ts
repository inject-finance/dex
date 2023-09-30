import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindAllPools {
  constructor(private poolsRepository: PoolsRepository) {}

  run() {
    return this.poolsRepository.find({
      relations: { tokenA: true, tokenB: true }
    })
  }
}
