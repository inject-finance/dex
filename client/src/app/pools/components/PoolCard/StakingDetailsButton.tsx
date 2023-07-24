'use client'
import { Token } from '@/common/types/Token'
import { Spinner } from '@/components/Spinner'
import { ActionButton } from '@/components/buttons/ActionButton'
import { setPoolState } from '@/features/pool/pool.state'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { toggleRedeemRewardsModalVisibilityVisibility } from '@/features/ui/ui.state'
import { faArrowUpRightDots } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValueLoadable } from 'recoil'

export const StakingDetailsButton: React.FC<{
  tokenA: Token
  tokenB: Token
}> = ({ tokenA, tokenB }) => {
  const { state, contents } = useRecoilValueLoadable(
    getPoolDetailsSelector({ tokenA, tokenB })
  )

  const onClick = () => {
    setPoolState({ tokenA, tokenB })
    toggleRedeemRewardsModalVisibilityVisibility()
  }

  if (state === 'loading' || state !== 'hasValue') {
    return <Spinner />
  }

  if (Number(contents.pendingRewards)) {
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
