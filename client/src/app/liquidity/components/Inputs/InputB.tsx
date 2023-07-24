import { Spinner } from '@/components/Spinner'
import { TokenBalance } from '@/components/TokenBalance'
import { formatQuantity } from '@/features/common/utils/formatQuantity'
import { getRatioSelector } from '@/features/liquidity/selectors/getRatio.selector'
import { poolState } from '@/features/pool/pool.state'
import { faEye } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import dynamic from 'next/dynamic'
import { useRecoilValue } from 'recoil'

export const InputB = dynamic(
  () =>
    Promise.resolve(() => {
      const { tokenB } = useRecoilValue(poolState)
      const ratio = useRecoilValue(getRatioSelector)

      return (
        <div className="w-full">
          <div className="flex flex-col items-end justify-end gap-3 group">
            <div className="flex justify-end items-center w-full rounded bg-[var(--green-black)] px-3 tooltip tooltip-top ease-in-out duration-300">
              <FontAwesomeIcon
                className="max-w-[16px] max-h-[16px] opacity-40 group-focus-within:transition group-focus-within:ease-in group-focus-within:duration-300 group-focus-within:opacity-90"
                color="#339EA8"
                icon={faEye}
              />

              <input
                className="w-full pr-2 text-sm bg-transparent border-none input focus:outline-none disabled:bg-transparent"
                disabled
                placeholder="Amount"
                value={formatQuantity(ratio || '')}
              />
            </div>
            <TokenBalance token={tokenB} />
          </div>
        </div>
      )
    }),
  {
    ssr: false,
    loading: () => (
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
)
