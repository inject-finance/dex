import { type Token } from '@/common/types/Token'
import { DAIContractAddress } from '@/contracts/data/TokenAddresses'
import { atom } from 'recoil'
import { getRecoil, setRecoil } from 'recoil-nexus'

export const tokenBState = atom<Token>({
  key: 'tokenB',
  default: {
    id: '2',
    name: 'DAI',
    symbol: 'DAI',
    address: DAIContractAddress,
    amount: ''
  }
})

export const setTokenBState = (state: Partial<Token>) => {
  setRecoil(tokenBState, (prev) => ({ ...prev, ...state }))
}

export const getTokenBState = () => getRecoil(tokenBState)
