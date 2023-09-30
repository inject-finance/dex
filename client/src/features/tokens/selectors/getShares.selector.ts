import { TokenPair } from '@/common/types/Token'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { selectorFamily } from 'recoil'

export const getSharesSelector = selectorFamily<
  { shares: number; totalSupply: number; sharesInPercent: number },
  TokenPair
>({
  key: 'getSharesSelector',
  get:
    ({ tokenA, tokenB }) =>
    async () => {
      const shares = await dexPoolContractService.getShares({ tokenA, tokenB })
      const totalSupply = await dexPoolContractService.totalSupply({
        tokenA,
        tokenB
      })
      return {
        shares,
        totalSupply,
        sharesInPercent: (shares / totalSupply) * 100 || 0
      }
    }
})
