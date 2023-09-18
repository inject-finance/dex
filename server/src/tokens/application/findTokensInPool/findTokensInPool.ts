import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Token } from '@/tokens/domain/tokens.entity'
import { Injectable } from '@nestjs/common'
import { Like } from 'typeorm'

@Injectable()
export class FindTokensInPool {
  constructor(private readonly poolsRepository: PoolsRepository) {}

  async run({ tokenSymbol }: { tokenSymbol: string }) {
    const data = await this.poolsRepository.find({
      where: [
        { tokenA: { symbol: Like(`%${tokenSymbol.toLocaleUpperCase()}%`) } },
        { tokenB: { symbol: Like(`%${tokenSymbol.toLocaleUpperCase()}%`) } }
      ],
      relations: { tokenA: true, tokenB: true }
    })

    return data
      .map((e) => {
        if (
          e.tokenA.symbol.toLocaleLowerCase() ===
          tokenSymbol.toLocaleLowerCase()
        ) {
          return e.tokenB
        }
        if (
          e.tokenB.symbol.toLocaleLowerCase() ===
          tokenSymbol.toLocaleLowerCase()
        ) {
          return e.tokenA
        }
        return undefined as unknown as Token
      })
      .filter(Boolean)
  }
}
