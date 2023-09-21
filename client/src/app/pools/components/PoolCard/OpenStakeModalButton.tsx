'use client'
import { Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { setPoolState } from '@/features/pool/pool.state'
import { getIsStakedPoolSelector } from '@/features/staking/selectors/getIsStakedPool.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import { toggleCreatePositionModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValue } from 'recoil'

type Props = {
  readonly tokenA: Token
  readonly tokenB: Token
}
export const OpenStakeModalButton = ({ tokenA, tokenB }: Props) => {
  const { stakedAmount } = useRecoilValue(
    getUserStakingPoolInfoSelector({ tokenA, tokenB })
  )
  const isStakeable = useRecoilValue(
    getIsStakedPoolSelector({ tokenA, tokenB })
  )
  const shares = useRecoilValue(getSharesSelector({ tokenA, tokenB }))

  const onClick = () => {
    setPoolState({ tokenA, tokenB })
    toggleCreatePositionModalVisibility()
  }

  if (isStakeable && Number(shares) && !Number(stakedAmount)) {
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
