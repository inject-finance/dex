import { Pool } from '@/common/types/Pool'
import { Token } from '@/common/types/Token'
import { atom, selector } from 'recoil'
import { poolState } from '../../pool/pool.state'
import { getHasReservesSelector } from '../../pool/selectors/getReserves.selector'
import { selectedTokenState } from '../selectedToken.state'

export const getTokensByNameFilter = atom({
  key: 'getTokensByNameFilter',
  default: ''
})

export const getTokensInPoolSelector = selector({
  key: 'getTokensInPoolSelector',
  get: async ({ get }) => {
    const name = get(getTokensByNameFilter)
    const selectedToken = get(selectedTokenState)
    const { tokenA, tokenB } = get(poolState)

    const tokenToMatch =
      selectedToken.symbol === tokenA.symbol ? tokenB : tokenA

    const data: Token[] = await fetch(
      `/api/tokens/tokens-in-pool/${tokenToMatch.symbol}`
    ).then((res) => res.json())

    return {
      tokens: data
        .filter((e) =>
          get(
            getHasReservesSelector({
              tokenA: e,
              tokenB: tokenToMatch
            })
          )
        )
        .filter((token) => new RegExp(name, 'iu').test(token.name)),
      tokenThatNeedMatch: tokenToMatch
    }
  }
})

export const getTokensWithoutPoolSelector = selector({
  key: 'getUnavailableTokensSelector',
  get: async ({ get }) => {
    const name = get(getTokensByNameFilter)
    const selectedToken = get(selectedTokenState)
    const { tokenA, tokenB } = get(poolState)
    const tokenToMatch =
      selectedToken.symbol === tokenA.symbol ? tokenB : tokenA

    const pools: Pool[] = await fetch(`/api/pools`).then((res) => res.json())
    const [tokens]: [Token[]] = await fetch(`/api/tokens`).then((res) =>
      res.json()
    )

    const tokensDone = pools
      .map((e) => {
        if (e.tokenA.symbol === tokenToMatch.symbol) {
          return e.tokenB
        }
        if (e.tokenB.symbol === tokenToMatch.symbol) {
          return e.tokenA
        }
        return undefined as unknown as Token
      })
      .filter(Boolean)

    const tokensToReturn = [...tokens, ...tokensDone]
      .filter((e) =>
        get(
          getHasReservesSelector({
            tokenA: e,
            tokenB: tokenToMatch
          })
        )
          ? undefined
          : e
      )
      .filter((e) => (e.symbol === tokenToMatch.symbol ? undefined : e))
      .filter((token) => new RegExp(name, 'iu').test(token?.name))
      .filter(Boolean)

    return {
      tokens: Array.from(
        new Set(tokensToReturn.map((obj) => JSON.stringify(obj)))
      ).map((str) => JSON.parse(str)),
      tokenThatNeedMatch: tokenToMatch
    }
  }
})
