import { type Token } from '@/common/types/Token'
import { atom } from 'recoil'
import { setRecoil, getRecoilPromise } from 'recoil-nexus'
import { getTokenBySymbol } from '../tokens/selectors/getTokenBySymbol.selector'
import constants from '@/common/configuration/constants'

export type PoolState = {
  tokenA: Token
  tokenB: Token
  staking: { shares: string; duration: number }
  slippage: number
  poolAddress: string
}

export const poolState = atom<PoolState>({
  key: 'poolState',
  default: {
    tokenA: {} as Token,
    tokenB: {} as Token,
    staking: { shares: '', duration: 60 },
    slippage: 0,
    poolAddress: ''
  }
})
export const setPoolState = (state: Partial<PoolState>) => {
  setRecoil(poolState, (prev) => ({ ...prev, ...state }))
}

export const getInitialTokens = async () => {
  const tokenA = await getRecoilPromise(
    getTokenBySymbol(constants.initialTokens.tokenA.symbol)
  )

  const tokenB = await getRecoilPromise(
    getTokenBySymbol(constants.initialTokens.tokenB.symbol)
  )

  setPoolState({
    tokenA,
    tokenB
  })
}
