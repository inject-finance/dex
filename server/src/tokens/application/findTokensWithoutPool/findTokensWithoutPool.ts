/* eslint-disable max-lines-per-function */
import { LiquidityRepository } from '@/liquidity/domain/liquidity.repository'
import { PoolsRepository } from '@/pools/domain/pools.repository'
import { Token } from '@/tokens/domain/tokens.entity'
import { TokensRepository } from '@/tokens/domain/tokens.repository'
import { Injectable } from '@nestjs/common'
import { Like, Not } from 'typeorm'

@Injectable()
export class FindTokensWithoutPool {
  constructor(
    private readonly tokensRepository: TokensRepository,
    private readonly poolsRepository: PoolsRepository,
    private readonly liquidityRepository: LiquidityRepository
  ) {}

  async run({ tokenSymbol }: { tokenSymbol: string }) {
    const data = await this.poolsRepository.find({
      where: [
        { tokenA: { symbol: Like(`%${tokenSymbol?.toLocaleUpperCase()}%`) } },
        { tokenB: { symbol: Like(`%${tokenSymbol?.toLocaleUpperCase()}%`) } }
      ],
      relations: { tokenA: true, tokenB: true }
    })

    const tokensDone = data
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

    // const liquidity = await this.liquidityRepository.find({
    //   relations: { pool: { tokenA: true, tokenB: true } }
    // })

    const tokens = await this.tokensRepository.find()

    return tokens
      .map((e) => {
        const tokenDone = tokensDone.find(({ symbol }) => symbol === e.symbol)

        if (tokenDone) {
          return null as unknown as Token
        }
        return e
      })
      .filter(Boolean)
      .filter((e) => {
        if (tokenSymbol.includes('ETH') && e.symbol.includes('ETH')) {
          return null as unknown as Token
        }

        if (e.symbol === tokenSymbol) {
          return null as unknown as Token
        }

        return e
      })
      .filter(Boolean)
  }
}
