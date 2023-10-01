'use client'
import { Pool } from '@/common/types/Pool'
import { Spinner } from '@/components/Spinner'
import { TokenIcon } from '@/components/TokenList/TokenIcon'
import { getIsStakeablePoolSelector } from '@/features/staking/selectors/getIsStakeablePool.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import { faCoins, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { useRecoilValue } from 'recoil'

interface Props {
  readonly pool: Pool
}

export const PositionPoolDetails = dynamic(
  () =>
    Promise.resolve(({ pool }: Props) => {
      const isStakeable = useRecoilValue(
        getIsStakeablePoolSelector({ tokenA: pool.tokenA, tokenB: pool.tokenB })
      )
      const { shares, sharesInPercent, totalSupply } = useRecoilValue(
        getSharesSelector({ tokenA: pool.tokenA, tokenB: pool.tokenB })
      )

      return (
        <div
          className={`collapse collapse-arrow rounded-md bg-[var(--dark-green)] ${
            isStakeable ? 'opacity-40' : ''
          }`}
        >
          <input type="checkbox" />
          {isStakeable ? (
            <div className="tooltip tooltip-top" data-tip="Staking...">
              <FontAwesomeIcon
                className="text-[var(--light-yellow)]"
                icon={faLock}
              />
            </div>
          ) : (
            <div className="tooltip tooltip-top" data-tip="Stakeable">
              <FontAwesomeIcon
                className="text-[var(--light-yellow)]"
                icon={faCoins}
              />
            </div>
          )}
          <div className="flex flex-row items-center justify-start gap-3 collapse-title text-md">
            <div className="relative flex mr-5">
              <span className="z-0">
                <TokenIcon token={pool.tokenA} />
              </span>
              <span className="absolute z-10 left-8">
                <TokenIcon token={pool.tokenB} />
              </span>
            </div>
            <h4>
              {pool.tokenA.symbol} / {pool.tokenB.symbol}
            </h4>
          </div>

          <div className="flex flex-row w-full collapse-content md:flex-col">
            <div>
              <h3 className="mb-2 text-xs opacity-80">
                <strong>Pool Address:</strong> {pool.address}
              </h3>
              <span className="flex my-2 text-xs opacity-40">
                <strong>Note:</strong> The values in this table are
                approximates, to see the actual values, hover the desired CELL
                NAME
              </span>
            </div>

            <div className="flex flex-col w-1/2 text-sm md:flex-row md:w-full md:justify-between bg-[#181818]/60 rounded-tl-md rounded-bl-md md:rounded-bl-none md:rounded-tr-md">
              <div
                className="text-center p-1 border-b border-b-[var(--light-blue)] md:w-1/3 md:border-b-0 md:border-r md:border-r-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
                data-tip={`${shares} Pool Token`}
              >
                Pool Shares
              </div>
              <div
                className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Staking"
              >
                Staking
              </div>
              <div
                className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
                data-tip="Rewards"
              >
                Pending Rewards
              </div>
            </div>
            <div className="flex flex-col w-1/2 md:flex-row md:w-full md:justify-between bg-[#181818]/30 rounded-br-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md">
              <div className="text-center p-1 border-b border-b-[var(--light-yellow)] md:w-1/3 md:border-b-0 md:border-r-1 md:border-r-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
                <span className="opacity-80">
                  {sharesInPercent.toFixed(2)}%
                </span>
              </div>
              <div className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
                <span className="opacity-80">{shares.toFixed(2)}</span>
              </div>
              <div className="text-center p-1 md:w-1/3 md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
                <span className="opacity-80">{totalSupply.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      )
    }),
  { ssr: false, loading: () => <Spinner /> }
)
