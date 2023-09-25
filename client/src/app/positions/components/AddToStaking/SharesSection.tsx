'use client'
import { MaxButton } from '@/components/MaxButton'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { poolState, setPoolState } from '@/features/pool/pool.state'
import {
  getSharesPercentSelector,
  getSharesSelector
} from '@/features/tokens/selectors/getShares.selector'
import {
  faExclamationCircle,
  faPercent
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ChangeEvent } from 'react'
import { useRecoilValue } from 'recoil'

export const SharesSection = () => {
  const { staking, tokenA, tokenB } = useRecoilValue(poolState)
  const shares = useRecoilValue(getSharesSelector({ tokenA, tokenB }))
  const sharesInPercent = useRecoilValue(
    getSharesPercentSelector({ tokenA, tokenB })
  )

  const handleInputChange = ({
    currentTarget
  }: ChangeEvent<HTMLInputElement>) => {
    const { value } = currentTarget

    if (Number(value) >= 0 && Number(value) <= sharesInPercent) {
      setPoolState({
        staking: { ...staking, shares: value }
      })
    }
  }

  const handleClickMax = () => {
    setPoolState({
      staking: { ...staking, shares: String(sharesInPercent) }
    })
  }

  return (
    <>
      <div className="flex flex-col gap-3">
        <div>
          <h4 className="flex flex-row items-center gap-1 mb-2 text-sm opacity-90">
            Shares{' '}
            <FontAwesomeIcon
              className="text-[var(--light-blue)] opacity-60"
              icon={faPercent}
            />
          </h4>
          <span className="my-2 text-sm opacity-60">
            Select the{' '}
            <span className="text-[var(--light-blue)]">percentage</span> of your{' '}
            <span className="text-[var(--light-yellow)]">Pool Shares</span> you
            wish to add staking to
          </span>
        </div>
        <div className="flex flex-row w-full md:flex-col">
          <div className="flex flex-col w-1/2 text-sm md:flex-row md:w-full bg-[#181818]/60 rounded-tl-md rounded-bl-md md:rounded-bl-none md:rounded-tr-md">
            <div
              className="text-center p-1 md:w-1/2 border-b border-b-[var(--light-blue)] md:border-b-0 h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip={`${sharesInPercent} %`}
            >
              Percent
            </div>
            <div
              className="text-center p-1 md:w-1/2 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
              data-tip={`${shares} Pool Tokens`}
            >
              Shares
            </div>
          </div>
          <div className="flex flex-col w-1/2 md:flex-row md:w-full bg-[var(--dark-green)] rounded-br-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md">
            <div className="text-center p-1 md:w-1/2 border-b border-b-[var(--light-yellow)] md:border-b-0 h-[32px] max-h-[32px] truncate">
              <span className="pl-2 opacity-80">
                {sharesInPercent.toFixed(2)} %
              </span>
            </div>
            <div className="text-center p-1 md:w-1/2 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
              <span className="opacity-80">{formatQuantity(shares)}</span>
            </div>
          </div>
        </div>

        <div className="text-center opacity-60">
          {Boolean(staking.shares) &&
            `${Number(staking.shares).toFixed(2)}% = ${formatQuantity(
              (Number(shares) / Number(sharesInPercent)) *
                Number(staking.shares)
            )}`}
        </div>

        <div className="group flex justify-start items-center w-full rounded bg-[var(--green-black)] px-3 opacity-80 tooltip tooltip-right ease-in-out duration-300 border border-1 border-[#d9d9d9]/20 focus-within:border-[#339ea8]/50">
          <FontAwesomeIcon
            className="opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90"
            color="#339EA8"
            icon={faPercent}
          />
          <input
            className="w-full pr-2 bg-transparent border-none input focus:outline-none placeholder:opacity-60 placeholder:text-left disabled:bg-transparen"
            onChange={handleInputChange}
            placeholder="Shares Percentage"
            value={staking.shares}
          />
          <MaxButton handleClick={handleClickMax} />
        </div>
      </div>

      <span className="my-2 text-xs opacity-60">
        <strong>
          {' '}
          <FontAwesomeIcon
            className="text-[var(--light-yellow)]"
            icon={faExclamationCircle}
          />{' '}
          Note:
        </strong>{' '}
        Rewards will be available to claim once the Time Span is completed
      </span>
    </>
  )
}
