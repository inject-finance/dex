'use client'
import { Spinner } from '@/components/Spinner'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { getOutAmountSelector } from '@/features/swap/selectors/getOutAmount.selector'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { useRecoilValueLoadable } from 'recoil'

export const InputOut = dynamic(
  () =>
    Promise.resolve(() => {
      const { state, contents } = useRecoilValueLoadable(getOutAmountSelector)

      if (state === 'loading' || state !== 'hasValue') {
        return (
          <div className="w-full">
            <div className="flex flex-col items-end justify-end gap-3">
              <div className="flex justify-end items-center w-full rounded bg-[var(--green-black)] px-3 tooltip tooltip-top ease-in-out duration-300">
                <div className="flex justify-end py-3 pr-2 text-right opacity-50">
                  <Spinner />
                </div>
              </div>
            </div>
          </div>
        )
      }

      return (
        <div className="w-full">
          <div className="flex flex-col items-end justify-end gap-3">
            <div className="flex justify-end items-center w-full rounded bg-[var(--green-black)] px-3 tooltip tooltip-top ease-in-out duration-300">
              <FontAwesomeIcon
                className="max-w-[16px] max-h-[16px] opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90"
                color="#339EA8"
                icon={faEye}
              />
              <input
                className="w-full pr-2 text-sm bg-transparent border-none input focus:outline-none opacity-40 placeholder:opacity-60 disabled:bg-transparent"
                disabled
                value={formatQuantity(contents.total)}
              />
            </div>
            <div
              className="pr-5 text-xs font-regular max-w-[142px] tooltip tooltip-bottom"
              data-tip={contents.minimumRequired}
            >
              {/* {Boolean(contents.total) && (
                <span className="opacity-40">
                  Minimum: {formatQuantity(contents.minimumRequired)}{' '}
                  {tokenB.symbol}
                </span>
              )} */}
            </div>
          </div>
        </div>
      )
    }),
  { ssr: false }
)
