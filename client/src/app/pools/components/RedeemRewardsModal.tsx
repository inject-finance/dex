import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { poolState } from '@/features/pool/pool.state'
import { getStoredPoolsSelector } from '@/features/pool/selectors/getStoredPools.selector'
import { redeemRewards } from '@/features/staking/actions/redeemRewards/redeemRewards.action'
import { getIsStakeablePoolSelector } from '@/features/staking/selectors/getIsStakeablePool.selector'
import { getPositionFromApiByPoolAddressSelector } from '@/features/staking/selectors/getPositionDuration.selector'
import { getTotalRewardsSelector } from '@/features/staking/selectors/getTotalRewards.selector'
import { getUserStakingPoolInfoSelector } from '@/features/staking/selectors/getUserStakingPoolInfo.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import {
  toggleRedeemRewardsModalVisibilityVisibility,
  uiState
} from '@/features/ui/ui.state'
import { faCoins, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const RedeemRewardsModal = dynamic(
  () =>
    Promise.resolve(() => {
      const { redeemRewardsModalVisibility } = useRecoilValue(uiState)
      const { tokenA, tokenB } = useRecoilValue(poolState)
      const userStakingInfo = useRecoilValue(
        getUserStakingPoolInfoSelector({ tokenA, tokenB })
      )
      const pendingRewards = useRecoilValue(
        getTotalRewardsSelector({ tokenA, tokenB })
      )
      const position = useRecoilValue(
        getPositionFromApiByPoolAddressSelector({ tokenA, tokenB })
      )

      const onRedeem = useRecoilCallback(({ refresh }) => async () => {
        try {
          await redeemRewards({ tokenA, tokenB })
          toggleRedeemRewardsModalVisibilityVisibility()
        } finally {
          const selectors = [
            getIsStakeablePoolSelector({ tokenA, tokenB }),
            getSharesSelector({ tokenA, tokenB }),
            getTotalRewardsSelector({ tokenA, tokenB }),
            getUserStakingPoolInfoSelector({ tokenA, tokenB }),
            getStoredPoolsSelector,
            poolState
          ]

          selectors.forEach((selector) => refresh(selector))
        }
      })

      if (!redeemRewardsModalVisibility) {
        return null
      }

      return (
        <Modal
          open={redeemRewardsModalVisibility}
          title="Redeem Rewards"
          toggle={toggleRedeemRewardsModalVisibilityVisibility}
        >
          <span className="my-5 text-xs opacity-80">
            <strong>
              <FontAwesomeIcon
                className="text-[var(--light-yellow)]"
                icon={faExclamationCircle}
              />{' '}
              Note:
            </strong>{' '}
            Claiming{' '}
            <span className="text-[var(--light-yellow)]">Rewards </span>
            before the chosen{' '}
            <span className="text-[var(--light-blue)]">Time Span</span> is
            completed will result in additional fees will be applied (20% of
            current pending rewards)
          </span>
          <div className="flex flex-col justify-between w-full gap-2 mx-auto my-5">
            {[
              {
                leftText: `Tokens Supply`,
                rightText: `${Number(userStakingInfo.totalSupply).toFixed(8)}`
              },
              {
                leftText: `Staked Amount`,
                rightText: `${Number(userStakingInfo.stakedAmount).toFixed(8)}`
              },
              {
                leftText: `Total Rewards`,
                rightText: `${Number(pendingRewards).toFixed(8)} INJ3`
              },
              {
                leftText: `Time Span start`,
                rightText: `${dayjs(position?.start).format(
                  'YYYY-MM-DD h:mm A'
                )}`
              },
              {
                leftText: `Time Span end`,
                rightText: `${dayjs(position?.end).format('YYYY-MM-DD h:mm A')}`
              }
            ].map((e, index) => (
              <div
                className="grid items-center w-full min-w-full grid-cols-3"
                key={index}
              >
                <p className="text-xs opacity-60 max-w-[80px]">{e.leftText}</p>
                <div className="h-[1px] opacity-40 bg-[#757575] w-full" />
                <p className="text-sm text-right opacity-60">{e.rightText}</p>
              </div>
            ))}
          </div>
          <div className="flex flex-col gap-10 pt-10">
            <ActionButton
              className={`${
                !pendingRewards ? 'disabled opacity-40 tooltip tooltip-top' : ''
              } w-full`}
              icon={faCoins}
              onClick={onRedeem}
              title="Redeem"
            />
          </div>
        </Modal>
      )
    }),
  { ssr: false }
)
