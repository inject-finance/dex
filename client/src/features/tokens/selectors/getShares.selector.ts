import { TokenPair } from '@/common/types/Token'
import { dexPoolContractService } from '@/contracts/services/dexPool/DexPoolContractService'
import { authState } from '@/features/auth/auth.state'
import { selectorFamily } from 'recoil'
import { getPoolAddressSelector } from '../../pool/selectors/getPoolAddress.selector'

export const getSharesSelector = selectorFamily<number, TokenPair>({
  key: 'getSharesSelector',
  get:
    ({ tokenA, tokenB }) =>
    async ({ get }) => {
      const { account } = get(authState)

      const address = get(getPoolAddressSelector({ tokenA, tokenB }))
      await dexPoolContractService.init(String(address))

      return dexPoolContractService.getShares(account)
    }
})

export const getTotalSupplySelector = selectorFamily({
  key: 'getTotalSupplySelector',
  get:
    ({ tokenA, tokenB }: TokenPair) =>
    async ({ get }) => {
      const address = get(getPoolAddressSelector({ tokenA, tokenB }))

      if (!address) {
        return 0
      }

      await dexPoolContractService.init(address)
      return Number(await dexPoolContractService.totalSupply())
    }
})

export const getSharesPercentSelector = selectorFamily({
  key: 'getSharesByTokensSelector',
  get:
    ({ tokenA, tokenB }: TokenPair) =>
    ({ get }) => {
      const shares = get(getSharesSelector({ tokenA, tokenB }))

      const totalSupply = get(getTotalSupplySelector({ tokenA, tokenB }))

      const precalculated = (shares / totalSupply) * 100

      return precalculated || 0
    }
})
