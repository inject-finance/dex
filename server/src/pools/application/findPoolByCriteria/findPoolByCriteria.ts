import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindPoolByCriteria {
  constructor(private readonly repository: PoolsRepository) {}

  run({ key, value }: { key: string; value: string }) {
    return this.repository.findOne({
      where: { [key]: value },
      relations: { tokenA: true, tokenB: true }
    })
  }
}
