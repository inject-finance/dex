import { MaxButton } from '@/components/MaxButton'
import { Modal } from '@/components/Modal'
import { ActionButton } from '@/components/buttons/ActionButton'
import { Input } from '@/components/inputs/Input'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { removeLiquidity } from '@/features/liquidity/action/removeLiquidity/removeLiquidity.action'
import { getRatioSelector } from '@/features/liquidity/selectors/getRatio.selector'
import { poolState } from '@/features/pool/pool.state'
import { getPoolDetailsSelector } from '@/features/pool/selectors/getPoolDetails.selector'
import { getBalanceSelector } from '@/features/tokens/selectors/getBalance.selector'
import {
  getSharesPercentSelector,
  getSharesSelector
} from '@/features/tokens/selectors/getShares.selector'
import {
  toggleRemoveLiquidityModalVisibility,
  uiState
} from '@/features/ui/ui.state'
import {
  faExclamationCircle,
  faOutdent,
  faPercent
} from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { ChangeEvent, useEffect, useState } from 'react'
import { useRecoilCallback, useRecoilValue } from 'recoil'

export const RemoveLiquidityModal = dynamic(
  () =>
    Promise.resolve(() => {
      const { tokenA, tokenB } = useRecoilValue(poolState)
      const { removeLiquidityModalVisibility } = useRecoilValue(uiState)
      const sharesInPercent = useRecoilValue(
        getSharesPercentSelector({ tokenA, tokenB })
      )
      const shares = useRecoilValue(getSharesSelector({ tokenA, tokenB }))
      const [inputValue, setInputValue] = useState('')

      useEffect(() => {
        setInputValue('')
      }, [tokenA, tokenB])

      const handleInputChange = ({
        currentTarget
      }: ChangeEvent<HTMLInputElement>) => {
        const { value } = currentTarget

        if (Number(value) >= 0 && Number(value) <= sharesInPercent) {
          setInputValue(value)
        }
      }

      const handleRemoveLiquidityClick = useRecoilCallback(
        ({ refresh }) =>
          async () => {
            try {
              await removeLiquidity({
                tokenA,
                tokenB,
                shares: Number(
                  formatQuantity(
                    (shares / sharesInPercent) * Number(inputValue)
                  )
                )
              })
              toggleRemoveLiquidityModalVisibility()
            } finally {
              refresh(getPoolDetailsSelector({ tokenA, tokenB }))
              refresh(getRatioSelector)
              refresh(getSharesSelector({ tokenA, tokenB }))
              refresh(getSharesPercentSelector({ tokenA, tokenB }))
              refresh(getBalanceSelector(tokenA))
              refresh(getBalanceSelector(tokenB))
              refresh(poolState)
            }
          }
      )

      const handleClickMax = () => {
        setInputValue(String(sharesInPercent))
      }

      if (!removeLiquidityModalVisibility) {
        return null
      }

      return (
        <Modal
          open={removeLiquidityModalVisibility}
          title={`Remove Liquidity from ${tokenA.symbol} / ${tokenB.symbol}`}
          toggle={toggleRemoveLiquidityModalVisibility}
        >
          <div className="flex flex-col gap-5 pt-5">
            <div className="flex flex-col w-full">
              <div className="flex flex-col w-1/2 text-sm md:flex-row md:w-full bg-[#181818]/60 rounded-tl-md rounded-bl-md md:rounded-bl-none md:rounded-tr-md">
                <div
                  className="text-center p-1 md:w-1/2 md:border-b-0 h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
                  data-tip={`${sharesInPercent} %`}
                >
                  Percent
                </div>
                <div
                  className="text-center p-1 md:w-1/2 md:border-b-0 md:border-l md:border-l-[var(--light-blue)] h-[32px] max-h-[32px] tooltip tooltip-bottom hover:cursor-pointer"
                  data-tip={`${shares} Pool Tokens`}
                >
                  Shares
                </div>
              </div>
              <div className="flex flex-col w-1/2 md:flex-row md:w-full bg-[#181818]/30 rounded-br-md rounded-tr-md md:rounded-tr-none md:rounded-bl-md">
                <div className="text-center p-1 md:w-1/2 md:border-b-0 h-[32px] max-h-[32px] truncate">
                  <span className="pl-2 opacity-80">
                    {sharesInPercent.toFixed(2)} %
                  </span>
                </div>
                <div className="text-center p-1 md:w-1/2 md:border-b-0 md:border-l md:border-l-[var(--light-yellow)] h-[32px] max-h-[32px] truncate">
                  <span className="opacity-80">{formatQuantity(shares)}</span>
                </div>
              </div>
            </div>

            <span className="my-2 text-xs opacity-40">
              <strong>
                <FontAwesomeIcon
                  className="text-[var(--light-yellow)]"
                  icon={faExclamationCircle}
                />{' '}
                Note:
              </strong>{' '}
              Shares are a representation of both{' '}
              <span className="text-[var(--light-yellow)]">
                {tokenA.symbol}
              </span>
              /<span className="text-[var(--light-blue)]">{tokenB.symbol}</span>{' '}
              combined. Relations and rates are different for each pair.
            </span>

            <div className="h-5 text-center">
              {Boolean(inputValue) &&
                `${Number(inputValue).toFixed(2)}% = ${formatQuantity(
                  (shares / sharesInPercent) * Number(inputValue)
                )}`}
            </div>

            <Input
              Right={<MaxButton handleClick={handleClickMax} />}
              icon={faPercent}
              max={sharesInPercent}
              min={0}
              onChange={handleInputChange}
              placeholder="Shares Percentage"
              step="0.01"
              type="number"
              value={inputValue}
            />

            <ActionButton
              icon={faOutdent}
              onClick={handleRemoveLiquidityClick}
              title="Remove Liquidity"
            />
          </div>
        </Modal>
      )
    }),
  { ssr: false }
)
