import { type Token } from '@/common/types/Token'
import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'
import { TOKENS } from '../tokens/tokens.state'

export type PoolState = {
  tokenA: Token
  tokenB: Token
  staking: { shares: string; duration: number }
}

export const initialPoolState: PoolState = {
  tokenA: TOKENS[2],
  tokenB: TOKENS[1],
  staking: { shares: '', duration: 60 }
}
export const poolState = atom<PoolState>({
  key: 'poolState',
  default: initialPoolState
})

export const setPoolState = (state: Partial<PoolState>) => {
  setRecoil(poolState, (prev) => ({ ...prev, ...state }))
}
