import { Token } from '@/common/types/Token'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { authState } from '@/features/auth/auth.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { selectorFamily } from 'recoil'
import { getIsStakeablePoolSelector } from './getIsStakeablePool.selector'

export const getTotalRewardsSelector = selectorFamily({
  key: 'getTotalRewardsSelector',
  get:
    (payload: { tokenA: Token; tokenB: Token }) =>
    ({ get }) => {
      const { account } = get(authState)
      const poolAddress = get(
        getPoolAddressSelector({
          tokenA: payload.tokenA,
          tokenB: payload.tokenB
        })
      )

      const isStakeable = Boolean(
        get(
          getIsStakeablePoolSelector({
            tokenA: payload.tokenA,
            tokenB: payload.tokenB
          })
        )
      )

      if (!isStakeable || !account.address) {
        return 0
      }

      return stakePoolContractService.getTotalRewards(
        String(poolAddress),
        String(account.address)
      )
    }
})
