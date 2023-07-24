'use client'
import { ActionButton } from '@/components/buttons/ActionButton'
import { authState } from '@/features/auth/auth.state'
import { poolState } from '@/features/pool/pool.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { stakeToken } from '@/features/staking/actions/stakeToken/stakeToken.action'
import { toggleCreatePositionModalVisibility } from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const Footer = () => {
  const { staking, tokenA, tokenB } = useRecoilValue(poolState)

  const onClick = useRecoilCallback(({ refresh, snapshot }) => async () => {
    try {
      if (Number(staking.shares) < 0) {
        throw new Error('The minimal shares is 0')
      }

      if (Number(staking.duration) < 30) {
        throw new Error('The minimal duration is 30 days')
      }

      const { shares, sharesInPercent } = await snapshot.getPromise(
        getPoolDetailsSelector({
          tokenA,
          tokenB
        })
      )

      const poolAddress = await snapshot.getPromise(
        getPoolAddressSelector({
          tokenA,
          tokenB
        })
      )
      const { account } = await snapshot.getPromise(authState)

      await stakeToken({
        sharesToStaking: (shares / sharesInPercent) * Number(staking.shares),
        stakeDuration: staking.duration,
        tokenA,
        tokenB,
        poolAddress,
        account
      })

      toggleCreatePositionModalVisibility()
    } finally {
      refresh(
        getPoolDetailsSelector({
          tokenA,
          tokenB
        })
      )
    }
  })

  return (
    <ActionButton
      className="w-full"
      disabled={
        !(Boolean(staking.duration) && Boolean(Number(staking.shares) >= 0))
      }
      icon={faCoins}
      onClick={onClick}
      title="Add Staking"
    />
  )
}
