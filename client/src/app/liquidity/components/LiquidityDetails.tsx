'use client'
import logoLong from '@/assets/images/inject_finance_logo_long.png'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { getPairAllowanceSelector } from '@/features/liquidity/selectors/getAllowance.selector'
import { getRatioSelector } from '@/features/liquidity/selectors/getRatio.selector'
import { poolState } from '@/features/pool/pool.state'
import { getReservesSelector } from '@/features/pool/selectors/getReserves.selector'
import { getSharesSelector } from '@/features/tokens/selectors/getShares.selector'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue } from 'recoil'

export const LiquidityDetails = dynamic(
  () =>
    Promise.resolve(() => {
      const { tokenA, tokenB } = useRecoilValue(poolState)
      const ratio = useRecoilValue(getRatioSelector)
      const reserves = useRecoilValue(getReservesSelector({ tokenA, tokenB }))
      const { sharesInPercent } = useRecoilValue(
        getSharesSelector({ tokenA, tokenB })
      )
      const allowance = useRecoilValue(getPairAllowanceSelector)

      if (!ratio) {
        return (
          <div className="mb-5 min-h-[192px] max-h-[172px]">
            <Image
              alt="Dex Logo"
              className="mx-auto mb-5 h-[100px] w-[180px]"
              src={logoLong}
            />
            <p className="text-center text-light opacity-40">
              Choose a pair of tokens and the amount of liquidity you wish to
              add.
              <br />
              Your transaction details will appear here.
            </p>
          </div>
        )
      }

      return (
        <div>
          <h3 className="pb-3 mb-6 text-sm opacity-60">Liquidity Details</h3>

          <div className="flex flex-col justify-between w-full gap-2 pr-3 mx-auto mb-2">
            {[
              {
                leftText: `${tokenA.symbol}/${tokenB.symbol}`,
                rightText: `1 ${tokenA.symbol} = ${formatQuantity(
                  ratio / Number(tokenA.amount)
                )}  ${tokenB.symbol}`
              },
              {
                leftText: `${tokenA.symbol} Reserves`,
                rightText: `${formatQuantity(reserves.reserveA)} ${
                  tokenA.symbol
                }`
              },
              {
                leftText: `${tokenB.symbol} Reserves`,
                rightText: `${formatQuantity(reserves.reserveB)} ${
                  tokenB.symbol
                }`
              },
              Boolean(sharesInPercent) && {
                leftText: `Your current Shares`,
                rightText: `≈ ${String(sharesInPercent).slice(0, 5)} %`
              },
              Boolean(
                tokenA.symbol !== 'ETH' &&
                  Number(tokenA.amount) > allowance.allowanceA
              ) &&
                Boolean(allowance.allowanceA) && {
                  leftText: `${tokenA.symbol} approved`,
                  rightText: formatQuantity(allowance.allowanceA)
                },
              Boolean(
                tokenB.symbol !== 'ETH' && Number(ratio) > allowance.allowanceB
              ) &&
                Boolean(allowance.allowanceB) && {
                  leftText: `${tokenB.symbol} approved`,
                  rightText: formatQuantity(allowance.allowanceB)
                }
            ].map(
              (e, index) =>
                e && (
                  <div
                    className="grid items-center grid-cols-3 min-w-fit"
                    key={index}
                  >
                    <p className="text-sm opacity-60">{e.leftText}</p>
                    <div className="mx-2 h-[1px] opacity-40 bg-[#757575] min-w-max" />
                    <p className="text-sm text-right opacity-60">
                      {e.rightText}
                    </p>
                  </div>
                )
            )}
          </div>
          {tokenA.symbol === 'ETH' || tokenB.symbol === 'ETH' ? (
            <span className="py-3 text-xs opacity-60">
              <strong>
                <FontAwesomeIcon
                  className="text-[var(--light-yellow)]"
                  icon={faCircleExclamation}
                />{' '}
                Note:{' '}
              </strong>
              <span className="text-[var(--light-blue)]">ETH</span> does not
              need to be approved for making a transaction
            </span>
          ) : null}
        </div>
      )
    }),
  {
    ssr: false,
    loading: () => (
      <div className="min-w-full">
        <Skeleton
          baseColor="#192026"
          count={4}
          height="35px"
          highlightColor="#283336"
        />
      </div>
    )
  }
)
