import { type Token } from '@/common/types/Token'
import { WETHContractAddress } from '@/contracts/data/TokenAddresses'
import { atom } from 'recoil'
import { getRecoil, setRecoil } from 'recoil-nexus'

export const tokenAState = atom<Token>({
  key: 'tokenA',
  default: {
    id: '3',
    name: 'ETH',
    symbol: 'ETH',
    address: WETHContractAddress,
    amount: ''
  }
})

export const setTokenAState = (state: Partial<Token>) => {
  setRecoil(tokenAState, (prev) => ({ ...prev, ...state }))
}

export const getTokenAState = () => getRecoil(tokenAState)
