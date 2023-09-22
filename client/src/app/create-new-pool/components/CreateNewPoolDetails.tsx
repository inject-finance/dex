'use client'
import logoLong from '@/assets/images/inject_finance_logo_long.png'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { getPairAllowanceSelector } from '@/features/liquidity/selectors/getAllowance.selector'
import { poolState } from '@/features/pool/pool.state'
import { faCircleExclamation } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue } from 'recoil'

export const CreateNewPoolDetails = dynamic(
  () =>
    Promise.resolve(() => {
      const { tokenA, tokenB } = useRecoilValue(poolState)
      const allowance = useRecoilValue(getPairAllowanceSelector)

      if (!tokenA.amount || !tokenB.amount) {
        return (
          <div className="flex flex-col justify-between h-full gap-10 lg:gap-0">
            <div>
              <h3 className="mb-3">Creating a Pool:</h3>
              <p className="opacity-40">
                <span className="text-[var(--light-blue)]">1.</span> Choose a
                pair of tokens
                <br />
                <span className="text-[var(--light-blue)]">2.</span> Type-in the
                kickoff amount of liquidity
                <br />
                <span className="text-[var(--light-blue)]">3.</span> Click
                Create
              </p>
            </div>
            <Image
              alt="Dex Logo"
              className="mx-auto mb-5 h-[50px] w-[90px]"
              src={logoLong}
            />
          </div>
        )
      }

      return (
        <div>
          <h3 className="pb-5 text-sm opacity-60">Create Pool Details</h3>

          <div
            className={`flex flex-col w-full h-full gap-2 pr-3 mb-2 mx-auto ${
              !allowance ? 'hidden' : ''
            }`}
          >
            {[
              Boolean(tokenA.symbol !== 'ETH' && allowance.allowanceA) &&
                Boolean(allowance.allowanceA) && {
                  leftText: `Currently Approved ${tokenA.symbol}`,
                  rightText: formatQuantity(allowance.allowanceA)
                },
              Boolean(tokenB.symbol !== 'ETH' && allowance.allowanceB) &&
                Boolean(allowance.allowanceB) && {
                  leftText: `Currently Approved ${tokenB.symbol} `,
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
            {tokenA.symbol || tokenB.symbol === 'ETH' ? (
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
