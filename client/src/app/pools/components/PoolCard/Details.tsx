'use client'
import { type Token } from '@/common/types/Token'
import { Spinner } from '@/components/Spinner'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { faExclamationCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { useRecoilValueLoadable } from 'recoil'

type Props = { tokenA: Token; tokenB: Token }

export const Details: React.FC<Props> = ({ tokenA, tokenB }) => {
  const { state, contents } = useRecoilValueLoadable(
    getPoolDetailsSelector({ tokenA, tokenB })
  )

  if (state === 'loading' || state !== 'hasValue') {
    return <Spinner />
  }

  return (
    <div>
      <div>
        <h3 className="mb-2 text-xs opacity-60">
          <strong>Pool Address:</strong> {contents.poolAddress}
        </h3>
        <div className="mt-2 mb-5 text-xs opacity-60">
          <strong>
            <FontAwesomeIcon
              className="text-[var(--light-yellow)] mr-1"
              icon={faExclamationCircle}
            />
            Note:
          </strong>
          <span>
            The values in this table are aproximates. To see the actual values,
            hover the desired
          </span>
          <span className="text-[var(--light-yellow)]"> Column Header</span>
        </div>
      </div>
      <div className="flex flew-row md:flex-col">
        <div className="flex flex-col w-1/2 text-sm md:flex-row md:w-full md:justify-between bg-[#181818]/60 rounded-tl-md rounded-bl-md md:rounded-bl-none md:rounded-tr-md">
          <div
            className="text-center p-1 border-b border-b-[var(--light-blue)] md:w-1/4 md:border-b-0 h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
            data-tip={`USD ${contents.tvl}`}
          >
            Total Value Lot
          </div>
          <div
            className="text-center p-1 border-b border-b-[var(--light-blue)] md:w-1/4 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
            data-tip={`${contents.shares} Pool Token`}
          >
            Pool Shares
          </div>
          <div
            className="text-center p-1 md:w-1/4 border-b border-b-[var(--light-blue)] md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
            data-tip={contents.shares}
          >
            Pool Tokens
          </div>
          <div
            className="text-center p-1 md:w-1/4 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
            data-tip={`${Number(contents.pendingRewards).toFixed(8)} INJ3`}
          >
            Pending Rewards
          </div>
        </div>
        <div className="flex flex-col w-1/2 md:flex-row md:w-full md:justify-between bg-[#181818]/30 rounded-br-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md">
          <div className="text-center p-1 md:w-1/4 border-b border-b-[var(--light-yellow)] md:border-b-0 h-[32px] max-h-[32px] truncate">
            <span className="opacity-80">{formatQuantity(contents.tvl)}</span>
          </div>
          <div className="text-center p-1 md:w-1/4 border-b border-b-[var(--light-yellow)] md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
            <span className="opacity-80">
              {contents.sharesInPercent.toFixed(2)}%
            </span>
          </div>
          <div className="text-center p-1 md:w-1/4 border-b border-b-[var(--light-yellow)] md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
            <span className="opacity-80">{contents.shares.toFixed(2)}</span>
          </div>
          <div className="text-center p-1 md:w-1/4 md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
            <span className="opacity-80">
              {Number(contents.pendingRewards).toFixed(8)}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}
