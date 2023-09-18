/* eslint-disable max-lines-per-function */
import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Token } from '@/tokens/domain/tokens.entity'
import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'
import { Like } from 'typeorm'

@Injectable()
export class FindTokensWithoutPool {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly poolsRepository: PoolsRepository
  ) {}

  async run({ symbol }: { symbol: string }) {
    const data = await this.poolsRepository.find({
      select: {
        id: true
      },
      where: [{ tokenA: { symbol } }, { tokenB: { symbol } }],
      relations: { tokenA: true, tokenB: true }
    })

    const tokensDone = data
      .map((e) => {
        if (e.tokenA.symbol === symbol) {
          return e.tokenB
        }
        if (e.tokenB.symbol === symbol) {
          return e.tokenA
        }
        return undefined as unknown as Token
      })
      .filter(Boolean)

    const tokens = await this.tokensRepository.find()

    return tokens
      .map((e) => {
        const tokenDone = tokensDone.find((td) => td.symbol === e.symbol)

        if (tokenDone) {
          return null as unknown as Token
        }
        return e
      })
      .filter(Boolean)
      .filter((e) => {
        if (symbol.includes('ETH') && e.symbol.includes('ETH')) {
          return null as unknown as Token
        }

        if (e.symbol === symbol) {
          return null as unknown as Token
        }

        return e
      })
      .filter(Boolean)
  }
}
