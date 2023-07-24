import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export type SwapState = {
  slippage: number | string
}

const initialState: SwapState = {
  slippage: ''
}

export const swapState = atom<SwapState>({
  key: 'swap',
  default: initialState
})

export const setSwapState = (state: Partial<SwapState>) => {
  setRecoil(swapState, (prev) => ({ ...prev, ...state }))
}
