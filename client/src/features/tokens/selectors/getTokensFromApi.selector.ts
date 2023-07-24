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

    const data: Token[] = await fetch(
      `/api/tokens/tokens-without-pool/${tokenToMatch.symbol}`
    ).then((res) => res.json())

    const { tokens: tokensInPool } = get(getTokensInPoolSelector)

    const tokensFiltered = await Promise.all(
      tokensInPool.map((e) => {
        const reserves = get(
          getHasReservesSelector({
            tokenA: e,
            tokenB: tokenToMatch
          })
        )

        return !reserves ? e : (undefined as unknown as Token)
      })
    )

    const tokens = [...data, ...tokensFiltered]
      .filter(Boolean)
      .filter((token) => new RegExp(name, 'iu').test(token.name))

    return { tokens, tokenThatNeedMatch: tokenToMatch }
  }
})
