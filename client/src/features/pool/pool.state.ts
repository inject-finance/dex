import { type Token } from '@/common/types/Token'
import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export type PoolState = {
  tokenA: Token
  tokenB: Token
  staking: { shares: string; duration: number }
}

export const poolState = atom<PoolState>({
  key: 'poolState',
  default: {
    tokenA: {} as Token,
    tokenB: {} as Token,
    staking: { shares: '', duration: 60 }
  }
})

export const setPoolState = (state: Partial<PoolState>) => {
  setRecoil(poolState, (prev) => ({ ...prev, ...state }))
}
