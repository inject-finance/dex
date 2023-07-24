'use client'
import { Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { setPoolState } from '@/features/pool/pool.state'
import { toggleCreatePositionModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'

export const OpenStakeModalButton: React.FC<{
  tokenA: Token
  tokenB: Token
  isStakeable?: boolean
  shares: number
  pendingRewards: string
}> = ({ isStakeable, shares, tokenA, tokenB, pendingRewards }) => {
  const onClick = () => {
    setPoolState({ tokenA, tokenB })
    toggleCreatePositionModalVisibility()
  }

  if (isStakeable && Number(shares) && !Number(pendingRewards)) {
    return (
      <ActionButton
        className="w-fit"
        icon={faCoins}
        onClick={onClick}
        title="Add Staking"
      />
    )
  }

  return null
}
