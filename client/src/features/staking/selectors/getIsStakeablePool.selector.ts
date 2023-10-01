import { Token } from '@/common/types/Token'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { selectorFamily } from 'recoil'

export const getIsStakeablePoolSelector = selectorFamily({
  key: 'getIsStakeablePoolSelector',
  get:
    (payload: { tokenA: Token; tokenB: Token }) =>
    ({ get }) => {
      const poolAddress = get(
        getPoolAddressSelector({
          tokenA: payload.tokenA,
          tokenB: payload.tokenB
        })
      )
      return stakePoolContractService.stakingPoolExists(String(poolAddress))
    }
})
