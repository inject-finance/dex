import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Injectable } from '@nestjs/common'
import { Like } from 'typeorm'

@Injectable()
export class FindPoolsByTokens {
  constructor(private poolsRepository: PoolsRepository) {}

  run({ key, value }: { key: string; value: string }) {
    return this.poolsRepository.find({
      where: value.length
        ? [
            {
              tokenA: {
                [String(key)]: Like(`%${value?.toLocaleUpperCase()}%`)
              }
            },
            {
              tokenB: {
                [String(key)]: Like(`%${value?.toLocaleUpperCase()}%`)
              }
            }
          ]
        : undefined,
      relations: { tokenA: true, tokenB: true }
    })
  }
}
