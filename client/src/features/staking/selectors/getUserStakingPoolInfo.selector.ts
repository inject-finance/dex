import { Token } from '@/common/types/Token'
import { stakePoolContractService } from '@/contracts/services/stake/StakePoolContractService'
import { authState } from '@/features/auth/auth.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { selectorFamily } from 'recoil'
import { getIsStakedPoolSelector } from './getIsStakedPool.selector'

export const getUserStakingPoolInfoSelector = selectorFamily({
  key: 'getUserStakingPoolInfoSelector',
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

      const isStakeable = get(
        getIsStakedPoolSelector({
          tokenA: payload.tokenA,
          tokenB: payload.tokenB
        })
      )

      if (!isStakeable || !account.address) {
        return {
          end: 0,
          stakeAmount: 0,
          start: 0,
          totalClaimed: 0,
          totalSupply: 0
        }
      }

      return stakePoolContractService.getUserStakeInfo(
        String(poolAddress),
        String(account.address)
      )
    }
})
