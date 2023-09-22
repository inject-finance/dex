'use client'
import logoLong from '@/assets/images/inject_finance_logo_long.png'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { poolState } from '@/features/pool/pool.state'
import { getOutAmountSelector } from '@/features/swap/selectors/getOutAmount.selector'
import dynamic from 'next/dynamic'
import Image from 'next/image'
import Skeleton from 'react-loading-skeleton'
import { useRecoilValue, useRecoilValueLoadable } from 'recoil'

export const TradeDetails = dynamic(
  () =>
    Promise.resolve(() => {
      const { tokenA, tokenB, slippage } = useRecoilValue(poolState)
      const { state, contents } = useRecoilValueLoadable(getOutAmountSelector)

      if (state === 'loading' || state !== 'hasValue') {
        return (
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

      if (!contents.total) {
        return (
          <div className="mb-5">
            <Image
              alt="Dex Logo"
              className="mx-auto mb-5 h-[100px] w-[180px]"
              src={logoLong}
            />
            <p className="text-center text-light opacity-40">
              Choose a pair of tokens and the amount you wish to trade. <br />
              Your transaction details will appear here.
            </p>
          </div>
        )
      }

      return (
        <div className="bg-[var(--green-black)]">
          <h2 className="pb-3 text-sm opacity-60">Trade Details</h2>
          <div className="flex flex-col justify-between w-full h-full gap-2 pr-3 mx-auto">
            {[
              {
                leftText: `${tokenA.symbol}/${tokenB.symbol}`,
                rightText: `1 ${tokenA.symbol} = ${formatQuantity(
                  contents.rate
                )}  ${tokenB.symbol}`
              },
              {
                leftText: `${tokenB.symbol}/USD`,
                rightText: `1 ${tokenB.symbol} = ${formatQuantity(
                  contents.price
                )} USD`
              },
              {
                leftText: `Minimum received`,
                rightText: `${formatQuantity(contents.minimumReceiveInUsd)} USD`
              },
              {
                leftText: `Minimum received`,
                rightText: `${formatQuantity(contents.total)} ${tokenB.symbol}`
              },
              Boolean(slippage) && {
                leftText: `Slippage`,
                rightText: `${formatQuantity(slippage)} %`
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
        </div>
      )
    }),
  {
    ssr: false
  }
)
