'use client'
import { Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { getIsStakeablePoolSelector } from '@/features/staking/selectors/getIsStakeablePool.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { toggleAddToStakingModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValue } from 'recoil'

interface Props {
  readonly tokenA: Token
  readonly tokenB: Token
}
export const OpenCreatePositionModal = ({ tokenA, tokenB }: Props) => {
  const { stakedAmount } = useRecoilValue(
    getUserStakingPoolInfoSelector({ tokenA, tokenB })
  )
  const isStakeable = useRecoilValue(
    getIsStakeablePoolSelector({ tokenA, tokenB })
  )

  if (isStakeable && !Number(stakedAmount)) {
    return (
      <ActionButton
        className="w-fit"
        icon={faCoins}
        onClick={toggleAddToStakingModalVisibility}
        title="Add Staking"
      />
    )
  }

  return null
}
