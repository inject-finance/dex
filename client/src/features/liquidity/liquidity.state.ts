import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export type LiquidityState = {
  isTokenAApproved: boolean
  isTokenBApproved: boolean
}

const initialState: LiquidityState = {
  isTokenAApproved: false,
  isTokenBApproved: false
}

export const liquidityState = atom<LiquidityState>({
  key: 'liquidity',
  default: initialState
})

export const setLiquidityState = (state: Partial<LiquidityState>) => {
  setRecoil(liquidityState, (prev) => ({ ...prev, ...state }))
}
