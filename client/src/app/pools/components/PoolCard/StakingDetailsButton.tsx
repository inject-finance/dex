'use client'
import { Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { poolState, setPoolState } from '@/features/pool/pool.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { getIsStakedPoolSelector } from '@/features/staking/selectors/getIsStakedPool.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { toggleRedeemRewardsModalVisibilityVisibility } from '@/features/ui/ui.state'
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const StakingDetailsButton: React.FC<{
  tokenA: Token
  tokenB: Token
}> = ({ tokenA, tokenB }) => {
  const { stakedAmount } = useRecoilValue(
    getUserStakingPoolInfoSelector({ tokenA, tokenB })
  )

  const onClick = useRecoilCallback(({ refresh }) => () => {
    setPoolState({ tokenA, tokenB })
    refresh(poolState)
    refresh(
      getUserStakingPoolInfoSelector({
        tokenA,
        tokenB
      })
    )
    toggleRedeemRewardsModalVisibilityVisibility()
  })

  if (Number(stakedAmount)) {
    return (
      <ActionButton
        className="w-1/2 md:w-fit"
        icon={faArrowUpRightDots}
        onClick={onClick}
        title="Staking Details"
      />
    )
  }

  return null
}
