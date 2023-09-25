'use client'
import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { authState } from '@/features/auth/auth.state'
import { poolState } from '@/features/pool/pool.state'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { getPoolsSelector } from '@/features/pool/selectors/getPoolsFromApi'
import { stakeToken } from '@/features/staking/actions/stakeToken/stakeToken.action'
import { getIsStakedPoolSelector } from '@/features/staking/selectors/getIsStakedPool.selector'
import { getTotalRewardsSelector } from '@/features/staking/selectors/getTotalRewards.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import {
  toggleAddToStakingModalVisibility,
  uiState
} from '@/features/ui/ui.state'
import { faCoins } from '@fortawesome/free-solid-svg-icons'
import { usePathname } from 'next/navigation'
import { useRecoilCallback, useRecoilValue } from 'recoil'
import { PoolSelectorSection } from '../../positions/components/AddToStaking/PoolSelectorSection'
import { SharesSection } from '../../positions/components/AddToStaking/SharesSection'
import { TimeSpanSection } from '../../positions/components/AddToStaking/TimeSpanSection'

export const CreatePositionModal = () => {
  const { createPositionModalVisibility } = useRecoilValue(uiState)
  const { tokenA, tokenB, staking, poolAddress } = useRecoilValue(poolState)
  const pathname = usePathname()

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

      await stakeToken({
        sharesToStaking: (shares / sharesInPercent) * Number(staking.shares),
        stakeDuration: staking.duration,
        tokenA,
        tokenB,
        poolAddress
      })

      toggleAddToStakingModalVisibility()
    } finally {
      refresh(poolState)
      refresh(getPoolsSelector)
      refresh(
        getIsStakedPoolSelector({
          tokenA,
          tokenB
        })
      )
      refresh(
        getSharesSelector({
          tokenA,
          tokenB
        })
      )
      refresh(
        getTotalRewardsSelector({
          tokenA,
          tokenB
        })
      )
      refresh(
        getUserStakingPoolInfoSelector({
          tokenA,
          tokenB
        })
      )
    }
  })

  if (!createPositionModalVisibility) {
    return null
  }
  return (
    <Modal
      open={createPositionModalVisibility}
      title={`Create Position in ${tokenA.symbol} / ${tokenB.symbol}`}
      toggle={toggleAddToStakingModalVisibility}
    >
      <div className="flex flex-col gap-2 py-3">
        {pathname === '/positions' && <PoolSelectorSection />}

        <TimeSpanSection />

        <SharesSection />

        <ActionButton
          className="w-full"
          disabled={
            !(Boolean(staking.duration) && Boolean(Number(staking.shares) >= 0))
          }
          icon={faCoins}
          onClick={onClick}
          title="Add Staking"
        />
      </div>
    </Modal>
  )
}
