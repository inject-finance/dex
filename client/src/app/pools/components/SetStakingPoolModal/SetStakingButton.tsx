'use client'
import { type Token } from '@/common/types/Token'
import { ActionButton } from '@/components/buttons/ActionButton'
import { authState } from '@/features/auth/auth.state'
import { setPoolState } from '@/features/pool/pool.state'
import { toggleSetStakingPoolModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useRecoilCallback, useRecoilValue } from 'recoil'

type Props = {
  readonly tokenA: Token
  readonly tokenB: Token
  readonly isStakeable?: boolean
}

export const SetStakingButton = ({ tokenA, tokenB, isStakeable }: Props) => {
  const { account } = useRecoilValue(authState)
  const openSetStakingModal = useRecoilCallback(() => () => {
    setPoolState({ tokenA, tokenB })
    toggleSetStakingPoolModalVisibility()
  })

  if (
    !isStakeable &&
    account.address ===
      process.env.NEXT_PUBLIC_ADDRESS_STAKING_OWNER?.toLocaleLowerCase()
  ) {
    return (
      <ActionButton
        className="w-1/2 md:w-fit"
        icon={faCoins}
        onClick={openSetStakingModal}
        title="Set Staking"
      />
    )
  }

  return null
}
