import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindPoolByCriteria {
  constructor(private poolsRepository: PoolsRepository) {}

  run({ key, value }: { key: string; value: string }) {
    return this.poolsRepository.findOne({
      where: { [key]: value },
      relations: { tokenA: true, tokenB: true }
    })
  }
}
