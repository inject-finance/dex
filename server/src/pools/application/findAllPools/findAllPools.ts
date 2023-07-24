import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Injectable } from '@nestjs/common'

@Injectable()
export class FindAllPools {
  constructor(private readonly repository: PoolsRepository) {}

  run(dto: { key: string; value: string }) {
    return this.repository.findAll(dto)
  }
}
