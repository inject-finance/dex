'use client'
import { type Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { authState } from '@/features/auth/auth.state'
import { getIsStakedPoolSelector } from '@/features/staking/selectors/getIsStakedPool.selector'
import { toggleSetStakingPoolModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useRecoilValue } from 'recoil'

interface Props {
  readonly tokenA: Token
  readonly tokenB: Token
}

export const OpenSetStakeableButton = ({ tokenA, tokenB }: Props) => {
  const { account } = useRecoilValue(authState)
  const isStakeable = useRecoilValue(
    getIsStakedPoolSelector({ tokenA, tokenB })
  )

  if (
    !isStakeable &&
    account.address ===
      process.env.NEXT_PUBLIC_ADDRESS_STAKING_OWNER?.toLocaleLowerCase()
  ) {
    return (
      <ActionButton
        className="w-1/2 md:w-fit"
        icon={faCoins}
        onClick={toggleSetStakingPoolModalVisibility}
        title="Set Staking"
      />
    )
  }

  return null
}
