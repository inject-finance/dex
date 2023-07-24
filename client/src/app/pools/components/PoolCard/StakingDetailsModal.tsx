import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { authState } from '@/features/auth/auth.state'
import { poolState } from '@/features/pool/pool.state'
import { getPoolAddressSelector } from '@/features/pool/selectors/getPoolAddress.selector'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { redeemRewards } from '@/features/staking/actions/redeemRewards/redeemRewards.action'
import { loadingState } from '@/features/ui/loading.state'
import {
  toggleRedeemRewardsModalVisibilityVisibility,
  uiState
} from '@/features/ui/ui.state'
import { faCoins, faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dayjs from 'dayjs'
import dynamic from 'next/dynamic'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const StakingDetailsModal = dynamic(
  () =>
    Promise.resolve(() => {
      const { redeemRewardsModalVisibility } = useRecoilValue(uiState)
      const { tokenA, tokenB } = useRecoilValue(poolState)
      const isLoading = useRecoilValue(loadingState)
      const contents = useRecoilValue(
        getPoolDetailsSelector({
          tokenA,
          tokenB
        })
      )

      const onRedeem = useRecoilCallback(
        ({ refresh, snapshot }) =>
          async () => {
            try {
              const { account } = await snapshot.getPromise(authState)
              const poolAddress = await snapshot.getPromise(
                getPoolAddressSelector({
                  tokenA,
                  tokenB
                })
              )
              await redeemRewards({
                tokenA,
                tokenB,
                account,
                poolAddress
              })

              toggleRedeemRewardsModalVisibilityVisibility()
            } finally {
              refresh(
                getPoolDetailsSelector({
                  tokenA,
                  tokenB
                })
              )
            }
          }
      )

      return (
        <Modal
          isLoading={isLoading}
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
            Claming <span className="text-[var(--light-yellow)]">Rewards </span>
            before the chosen{' '}
            <span className="text-[var(--light-blue)]">Time Span</span> is
            completed will result in additional fees will be applied (20% of
            current pending rewards)
          </span>
          <div className="flex flex-col justify-between w-full gap-2 mx-auto my-5">
            {[
              {
                leftText: `Tokens Supply`,
                rightText: `${Number(
                  contents.userStakingInfo.totalSupply
                ).toFixed(8)}`
              },
              {
                leftText: `Staked Amount`,
                rightText: `${Number(
                  contents.userStakingInfo.stakeAmount
                ).toFixed(8)}`
              },
              {
                leftText: `Total Rewards`,
                rightText: `${Number(contents.pendingRewards).toFixed(8)} INJ3`
              },
              {
                leftText: `Time Span start`,
                rightText: `${dayjs(contents.position?.start).format(
                  'YYYY-MM-DD h:mm A'
                )}`
              },
              {
                leftText: `Time Span end`,
                rightText: `${dayjs(contents.position?.end).format(
                  'YYYY-MM-DD h:mm A'
                )}`
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
                !contents.pendingRewards
                  ? 'disabled opacity-40 tooltip tooltip-top'
                  : ''
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
