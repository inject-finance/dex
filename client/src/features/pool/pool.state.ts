import { type Token } from '@/common/types/Token'
import { atom } from 'recoil'
import { setRecoil, getRecoilPromise } from 'recoil-nexus'
import { getTokenBySymbol } from '../tokens/selectors/getTokenBySymbol.selector'
import constants from '@/common/configuration/constants'
import { Position } from '@/common/types/Position'

export type PoolState = {
  tokenA: Token
  tokenB: Token
  position: Pick<Position, 'amount' | 'duration'>
  slippage: number
}

export const poolState = atom<PoolState>({
  key: 'poolState',
  default: {
    tokenA: {} as Token,
    tokenB: {} as Token,
    position: { amount: 0, duration: 60 },
    slippage: 0
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
