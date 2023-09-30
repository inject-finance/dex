import { TokenPair } from '@/common/types/Token'
import { getRatioSelector } from '@/features/liquidity/selectors/getRatio.selector'
import { getIsStakedPoolSelector } from '@/features/staking/selectors/getIsStakedPool.selector'
import { getStakingPoolInfoSelector } from '@/features/staking/selectors/getStakingPoolInfo.selector'
import { getTotalRewardsSelector } from '@/features/staking/selectors/getTotalRewards.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { getOutAmountSelector } from '@/features/swap/selectors/getOutAmount.selector'
import { selectorFamily } from 'recoil'
import { getSharesSelector } from '../../tokens/selectors/getShares.selector'
import { getPoolAddressSelector } from './getPoolAddress.selector'
import { getReservesSelector } from './getReserves.selector'
import { getTotalValueLote } from './getTotalValueLote'

export const getPoolDetailsSelector = selectorFamily({
  key: 'getPoolDetailsSelector',
  get:
    ({ tokenA, tokenB }: TokenPair) =>
    ({ get }) => {
      const poolAddress = get(getPoolAddressSelector({ tokenA, tokenB }))
      const reserves = get(getReservesSelector({ tokenA, tokenB }))
      const ratio = get(getRatioSelector)
      const outAmount = get(getOutAmountSelector)
      const { shares, sharesInPercent, totalSupply } = get(
        getSharesSelector({ tokenA, tokenB })
      )
      const isStakeable = get(getIsStakedPoolSelector({ tokenA, tokenB }))

      const userStakingInfo = get(
        getUserStakingPoolInfoSelector({ tokenA, tokenB })
      )
      const stakingInfo = get(getStakingPoolInfoSelector({ tokenA, tokenB }))
      const pendingRewards = String(
        get(getTotalRewardsSelector({ tokenA, tokenB }))
      )
      const tvl = get(getTotalValueLote({ tokenA, tokenB }))

      return {
        reserves,
        poolAddress,
        sharesInPercent,
        shares,
        totalSupply,
        isStakeable,
        userStakingInfo,
        stakingInfo,
        pendingRewards,
        tvl,
        ratio,
        outAmount
      }
    }
})
