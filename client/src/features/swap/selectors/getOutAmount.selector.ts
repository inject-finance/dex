import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { poolState } from '@/features/pool/pool.state'
import { getPriceSelector } from '@/features/tokens/selectors/getPrice.selector'
import { selector } from 'recoil'
import { swapState } from '../swap.state'

export const getOutAmountSelector = selector({
  key: 'getOutAmountSelector',
  get: async ({ get }) => {
    const { tokenA, tokenB } = get(poolState)
    const { slippage } = get(swapState)
    if (!tokenA.amount) {
      return {
        minimumReceiveInUsd: 0,
        total: 0,
        minimumRequired: 0,
        rate: 0,
        price: 0,
        outAmount: 0
      }
    }
    const outAmount = await routerContractService.getTokensOutAmount(
      tokenA,
      tokenB
    )

    const rate = await routerContractService.getTokensOutAmount(
      { ...tokenA, amount: '1' },
      tokenB
    )

    const price = get(getPriceSelector(tokenB))

    return {
      rate,
      minimumReceiveInUsd: price * outAmount,
      minimumRequired: 10 / Number(price) || 0,
      price,
      total: outAmount - outAmount * (Number(slippage) / 100),
      outAmount
    }
  }
})
