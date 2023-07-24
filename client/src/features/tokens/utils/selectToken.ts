import { type Token } from '@/common/types/Token'
import { getRecoil } from 'recoil-nexus'
import { poolState, setPoolState } from '../../pool/pool.state'
import { selectedTokenState } from '../selectedToken.state'
import { switchCoins } from './switchCoins'

export const selectToken = (token: Token) => {
  const { tokenA, tokenB } = getRecoil(poolState)
  const selectedToken = getRecoil(selectedTokenState)

  if (
    selectedToken.symbol === tokenB.symbol &&
    token.symbol === tokenA.symbol
  ) {
    switchCoins()
  }

  if (
    selectedToken.symbol === tokenA.symbol &&
    token.symbol === tokenB.symbol
  ) {
    switchCoins()
  }

  if (selectedToken.symbol === tokenA.symbol) {
    setPoolState({
      tokenA: token
    })
  }

  if (selectedToken.symbol === tokenB.symbol) {
    setPoolState({
      tokenB: token
    })
  }
}
