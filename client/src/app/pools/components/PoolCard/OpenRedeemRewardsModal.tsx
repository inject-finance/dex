'use client'
import { Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { toggleRedeemRewardsModalVisibilityVisibility } from '@/features/ui/ui.state'
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValue } from 'recoil'

interface Props {
  readonly tokenA: Token
  readonly tokenB: Token
}

export const OpenRedeemRewardsModal = ({ tokenA, tokenB }: Props) => {
  const { stakedAmount } = useRecoilValue(
    getUserStakingPoolInfoSelector({ tokenA, tokenB })
  )

  if (Number(stakedAmount)) {
    return (
      <ActionButton
        className="w-1/2 md:w-fit"
        icon={faArrowUpRightDots}
        onClick={toggleRedeemRewardsModalVisibilityVisibility}
        title="Staking Details"
      />
    )
  }

  return null
}
