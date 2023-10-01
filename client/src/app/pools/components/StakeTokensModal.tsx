'use client'
import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { poolState } from '@/features/pool/pool.state'
import { getStoredPoolsSelector } from '@/features/pool/selectors/getStoredPools.selector'
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

export const StakeTokensModal = () => {
  const { createPositionModalVisibility } = useRecoilValue(uiState)
  const { tokenA, tokenB, position } = useRecoilValue(poolState)
  const pathname = usePathname()

  const onClick = useRecoilCallback(({ refresh }) => async () => {
    await stakeToken({
      position,
      tokenA,
      tokenB
    })

    toggleAddToStakingModalVisibility()

    const selectors = [
      poolState,
      getStoredPoolsSelector,
      getIsStakedPoolSelector({ tokenA, tokenB }),
      getSharesSelector({ tokenA, tokenB }),
      getTotalRewardsSelector({ tokenA, tokenB }),
      getUserStakingPoolInfoSelector({ tokenA, tokenB })
    ]

    selectors.forEach((selector) => refresh(selector))
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
            !(
              Boolean(position.duration) &&
              Boolean(Number(position.amount) >= 0)
            )
          }
          icon={faCoins}
          onClick={onClick}
          title="Add Staking"
        />
      </div>
    </Modal>
  )
}
