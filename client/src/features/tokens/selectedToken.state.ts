import { type Token } from '@/common/types/Token'
import { atom } from 'recoil'
import { setRecoil } from 'recoil-nexus'

export const selectedTokenState = atom<Token>({
  key: 'selectedToken',
  default: {} as Token
})

export const setSelectedTokenState = (state: Partial<Token>) => {
  setRecoil(selectedTokenState, (prev) => ({ ...prev, ...state }))
}
