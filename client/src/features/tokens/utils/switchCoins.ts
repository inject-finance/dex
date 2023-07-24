import { getRecoil } from 'recoil-nexus'
import {
  selectedTokenState,
  setSelectedTokenState
} from '../selectedToken.state'
import { poolState, setPoolState } from '../../pool/pool.state'

export const switchCoins = () => {
  const prevPoolState = getRecoil(poolState)
  const selectedToken = getRecoil(selectedTokenState)

  setPoolState({
    tokenA: prevPoolState.tokenB,
    tokenB: prevPoolState.tokenA
  })

  setSelectedTokenState(
    selectedToken.symbol === prevPoolState.tokenA.symbol
      ? prevPoolState.tokenB
      : prevPoolState.tokenA
  )
}
