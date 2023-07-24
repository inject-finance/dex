import { routerContractService } from '@/contracts/services/router/RouterContractService'
import { poolState } from '@/features/pool/pool.state'
import { selector } from 'recoil'

export const getRatioSelector = selector<number>({
  key: 'getRatioSelector',
  get: ({ get }) => {
    const { tokenA, tokenB } = get(poolState)
    return routerContractService.getTokenPairRatio(tokenA, tokenB)
  }
})
